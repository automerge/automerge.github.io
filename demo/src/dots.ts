import { ChangeInfo, Color, Position } from "./types.ts"
import { rand } from "./util.ts"
import Vec, { Vector } from "./vec.ts"

let colorA: Color = [0.22, 0.21, 0.2]
let colorB: Color = [0.7 * 1, 0.7 * 0.8, 0.7 * 0.2]

type Theme = "light" | "dark"
window.addEventListener("set-theme", (e) => setTheme((e as CustomEvent).detail as Theme))

function setTheme(theme: Theme) {
  if (theme == "dark") {
    colorA = [1, 0.8, 0.2]
    colorB = [0.35, 0.35, 0.35]
  } else {
    colorA = [0.22, 0.21, 0.2]
    colorB = [0.7 * 1, 0.7 * 0.8, 0.7 * 0.2]
  }
}

setTheme(document.documentElement.getAttribute("theme") as Theme)

// Density of particles — bigger values are more spaced-out
const step = 2

// Size of the offscreen canvas used for generating text particles
const width = 330
const height = 30

// Create offscreen canvas
const cvs = document.createElement("canvas")
const ctx = cvs.getContext("2d", { willReadFrequently: true })!

// doesn't need to be retina (in fact, probably want to reduce res)
cvs.width = width
cvs.height = height

// Must match the stylesheet
ctx.font = "500 16px / 1 'Overpass Mono'"

export type Dot = {
  // Offset with respect to the particle
  local: Position
  // For lerping
  start: Position
  dest: Position
  // For physics-driven animation
  pos: Position
  vel: Vector
  accel: Vector
  // Etc
  age: number
  size: number
  color: Color
  complete: boolean
}

export function makeDots(info: ChangeInfo, worldPos: Position, isDelete: boolean) {
  const dots: Dot[] = []
  for (let edit of info.edits) {
    // Text addition / removal
    if (edit.type == "edit") {
      // Draw the text white-on-black into our offscreen canvas
      ctx.fillStyle = "black"
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = "white"
      ctx.fillText(edit.text, 0, 14.5)
      const data = ctx.getImageData(0, 0, width, height).data
      // Find all bright pixels, and put dots there
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const byte = (y * width + x) * 4
          if (data[byte] > 127) {
            // Manually adjust dot position to match text (tuned by eye)
            let X = x + (30 + edit.charIndex * 9.8)
            dots.push(makeDot(X, y, worldPos, isDelete))
          }
        }
      }
      // Place a dot at the center of space chars
      if (dots.length == 0) dots.push(makeDot(35 + edit.charIndex * 9.8, 10, worldPos, isDelete))
    }

    // Crossing-out a completed task with a long horizontal line
    // TODO: make the line match the length of the text?
    else if (edit.type == "clear") {
      let y1 = 8
      let y2 = 9
      let x1 = -6
      let x2 = 250
      for (let y = y1; y <= y2; y += step) {
        for (let x = x1; x <= x2; x += step) {
          dots.push(makeDot(x, y, worldPos, isDelete))
        }
      }
    }

    // Toggling a checkbox ON with a little square in the middle
    else if (edit.type == "toggle" && edit.value) {
      let y1 = 5
      let y2 = 11
      let x1 = 6
      let x2 = 11
      for (let y = y1; y <= y2; y += step) {
        for (let x = x1; x <= x2; x += step) {
          dots.push(makeDot(x, y, worldPos, isDelete, 1))
        }
      }
    }

    // Toggling a checkbox OFF with a hollow outline around the checkbox
    else {
      let y1 = 0
      let y2 = 18
      let x1 = 0
      let x2 = 18
      let r = 2
      for (let y = y1; y <= y2; y += step) {
        for (let x = x1; x <= x2; x += step) {
          if (x - x1 < r || x2 - x < r || y - y1 < r || y2 - y < r) {
            dots.push(makeDot(x, y, worldPos, isDelete, info.edits[0].type == "add" ? 0 : 1))
          }
        }
      }
    }
  }

  return dots
}

function makeDot(x: number, y: number, worldPos: Position, isDelete: boolean, hurry = 0) {
  let X = x
  let Y = y
  let local = Vec(X, Y)
  let start = Vec.add(local, worldPos)
  let dest = Vec()
  let pos = start
  let vel = Vec()
  let accel = Vec.random(0.02)
  let age = isDelete ? 1 : hurry - (rand(0, 0.1) * y) / height - (rand(0, 0.5) * x) / width
  let size = 0
  let color = isDelete ? colorB : colorA
  let complete = false
  return { local, start, dest, pos, vel, accel, age, size, color, complete }
}
