import { Particle } from "./particle.ts"
import { Color, Position } from "./types.ts"
import { PI, TAU } from "./util.ts"

const sides = 4
const radius = 0.8

export type RenderDot = Position & { color: Color }

const vertexShaderSource = `#version 300 es
in vec2 a_position;
in vec2 a_offset;
in float a_alpha;
in vec3 a_color;
out float v_alpha;
out vec3 v_color;
uniform vec2 u_resolution;
void main() {
  vec2 pos = a_position + a_offset;
  gl_Position = vec4(pos / u_resolution * 2.0 - 1.0, 0, 1);
  gl_Position.y *= -1.0;
  v_alpha = a_alpha;
  v_color = a_color;
}
`

const fragmentShaderSource = `#version 300 es
precision mediump float;
in float v_alpha;
in vec3 v_color;
out vec4 outColor;
void main() {
  outColor = vec4(v_color, v_alpha);
}
`

const canvas = document.querySelector("#demo canvas") as HTMLCanvasElement
const dpr = window.devicePixelRatio

let width = 0
let height = 0
let bounds: DOMRect

const resize = () => {
  bounds = canvas.getBoundingClientRect()
  width = bounds.width
  height = bounds.height
  canvas.width = width * dpr
  canvas.height = height * dpr
}
resize()
window.onresize = resize

export function getCanvasRect() {
  return (bounds ??= canvas.getBoundingClientRect())
}

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return shader
}

function makePolygon(sides: number, radius: number): number[] {
  const vertices: number[] = []
  for (let i = 0; i < sides; i++) {
    const a1 = (i / sides) * TAU + PI / 4
    const a2 = ((i + 1) / sides) * TAU + PI / 4
    vertices.push(0, 0, radius * Math.cos(a1), radius * Math.sin(a1), radius * Math.cos(a2), radius * Math.sin(a2))
  }
  return vertices
}

const gl = canvas.getContext("webgl2", { antialias: true })!

gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

const vertShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

const program = gl.createProgram()!
gl.attachShader(program, vertShader)
gl.attachShader(program, fragShader)
gl.linkProgram(program)

const resolutionLoc = gl.getUniformLocation(program, "u_resolution")!

const vao = gl.createVertexArray()!
gl.bindVertexArray(vao)

const shapeVertices = makePolygon(sides, radius)
const vertexCount = shapeVertices.length / 2
const shapeBuffer = gl.createBuffer()!
gl.bindBuffer(gl.ARRAY_BUFFER, shapeBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shapeVertices), gl.STATIC_DRAW)

const positionLoc = gl.getAttribLocation(program, "a_position")
gl.enableVertexAttribArray(positionLoc)
gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

const instanceBuffer = gl.createBuffer()!
gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer)

const offsetLoc = gl.getAttribLocation(program, "a_offset")
gl.enableVertexAttribArray(offsetLoc)
gl.vertexAttribPointer(offsetLoc, 2, gl.FLOAT, false, 0, 0)
gl.vertexAttribDivisor(offsetLoc, 1)

const alphaBuffer = gl.createBuffer()!
gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer)

const alphaLoc = gl.getAttribLocation(program, "a_alpha")
gl.enableVertexAttribArray(alphaLoc)
gl.vertexAttribPointer(alphaLoc, 1, gl.FLOAT, false, 0, 0)
gl.vertexAttribDivisor(alphaLoc, 1)

const colorBuffer = gl.createBuffer()!
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)

const colorLoc = gl.getAttribLocation(program, "a_color")
gl.enableVertexAttribArray(colorLoc)
gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0)
gl.vertexAttribDivisor(colorLoc, 1)

export function render(particles: Set<Particle>) {
  gl.viewport(0, 0, width * dpr, height * dpr)
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.useProgram(program)
  gl.uniform2f(resolutionLoc, width, height)
  gl.bindVertexArray(vao)

  let count = 0
  for (let particle of particles) count += particle.dots.length

  const offsets = new Float32Array(count * 2)
  const alphas = new Float32Array(count)
  const colors = new Float32Array(count * 3)

  let i = 0
  for (let particle of particles) {
    for (let dot of particle.dots) {
      offsets[i * 2] = dot.springPos.x
      offsets[i * 2 + 1] = dot.springPos.y
      colors[i * 3] = dot.color[0]
      colors[i * 3 + 1] = dot.color[1]
      colors[i * 3 + 2] = dot.color[2]
      alphas[i] = dot.color[3]
      i++
    }
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, offsets, gl.DYNAMIC_DRAW)

  gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, alphas, gl.DYNAMIC_DRAW)

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW)

  gl.drawArraysInstanced(gl.TRIANGLES, 0, vertexCount, count)
}
