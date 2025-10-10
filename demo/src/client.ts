import * as Automerge from "@automerge/automerge"
import { Particle } from "./particle.ts"
import { ChangeInfo, Doc, Edit, Id } from "./types.ts"
import Vec from "./vec.ts"

// What's the max number of todos that can be shown?
const limit = 5

// A little collection of HTML elements used to render each todo
type Elements = {
  item: HTMLElement
  box: HTMLInputElement
  input: HTMLInputElement
}

export class Client {
  static all: Client[] = []

  spec: Doc // state of this.doc after various in-flight changes have been applied; used for animation

  nextTodoId = 0
  editing: Id | null = null

  listElm: HTMLElement
  overflowElm: HTMLElement
  elements = new Map<Id, Elements>()

  cachedListElmPos = { x: 0, y: 0 }

  constructor(public name: string, public doc: Doc) {
    this.spec = Automerge.clone(this.doc)

    const elm = document.querySelector(`[js-client="${name}"]`) as HTMLElement
    const taskEntry = elm.querySelector(".entry .text") as HTMLInputElement
    taskEntry.onkeydown = (e) => {
      if (e.key == "Enter") taskEntry.blur()
    }
    taskEntry.onblur = () => {
      if (taskEntry.value.length <= 0) return
      this.add(taskEntry.value, 0)
      taskEntry.value = ""
    }
    this.listElm = elm.querySelector(".list") as HTMLElement
    this.overflowElm = elm.querySelector(".todo-overflow") as HTMLElement

    Client.all.push(this)

    // Make sure the cachedElmPos is not nonsense
    this.render()
  }

  add(text: string, index?: number) {
    const id = this.name + this.nextTodoId++
    const before = this.doc
    this.doc = Automerge.change(this.doc, (doc) => doc.todos.splice(index ?? doc.todos.length, 0, { id, text, done: false }))
    this.broadcast(before)
    return id
  }

  edit(id: Id, text: string) {
    const idx = this.getIndex(id)
    if (idx < 0) return console.log(`Couldn't edit todo ${id} on client ${this.name}`)
    const isDelete = text.length < this.doc.todos[idx].text.length
    const before = this.doc
    this.doc = Automerge.change(this.doc, (doc) => Automerge.updateText(doc, ["todos", idx, "text"], text))
    this.broadcast(before, isDelete)
  }

  toggle(id: Id, done?: boolean) {
    const idx = this.getIndex(id)
    if (idx < 0) return console.log(`Couldn't toggle todo ${id} on client ${this.name}`)
    const before = this.doc
    this.doc = Automerge.change(this.doc, (doc) => (doc.todos[idx].done = done ?? !doc.todos[idx].done))
    this.broadcast(before)
  }

  clear(id: Id) {
    const idx = this.getIndex(id)
    if (idx < 0) return console.log(`Couldn't clear todo ${id} on client ${this.name}`)
    const before = this.doc
    this.doc = Automerge.change(this.doc, (doc) => doc.todos.splice(idx, 1))
    this.broadcast(before, true)
  }

  getIndex(id: Id) {
    return this.doc.todos.findIndex((todo) => todo.id == id)
  }

  broadcast(before: Doc, isDelete = false) {
    // Render first, to make sure our cached rect position is updated
    this.render()
    let change = Automerge.getLastLocalChange(this.doc)
    if (!change) throw new Error("Couldn't get change?!")
    // Calculate info about this change, which we need for generating and animating particles
    let changeInfo = getChangeInfo(this.doc, before, change)
    // Now send the change to peers
    for (let target of Client.all) if (target != this) new Particle(changeInfo, this, target, isDelete)
    // Recalc all particles
    for (let client of Client.all) client.resetSpec()
    Particle.recalc()
  }

  applyChange(change: Automerge.Change) {
    this.doc = Automerge.applyChanges(this.doc, [change])[0]
    this.resetSpec()
    this.render()
  }

  speculate(info: ChangeInfo) {
    return (this.spec = Automerge.applyChanges(this.spec, [info.change])[0])
  }

  resetSpec() {
    this.spec = Automerge.clone(this.doc)
  }

