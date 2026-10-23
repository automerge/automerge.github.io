// I/O
// This file wraps Chokidar, Glob, and Node, giving use nicer default behaviour
// and more ability to remove or replace these dependencies without breaking anything.

import Chokidar from "chokidar"
import { globSync } from "glob"
import ChildProcess from "node:child_process"
import FS from "node:fs"
import * as Path from "node:path"
import { fileURLToPath } from "node:url"
import { Env } from "./env.ts"
import { green, log, logError, magenta, red } from "./logging.ts"
import type { Stats } from "./types.ts"
import { debounce, toSorted, unique } from "./util.ts"

const dotfiles = /(^|[\/\\])\../

// After anything inside the given paths changes, wait for things to calm down, then run the given actions.
export function runWatcher(paths: string[], actions: () => any, debounceTime = 100) {
  const runActionsSoon = debounce(debounceTime, actions)

  // Each build deletes /public and hardlinks static assets back into it, which changes the link count of
  // their sources in /content. Some platforms (eg: Linux inotify) report that as a "change", which would
  // trigger another build, forever. So we only count a change if the file's mtime actually moved.
  const mtimes = new Map<string, number>()
  let ready = false

  Chokidar.watch(paths, { ignored: dotfiles, alwaysStat: true })
    .on("error", () => log(red(`Watching ${JSON.stringify(paths)} failed`)))
    .on("ready", () => (ready = true))
    .on("all", (event, path, stats) => {
      if (stats) {
        const unchanged = event == "change" && mtimes.get(path) == stats.mtimeMs
        mtimes.set(path, stats.mtimeMs)
        if (unchanged) {
          if (Env.verbose) log(magenta(event) + " " + green(path) + " " + magenta("(metadata only, ignoring)"))
          return
        }
      } else if (event == "unlink") mtimes.delete(path)

      if (!ready) return // Initial scan, just recording mtimes

      if (Env.verbose) log(magenta(event) + " " + green(path))
      runActionsSoon()
    })
}

// Extend glob to support arrays of patterns
// TODO: Can we use node's new built-in FS.globSync instead of the npm package?
export const glob = (...patterns: string[]) => toSorted(unique(patterns.flatMap((p) => globSync(p))))

// Common file path ops
export const basename = (path: string) => Path.parse(path).name
export const extname = (path: string) => Path.extname(path).slice(1) // strip leading dot
export const parentDir = (path: string) => Path.dirname(path)

// Ensure that the parent dir exists (ie: before writing a file inside it)
export const ensureDir = (path: string) => {
  mkdir(parentDir(path) || ".")
  return path
}

// Caching these reads only made a ~4ms improvement on M1, so it was deemed not worth the complexity
export const read = (path: string) => FS.readFileSync(path).toString()

export const mkdir = (path: string) => FS.mkdirSync(path, { recursive: true })
export const exists = (path: string) => FS.existsSync(path)
export const rm = (pattern: string) => glob(pattern).forEach((path) => FS.rmSync(path, { recursive: true }))
export const copy = (path: string, dest: string) => FS.copyFileSync(path, ensureDir(dest), FS.constants.COPYFILE_EXCL)
export const write = (dest: string, text: string) => FS.writeFileSync(ensureDir(dest), text, { flag: "wx" }) // open for writing, fail if file exists
export const link = (path: string, dest: string) => FS.linkSync(path, ensureDir(dest))
export const stats = (path: string): Stats => {
  let s = FS.statSync(path)
  return { modified: s.mtime }
}

// Saner default for execSync
export const exec = (cmd: string) => ChildProcess.execSync(cmd, { stdio: "inherit" })

// Make sure the script is being run from the right dir
export const isSafeInvocation = () => Path.resolve(process.cwd()) === Path.dirname(Path.dirname(fileURLToPath(import.meta.url)))

// FILE WRITING WITH NICE ERRORS //////////////////////////////////////////////////////////////////

export const writePage = (dest: string, html: string) => {
  try {
    write(dest, html)
  } catch (err: any) {
    if (err.code === "EEXIST") log(red(`Multiple pages want to be ${green(dest.replace("public/", "/"))}`))
    else logError("Unexpected error while writing page " + green(dest), err)
  }
}

export const copyPage = (path: string, dest: string) => {
  try {
    copy(path, dest)
  } catch (err: any) {
    if (err.code === "EEXIST") log(red(`Multiple pages want to be ${green(dest.replace("public/", "/"))}`))
    else logError("Unexpected error while copying page " + green(path), err)
  }
}

export const linkFile = (path: string, dest: string) => {
  try {
    link(path, dest)
  } catch (err: any) {
    logError("Unexpected error while linking file " + green(dest), err)
  }
}
