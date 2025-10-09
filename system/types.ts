// Types
// At time of writing, Node.js has mediocre support for TypeScript.
// It helps to have exported types stored in a dedicated file,
// and then imported using: import type { … } from "./types.ts"
// So that's what this file is for.

export type Stats = {
  modified: Date
}

export type Frontmatter = Record<string, string>

export type Templates = Record<string, Template>

export type Template = {
  path: string
  frontmatter: Frontmatter
  body: string
}

export type PageSource = {
  path: string
  source: string
  stats: Stats
}

export type Page = PageSource & {
  frontmatter: Frontmatter
  body: string
  html: string
  dest: string
  url: URL
  parent?: Page
  children: Page[]
  template: Template
}
