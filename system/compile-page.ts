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
  page.body = compileBody(page, pages)

  // Finally, we compile the html output.
  page.html = compileHtml(page, pages)
}

function compileBody(page: Page, pages: Page[]) {
  let { body, path, template } = page

  // Process markdown in <md> tags
  body = replaceHtmlTag(body, "md", (md, attrs, spaces) => {
    // TODO: maybe tweak the output based on whether the md is one line or multi-line
    let res = Markdown.renderInline(md)
    if (res.includes("<pre") && !md.includes("<pre")) log(`Warning: possible syntax error in an <md> in ${path}`)
    res = indent(res, "  ")
    return indent(`<p${attrs}>\n${res}\n</p>`, spaces)
  })

  // Render markdown pages
  if (path.endsWith("md")) body = Markdown.render(body)

  // Clean up a bit of mess left by markdown conversion
  body = body.replaceAll("<p></p>", "")
  body = body.replaceAll(/<p>({{.*?}})<\/p>/gs, (_, capture) => capture) // markdownit sometimes wraps our macros in <p>
  // De-indent and otherwise clean up <pre> tags
  body = body.replace(/<pre>(.+?)<\/pre>/gs, (_, content) => {
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
      body = replaceHtmlTag(body, tag, (content, attrs) => {
        const id = anchorize(plainify(content))
        return `<${tag}${attrs} id="${id}"><a class="plain" href="#${id}">${content}</a></${tag}>`
      })
    }
  }

  return expandMacros(body, page, pages)
}

function compileHtml(page: Page, pages: Page[]) {
  let { frontmatter, path, template } = page

  let html = template.body

  // Add extra CSS or scripts
  frontmatter.styles ??= frontmatter.style ?? ""
  frontmatter.styles += template.frontmatter.styles ?? template.frontmatter.style ?? ""
  if (frontmatter.styles) {
    for (const style of trimAll(frontmatter.styles.split(","))) {
      const styleTag = `<link rel="stylesheet" href="${style}">`
      html = html.replace("</head>", `${indent(styleTag)}\n</head>`)
    }
  }
  frontmatter.scripts ??= frontmatter.script ?? ""
  frontmatter.scripts += template.frontmatter.scripts ?? template.frontmatter.script ?? ""
  if (frontmatter.scripts) {
    for (const script of trimAll(frontmatter.scripts.split(","))) {
      const scriptTag = `<script defer src="${script}"></script>`
      html = html.replace("</body>", `${indent(scriptTag)}\n</body>`)
    }
  }

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
