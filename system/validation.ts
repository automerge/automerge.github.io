// Validation
// This file contains various validity checks we run compiled pages through.

import { exists, read } from "./io.ts"
import { green, log, yellow } from "./logging.ts"
import type { Page } from "./types.ts"
import { getValuesOfAttributes, stripIgnoredHtml, trimAll, withTrailingSlash } from "./util.ts"

export function runValidityChecks(pages: Page[]) {
  // When we check for broken links and asset paths, we want to ignore anything inside <pre>, <code>, and <!-- comments -->
  for (const page of pages) page.scannable = stripIgnoredHtml(page.html)

  checkForInvalidHtml(pages)
  checkForBrokenLinks(pages)
  checkForBrokenAssets(pages)
}


const checkForInvalidHtml = (pages: Page[]) => {
  for (const page of pages) {
    if (page.scannable.match(/<video\b[^>]*?\/>/g)) {
      log(`Invalid html ${yellow("<video … />")} — use ${yellow("<video …></video>")} (in ${green(page.path)})`)
    }
  }
}

const checkForBrokenLinks = (pages: Page[]) => {
  for (const page of pages) {
    for (const href of getValuesOfAttributes(page.scannable, "href")) {
      checkLink(pages, page, href)
    }
  }
}

const checkForBrokenAssets = (pages: Page[]) => {
  for (const page of pages) {
    for (const src of getValuesOfAttributes(page.scannable, "src")) checkAsset(page, src)
    for (const poster of getValuesOfAttributes(page.scannable, "poster")) checkAsset(page, poster)
    for (const srcset of getValuesOfAttributes(page.scannable, "srcset")) {
      // srcset is a list like "/a.png 1x, /b.png 2x"
      for (const candidate of trimAll(srcset.split(","))) checkAsset(page, candidate.split(/\s+/)[0])
    }
  }
}

const checkLink = (pages: Page[], page: Page, link: string) => {
  // Check links that target an anchor on the same page
  if (link.startsWith("#")) {
    const targetAnchor = link.slice(1)
    if (!targetAnchor) return // ignore href="#"
    if (!hasTargetAnchor(page.scannable, targetAnchor)) log(`Broken anchor link in ${green(page.path)}: ${yellow(link)}`)
    return
  }

  // If a link includes a dot, we treat it like a static asset rather than a page. Eg: css, pdf, static html, etc.
  // Kinda jank, but it's fine for now.
  if (link.includes(".")) return checkAsset(page, link)

  // Initialize a URL object for this link, using the current page's absolute URL as a base for relative links.
  let linkUrl = new URL(link, page.url)
  // Also, note, this ^ might throw. If it does, that's unexpected, so we let it bubble up.

  // Links are inconsistent about trailing slashes, so we normalize
  let pathname = withTrailingSlash(linkUrl.pathname)

  // Check that the target exists
  const targetFile = "public" + pathname + "index.html"
  if (!exists(targetFile)) return log(`Broken link in ${green(page.path)}: ${yellow(link)}`)

  // If the target is a compiled page (not a static html file), we can do some extra checks
  const targetPage = pages.find((p) => p.url.pathname === pathname)

  // Warn if the target is a draft page
  if (targetPage?.frontmatter.publish == "draft") return log(`Warning: linking to a draft in ${green(page.path)}: ${yellow(link)}`)

  // If the link targets an anchor, make sure the anchor exists in the targetHtml
  if (linkUrl.hash) {
    const targetAnchor = linkUrl.hash.slice(1) // Drop the #
    let targetHtml = targetPage?.scannable || stripIgnoredHtml(read(targetFile))
    const exists = hasTargetAnchor(targetHtml, targetAnchor)
    if (!exists) log(`Broken cross-page anchor in ${green(page.path)}: ${yellow(link)}`)
    return
  }
}

const checkAsset = (page: Page, path: string) => {
  // Data urls are automatically valid.
  if (path.startsWith("data:")) return

  // Absolute URLs also get a pass, even when they point at our own domain.
  // That's because automerge.org hosts more than just this build — the API docs,
  // automerge-repo docs, etc are separate deployments served under our domain,
  // so a URL being absent from our public folder doesn't mean it's broken.
  if (path.startsWith("http")) return

  // Initialize a URL object for this asset, using the current page's absolute URL as a base for relative paths.
  let url = new URL(path, page.url)
  // Also, note, this ^ might throw. If it does, that's unexpected, so we let it bubble up.

  // Skip assets loaded from elsewhere.
  if (url.origin !== page.url.origin) return

  // Spaces and such are encoded by the URL object, so we decode them before checking for a corresponding file.
  const file = "public" + decodeURIComponent(url.pathname)

  // Do the check!
  if (!exists(file)) log(`Broken asset in ${green(page.path)}: ${yellow(path)}`)
}

const hasTargetAnchor = (html: string, id: string) => new RegExp(`\\b(id|name)=["']${id}["']`).test(html)
