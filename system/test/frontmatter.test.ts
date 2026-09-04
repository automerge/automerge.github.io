import test from "node:test"
import { deepStrictEqual } from "node:assert"
import { extractFrontmatter } from "../frontmatter.ts"

const assert = (actual: unknown, expected: any) => deepStrictEqual(actual, expected)

test("extracts basic frontmatter", () => {
  const source = `
  title: My Title
  description: A simple description
  ---
  # Main content here`

  const result = extractFrontmatter(source)

  assert(result.frontmatter.title, "My Title")
  assert(result.frontmatter.description, "A simple description")
  assert(result.body, "# Main content here")
})

test("handles frontmatter with leading ---", () => {
  const source = `---
  title: My Title
  description: A simple description
  ---
  # Main content here`

  const result = extractFrontmatter(source)

  assert(result.frontmatter.title, "My Title")
  assert(result.frontmatter.description, "A simple description")
  assert(result.body, "# Main content here")
})

test("handles content without frontmatter", () => {
  const source = `
  # Just content
  No frontmatter here`

  const result = extractFrontmatter(source)

  assert(result.frontmatter, {})
  assert(result.body, source.trim())
})

test("handles frontmatter without content", () => {
  const source = `
  this is: just frontmatter
  ---`

  const result = extractFrontmatter(source)

  assert(result.frontmatter, { "this is": "just frontmatter" })
  assert(result.body, "")
})

test("ignores comment lines", () => {
  const source = `
  title: My Title
  # This is a comment
  description: A simple description
  ---
  # Main content here`

  const result = extractFrontmatter(source)

  assert(Object.keys(result.frontmatter), ["title", "description"])
})

test("should handle values with colons", () => {
  const source = `
  title: My Article: A Deep Dive
  description: Chapter 1: Introduction
  ---
  # Main content here`

  const result = extractFrontmatter(source)

  assert(result.frontmatter.title, "My Article: A Deep Dive")
  assert(result.frontmatter.description, "Chapter 1: Introduction")
})

test("should ignore frontmatter keys without values", () => {
  const source = `
  nothing:
  still nothing: # comment
  something: here
  ---`

  const result = extractFrontmatter(source)

  assert(result.frontmatter, { something: "here" })
})

test("handles mixed quoted and unquoted values", () => {
  const source = `
  title: "Article: With Colon"
  description: Simple description
  author: "Jane Doe"
  ---
  # Main content here`

  const result = extractFrontmatter(source)

  assert(result.frontmatter.title, "Article: With Colon")
  assert(result.frontmatter.description, "Simple description")
  assert(result.frontmatter.author, "Jane Doe")
})

test("handles quotes with special characters", () => {
  const source = `
  title: "Article #1: Best Practices"
  description: "Tips & tricks: for developers"
  ---
  # Main content here`

  const result = extractFrontmatter(source)

  assert(result.frontmatter.title, "Article #1: Best Practices")
  assert(result.frontmatter.description, "Tips & tricks: for developers")
})
