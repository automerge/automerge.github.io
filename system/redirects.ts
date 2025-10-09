// Redirects
// This function loads the Redirects.txt file and generates pages that do a client-side redirect.
// We opt to do redirects on the client so as to avoid depending on the particulars of any specific web host.

import { glob, linkFile, read } from "./io.ts"
import { green, log } from "./logging.ts"
import type { PageSource } from "./types.ts"
import { splitLines, trimAll, withTrailingSlash } from "./util.ts"

export const generateRedirectPages = () => {
  const modified = new Date()
  const redirects = read("Redirects.txt")
  const lines = trimAll(splitLines(redirects))
  const pages: PageSource[] = []

  for (const line of lines) {
    if (!line.startsWith("/")) continue // Bare text is treated as a comment and ignored

    let [oldPath, newPath] = line.split(/\s+/)
    if (!oldPath || !newPath) continue

    // Only two destination types are supported: absolute path and full URL
    if (!newPath.startsWith("/") && !newPath.startsWith("http")) {
      log(`Redirects.txt contains an invalid destination path: ${green(newPath)}`)
      continue
    }

    // If both the oldPath and the newPath include an extension, we'll assume they're static assets.
    // In this case, we copy newPath->oldPath (using a hardlink). We have to do this because we don't
    // control the server, so we can't do a 301 or 302, so this is the next best option.
    if (oldPath.includes(".") && newPath.includes(".")) {
      // paths are relative to the public folder, so we need to find the source file
      const newFile = glob(`{content,template}${newPath}`)[0]
      if (newFile) linkFile(newFile, `public${oldPath}`)
      continue
    }

    // If the oldPath includes .html, we need to make sure it skips the /name.html -> /name/index.html rewrite.
    const wasHtml = oldPath.endsWith(".html")

    // path the page would have had if it were a real page
    const path = wasHtml ? `content${oldPath}` : `content${withTrailingSlash(oldPath)}index.html`

    const stats = { modified }

    // Generate the source text for the redirect page. It's all frontmatter.
    const fm = ["template: redirect", `redirect_url: ${newPath}`, `index: false`]
    if (wasHtml) fm.push("clean: false")
    const source = ["---", ...fm, "---"].join("\n")

    pages.push({ path, stats, source })
  }

  return pages
}
