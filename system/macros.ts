// Macros
// The build system supports a special {{ macro }} syntax in Markdown and HTML.
// This file contains all the rewrite rules to apply when a macro is encountered.

import { Env } from "./env.ts"
import { exists, read } from "./io.ts"
import { green, log, logError, yellow } from "./logging.ts"
import { Markdown } from "./markdown.ts"
import type { Page } from "./types.ts"
import { compact, compare, flatJoin, getValuesOfAttributes, ignoredHtml, plainify, splitAfter, splitBefore, toFullUrl } from "./util.ts"; // prettier-ignore

// Expand all macros found in text, in the context of the given page
export function expandMacros(text: string, page: Page, pages: Page[]) {
  let limit = 100

  while (true) {
    if (limit-- <= 0) {
      log(`Detected an infinite loop of nested macros while compiling ${green(page.path)}`)
      break
    }
    try {
      // We stop expanding macros as soon as things stop changing
      const before = text

      text = expandAllMacros(text, page, pages)

      // If nothing changed, we're done!
      if (text === before) break
    } catch (err) {
      logError("An unhandled error occurred while expanding macros in " + green(page.path), err)
      break
    }
  }

  return text.trim()
}

const expander = (macro: string, spaces: string, page: Page, pages: Page[]) => {
  let { frontmatter, compiledBody, path } = page

  // If there's a problem expanding the macro, print a msg and inject a red `{{ macro }}` into the HTML
  let bail = (msg: string, str?: string) => {
    log(msg)
    return `<b style='color:red'>${str ?? `&#123;&#123;${macro}&#125;&#125;`}</b>`
  }

  // Here it is!
  // The big list of all the macros in the system. Boo-yah!

  switch (macro) {
    // [This space intentionally left blank — damn you prettier]

    // {{content}} — marks where page content should be inserted into the template
    case "content":
      return compiledBody // Note: don't change indentation, because that messes up <pre> tags

    // {{include:FILENAME}} — replaced with the content of /template/includes/FILENAME.{html,md}
    // {{include:FILENAME.md inline}} — same as above, but using Markdown.renderInline()
    case macro.startsWith("include") && macro: {
      let [name, flag] = stripName(macro, "include").split(" ")

      let mdFile = `template/includes/${name}.md`
      let htmlFile = `template/includes/${name}.html`

      try {
        let isMd = exists(mdFile)
        let content = isMd ? read(mdFile) : read(htmlFile)
        if (isMd) content = flag == "inline" ? Markdown.renderInline(content) : Markdown.render(content)
        // We prepend spaces so that inline includes (eg: {{contact-info}}) don't slam into the text right before them.
        return spaces + content
      } catch (err: any) {
        if (err?.code == "ENOENT") log(`Missing include ${yellow(name)}, referenced in page ${green(path)}`)
        else logError(`Unexpected error loading include ${yellow(name)} in page ${green(path)}`, err)
        return ""
      }
    }

    // {{ index:FILENAME }} — generate an index of all child pages of the current page, using a FILENAME include to render each child
    // {{ index:FILENAME reverse }} — the default is chronological, so specify "reverse" for reverse-chronological
    case macro.startsWith("index:") && macro: {
      let [template, reverse] = stripName(macro, "index").split(" ")
      // In practice, it doesn't seem to matter whether the children are fully compiled or not when we do this.
      // But in theory it *might* matter, so we might want to somehow guarantee that children are compiled before parents.
      let children = page.children.toSorted((a, b) => compare(a.frontmatter.date, b.frontmatter.date))
      if (reverse) children = children.reverse()
      // Cool trick — we expand an include macro in the context of each child page to generate the html for each item in the index
      return children.map((child) => expandMacros(`{{include:${template}}}`, child, pages)).join("\n")
    }

    case "blog-sidebar": {
      let children = page.parent!.children.toSorted((a, b) => compare(a.frontmatter.date, b.frontmatter.date)).reverse()
      // Cool trick — we expand an include macro in the context of each child page to generate the html for each item in the index
      let elms = children.map((child) => expandMacros(`{{include:blog-post-sidebar-item}}`, child, pages)).join("\n")
      return elms
    }

    case "most-recent-blog-post": {
      let mostRecentPost = pages
        .filter((p) => p.frontmatter.template == "blog")
        .toSorted((a, b) => compare(a.frontmatter.date, b.frontmatter.date))
        .at(-1)
      if (!mostRecentPost) throw new Error("Can't determine most recent blog post when expanding {{most-recent-blog-post}}")
      return mostRecentPost.url.pathname
    }

    // {{figure ![](src.ext)}} — A <figure> with some media (image or video)
    // {{figure wide frame ![](src.ext) }} — with class="wide frame"
    // {{figure autoplay ![](src.mp4) }} — the "autoplay" class is special, and adds "autoplay loop muted" to the <video>
    // {{figure ![Photograph of a brown dog on a grassy field](src.ext)}} — with alt text
    // {{figure ![](src.ext) *This* image is, as they say, "cute"}} — with caption, which can be multiline and contain md/html
    case macro.startsWith("figure") && macro: {
      macro = stripName(macro, "figure")

      // Macro expansion happens after markdown conversion, so at this point prop will look like:
      // `classes <img src="src.ext" alt="alt text"> caption <b>text</b> etc etc`
      // But, if the macro was nested inside some HTML, it'll still be raw markdown, so we must convert it:
      if (macro.includes("![")) macro = Markdown.renderInline(macro)

      // If the macro includes any words before the image, we use them as CSS classes
      let [classes, rest] = splitBefore(macro, "<")
      let cls = classes ? ` class="${classes.trim()}"` : ""
      macro = rest

      // Extract the image tag
      let [img, caption] = splitAfter(macro, ">")

      // Check if src is a video
      let src = getValuesOfAttributes(img, "src")[0]
      let ext = splitAfter(src, ".")[1]
      let isVideo = ["mov", "mp4", "webm"].includes(ext)
      if (isVideo) {
        let alt = getValuesOfAttributes(img, "alt")[0] ?? ""
        // We preload the whole video, not just the metadata, because otherwise browsers don't render the poster frame!
        // Our videos are all rather small, so this is fine — akin to loading a few images.
        let attrs = "controls playsinline preload"
        if (classes.includes("autoplay")) attrs += " autoplay loop muted"
        img = `<video ${attrs} src="${src}" alt="${alt}"></video>`
      }

      // Remove empty alt text attrs, which signal "this image doesn't need alt text".
      // TODO: I suspect we should almost always add alt text, and it definitely shouldn't be the same as the caption.
      img = img.replace(` alt=""`, "")

      // If there's a caption, add a <figcaption> element
      let figcaption = caption ? `<figcaption>\n${Markdown.render(caption).trim()}\n</figcaption>` : null

      return compact([`<figure${cls}>`, img, figcaption, "</figure>"]).join("\n")
    }

    case macro.startsWith("info:") && macro: {
      return flatJoin([`<div class="info">`, stripName(macro, "info"), "</div>"])
    }

    case macro.startsWith("caution:") && macro: {
      return flatJoin([`<div class="caution">`, stripName(macro, "caution"), "</div>"])
    }

    // {{# SOME COMMENT}} — a comment that's removed at compile time
    case macro.startsWith("#") && macro:
      return ""

    case "month-year":
      if (!frontmatter.date) return bail(`This page's template requires a date: ` + green(path))
      return new Date(frontmatter.date).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" })

    case "prev-in-docs": {
      let html = expandMacros(`{{include:docs}}`, page, pages)
      let hrefs = getValuesOfAttributes(html, "href")
      let idx = hrefs.indexOf(page.url.pathname)
      if (idx < 1) return ""
      let href = hrefs[idx - 1]
      let nextPage = pages.find((p) => p.url.pathname == href)
      if (!nextPage) return ""
      return `<a class="prev-page" href="${href}"><span>Previous page</span> ${nextPage.frontmatter.title}</a>`
    }

    case "next-in-docs": {
      let html = expandMacros(`{{include:docs}}`, page, pages)
      let hrefs = getValuesOfAttributes(html, "href")
      let idx = hrefs.indexOf(page.url.pathname)
      if (idx < 0 || idx == hrefs.length - 1) return ""
      let href = hrefs[idx + 1]
      let nextPage = pages.find((p) => p.url.pathname == href)
      if (!nextPage) return ""
      return `<a class="right" href="${href}"><span>Next page</span> ${nextPage.frontmatter.title}</a>`
    }

    case "newer-in-blog":
      if (page.parent) {
        let children = page.parent.children.toSorted((a, b) => compare(a.frontmatter.date, b.frontmatter.date))
        let next = children[children.indexOf(page) + 1]
        if (next) return `<a href="${next.url.pathname}"><span>Newer post</span> ${next.frontmatter.title}</a>`
      }
      return ""

    case "older-in-blog":
      if (page.parent) {
        let children = page.parent.children.toSorted((a, b) => compare(a.frontmatter.date, b.frontmatter.date))
        let prev = children[children.indexOf(page) - 1]
        if (prev) return `<a class="right" href="${prev.url.pathname}"><span>Older post</span> ${prev.frontmatter.title}</a>`
      }
      return ""

    case "href":
      return page.url.pathname

    case "head-title": {
      let title = frontmatter.title || "Automerge"
      let subtitle = frontmatter.subtitle ? `: ${frontmatter.subtitle}` : ""
      return title + subtitle
    }

    case "og-image":
      return frontmatter.image || toFullUrl("/static/og-image.png")

    case "og-description":
      return plainify(frontmatter.description || Env.description)

    // A page with a date is an "article" — the same signal the RSS feed uses to decide what's a post
    case "og-type":
      return frontmatter.date ? "article" : "website"

    case "og-url":
      return page.url.toString()

    case "og-published_time":
      return frontmatter.date ? `<meta property="article:published_time" content="${frontmatter.date}">` : ""

    case "domain":
      return Env.domain

    // If the macro ends with a question mark, that's an optional frontmatter prop
    case macro.endsWith("?") && macro: {
      let value = frontmatter[macro.slice(0, -1)]
      return value ? spaces + value : ""
    }

    // If the macro matches a frontmatter key, indent and return that value
    case frontmatter[macro] && macro:
      return spaces + frontmatter[macro]

    // If all else fails, display an error in the terminal and the rendered page
    default:
      return bail(`The page ${green(path)} is missing required frontmatter: ${yellow(macro.split(":").at(-1) ?? macro)}`)
  }
}

