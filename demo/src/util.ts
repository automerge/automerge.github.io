export type Point = { x: number; y: number }

export const PI = Math.PI
export const TAU = PI * 2

// keep i between min and max
export const clip = (i: number, min = 0, max = 1) => Math.min(Math.max(i, min), max)

// get what i would be if min became 0 and max became 1
export const no = (i = 0, min = -1, max = 1, doClip = false) => {
  let n = max === min ? min : (i - min) / (max - min)
  return doClip ? clip(n) : n
}

// get what i would be if 0 became min and 1 became max
export const de = (i = 0, min = -1, max = 1) => i * (max - min) + min

// normalize to [min1,max1] then denormalize to [min2,max2]
export const re = (i = 0, min1 = -1, max1 = 1, min2 = 0, max2 = 1, doClip = false, exp = 1) => {
  if (max1 < min1) [min1, max1, min2, max2] = [max1, min1, max2, min2]
  let n = no(i, min1, max1, doClip) ** exp
  return de(n, min2, max2)
}

// take a number in range [min, max], and remap to the V-shaped range max to 0 to max.
// pass flip=true to go from 0 to max to 0
export const mirror = (i: number, min = 0, max = 1, flip = false) => {
  let v = Math.abs(re(i, min, max, -max, max, true))
  return flip ? max - v : v
}

// random float in the range [min,max)
export const rand = (min = 0, max = 1) => de(Math.random(), min, max)

// random int in the range [min,max]
export const randInt = (min = 0, max = 1) => Math.floor(rand(min, max + 1)) // (written carefully to avoid bias)

// like %, but without mirroring at 0
export const mod = (n: number, m = 1) => ((n % m) + m) % m

export const equal = (a: number, b: number, tolerance = 1e-10) => Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(a), Math.abs(b))

export const isZero = (v: number) => Number.EPSILON > Math.abs(v)

export const isNonZero = (v: number) => !isZero(v)

export const isNorm = (v: number) => v >= 0 && v <= 1

export const avg = (a: number, b: number) => (a + b) / 2

export const roundTo = (input: number, precision: number) => {
  // Using the reciprocal avoids floating point errors. Eg: 3/10 is fine, but 3*0.1 is wrong.
  const p = 1 / precision
  return Math.round(input * p) / p
}

// Alias, because it's sometimes weird to think of one in terms of the other
export const nearestMultiple = roundTo

export const easeInOut = (t: number) => (t < 0.5 ? de((t * 2) ** 3, 0, 0.5) : re(((1 - t) * 2) ** 3, 1, 0, 0.5, 1))

// Simple s-curve easing function
export const sCurve = (i: number, iMin = 0, iMax = 1, oMin = 0, oMax = 1) => {
  i = clip(no(i, iMin, iMax))
  i = 3 * Math.pow(i, 2) - 2 * Math.pow(i, 3)
  return de(i, oMin, oMax)
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const arrMod = <T>(arr: T[], i: number) => arr[i % arr.length]
export const arrRnd = <T>(arr: T[]) => arr[randInt(0, arr.length - 1)]
export const arrClip = <T>(arr: T[], i: number) => arr[clip(i, 0, arr.length - 1)]

export function getCornerPoints(p1: Point, p2: Point, p3: Point, distance: number) {
  // Calculate unit vectors from middle point to edge points
  const dx1 = p1.x - p2.x
  const dy1 = p1.y - p2.y
  const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1)
  const unit1x = dx1 / len1
  const unit1y = dy1 / len1

  const dx2 = p3.x - p2.x
  const dy2 = p3.y - p2.y
  const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)
  const unit2x = dx2 / len2
  const unit2y = dy2 / len2

  // Walk distance away from middle point toward edge points
  const corner1 = {
    x: p2.x + unit1x * distance,
    y: p2.y + unit1y * distance,
  }

  const corner2 = {
    x: p2.x + unit2x * distance,
    y: p2.y + unit2y * distance,
  }

  return [corner1, corner2]
}

export const range = (min: number, max: number) => Array.from({ length: max - min }, (_, i) => i + min)
export const shuffledRange = (min: number, max: number) => shuffleArray(range(min, max))

// v in the range 0 to 1 becomes min to max to min with a bell-esq curve
export const bell = (v: number, min = 0, max = 1) => re(cos1(clip(v) - 0.25), min, max)

export const chance = (v = 0.5) => rand(0, 1) < v

export const cos = (t = 0) => Math.cos(t * TAU)
export const sin = (t = 0) => Math.sin(t * TAU)
export const cos1 = (t = 0) => no(cos(t))
export const sin1 = (t = 0) => no(sin(t))

export const ss = (v = 0) => v * v * (3 - 2 * v)

export const min = (a = 1, b = 1) => Math.min(a, b)
export const max = (a = 0, b = 0) => Math.max(a, b)
export const inexp = (v = 0, min = 0, max = 1, e = 2) => re(v, min, max, min, max, false, e)

// as v goes from 0 to 2, this goes from 0 to 1 to 0
export const tri = (v = 0) => Math.abs(mod(v, 2) - 1)
