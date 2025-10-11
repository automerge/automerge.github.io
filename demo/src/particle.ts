import { Client, limit } from "./client.ts"
import { Dot, makeDots } from "./dots.ts"
import { getCanvasRect, render } from "./ParticleRenderer.ts"
import { ChangeInfo, Id, Position } from "./types.ts"
import { clip, no, ss } from "./util.ts"
import Vec from "./vec.ts"

export class Particle {
  static all: Set<Particle> = new Set()

  static update(dt: number) {
    Particle.all.forEach((p) => p.physics(dt))
    render(Particle.all)
  }

  static recalc() {
    let map = new Map<Id, number>()

    // To start, the target spec doc has been reset to its own local doc state
    for (let particle of Particle.all) {
      // Capture the ID=>IDX mapping for each todo currently in the spec doc
      for (let i = 0; i < particle.target.spec.todos.length; i++) map.set(particle.target.spec.todos[i].id, i)
      // Apply this particle's changes
      particle.target.speculate(particle.sourceInfo)
      // Again, capture the ID=>IDX mapping for each todo currently in the spec doc
      for (let i = 0; i < particle.target.spec.todos.length; i++) map.set(particle.target.spec.todos[i].id, i)
    }
    // At this point, every todo ID will have its last-known IDX stored.

    for (let particle of Particle.all) {
      // Now, update the destination positions for each particle
      let idx = map.get(particle.sourceInfo.id)
      if (idx != null && idx >= 0) {
        particle.dest = getPos(particle.target, idx)
        particle.skipEnd = idx >= limit
      }
      // This is an extremely rare failure case, where we couldn't find a TODO for this particle anywhere in history.
      // In this case, we use the particle's last-known destination, or just go to idx 0 as a final fallback.
      else particle.dest ??= getPos(particle.target, 0)
    }
  }

  dots: Dot[]
  dest: Position = { x: 0, y: 0 }
  applyEarly = false
  skipStart = false
  skipEnd = false

  constructor(public sourceInfo: ChangeInfo, public source: Client, public target: Client, isDelete: boolean) {
    // When adding a new todo, we apply early so that other todos scoot out of the way
    let isAdd = sourceInfo.edits.some((e) => e.type == "add")
    if (isAdd) this.applyEarly = true
    this.dots = makeDots(sourceInfo, getPos(source, sourceInfo.todoIndex), isDelete)
    // let targetInfo = target.speculate(sourceInfo)
    // this.dest = getPos(target, targetInfo)
    this.skipStart = sourceInfo.todoIndex >= limit
    Particle.all.add(this)
  }

  physics(dt: number) {
    let allComplete = true

    for (const dot of this.dots) {
      let dest = Vec.add(this.dest, dot.local) // TODO: cache this, only recompute on recalc

      dot.age += dt

      // scatter
      let accel = Vec.mulS(dot.accel, no(dot.age, 0.8, 2, true))
      dot.vel = Vec.add(dot.vel, Vec.mulS(accel, 120 * dt))
      dot.pos = Vec.add(dot.pos, Vec.mulS(dot.vel, 120 * dt))

      // figure out our lerp to target
      let goalT = ss(no(dot.age, 1.3, 3, true))
      let goal = Vec.lerp(dot.start, dest, goalT)

      let blendT = ss(no(dot.age, 1.3, 3, true))
      dot.pos = Vec.lerp(dot.pos, goal, blendT)

      if (dot.age > 2.5 && this.applyEarly) {
        this.applyEarly = false
        this.target.applyChange(this.sourceInfo.change)
      }

      dot.size = clip(dot.age - 1)
      dot.size *= no(dot.age, 4, 2.5, true)
      if (this.skipStart) dot.size *= no(dot.age, 0, 3, true)
      if (this.skipEnd) dot.size *= no(dot.age, 3, 0, true)

      dot.complete = dot.age > 3.2
      allComplete &&= dot.complete
    }

    if (allComplete) {
      Particle.all.delete(this)
      this.target.applyChange(this.sourceInfo.change)
    }
  }
}

function getPos(client: Client, todoIndex: number) {
  let p = Vec.add(client.cachedListElmPos, Vec(20.5, 12.5 + todoIndex * 42))
  // As of this point, all position math is done relative to the canvas, which we call "world space"
  return Vec.sub(p, getCanvasRect())
}
