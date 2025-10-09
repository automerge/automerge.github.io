---
title: "Setup"
template: docs
---

*All the code here can be found at the [automerge-repo-quickstart](https://github.com/automerge/automerge-repo-quickstart) repo.*

To get started:

- clone the tutorial project from [automerge-repo-quickstart](https://github.com/automerge/automerge-repo-quickstart)
- switch to the `without-automerge` branch
- in the `automerge-repo-quickstart` directory, install the project dependencies
- start the local Vite development server

```bash
$ git clone https://github.com/automerge/automerge-repo-quickstart
# Cloning into 'automerge-repo-quickstart'...
$ cd automerge-repo-quickstart
$ git checkout without-automerge
$ npm install
# ...installing dependencies...
$ npm run dev
```

Visit [localhost:5173/](http://localhost:5173/) to see the app in its "starter" state, as a basic React app not yet using Automerge: the task list can be edited, but changes are not synced between users, and all local changes are lost when the page is closed or reloaded.

{{ figure ![Screen capture of the non-syncing app](task-list-pre-automerge.webm) The (unimpressive) app before you give it superpowers with Automerge }}

Let's fix all that with Automerge!

In the exercises that follow, you'll modify the source code to:

1. Configure a Repository to store & sync document changes locally
1. Create/retrieve a task list Document by its Document URL
1. Use the Automerge React client to update the Doc's data on user input
1. Update the Repo to also sync changes over the network (when available)
1. Create and manage a persistent user account document
1. Store and retrieve document references
1. Build a task list document listing interface
1. Implement task list switching
1. Handle task list sharing and collaboration
