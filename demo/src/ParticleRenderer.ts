import { Particle } from "./particle.ts"
import { PI, TAU } from "./util.ts"

const sides = 8
const radius = 1.5

let width = 0
let height = 0
let bounds: DOMRect

const canvas = document.querySelector("#demo canvas") as HTMLCanvasElement
const dpr = window.devicePixelRatio

const gl = canvas.getContext("webgl2", { antialias: false })!

const vertexShaderSource = `#version 300 es
in vec2 a_position;
in vec3 a_offset;
in vec3 a_color;
out vec3 v_color;
uniform vec2 u_resolution;
void main() {
  vec2 pos = a_position * a_offset.z + a_offset.xy;
  gl_Position = vec4(pos / u_resolution * 2.0 - 1.0, 0, 1);
  gl_Position.y *= -1.0;
  v_color = a_color;
}
`

const fragmentShaderSource = `#version 300 es
precision mediump float;
in vec3 v_color;
out vec4 outColor;
void main() { outColor = vec4(v_color, 1.0); }
`

const resize = () => {
  bounds = null!
  bounds = getCanvasRect()
  width = bounds.width
  height = bounds.height
  canvas.width = width * dpr
  canvas.height = height * dpr
}
resize()
window.addEventListener("resize", resize)

export function getCanvasRect() {
  if (bounds) return bounds
  bounds = canvas.getBoundingClientRect()
  let body = document.body.getBoundingClientRect()
  bounds.x -= body.x
  bounds.y -= body.y
  return bounds
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
gl.vertexAttribPointer(offsetLoc, 3, gl.FLOAT, false, 0, 0)
gl.vertexAttribDivisor(offsetLoc, 1)

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

  const offsets = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  let i = 0
  for (let particle of particles) {
    for (let dot of particle.dots) {
      offsets[i * 3 + 0] = dot.pos.x
      offsets[i * 3 + 1] = dot.pos.y
      offsets[i * 3 + 2] = dot.size
      colors[i * 3 + 0] = dot.color[0]
      colors[i * 3 + 1] = dot.color[1]
      colors[i * 3 + 2] = dot.color[2]
      i++
    }
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, offsets, gl.DYNAMIC_DRAW)

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW)

  gl.drawArraysInstanced(gl.TRIANGLES, 0, vertexCount, count)
}
