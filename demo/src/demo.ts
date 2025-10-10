import * as Automerge from "@automerge/automerge"
import { Client } from "./client.ts"
import { Particle } from "./particle.ts"
import { DocSchema, Id } from "./types.ts"
import { arrMod, arrRnd, chance, shuffleArray } from "./util.ts"

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
let timeSinceAction = 0

let s = performance.now() / 1000
function update(ms: number) {
  let t = ms / 1000
  let dt = Math.min(t - s, 1 / 20) // longest frame time before skewing is 1/20th of a second
  s = t
  requestAnimationFrame(update)
  if (!running || document.hidden) return

  if (queuedActions.size == 0) {
    timeSinceAction += dt
    if (timeSinceAction > 10) {
      timeSinceAction = 0
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

window.onresize = () => {
  desktop.resize()
  phone.resize()
  // Particle.recalc(desktop)
  // Particle.recalc(phone)
}

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

// ANIMATED CHANGES

function addTodo(client: Client, text: string) {
  let id = client.add("")
  populateTodo(client, text, id)
}

function populateTodo(client: Client, text: string, id: Id) {
  let charsToAdd = Array.from(text)
  let addNextChar = () => {
    if (charsToAdd.length <= 0) return // done
    let idx = client.getIndex(id)
    if (idx < 0) return console.log("Can't add chars to missing todo")
    let oldText = client.doc.todos[idx].text
    let newText = oldText + charsToAdd.shift()
    client.edit(id, newText)
    enqueue(addNextChar, 50)
  }
  addNextChar()
}

let editTodo = (client: Client, text: string, id: Id) => {
  let removeNextChar = () => {
    let idx = client.getIndex(id)
    if (idx < 0) return addTodo(client, text) // If at any point the todo we're editing doesn't exist, just add the text as a new todo
    let oldText = client.doc.todos[idx].text
    if (oldText.length <= 0) return enqueue(() => populateTodo(client, text, id), 2000) // After the todo is empty, fill it with the new text
    let newText = oldText.slice(0, -1)
    client.edit(id, newText)
    enqueue(removeNextChar, 50)
  }
  removeNextChar()
}

let clearAll = (client: Client) => {
  let clearNextTodo = () => {
    let todo = getIsDone(client).at(-1)
    if (!todo) return
    client.clear(todo.id)
    enqueue(clearNextTodo, 200)
  }
  clearNextTodo()
}

// ACTIONS

let addNextTodo = (client: Client) => addTodo(client, currentSet.pop()!)

let editRandomTodo = (client: Client) => {
  let text = currentSet.pop()!
  let notDone = getNotDone(client)
  if (notDone.length == 0) addTodo(client, text)
  else editTodo(client, text, arrRnd(notDone).id)
}

let doComplete = (client: Client) => {
  let notDone = getNotDone(client)
  if (notDone.length > 0) client.toggle(arrRnd(notDone).id, true)
}

let doClear = (client: Client) => {
  let isDone = getIsDone(client)
  if (isDone.length > 0) client.clear(arrRnd(isDone).id)
}

let doClearAll = (client: Client) => clearAll(client)

function runAction(action: (client: Client) => void, client: Client) {
  action(client)
}

function nextAction(client?: Client) {
  // If the user is editing, wait until they stop before resuming the demo
  if (desktop.editing != null || phone.editing != null) return

  client ??= chance() ? desktop : phone
  let todoCount = client.doc.todos.length
  let notDone = getNotDone(client)
  let isDone = getIsDone(client)

  // When we have no more todos left to add in the current set…
  if (currentSet.length == 0) {
    // …first mark all of them as complete, then…
    if (notDone.length > 0) runAction(doComplete, client)
    // …clear them all and move on to the next set
    else {
      runAction(doClearAll, client)
      nextSet()
    }
    return
  }

  // From here on down, we know we have todos left to add

  // Whenever we have no todos, add more
  if (todoCount < 2) return runAction(addNextTodo, client)

  // Whenever we have too many done todos, clear them
  if (isDone.length > 4) return runAction(clearAll, client)

  // From here, we know we have todos to add and a few todos that exist

  // 33% of the time, add a new todo
  if (chance(0.33) && todoCount < 4) return runAction(addNextTodo, client)

  // 33% of the time, edit an existing todo
  if (chance(0.5)) return runAction(editRandomTodo, client)

  // For the remaining 33% of the time…

  // Mark todos as completed
  if (notDone.length > 0) return runAction(doComplete, client)

  // Clear completed todos
  if (isDone.length > 0) return runAction(doClear, client)

  // If all else fails, add a todo
  runAction(addNextTodo, client)
}

nextAction(desktop)