  render() {
    const todos = this.doc.todos
    const overflow = todos.length > limit
    const visibleCount = Math.min(limit, todos.length)

    // Handle overflow
    this.overflowElm.textContent = `${todos.length - limit} more…`
    this.overflowElm.classList.toggle("hidden", !overflow)

    // Keep only the elms that haven't been cleared and aren't overflowing
    const keepElms = new Map<Id, Elements>()

    // Update visible todos
    for (let i = 0; i < visibleCount; i++) {
      const todo = todos[i]

      // Get or make elements for this todo
      let elms = this.elements.get(todo.id) ?? this.makeTodoElms(todo.id)
      keepElms.set(todo.id, elms)

      // Ensure element is in correct position
      elms.item.style.translate = `0 ${42 * i}px`
      elms.item.style.transition = `translate 1s`

      if (this.editing == todo.id && document.activeElement != elms.input) {
        elms.input.focus()
      }

      // Update element display
      elms.box.classList.toggle("hide", todo.text.length <= 0)
      elms.box.checked = todo.done
      if (!this.editing || this.editing !== todo.id) elms.input.value = todo.text
    }

    // Cleanup elements that weren't kept
    this.elements.forEach(({ item: div }, id) => {
      if (!keepElms.has(id)) {
        try {
          div.remove()
        } catch {
          // calling .remove() sometimes throws an error, not sure why
          console.log("Calling .remove() failed — might want to investigate the DOM")
        }
      }
    })
    this.elements = keepElms

    this.resize()
  }

  resize() {
    // Cache the list elm position, for particles to use
    this.cachedListElmPos = Vec.sub(this.listElm.getBoundingClientRect(), document.body.getBoundingClientRect())
  }

  makeTodoElms(id: Id) {
    const item = createElement("div", "item", this.listElm)

    const box = createInputElement("checkbox", "checkbox", item)
    box.onclick = () => this.toggle(id)

    const input = createInputElement("text", "text", item)
    input.onfocus = () => (this.editing = id)
    input.oninput = () => this.edit(id, input.value)
    input.onkeydown = (e) => {
      if (e.key == "Enter") input.blur()
    }
    input.onblur = () => {
      if (input.value.length == 0) return this.clear(id)
      this.editing = null
      this.render()
    }

    const elms = { item, box, input }
    this.elements.set(id, elms)
    return elms
  }
}

function createElement(type: string, className: string, parent?: HTMLElement) {
  const elm = document.createElement(type)
  elm.className = className
  parent?.appendChild(elm)
  return elm
}

function createInputElement(type: string, className: string, parent: HTMLElement) {
  const input = createElement("input", className, parent) as HTMLInputElement
  input.setAttribute("spellcheck", "false")
  input.type = type
  return input
}

function getChangeInfo(doc: Doc, before: Doc, change: Automerge.Change): ChangeInfo {
  const { deps, hash } = Automerge.decodeChange(change)
  const patches = Automerge.diff(doc, deps, [hash])
  return { change, ...parsePatches(doc, before, patches) }
}

function parsePatches(doc: Doc, before: Doc, patches: Automerge.Patch[]) {
  if (patches.length == 0) throw new Error("Unexpectedly empty patches")

  // Figure out which todo these patches apply to
  let todoIndex = patches[0].path[1] as number

  // Safety check
  if (patches.some((p) => p.path[1] != todoIndex)) throw new Error("Found a change affecting multiple todos") // Have hit this in practice

  // Convert patches to the form we need for particles
  let edits: Edit[] = []
  patches.map((patch) => {
    const { action, path } = patch

    if (action == "conflict") {
      console.log(`conflict! ${path[2]}`)
      // If done conflicts, we just bias toward false
      if (path[2] == "done") return edits.push({ type: "toggle", value: false })

      // If text conflicts, we throw up our hands
      if (path[2] == "text") return edits.push({ type: "edit", text: "Nice! You made a conflict!", charIndex: 0 })
    }

    if (action == "insert") return edits.push({ type: "add" })

    if (action == "put" && path[2] == "done") {
      let putPatch = patch as Automerge.PutPatch
      let value = putPatch.value as boolean
      return edits.push({ type: "toggle", value })
    }

    if (action == "del" && path.length == 2) {
      return edits.push({ type: "clear" })
    }

    if (action == "splice" && path[2] == "text") {
      let { value } = patch as Automerge.SpliceTextPatch
      let charIndex = path[3] as number
      return edits.push({ type: "edit", text: value, charIndex })
    }

    if (action == "del" && path[2] == "text") {
      let charIndex = path[3] as number
      let length = patch.length ?? 1
      let text = before.todos[todoIndex].text.slice(charIndex, charIndex + length)
      return edits.push({ type: "edit", text, charIndex })
    }

    // Used during initial setup — ignored
    if (path[2] == "id") return
    if (action == "put" && path[2] == "text") return

    throw new Error("Unknown edit type")
  })

  let todo = doc.todos[todoIndex] ?? before.todos[todoIndex]
  if (!todo) throw new Error("Unable to determine which TODO was changed")

  return { id: todo.id, edits, todoIndex }
}
