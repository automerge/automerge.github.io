// Logging
// A collection of helper functions for consistent, nicely-formatted console messages.

import { Env } from "./env.ts"
import { indent } from "./util.ts"

// Terminal colors, and how we use them
export const red = (t: string) => `\x1b[31m${t}\x1b[0m` // attention-grabbing summary of an error condition, usually first line
export const green = (t: string) => `\x1b[32m${t}\x1b[0m` // current context (page, path, etc)
export const yellow = (t: string) => `\x1b[33m${t}\x1b[0m` // relevant snippet of code that triggered an error
export const blue = (t: string) => `\x1b[34m${t}\x1b[0m`
export const magenta = (t: string) => `\x1b[35m${t}\x1b[0m` // verbose mode
export const cyan = (t: string) => `\x1b[36m${t}\x1b[0m` // breaking the fourth wall
export const grey = (t: string) => `\x1b[90m${t}\x1b[0m` // de-emphasis
export const bold = (t: string) => `\x1b[1m${t}\x1b[0m` // title

// Log-able time since start
export const duration = (start: number) => grey(`(${Math.round(performance.now() - start)}ms)`)

export const getLogPrefix = () => {
  const timestamp = Env.verbose ? performance.now().toFixed(3).padStart(10) + "ms" : new Date().toLocaleTimeString("en-US", { hour12: false })
  return grey(timestamp + " → ")
}

// Print msg with a timestamp
export const log = (msg: any, ...more: any[]) => {
  console.log(getLogPrefix() + msg)
  for (let str of more) logIndented(str)
}

export const relog = (msg: string) => process.stdout.write("\r\x1b[K" + getLogPrefix() + msg)

// Print msg so that it lines up with log(), but without the timestamp
export const logIndented = (msg: any) => console.log(indent(msg, "           "))

// Print a nicely-formatted error message
export const logError = (context: string, err: any) => {
  log(red(context))
  err instanceof Error ? console.log(err.stack) : logIndented(err)
  logIndented(cyan("Please report this error! It should be handled better than this."))
}
