// Compile Everything
// This file does the main orchestration logic for building the website.
// It creates the /public folder, loads templates, builds all the pages, generates feeds,
// reports any broken or missing links, and wrangles fonts and static assets.

import { compilePage } from "./compile-page.ts"
import { Env } from "./env.ts"
import { generateFontSubsets } from "./font.ts"
import { extractFrontmatter, hasFrontmatter, validateFrontmatter } from "./frontmatter.ts"
import { basename, copyPage, glob, linkFile, read, rm, stats, write, writePage } from "./io.ts"
import { green, log, logError, yellow } from "./logging.ts"
import { generateRedirectPages } from "./redirects.ts"
import { generateRssFeeds } from "./rss.ts"
import type { Page, PageSource, Templates } from "./types.ts"
import { compare, replace } from "./util.ts"
import { runValidityChecks } from "./validation.ts"

export const compileEverything = () => {
  // Clear any existing public folder
  rm("public")

  // Load all page templates
  const templates: Templates = {}
  for (const path of glob("template/*.html")) {
    const source = read(path)
    const { frontmatter, body } = extractFrontmatter(source)
    templates[basename(path)] = { path, frontmatter, body }
  }

  // Load all page source files in the content folder
  let pageSources: PageSource[] = glob("content/**/*.{md,html}").map((path) => ({
    path,
    source: read(path).trim(),
    stats: stats(path),
  }))

  // HTML files without frontmatter are treated as static and need no further processing
  pageSources = pageSources.filter((page) => {
    const skipProcessing = page.path.endsWith("html") && !hasFrontmatter(page.source)
    if (skipProcessing) copyPage(page.path, page.path.replace("content", "public"))
    return !skipProcessing
  })

  // This function loads the redirects file, copies redirected static assets, and
  // generates pages with `template: redirect` as needed.
  pageSources = pageSources.concat(generateRedirectPages())

  // Extract the frontmatter and body of each page
  let pages: Page[] = pageSources.map(({ path, source, stats }) => {
    const { frontmatter, body } = extractFrontmatter(source)

    // We want the frontmatter to be quite flexible — opt-in, low-ceremony, etc.
    // In the spirit of "the right thing" (vs "worse is better"), we need to do a
    // bunch of work here to pull various frontmatter values together into the right
    // shape for later compilation stages, and log warnings when things go awry.
    validateFrontmatter(path, frontmatter)

    // Next, figure out the destination file path the compiled page will be written to:
    // * content/ -> public/
    // * .md -> .html
    // * The optional "clean URLs" rewrite rule: /name.html -> /name/index.html
    let dest = replace(path, { "content/": "public/", ".md": ".html" })
    if (frontmatter.clean != "false") {
      if (!dest.endsWith("/index.html")) {
        dest = dest.replace(".html", "/index.html")
      }
    }

    // Make a URL object for each page, which we'll use for indexes and broken link checking
    const rootRelPath = replace(dest, { "public/": "/", "index.html": "" })
    const url = new URL(rootRelPath, `https://${Env.domain}`)

    // Based on the frontmatter, determine which template this page should have
    let template = templates[frontmatter.template || "default"]
    if (!template) {
      log(`The page ${green(path)} is requesting an unknown template: ${yellow(frontmatter.template)}`)
      template = templates.default
    }

    // We'll fill these in when we do the full compile. Initializing to a blank values just simplifies the Page type. It's fine.
    const html = ""
    const children: Page[] = []

    return { path, source, stats, frontmatter, body, dest, url, template, html, children }
  })

  // Only compile published pages
  pages = pages.filter(({ frontmatter }) => {
    if (frontmatter.publish == "true") return true
    if (frontmatter.publish == "draft" && Env.draft) return true
    return false
  })

  // Figure out the parent & children for each page, based solely on their href
  buildTree(pages)

  // Compile each page — markdown, macros, and most other transformations are applied here.
  // After this point, page.body and page.html will be ready to publish.
  for (const page of pages) {
    try {
      compilePage(page, pages)
    } catch (err) {
      return logError("An unhandled error occurred while compiling page " + green(page.path), err)
    }
  }

  generateRssFeeds(pages)
  generateSitemap(pages)
  generateRobots()

  // Write pages to disk
  for (const page of pages) writePage(page.dest, page.html)

  // Generate font subsets which include only the characters used on our site.
  subsetFonts(pages)

  // Now we take everything that's not a page and hardlink it into the public folder.
  // We use hardlinks, rather than copying, because it's much faster.
  // We use path.replace(), rather than the replace({}) helper, because there can be subfolders named "content"
  glob("content/**/*.!(md|html)").forEach((path) => linkFile(path, path.replace("content/", "public/")))

  // Now that the public folder is fully populated, we can run a few validity checks
  runValidityChecks(pages)

  // And that's it — we're done building the website! Woo hoo!
}

// COMPILATION HELPERS /////////////////////////////////////////////////////////////////////////////

function buildTree(pages: Page[]) {
  pages = pages.filter((page) => page.frontmatter.index != "false")

  const pagesByPath = new Map<string, Page>()
  for (const page of pages) pagesByPath.set(page.url.pathname, page)

  for (const page of pages) {
    const segments = page.url.pathname.split("/")
    if (segments.at(-1) == "") segments.pop()

    for (let i = segments.length - 1; i > 0; i--) {
      const ancestorPath = segments.slice(0, i).join("/") + "/"
      const parent = pagesByPath.get(ancestorPath)
      if (parent) {
        // logIndented(green(page.path) + " child of " + green(parent.path))
        page.parent = parent
        parent.children.push(page)
        break
      }
    }
  }
}

// TODO: Could this be a template? Can it use {{index:foo}} or does it need some special macro?
const generateSitemap = (pages: Page[]) => {
  let sitemap = [
    `<?xml version="1.0" encoding="utf-8" standalone="yes"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
    ...pages
      .filter(({ frontmatter }) => frontmatter.index != "false")
      .toSorted((a, b) => compare(a.url.pathname, b.url.pathname))
      .map((page) => [page.url, page.stats.modified.toISOString()])
      .map(([url, modified]) => `<url><loc>${url}</loc><lastmod>${modified}</lastmod></url>`),
    `</urlset>`,
  ].join("\n")
  write("public/sitemap.xml", sitemap)
}

function generateRobots() {
  // If we're publishing draft pages (eg: on the private mirror), we shouldn't be crawled.
  // TODO: Are we not generating a robots.txt in prod? Is that what we want?
  if (Env.draft) write("public/robots.txt", `User-agent: *\nDisallow: /`)
}

function subsetFonts(pages: Page[]) {
  if (!Env.subsetFonts) return
  const text = pages.map(({ html }) => html).join()
  const success = generateFontSubsets(text)
  Env.subsetFonts = success // If we fail, stop processing fonts
}
