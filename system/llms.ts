// LLMs
// Generate llms.txt and llms-full.txt

import { read, write } from "./io.ts"
import type { Page } from "./types.ts"
import { extractMdLinks, toFullUrl } from "./util.ts"

export const generateLLMsTxt = (pages: Page[]) => {
  // Grab all the links from the docs sidebar
  let docLinks = extractMdLinks(read(`template/includes/docs.md`))
  let apiLinks = extractMdLinks(read(`template/includes/api.md`))

  // Find pages that these links correspond to
  let linkedPages = new Map<string, Page | undefined>(docLinks.map(([_, href]) => [href, pages.find((p) => p.url.pathname == href)]))

  // Generate a markdown link in the format expected by llms.txt
  const makeLink = ([text, href, desc]: [string, string, string?]) => `- [${text}](${toFullUrl(href)})` + (desc ? ": " + desc : "")

  let prelude =
    "# Automerge\n\n> Automerge is a local-first sync engine for multiplayer apps that works offline, prevents conflicts, and runs fast. It uses CRDTs to support all the JSON data types — and more, such as rich text. It's also available as part of Automerge Repo, a toolkit for building local-first applications, with various adaptors for sync and persistence included.\n"

  write(
    `public/llms.txt`,
    [
      prelude,
      `This file contains links to documentation sections following the llmstxt.org standard.`,
      ``,
      `## Tutorials, Guides, and Reference docs`,
      ``,
      ...docLinks.map(([text, href]) => {
        let page = linkedPages.get(href)
        if (!page) return makeLink([text, href])
        return makeLink([page.frontmatter.title ?? text, href, page.frontmatter.description])
      }),
      ``,
      `## API Reference`,
      ...apiLinks.map(makeLink),
    ].join("\n")
  )

  write(
    `public/llms-full.txt`,
    [
      prelude,
      `This file contains all documentation content in a single document following the llmstxt.org standard.`,
      ...docLinks.map(([text, href]) => {
        let page = linkedPages.get(href)
        if (!page) return `\n# ` + makeLink([text, href])
        return `\n# [${page.frontmatter.title}](${toFullUrl(href)})\n\n` + page.body
      }),
      ``,
      `# API Reference Links`,
      ``,
      ...apiLinks.map(makeLink),
    ].join("\n")
  )
}
