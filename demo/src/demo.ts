import * as Automerge from "@automerge/automerge"
import { Client, limit } from "./client.ts"
import { Particle } from "./particle.ts"
import { DocSchema, Id } from "./types.ts"
import { arrMod, arrRnd, chance, randInt, shuffleArray } from "./util.ts"

let rootDoc = Automerge.change(Automerge.init<DocSchema>(), (doc) => (doc.todos = []))

// We give desktop a higher actorId to hint the merge behaviour such that its todos come first
let desktop = new Client("a", Automerge.clone(rootDoc, { actor: "01" }))
let phone = new Client("b", Automerge.clone(rootDoc, { actor: "00" }))

// For debugging
;(window as any).desktop = desktop
;(window as any).phone = phone

type QueuedAction = { time: number; action: () => void }
let queuedActions: Set<QueuedAction> = new Set()
let enqueue = (action: () => void, delay: number) => queuedActions.add({ action, time: (performance.now() + delay) / 1000 })
let timeBetweenActions = 5
let timeUntilNextAction = timeBetweenActions

let s = performance.now() / 1000

function update(ms: number) {
  let t = ms / 1000
  let dt = Math.min(t - s, 1 / 20) // longest frame time before skewing is 1/20th of a second
  s = t

  requestAnimationFrame(update)

  if (!running || document.hidden) return

  if (queuedActions.size == 0) {
    timeUntilNextAction -= dt
    if (timeUntilNextAction <= 0) {
      timeUntilNextAction = timeBetweenActions
      nextAction()
    }
  } else {
    for (let qa of queuedActions) {
      if (qa.time < t) {
        queuedActions.delete(qa)
        qa.action()
      }
    }
  }

  Particle.update(dt)
}
requestAnimationFrame(update)

let running = false
let observer = new IntersectionObserver(([entry]) => (running = entry.isIntersecting))
observer.observe(document.querySelector("#demo")!)

window.addEventListener("resize", () => {
  desktop.resize()
  phone.resize()
  Particle.recalc()
})

// AUTOMATIC DEMO /////////////////////////////////////////////////////////////////////////////////

let sets = [
  ["Align dilithium matrix", "Charge AT field", "Lock S-foils", "Reticulate splines", "Load the jump program"],
  ["Stabilize inertial dampers", "Override safety protocols", "Match spin rate", "Release handbrake", "Spin up FTL"],
  ["Engage!", "Light the candle", "Flip and Burn", "We are go", "Liftoff"],
  ["Open the pod bay doors", "Experience Bij"],
]

let setIndex = 0
let currentSet: string[] = []

let nextSet = () => (currentSet = shuffleArray(arrMod(sets, setIndex++)))
nextSet()

let getIsDone = (client: Client) => client.doc.todos.filter((t) => t.done)
let getNotDone = (client: Client) => client.doc.todos.filter((t) => !t.done)
let getVisibleIsDone = (client: Client) => client.doc.todos.filter((t) => t.done).slice(0, limit)
let getVisibleNotDone = (client: Client) => client.doc.todos.filter((t) => !t.done).slice(0, limit)

// ANIMATED CHANGES

export function animatedAddTodo(client: Client, text: string, index?: number) {
  let id = client.add("", index)
  animatedPopulateTodo(client, text, id)
}

function animatedPopulateTodo(client: Client, text: string, id: Id) {
  let charsToAdd = Array.from(text)
  let addNextChar = () => {
    if (charsToAdd.length <= 0) return // done
    let idx = client.getIndex(id)
    if (idx < 0) return console.log("Can't add chars to missing todo")
    let oldText = client.doc.todos[idx].text
    let newText = oldText + charsToAdd.shift()
    client.edit(id, newText)
    enqueue(addNextChar, randInt(20, 60))
  }
  addNextChar()
}

let animatedEditTodo = (client: Client, text: string, id: Id) => {
  let removeNextChar = () => {
    let idx = client.getIndex(id)
    if (idx < 0) return animatedAddTodo(client, text) // If at any point the todo we're editing doesn't exist, just add the text as a new todo
    let oldText = client.doc.todos[idx].text
    if (oldText.length <= 0) return enqueue(() => animatedPopulateTodo(client, text, id), 1500) // After the todo is empty, fill it with the new text
    let newText = oldText.slice(0, -1)
    client.edit(id, newText)
    enqueue(removeNextChar, randInt(20, 30))
  }
  removeNextChar()
}

let animatedClearAllDone = (client: Client) => {
  let clearNextTodo = () => {
    let todo = getIsDone(client).at(-1)
    if (!todo) return
    client.clear(todo.id)
    enqueue(clearNextTodo, 200)
  }
  clearNextTodo()
}

let animatedCompleteAllNotDone = (client: Client) => {
  let completeNextTodo = () => {
    let todo = getNotDone(client).at(-1)
    if (!todo) return
    client.toggle(todo.id, true)
    enqueue(completeNextTodo, 300)
  }
  completeNextTodo()
}

// ACTIONS

let doAddNextTodo = (client: Client) => animatedAddTodo(client, currentSet.pop()!)

let doEditRandomVisible = (client: Client) => {
  let text = currentSet.pop()!
  let visibleNotDone = getVisibleNotDone(client)
  if (visibleNotDone.length == 0) animatedAddTodo(client, text)
  else animatedEditTodo(client, text, arrRnd(visibleNotDone).id)
}

let doCompleteRandomVisible = (client: Client) => {
  let visibleNotDone = getVisibleNotDone(client)
  if (visibleNotDone.length > 0) client.toggle(arrRnd(visibleNotDone).id, true)
}

let doClearRandomVisible = (client: Client) => {
  let visibleIsDone = getVisibleIsDone(client)
  if (visibleIsDone.length > 0) client.clear(arrRnd(visibleIsDone).id)
}

function nextAction(client?: Client) {
  // If the user is editing, wait until they stop before resuming the demo
  if (desktop.isEditing() || phone.isEditing()) return

  client ??= chance() ? desktop : phone
  let todoCount = client.doc.todos.length
  let isDone = getIsDone(client)
  let notDone = getNotDone(client)
  let visibleNotDone = getVisibleNotDone(client)
  let visibleIsDone = getVisibleIsDone(client)

  // When we have no more todos left to add in the current set…
  if (currentSet.length == 0) {
    // …first mark all of them as complete…
    if (visibleNotDone.length > 0) doCompleteRandomVisible(client)
    // …then clear them all and move on to the next set.
    else {
      animatedClearAllDone(client)
      nextSet()
    }
    return
  }

  // From here on down, we know we have todos left to add

  // Whenever we have no todos, add more
  if (todoCount < 2) return doAddNextTodo(client)

  // Whenever we have too many done todos, clear them
  if (isDone.length > 4) return animatedClearAllDone(client)

  // If the user gets silly and adds a ton of todos, clean them up
  if (notDone.length > 10) return animatedCompleteAllNotDone(client)

  // From here, we know we have todos to add and a few todos that exist

  // 33% of the time, add a new todo
  if (chance(0.33) && todoCount < 4) return doAddNextTodo(client)

  // 33% of the time, edit an existing todo
  if (chance(0.5)) return doEditRandomVisible(client)

  // For the remaining 33% of the time…

  // Mark todos as completed
  if (visibleNotDone.length > 0) return doCompleteRandomVisible(client)

  // Clear completed todos
  if (visibleIsDone.length > 0) return doClearRandomVisible(client)

  // If all else fails, add a todo
  doAddNextTodo(client)
}

nextAction(desktop)
