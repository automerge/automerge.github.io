// RSS
// This file handles RSS feed generation.

import { Env } from "./env.ts"
import { write } from "./io.ts"
import type { Page } from "./types.ts"
import { cdata, compare, toFullUrl } from "./util.ts"

export const generateRssFeeds = (pages: Page[]) => {
  write(
    `public/index.xml`,
    [
      `<?xml version="1.0" encoding="utf-8" standalone="yes"?>`,
      `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">`,
      `  <channel>`,
      `    <title>Automerge</title>`,
      `    <link>${toFullUrl("/")}</link>`,
      `    <description>${Env.description}</description>`,
      `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
      `    <atom:link href="${toFullUrl("/index.xml")}" rel="self" type="application/rss+xml" />`,
      ...pages
        .filter(
          ({ frontmatter }) =>
            frontmatter.title && // Only include pages with a title
            frontmatter.description && // Only include pages with a description
            frontmatter.index != "false" && // Skip pages that ask not to be indexed
            frontmatter.publish != "draft" && // Skip drafts (for now, to simplify testing)
            frontmatter.date // Only include pages with a publish date
        )
        .toSorted((a, b) => compare(b.frontmatter.date, a.frontmatter.date)) // reverse-chronological
        .flatMap((page) => [
          `    <item>`,
          `      <title>${cdata(page.frontmatter.title)}</title>`,
          `      <link>${page.url}</link>`,
          `      <guid isPermaLink="true">${page.url}</guid>`,
          `      <pubDate>${new Date(page.frontmatter.date + "T00:00:00Z").toUTCString()}</pubDate>`,
          `      <description>${cdata(page.frontmatter.description)}</description>`,
          `      <content:encoded>${cdata(page.body)}</content:encoded>`,
          `    </item>`,
        ]),
      `  </channel>`,
      `</rss>`,
    ].join("\n")
  )
}
