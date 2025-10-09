// Env
// This file holds global variables, some of which are constants,
// some of which can be changed based on CLI commands/options,
// some of which are runtime state.

export const Env = {
  // CONFIGURABLE CONSTANTS

  // When these folders change, the watcher triggers a build.
  watchedPaths: ["content", "template"], // const

  domain: "automerge.org",

  description: "Automerge is a library for building collaborative, local-first applications.",

  // CLI FLAGS

  // Include draft pages in the build, and emit a robots.txt disallowing everything. True by default for most commands.
  draft: true, // set explicitly with --draft or --no-draft

  // Skip the font subsetting step.
  subsetFonts: true, // disable with --no-fonts

  // Increase the amount of logging
  verbose: false, // enable with --verbose
}
