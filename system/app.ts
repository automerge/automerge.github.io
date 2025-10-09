// App
// This is the main entry point for the website build system.
// It defines all the commands available via the `site` CLI.

import { parseArgs } from "node:util"
import { build } from "./build.ts"
import { Env } from "./env.ts"
import { exec, isSafeInvocation, runWatcher } from "./io.ts"
import { bold, grey, red, yellow } from "./logging.ts"
import Server from "./server.ts"

const commands = {
  dev: {
    help: "Build, watch, and serve with live-reloading. This is the default command.\n",
    cmd: () => {
      build()

      runWatcher(Env.watchedPaths, () => {
        build()
        Server.reload()
      })

      Server.serve("public")
    },
  },

  build: {
    help: "Build the website once. Drafts are excluded by default.",
    cmd: () => {
      // For this command, draft pages are *excluded* by default, but you can include them with --draft
      Env.draft = args.values.draft

      build()
    },
  },

  watch: {
    help: "Build the website whenever the content changes.",
    cmd: () => runWatcher(Env.watchedPaths, build),
  },

  serve: {
    help: "Run a local server to preview the last build of the website.\n",
    cmd: () => Server.serve("public"),
  },

  repo: {
    help: "Load the website repo on Github in your default browser.",
    cmd: () => {
      exec(`open "https://github.com/automerge/website"`)
    },
  },

  open: {
    help: `Open ${Env.domain} in your default browser.\n`,
    cmd: () => {
      exec(`open "https://${Env.domain}"`)
    },
  },

  help: {
    help: "Show this help info.",
    cmd: () => {
      console.log(bold("\n  Automerge Website CLI\n"))
      console.log(grey("  Usage:\n"))
      let longestName = Object.keys(commands).reduce((l, name) => Math.max(l, name.length), 0)
      for (const [name, { help }] of Object.entries(commands)) console.log(`    site ${name.padEnd(longestName)}  ${grey(help)}`)
      console.log("")
    },
  },
} satisfies Record<string, { help: string; cmd: () => void }>

// First, we need to parse the command line args, and set the relevant Env variables.

const args = parseArgs({
  options: {
    "draft": { type: "boolean", default: false },
    "no-draft": { type: "boolean", default: false },
    "fonts": { type: "boolean", default: true },
    "verbose": { type: "boolean", default: false },
  },
  allowPositionals: true,
})

// For most commands, draft pages are included by default, but you can exclude them with --no-draft
Env.draft = !args.values["no-draft"]
Env.subsetFonts = args.values.fonts
Env.verbose = args.values.verbose

// Alright! Let's run the requested command.

type Command = keyof typeof commands
const command = (args.positionals[0] || "dev") as Command

if (!isSafeInvocation()) {
  console.log(yellow("For safety, the site CLI can only be run at the root of the website repo."))
  // …because all our path handling logic uses relative paths, for simplicity.
  process.exitCode = 1
} else if (commands[command]) {
  commands[command].cmd()
} else {
  console.log("\n" + yellow(command) + red(" is not a valid command."))
  commands.help.cmd()
}
