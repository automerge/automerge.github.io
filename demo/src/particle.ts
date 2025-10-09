import { Client } from "./client.ts"
import { Dot, makeDots } from "./dots.ts"
import { getCanvasRect, render } from "./ParticleRenderer.ts"
import { ChangeInfo, Id, Position } from "./types.ts"
import { de, no, re } from "./util.ts"
import Vec from "./vec.ts"

export class Particle {
  static all: Set<Particle> = new Set()

  static update(dt: number) {
    Particle.all.forEach((p) => p.physics(dt))
    if (!document.hidden) render(Particle.all)
  }

  static recalc() {
    let map = new Map<Id, number>()

    for (let particle of Particle.all) {
      for (let i = 0; i < particle.target.spec.todos.length; i++) map.set(particle.target.spec.todos[i].id, i)
      particle.target.speculate(particle.sourceInfo)
      for (let i = 0; i < particle.target.spec.todos.length; i++) map.set(particle.target.spec.todos[i].id, i)
    }

    for (let particle of Particle.all) {
      let idx = map.get(particle.sourceInfo.id)
      if (idx != null && idx >= 0) particle.dest = getPos(particle.target, idx)
      else debugger
    }
  }

  dots: Dot[]
  dest: Position = { x: 0, y: 0 }
  applyEarly = false

  constructor(public sourceInfo: ChangeInfo, public source: Client, public target: Client, public isDelete: boolean) {
    // When adding a new todo, we apply early so that other todos scoot out of the way
    let isAdd = sourceInfo.edits.some((e) => e.type == "add")
    if (isAdd) this.applyEarly = true
    this.dots = makeDots(sourceInfo, getPos(source, sourceInfo.todoIndex))
    // let targetInfo = target.speculate(sourceInfo)
    // this.dest = getPos(target, targetInfo)
    Particle.all.add(this)
  }

  physics(dt: number) {
    let allComplete = true

    for (const dot of this.dots) {
      if (dot.isComplete) continue

      let destPos = Vec.add(this.dest, dot.local)
      let springDist = Vec.len(Vec.sub(destPos, dot.springPos))

      if (springDist < 50 && this.applyEarly) {
        this.applyEarly = false
        this.target.applyChange(this.sourceInfo.change)
      }

      if (springDist < 0.1) {
        if (!this.isDelete) dot.color[3] = 0.7
        dot.isComplete = true
        continue
      }

      allComplete = false

      dot.age += dt

      // move slowly for the first few seconds
      let rampStart = no(dot.age, 0, 4, true) ** 1.5
      let maxAccel = 0.02 * rampStart // per second
      let accel = Vec.renormalize(Vec.sub(destPos, dot.pos), maxAccel)

      // slow down as we approach
      let approach = no(springDist, 120, 0, true)
      let damping = de(approach, 0.99, 0.88) ** (dt * 60)

      dot.vel = Vec.add(dot.vel, Vec.Smul(120 * dt, accel))
      dot.vel = Vec.mulS(dot.vel, damping)
      dot.pos = Vec.add(dot.pos, Vec.Smul(120 * dt, dot.vel))

      // Spring pos (oscillating noisily around dot.pos) goes here
      const displacement = Vec.sub(dot.pos, dot.springPos)
      const springAccel = Vec.Smul(dot.springK * rampStart, displacement)
      dot.springVel = Vec.add(dot.springVel, Vec.Smul(dt, springAccel))
      dot.springVel = Vec.mulS(dot.springVel, damping)
      dot.springPos = Vec.add(dot.springPos, Vec.Smul(dt, dot.springVel))

      // Color
      if (this.isDelete) {
        dot.color[0] = re(springDist, 500, 0, 0.133, 0.8 * 1)
        dot.color[1] = re(springDist, 500, 0, 0.133, 0.8 * 0.8)
        dot.color[2] = re(springDist, 500, 0, 0.133, 0.8 * 0.2)
      } else {
        dot.color[3] = re(dot.age, 0, 3, 0, 1)
      }
    }

    if (allComplete) {
      Particle.all.delete(this)
      this.target.applyChange(this.sourceInfo.change)
    }
  }
}

function getPos(client: Client, todoIndex: number) {
  let p = Vec.add(client.cachedListElmPos, Vec(10, 5.5 + todoIndex * 28))
  // As of this point, all position math is done relative to the canvas, which we call "world space"
  return Vec.sub(p, getCanvasRect())
}
