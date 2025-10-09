// Server
// This is a super-simple live-reloading web server for local development,
// using websockets & an injected <script> tag to trigger browser refresh.
// For more, see the original: https://github.com/ivanreese/please-reload.
// If our needs change, it'll be easy to replace this with something else.

import { Buffer } from "node:buffer"
import * as FS from "node:fs"
import * as HTTP from "node:http"
import * as OS from "node:os"
import * as Path from "node:path"
import * as WS from "ws"
import { exists } from "./io.ts"
import { green, log, logError, logIndented, red, yellow } from "./logging.ts"

// Add to this list as needed.
// If you don't know what mime type to use, just ask jeeves (or gee-pee-tee)
const mimeTypes: Record<string, string> = {
  css: "text/css",
  gif: "image/gif",
  gz: "application/gzip",
  html: "text/html",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "text/javascript",
  json: "application/json",
  map: "application/json",
  mjs: "text/javascript",
  mov: "video/quicktime",
  mp3: "audio/mpeg",
  mp4: "video/mp4",
  pdf: "application/pdf",
  png: "image/png",
  rss: "text/xml",
  svg: "image/svg+xml",
  wasm: "application/wasm",
  webm: "video/webm",
  webp: "image/webp",
  woff2: "font/woff2",
  woff: "font/woff",
  xml: "application/xml",
}

// These are the websocket servers we use to trigger reloads
let websockets: Record<string, WS.WebSocketServer> = {}

export default { reload, serve }

async function serve(root: string) {
  if (!exists(root)) log(yellow("Warning: the `public` folder doesn't exist. Did you mean to run `site dev`?"))

  // Announce that we're up and running
  log("Serving")

  // Start a server for localhost
  await createServer(root, "localhost", 3000, "local")

  // Start a server for local area network access (ie. so you can test the site on your phone)
  const networkHost = OS.networkInterfaces().en0?.filter((i) => i.family === "IPv4")[0]?.address
  if (networkHost) await createServer(root, networkHost, 3000, "network")
}

function reload() {
  for (const name in websockets) {
    websockets[name].clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send("reload")
      }
    })
  }
}

async function createServer(root: string, host: string, port: number, name: string) {
  return new Promise<number>((resolve) => {
    // Set up our file server
    const server = HTTP.createServer(handleRequest(root))

    server.on("error", (err: NodeJS.ErrnoException) => {
      // If the port is already in use, try the next port
      if (err.code === "EADDRINUSE") {
        server.close()
        server.listen({ host, port: ++port })
      } else {
        logError("Unhandled server error", err)
      }
    })

    // When we successfully fire up the server, make an announcement and resolve the promise
    server.on("listening", () => {
      logIndented(name + ": " + green(`http://${host}:${port}`))
      resolve(port)
    })

    // When the browser connects, upgrade to a websocket conn, and store the websocket server for firing reloads
    websockets[name] = new WS.WebSocketServer({ noServer: true })
    server.on("upgrade", (r, s, h) => websockets[name].handleUpgrade(r, s, h, () => {}))

    server.listen({ host, port })
  })
}

// When a request comes in, figure out what to respond with, and then do that!
const handleRequest = (root: string) => (req: HTTP.IncomingMessage, res: HTTP.ServerResponse) => {
  const [url, query] = (req.url as string).split("?")
  let filePath = decodeURI(root + url)
  let ext = Path.extname(filePath).toLowerCase().substring(1)

  // When the request doesn't include a file extension, attempt to serve an index.html
  if (ext === "") {
    if (filePath.slice(-1) !== "/") {
      return respond(res, 302, null, { location: req.url + "/" })
    } else {
      filePath += "index.html"
      ext = "html"
    }
  }

  const contentType = mimeTypes[ext]

  // prettier-ignore
  if (!contentType) {
    log(red(`Unknown Media Type for url: ${req.url}`))
    log(    `                  filePath: ${filePath}`)
    log(    `                       ext: ${ext}`)
    log(    `Please add the appropriate mime type to server.ts`)
    return respond(res, 415)
  }

  const headers: HTTP.OutgoingHttpHeaders = {
    "Cache-Control": "private, no-cache, no-store, must-revalidate",
    "Expires": "-1",
    "Pragma": "no-cache",
    "Content-Type": contentType,
  }

  // Check if there's a file we can serve, otherwise respond with a 404
  let stats: FS.Stats
  try {
    stats = FS.statSync(filePath)
  } catch (error) {
    return respond(res, 404)
  }

  // For range requests (ie: videos), we need to do a bunch of extra nonsense
  if (req.headers.range) {
    const [start, end] = req.headers.range.replace("bytes=", "").split("-")
    const startByte = parseInt(start, 10) || 0
    const endByte = parseInt(end, 10) || stats.size - 1

    if (startByte >= stats.size || endByte >= stats.size) {
      return respond(res, 416, null, { "Content-Range": `bytes */${stats.size}` })
    }

    // prettier-ignore
    res.writeHead(206, Object.assign(headers, {
      "Content-Range": `bytes ${startByte}-${endByte}/${stats.size}`,
      "Content-Length": endByte - startByte + 1,
      "Accept-Ranges": "bytes"
    }))

    FS.createReadStream(filePath, { start: startByte, end: endByte }).pipe(res)
  }

  // For all other requests, serve the file
  else {
    FS.readFile(filePath, (error, content) => {
      if (error?.code === "ENOENT") return respond(res, 404)
      if (error) return respond(res, 500, error.code)
      if (ext === "html" && req.headers.host) {
        let html = content.toString()
        let reloadScript = `<script>if (window == window.top) (new WebSocket("ws://${req.headers.host}")).onmessage = e => { if (e.data == "reload") location.reload(true) };</script>\n</body>`
        html = html.includes("</body>") ? html.replace("</body>", reloadScript) : html + reloadScript
        content = Buffer.from(html)
      }
      respond(res, 200, content, headers)
    })
  }
}

// Write out the headers and respond with an optional body
const respond = (res: HTTP.ServerResponse, code: number, body?: any, headers?: HTTP.OutgoingHttpHeaders) => {
  res.writeHead(code, headers)
  res.end(body)
}
