// Validation
// This file contains various validity checks we run compiled pages through.

import { exists, read } from "./io.ts"
import { green, log, yellow } from "./logging.ts"
import type { Page } from "./types.ts"
import { getValuesOfAttributes, withTrailingSlash } from "./util.ts"

export function runValidityChecks(pages: Page[]) {
  checkForBrokenLinks(pages)
  checkForInvalidHtml(pages)
}

const checkForInvalidHtml = (pages: Page[]) => {
  for (const page of pages) {
    if (page.html.match(/<video\b[^>]*?\/>/g))
      log(`Invalid html ${yellow("<video … />")} — use ${yellow("<video …></video>")} (in ${green(page.path)})`)
  }
}

const checkForBrokenLinks = (pages: Page[]) => {
  for (const page of pages) {
    for (const href of getValuesOfAttributes(page.html, "href")) {
      checkLink(pages, page, href)
    }
  }
}

const checkLink = (pages: Page[], page: Page, link: string) => {
  // Check links that target an anchor on the same page
  if (link.startsWith("#")) {
    const targetAnchor = link.slice(1)
    if (!targetAnchor) return // ignore href="#"
    if (!hasTargetAnchor(page.html, targetAnchor)) log(`Broken anchor link in ${green(page.path)}: ${yellow(link)}`)
    return
  }

  // TODO: We don't yet support checking links that contain a dot. Eg:
  //   <meta rel="stylesheet" href="….css">
  //   <a href="/something.html"> — a plain html file, no frontmatter, not named index.html
  //   <a href="https://some.other.site">
  if (link.includes(".")) return

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
    let targetHtml = targetPage?.html || read(targetFile)
    const exists = hasTargetAnchor(targetHtml, targetAnchor)
    if (!exists) log(`Broken cross-page anchor in ${green(page.path)}: ${yellow(link)}`)
    return
  }
}

const hasTargetAnchor = (html: string, id: string) => new RegExp(`\\b(id|name)=["']${id}["']`).test(html)
