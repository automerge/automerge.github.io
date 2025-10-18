// Compile Page
// All the steps needed to produce the final HTML for every page,
// everything from markdown conversion to macro expansion,
// is applied and/or orchestrated here.

import { log } from "./logging.ts"
import { expandMacros } from "./macros.ts"
import { Markdown } from "./markdown.ts"
import type { Page } from "./types.ts"
import { anchorize, flatJoin, getValuesOfAttributes, indent, plainify, replaceHtmlTag, splitLines, trimAll, withTrailingSlash } from "./util.ts"

// MAIN ///////////////////////////////////////////////////////////////////////////////////////////

export const compilePage = (page: Page, pages: Page[]) => {
  // First, we compile the page body. The body is then used for the html output, but also for RSS and other output.
  page.compiledBody = compileBody(page, pages)

  // Finally, we compile the html output.
  page.html = compileHtml(page, pages)
}

function compileBody(page: Page, pages: Page[]) {
  let { body, path, template } = page

  // Process markdown in <md> tags
  let compiledBody = replaceHtmlTag(body, "md", (md, attrs, spaces) => {
    // TODO: maybe tweak the output based on whether the md is one line or multi-line
    let res = Markdown.renderInline(md)
    if (res.includes("<pre") && !md.includes("<pre")) log(`Warning: possible syntax error in an <md> in ${path}`)
    res = indent(res, "  ")
    return indent(`<p${attrs}>\n${res}\n</p>`, spaces)
  })

  // Render markdown pages
  if (path.endsWith("md")) compiledBody = Markdown.render(compiledBody)

  // Clean up a bit of mess left by markdown conversion
  compiledBody = compiledBody.replaceAll("<p></p>", "")
  compiledBody = compiledBody.replaceAll(/<p>({{.*?}})<\/p>/gs, (_, capture) => capture) // markdownit sometimes wraps our macros in <p>
  // De-indent and otherwise clean up <pre> tags
  compiledBody = compiledBody.replace(/<pre>(.+?)<\/pre>/gs, (_, content) => {
    const lines = splitLines(content)
    const spaces = lines
      .filter((l) => l.trim().length > 0) // Ignore empty lines
      .map((line) => line.match(/^\s*/)?.[0].length || 0) // TODO: probably wrong for mixed tabs and spaces
    const mindent = Math.min(...spaces)
    const deindented = lines.map((line) => line.slice(mindent))
    const pre = flatJoin(deindented).trimEnd()
    return `<pre>${pre}</pre>`
  })

  // Convert all h2-h4 into anchors
  if (template.frontmatter.header_anchors == "true") {
    for (const tag of ["h2", "h3", "h4"]) {
      compiledBody = replaceHtmlTag(compiledBody, tag, (content, attrs) => {
        const id = anchorize(plainify(content))
        return `<${tag}${attrs} id="${id}"><a class="plain" href="#${id}">${content}</a></${tag}>`
      })
    }
  }

  return expandMacros(compiledBody, page, pages)
}

function compileHtml(page: Page, pages: Page[]) {
  let { frontmatter, path, template } = page

  let html = template.body

  // Add extra CSS or scripts
  // We accept both the singular and the plural, from both the page and the template
  let styles = [frontmatter.styles, frontmatter.style, template.frontmatter.styles, template.frontmatter.style]
  let scripts = [frontmatter.scripts, frontmatter.script, template.frontmatter.scripts, template.frontmatter.script]
  // combine and then filter empty values
  styles = trimAll(styles.join(",").split(",")).filter((v) => v)
  scripts = trimAll(scripts.join(",").split(",")).filter((v) => v)
  // insert at the end of the head
  for (const style of styles) html = html.replace("</head>", `  <link rel="stylesheet" href="${style}">\n</head>`)
  for (const script of scripts) html = html.replace("</head>", `  <script defer src="${script}"></script>\n</head>`)

  html = expandMacros(html, page, pages)

  html = replaceHtmlTag(html, "a", (content, attrs, spaces) => {
    if (
      getValuesOfAttributes(attrs, "href")
        .map((v) => withTrailingSlash(v))
        .includes(page.url.pathname)
    ) {
      attrs += " is-current"
    }

    return `${spaces}<a${attrs}>${content}</a>`
  })

  return html
}
