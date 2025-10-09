---
title: "Tutorial: An Automerge todo list"
template: docs
---

Automerge is a suite of tools for building [local-first](https://www.inkandswitch.com/local-first) web applications with real-time synchronization that works on and offline.

In this tutorial, you'll build a local-first multiplayer app with TypeScript, React, [Vite](https://vite.dev), and Automerge. You'll discover how to:

- Represent data as Automerge [Documents](/docs/reference/concepts/#documents)
- [Change](/docs/reference/documents/conflicts/) documents' data and [merge](/docs/reference/under-the-hood/merge-rules/) changes from different peers
- Store & synchronize a set of documents in an Automerge [Repository](/docs/reference/concepts/#repositories)
- Build a multiplayer realtime web app with the Automerge [React client](https://github.com/automerge/automerge-repo/tree/main/packages/automerge-repo-react-hooks)

{{ figure ![Screen capture of two browser windows side-by-side showing the same app titled "Automerge Task List". As the user clicks buttons, enters text or checks boxes in one window, their changes show up immediately in the other window.](task-list-sync.webm) The app in action. Data is stored locally, and Automerge syncs changes between users automatically. }}