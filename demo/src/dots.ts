import { ChangeInfo, Color, Position } from "./types.ts"
import Vec, { Vector } from "./vec.ts"

const step = 2
const width = 500
const height = 50
const springStiffness = 10

// Create offscreen canvas
const cvs = document.createElement("canvas")
const ctx = cvs.getContext("2d", { willReadFrequently: true })!

// doesn't need to be retina (in fact, probably want to reduce res)
cvs.width = width
cvs.height = height

// Must match the stylesheet
ctx.font = "500 16px / 1 'Overpass Mono'"
// ctx.textBaseline = "middle"

export type Dot = {
  // Offset with respect to the canvas (used for offset with respect to destination)
  local: Position

  // Screen position (moves with velocity/acceleration toward target)
  pos: Position
  vel: Vector

  // Rendered position (springs around the real position)
  springPos: Position
  springVel: Vector
  springK: number

  age: number

  isComplete: boolean

  color: Color
}

export function makeDots(info: ChangeInfo, worldPos: Position) {
  const dots: Dot[] = []
  for (let edit of info.edits) {
    if (edit.type == "edit") {
      ctx.fillStyle = "black"
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = "white"
      ctx.fillText(edit.text, 0, 14.5)
      const data = ctx.getImageData(0, 0, width, height).data
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const byte = (y * width + x) * 4
          if (data[byte] > 127) {
            let X = x + (30 + edit.charIndex * 9.8)
            dots.push(makeDot(X, y, worldPos))
          }
        }
      }
      // We'll have no dots if the only edits were whitepsace
      if (dots.length == 0) dots.push(makeDot(35 + edit.charIndex * 9.8, 10, worldPos))
    } else if (edit.type == "clear") {
      let y1 = 8
      let y2 = 9
      let x1 = -6
      let x2 = 250
      for (let y = y1; y <= y2; y += step) {
        for (let x = x1; x <= x2; x += step) {
          dots.push(makeDot(x, y, worldPos))
        }
      }
    } else if (edit.type == "toggle" && edit.value) {
      let y1 = 5
      let y2 = 11
      let x1 = 6
      let x2 = 11
      for (let y = y1; y <= y2; y += step) {
        for (let x = x1; x <= x2; x += step) {
          dots.push(makeDot(x, y, worldPos))
        }
      }
    } else {
      let y1 = 0
      let y2 = 18
      let x1 = 0
      let x2 = 18
      let r = 2
      for (let y = y1; y <= y2; y += step) {
        for (let x = x1; x <= x2; x += step) {
          if (x - x1 < r || x2 - x < r || y - y1 < r || y2 - y < r) {
            dots.push(makeDot(x, y, worldPos))
          }
        }
      }
    }
  }

  return dots
}

function makeDot(x: number, y: number, worldPos: Position) {
  let X = x
  let Y = y
  let local = Vec(X, Y)
  let pos = Vec.add(local, worldPos)
  let vel = Vec.random(0.1) // TODO: adjust
  let springK = springStiffness // + rand(-0.1, 0.1)
  let age = 1 - y / height - (5 * x) / width
  let color: Color = [0.166, 0.166, 0.166, 1]
  return { local, pos, vel, springPos: pos, springVel: vel, springK, age, isComplete: false, color }
}
