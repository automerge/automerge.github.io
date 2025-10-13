---
title: Local Storage & Sync
template: docs
---

## Storage & Network Adapters

Currently, the task list app doesn't persist or sync any changes, even locally.

To prepare to add local multiplayer capabilities to the app, you'll initialize a local-first Repo to:

- save Docs client-side in the browser's [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), using the `IndexedDBStorageAdapter` from `@automerge/automerge-repo-storage-indexeddb`
- keep local users (i.e. tabs within the same browser/origin) in sync via a [BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API), using the `BroadcastChannelNetworkAdapter`.

### Exercise

#### Create a Repo to hold your documents

Start by adding `@automerge/react` to your project.

```bash
# highlight-next-line
$ npm install @automerge/react
# ...installing dependencies...
```

In `src/main.tsx`, import `@automerge/react` and create a Repo object configured with networking and storage.

We'll start by storing our data in IndexedDB so we don't lose it when we refresh the browser, and we'll use the inefficient but simple BroadcastChannel networking adapter to keep our browser tabs in sync.

```tsx title="src/main.tsx"
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.tsx";
import "./index.css";

import { initTaskList } from "./components/TaskList.tsx";

// highlight-start
import {
  Repo,
  WebSocketClientAdapter,
  IndexedDBStorageAdapter,
} from "@automerge/react";

const repo = new Repo({
  network: [new WebSocketClientAdapter("wss://sync.automerge.org")],
  storage: new IndexedDBStorageAdapter(),
});

// Add the repo to the global window object so it can be accessed in the browser console
// This is useful for debugging and testing purposes.
declare global {
  interface Window {
    repo: Repo;
  }
}
window.repo = repo;
// highlight-end

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading a document...</div>}>
      <App taskList={initTaskList()} />
    </Suspense>
  </React.StrictMode>,
);
```

There are lots of other storage and networking adapters for all kinds of different environments. We'll see more of them later.

### Testing Storage and Sync

Now that we have the Repo set up with local storage and sync, we can create documents and check that changes are synced between tabs by:

1. Opening the app in two different browser tabs
2. Making changes in one tab
3. Seeing those changes appear in the other tab

Let's do that:

We've added the `Repo` to the global `window` object so you can access it in the browser console - this is not something you would do in production code but we can use it now to check everything is working.

Open the app in two tabs, in the first tab open the browser console and type:

```js
const handle = window.repo.create({foo: "bar"})
console.log(handle.url)
```

`repo.create` create a new document, saving it in the `StorageAdapter` and announcing it to the network via the `NetworkAdapter`; and returns a `DocHandle` which allows us to access the document and URL which can be used to find it later.

In the second tab type

```js
const handle = await window.repo.find("<paste the URL from the first tab here>")
console.log(handle.doc())
```

You should see the document in the second tab.

`Repo.find` looks up a document by its URL, it checks local storage and asks any connected peers for the document. In this case because we are using the `IndexedDBStorageAdapter` it will find the document locally.

Now let's listen for new changes. In the second tab console type:

```js
handle.on("change", evt => console.log(evt.doc))
```

Then in the first tab console type:

```js
handle.change(doc => doc.foo = "baz")
```

If you switch back to the second tab, you should see the updated document logged in the console. This is because the `BroadcastChannelNetworkAdapter` is sending changes to other connected tabs.
