// Frontmatter
// This file handles parsing the frontmatter section of Markdown and HTML files.

import { green, log, yellow } from "./logging.ts"
import { Markdown } from "./markdown.ts"
import type { Frontmatter } from "./types.ts"
import { isISOString, splitLines, splitOnce, trimAll } from "./util.ts"

export const hasFrontmatter = (source: string) => /^\s*---\s*$/m.test(source)

export const extractFrontmatter = (source: string) => {
  // First, before anything else, trim the source.
  source = source.trim()

  // Now, there are a handful of different formats we want to support:
  // (1) ---, fm, ---, body
  // (2) fm, ---, body
  // (3) ---, body
  // (4) fm, ---
  // (5) body

  // If the first line is "---", strip it.
  // This turns (1) into (2), and (3) into (5)
  const [firstLine, rest] = splitOnce(source, "\n")
  if (firstLine.trim() === "---") source = rest

  // (5) If there's no frontmatter, we're done
  if (!hasFrontmatter(source)) return { frontmatter: {}, body: source }

  // Now, we just need to handle 2 formats:
  // (2) fm, ---, body
  // (4) fm, ---

  // Split the frontmatter from the body
  const [fm, body] = trimAll(splitOnce(source, "---"))

  // Parse each line of frontmatter
  const frontmatter: Frontmatter = {}
  for (let line of trimAll(splitLines(fm))) {
    if (!line) continue // skip empty lines

    // Check if the line contains a quoted value first (preserves # inside quotes)
    const quotedMatch = line.match(/^([^:]+):\s*"(.*)"$/)
    if (quotedMatch) {
      const [, k, v] = quotedMatch
      frontmatter[k.trim().toLowerCase()] = v
    } else {
      // For unquoted values, strip comments then parse
      line = splitOnce(line, "#")[0]
      if (!line) continue // lines beginning with a # comment are ignored
      const [k, v] = trimAll(splitOnce(line, ":"))
      if (!v) continue // keys with blank values are ignored
      frontmatter[k.toLowerCase()] = v
    }
  }

  return { frontmatter, body }
}

export const validateFrontmatter = (path: string, fm: Frontmatter) => {
  // DATE
  if (isISOString(fm.date)) {
    // Pages with a date also need a title and description, for RSS
    if (!fm.title) log(`Page with publish: YYYY-MM-DD must have a title: ${green(path)}`)
    if (!fm.description) log(`Page with publish: YYYY-MM-DD must have a description: ${green(path)}`)
  } else if (fm.date) {
    log(`The ${yellow("date")} frontmatter must be ${yellow("YYYY-MM-DD")}, but isn't: ${green(path)}`)
    delete fm.date
  }

  // PUBLISH
  fm.publish ??= "true"
  if (!["true", "draft", "false"].includes(fm.publish)) {
    log(`The ${yellow("publish")} frontmatter, if present, should be ${yellow("draft")} or ${yellow("false")}: ${green(path)}`)
    fm.publish = "false"
  }

  // DESCRIPTION
  // You can use inline markdown for the description.
  if (fm.description) fm.description = Markdown.renderInline(fm.description)
}
