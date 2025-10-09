// Util
// Various little utility functions used throughout the build system.
// None of these functions should know anything about the nature of our website.

import { Env } from "./env.ts"

// Fill in some gaps in the std lib, and support a point-free style
export const flatJoin = <T>(arr: T[], sep = "\n") => arr.flat(Infinity).join(sep)
export const toSorted = <T>(arr: T[]) => arr.toSorted()
export const unique = <T>(arr: T[]) => Array.from(new Set(arr))
type Existing<T> = T extends null | undefined | void ? never : T
export const compact = <T>(arr: (T | null)[]): Existing<T>[] => arr.filter(nonnull)
export const nonnull = <T>(v: T): v is Existing<T> => v != null
export const indent = (str: string, spaces = "  ") => splitLines(str).map((line) => spaces + line).join("\n") // prettier-ignore
export const splitOnce = (str: string, sep: string) => {
  const i = str.indexOf(sep)
  return i === -1 ? [str] : [str.slice(0, i), str.slice(i + sep.length)]
}
export const splitLines = (str: string) => str.split("\n")
export const trim = (s: string) => s.trim()
export const trimAll = (arr: string[]) => arr.map(trim)

// Split str to the left of the first occurrence of char
// splitBefore("1234", "3") => ["12", "34"]
// splitBefore("1234", "5") => ["", "1234"]
export const splitBefore = (str: string, char: string) => {
  let index = Math.max(str.indexOf(char), 0)
  return [str.slice(0, index), str.slice(index)]
}

// Split str to the right of the first occurrence of char
// splitAfter("1234", "3") => ["123", "4"]
// splitAfter("1234", "5") => ["1234", ""]
export const splitAfter = (str: string, char: string) => {
  const index = str.indexOf(char)
  const splitIndex = index === -1 ? str.length : index + 1
  return [str.slice(0, splitIndex), str.slice(splitIndex)]
}

export const getValuesOfAttributes = (src: string, attr: string) =>
  compact([
    src.match(new RegExp(`${attr}="[^"]+"`, "g")), // double quotes
    src.match(new RegExp(`${attr}='[^']+'`, "g")), // single quotes
  ])
    .flat()
    .map((match) => match.slice(attr.length + 2, -1)) // attr="foo" -> foo

// A tiny DSL for string replacement
export const replace = (str: string, kvs: Record<string, string>) => {
  Object.entries(kvs).forEach(([k, v]) => (str = str.replaceAll(k, v)))
  return str
}

// Turn arbitrary text into nice(ish) url-safe "slugs". Eg: `This isn't *so* bad!` becomes `this-isnt-so-bad`
export const slugify = (s: string) => s.toLowerCase().replaceAll(/['’]/g, "").replace(/[^a-z0-9]+/g, " ").trim().replaceAll(/ +/g, "-") // prettier-ignore

// Similar to the above, but preserves more of unicode (eg: letters with accents)
export const anchorize = (s: string) => s.toLowerCase().replaceAll("&amp;","and").replaceAll(/['’]/g, "").replace(/[^\p{L}\p{N}]/gu, " ").trim().replaceAll(/ +/g, "-") // prettier-ignore

export const cdata = (s: string) => `<![CDATA[${s}]]>`

// Remove HTML tags — eg, for cleaning up the description frontmatter for inclusion in <meta>
// TODO: make this smart enough to ignore code blocks inside <pre>
export const plainify = (s: string) => s.replace(/<[^>]+>/g, "")

// Replace all instances of an html tag in a string, using a given replacement function
type ReplaceTagFn = (contents: string, attrs: string, spaces: string) => string
export const replaceHtmlTag = (html: string, tag: string, cb: ReplaceTagFn) => {
  const regex = new RegExp(`( *)<${tag}(?![a-zA-Z])([^>]*)>(.*?)</${tag}>`, "gs")
  return html.replaceAll(regex, (match, spaces, attrs, contents) => cb(contents.trim(), attrs, spaces))
}

// For natural sorting
export const compare = new Intl.Collator("en").compare

// Some date string handling
export const isISOString = (str: string) => /^\d{4}-\d{2}-\d{2}/.test(str)
export const dateIsInTheFuture = (str: string) => compare(str, new Date().toISOString().slice(0, 10)) > 0

// URL handling
export const withLeadingSlash = (path: string) => (path.startsWith("/") ? path : "/" + path)
export const withTrailingSlash = (path: string) => (path.endsWith("/") ? path : path + "/")
export const withOuterSlashes = (path: string) => withLeadingSlash(withTrailingSlash(path))

export const toFullUrl = (path: string) => {
  path = path.startsWith("http") ? path : `https://${Env.domain}` + withLeadingSlash(path)
  let segs = path.split("/")
  path = segs.at(-1)!.includes(".") ? path : withTrailingSlash(path)
  return path
}

// Wait to call the given function until some time has passed without new calls.
export const debounce = (time: number, fn: () => void) => {
  let timeout: NodeJS.Timeout
  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(fn, time)
  }
}
