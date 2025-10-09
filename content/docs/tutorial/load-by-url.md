---
title: "Load documents by URL"
template: docs
---

We've learned to create documents in the browser console using `Repo.create` and look them up by using `Repo.find`. But this is not a user interface. On the web we really want to be able to share links with each other, not munge around in the browser console. We're now going to introduce a simple trick for loading documents by URL which is great for prototyping - storing the document URL in the browser's location hash.

What we're going to do is this:

* When the application loads, check if there is a document URL in the location hash
* If there is, load that document
* If there isn't, create a new document and put its URL in the location hash

The end result of this is that you can load the application and then share the URL with someone else and they'll be able to load the same document.

### Exercise

#### Find or create `DocHandle`

Add the highlighted code to `src/main.tsx` to load a document by URL or create a new one if it doesn't exist:

```tsx title="src/main.tsx"
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.tsx";
import "./index.css";

// highlight-next-line
import { initTaskList, TaskList } from "./components/TaskList.tsx";
import {
  Repo,
  BroadcastChannelNetworkAdapter,
  IndexedDBStorageAdapter,
  // highlight-next-line
  isValidAutomergeUrl,
  // highlight-next-line
  DocHandle,
} from "@automerge/react";

const repo = new Repo({
  network: [new BroadcastChannelNetworkAdapter()],
  storage: new IndexedDBStorageAdapter(),
});

// Add the repo to the global window object so it can be accessed in the browser console
// This is useful for debugging and testing purposes.
declare global {
  interface Window {
    repo: Repo;
    // highlight-start
    // We also add the handle to the global window object for debugging
    handle: DocHandle<TaskList>;
    // highlight-end
  }
}
window.repo = repo;

// highlight-start
// Check the URL for a document to load
const locationHash = document.location.hash.substring(1);
// Depending if we have an AutomergeUrl, either find or create the document
if (isValidAutomergeUrl(locationHash)) {
  window.handle = await repo.find(locationHash);
} else {
  window.handle = repo.create<TaskList>(initTaskList());
  // Set the location hash to the new document we just made.
  document.location.hash = window.handle.url;
}
// highlight-end

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading a document...</div>}>
      <App taskList={initTaskList()} />
    </Suspense>
  </React.StrictMode>,
);
```

Note that if the handle doesn't exist, we initialize it with `initTaskList()`, which is a function that returns an initial task list structure. This will be useful in the next step when we integrate the document with our React components.

### Testing DocHandle loading

Let's check this works. First, open the application at `localhost:5173`. You should see that the URL of the browser gets updated to something like `http://localhost:5173/#automerge:2mdM9TnM2sJgLhHhYjyBzfusSsyr`. Now, copy that URL and open it in a new tab. At this point we should have the same handle loaded in both tabs, lets check that.

In the first tab open the console and type:

```js
console.log(window.handle.doc())
```

You should see a basic task list data structure

Now, in the second tab, open the console and type the same command. You should see that the title of the task list in the second tab is the same as in the first.

We can even update the task list in one tab and see the changes reflected in the other tab. In the first tab type:

```js
window.handle.change(d => d.title = "My task list")
```

Then in the second tab type:

```js
console.log(window.handle.doc().title)
```

You should see that the title in the second tab has been updated to "My task list".

### Next Step

Now that we can easily share documents by URL it's time to update our React application to store it's state in Automerge.