// HELPERS ////////////////////////////////////////////////////////////////////////////////////////

// Walk the page source looking for {{, then keep walking until we find the matching }}.
const expandAllMacros = (html: string, page: Page, pages: Page[]) => {
  // Find all the ignored (ie: <pre>, <code>, <!-- -->) regions, so we can skip macros inside them
  const ignored: [number, number][] = []
  for (const region of html.matchAll(ignoredHtml)) ignored.push([region.index, region.index + region[0].length])

  // We will gradually build up a copy of html, but with all the top-level macros expanded.
  // (Nested macros, and macros newly generated during expansion, will be expanded in future passes.)
  let out = ""

  // Track how far we've walked to get to the last seen }} (so we know to skip over nested macros)
  let cursor = 0

  for (const match of html.matchAll(/( *){{/g)) {
    const spaces = match[1]
    const open = match.index + spaces.length

    // Skip braces we've already walked past (ie: nested macros)
    if (open < cursor) continue

    // Skip macros in ignored regions
    if (ignored.some(([from, to]) => open >= from && open < to)) continue

    const end = findMacroEnd(html, open)

    // Skip unbalanced braces
    if (end === undefined) continue

    // Add all the text between the end of the previous macro expansion and the beginning of this one (excluding spaces)
    out += html.slice(cursor, match.index)

    // This is the macro to be expanded
    const macro = html.slice(open + 2, end - 2).trim()

    // Run the replacement function, and append it to our output string
    // (TODO: instead of passing in the spaces and making each replacement fn do indentation,
    //  could we do some sort of indent-all-lines here? would any macros not want that?
    //  yes, it looks like {{content}} doesn't want that. Hmm.)
    out += expander(macro, spaces, page, pages)

    // We've now walked to the end of this macro
    cursor = end
  }

  // Add the remaining text after the final macro
  return out + html.slice(cursor)
}

// Find the }} that closes the {{ at the given position, counting nested pairs along the way.
// Returns the index just past the closing braces, or undefined if the braces never balance.
const findMacroEnd = (html: string, open: number) => {
  let depth = 0
  for (let i = open; i < html.length - 1; i++) {
    if (html[i] === "{" && html[i + 1] === "{") {
      depth++
      i++
    } else if (html[i] === "}" && html[i + 1] === "}") {
      i++
      if (--depth === 0) return i + 1
    }
  }
}

const stripName = (macro: string, name: string) => stripColon(macro.replace(name, "").trim())
const stripColon = (macro: string) => (macro.trim().startsWith(":") ? macro.trim().replace(":", "").trim() : macro)
