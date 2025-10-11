import * as Automerge from "@automerge/automerge"

export type Id = string
export type Todo = {
  id: Id
  done: boolean
  text: string
}
export type DocSchema = { todos: Todo[] }
export type Doc = Automerge.next.Doc<DocSchema>

export type Position = { x: number; y: number }
export type Color = [number, number, number]

export type ChangeInfo = {
  id: Id
  edits: Edit[]
  todoIndex: number
  change: Automerge.Change
}

export type Edit = { type: "add" | "clear" } | { type: "toggle"; value: boolean } | { type: "edit"; charIndex: number; text: string }
