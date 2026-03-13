---
title: Deep References
template: docs
---

Sometimes, it is useful to be able to "deep link" to a specific part of a
document. For example, if you want to add comments to a text document, it's
useful to maintain those outside of the document: the commenter may not have
edit permissions, or you want to prevent different commenters from editing each
other's comments.

Automerge supports this use case with
[`Ref`](https://automerge.org/automerge-repo/interfaces/_automerge_automerge-repo.Ref.html)s.
Refs allow you to reference a specific subsection of a document. They can be
obtained through a document handle:


```typescript
const handle = repo.create({
  todos: [
    { title: "First", done: false },
    { title: "Second", done: true },
  ]
})
const doneRef = handle.ref("todos", 0, "done")
// Logs false
console.log("first todo done:", doneRef.value())
```

Refs allow you to write to the document as well. When the ref points to a
primitive value, just return the new value:

```typescript
doneRef.change(() => true)
// Logs true
console.log("first todo done:", doneRef.value())
```

When it points to an object, you can return a brand new object, or you can
mutate the object itself:

```typescript
const firstTodoRef = handle.ref("todos", 0)
doneRef.change((value) => value.done = true)
// Logs { title: "First", done: true }
console.log("first todo:", firstTodoRef.value())
```

If the change function returns `undefined`, no change is made. This allows
changes to be made conditionally.


Refs can use
[cursors](https://automerge.org/automerge-repo/variables/_automerge_automerge-repo.getCursor.html)
to reference a specific subsection of a string:

```typescript
handle = repo.create({
  message: "Hello world" 
})

const rangeRef = handle.ref("message", cursor(0, 5))
// Logs 'Hello'
console.log(rangeRef.value())

rangeRef.change(() => "Hi")
// The text is replaced at the range; logs "Hi world"
console.log(handle.doc().message)
```

Refs can remove the properties they point to. This works for object fields,
substrings referenced by cursors, and array elements:

```typescript
handle = repo.create({
  user: { name: "Alice", age: 30, hobbies: ["biking", "spelunking", "weaving"] }
})

const ageRef = handle.ref("user", "age")
ageRef.remove()
// Logs undefined
console.log("age is", handle.doc().user.age)

const nameRef = handle.ref("user", "name", cursor(2,5))
nameRef.remove()
// Logs Al
console.log("name is", handle.doc().user.name)

const bikingHobbyRef = handle.ref("user", "hobbies", 0)
bikingHobbyRef.remove()
// logs ['spelunking', 'weaving']
console.log("hobbies are ", handle.doc().user.hobbies)
```

Refs don't need to define explicit paths. They can select document subsections
by simple pattern matching:

```typescript
handle = repo.create({
  users: [
    { id: "a", name: "Alice" },
    { id: "b", name: "Bob" },
    { id: "c", name: "Charlie" },
  ]
})

const bobRef = handle.ref("users", { id: "b" })
bobRef.remove()

// Logs the objects for Alice and Charlie
console.log(handle.doc().users)
```

The `url` property on a ref returns a serialized representation of that ref:
this value can be used to create a new ref pointing to the same subsection of
that document. These URLs can be shared like regular Automerge URLs. The
[`findRef`](https://automerge.org/automerge-repo/functions/_automerge_automerge-repo.findRef.html)
function can be used to resolve the URL to a `Ref` object.

The Refs API is currently experimental and may change in a future release.
