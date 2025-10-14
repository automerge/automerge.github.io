// Markdown
// Here, we initialize and configure the markdown renderer.

import MarkdownIt from "markdown-it"
import MarkdownItFootnote from "markdown-it-footnote"
import Prism from "prismjs"
import { log, yellow } from "./logging.ts"
import { splitOnce, trimAll } from "./util.ts"

// If you need to add more languages, import them here:
import "prismjs/components/prism-bash.js"
import "prismjs/components/prism-jsx.js" // We don't use jsx, but need to import it for tsx to work
import "prismjs/components/prism-mermaid.js"
import "prismjs/components/prism-tsx.js"
import "prismjs/components/prism-typescript.js"

export const Markdown = MarkdownIt({ html: true, typographer: true }).use(MarkdownItFootnote)

// Override the default markdown renderer to provide our own footnote style.
Markdown.renderer.rules.footnote_caption = (tokens, idx) => {
  let n = tokens[idx].meta.id + 1 // calculate the footnote number
  if (tokens[idx].meta.subId > 0) n += ":" + tokens[idx].meta.subId // incorporate subIds
  return `${n}` // our footnote style is just the number
}

// Override the default footnote block renderer
Markdown.renderer.rules.footnote_block_open = () => '<section class="footnotes" role="doc-endnotes"><hr><ol>\n'

// Override the default fence block renderer to add title & line highlight support
Markdown.renderer.rules.fence = (tokens, idx) => {
  const token = tokens[idx]
  let [langName, meta] = splitOnce(token.info.trim(), " ")

  // Process line highlight markers
  let lines = token.content.trim().split("\n")
  const highlightedLines = new Set<number>()
  let insideBlock = false
  let highlightNext = false
  let out: string[] = []
  lines.forEach((line, i) => {
    if (/highlight-next-line/.test(line)) {
      highlightNext = true
    } else if (/highlight-start/.test(line)) {
      insideBlock = true
    } else if (/highlight-end/.test(line)) {
      insideBlock = false
    } else if (insideBlock || highlightNext) {
      highlightNext = false
      highlightedLines.add(out.length)
      out.push(line)
    } else {
      out.push(line)
    }
  })
  let code = out.join("\n")

  // Run Prism
  let highlightedBlock: string
  if (langName) {
    if (Prism.languages[langName]) highlightedBlock = Prism.highlight(code, Prism.languages[langName], langName)
    else log(`To use syntax highlighting for ${langName}, add an import to ${yellow("/system/markdown.ts")}`)
  }
  highlightedBlock ??= MarkdownIt().utils.escapeHtml(code)

  // Wrap lines
  lines = highlightedBlock.split("\n").map((line, i) => {
    const classes = ["code-line"]
    if (highlightedLines.has(i)) classes.push("highlighted-line")
    return `<div class="${classes.join(" ")}">${line}</div>`
  })
  lines = [`<pre><code class="language-${langName}">`, ...lines, "</code></pre>"]

  // Add title above the code block, if any
  const titleMatch = meta?.match(/title="([^"]+)"/)
  if (titleMatch) lines.unshift(`<div class="code-title">${Markdown.utils.escapeHtml(titleMatch[1])}</div>`)

  return trimAll(lines).join("")
}
