// Build
// This file wraps a bit of retry logic and error handling
// around the main website compilation process.

import { compileEverything } from "./compile-everything.ts"
import { Env } from "./env.ts"
import { duration, log, logError, magenta } from "./logging.ts"
import { debounce } from "./util.ts"

let building = false
let buildNum = 0

// Either start building immediately if we can, or wait until things calm down then go.
export const build = () => (!building ? buildNow() : buildSoon())

const buildSoon = debounce(50, build)

const buildNow = () => {
  building = true

  try {
    const num = ++buildNum
    const start = performance.now()
    if (Env.verbose) log(magenta(`Starting build ${num}`))

    compileEverything()

    if (Env.verbose) log(magenta(`Finished build ${num} ${duration(start)}`))
    else log(`Build ${duration(start)}`)
  } catch (err) {
    logError("An unhandled error occurred while building.", err)
  }

  building = false
}
