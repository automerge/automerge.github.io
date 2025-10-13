---
title: Persisting the Root Document
template: docs
---

## Keeping Track of the Root Document

Putting all our task lists in a root document is great, but right now we don't persist the root document, instead creating a new one every time we load the app. To make the root document useful we're going to want to persist it somewhere. Unlike the individual task lists a root document isn't really "the thing we're looking at", but is more like a "user account" in that it is the context in which the rest of the application works.

To achieve this kind of usage we're going to store the root document ID in the browser's local storage. This way, even if you close the browser or refresh the page, your root document will still be there when you come back. Let's add some code to manage this process to `src/rootDoc.ts`.

Create the root document management functions:

```ts file="src/rootDoc.ts"
// highlight-start
import { AutomergeUrl, Repo } from "@automerge/react";

const ROOT_DOC_URL_KEY = "root-doc-url";
// highlight-end

export type RootDocument = {
  taskLists: AutomergeUrl[];
};

// highlight-start
export const getOrCreateRoot = (repo: Repo): AutomergeUrl => {
  // Check if we already have a root document
  const existingUrl = localStorage.getItem(ROOT_DOC_URL_KEY);
  if (existingUrl) {
    return existingUrl as AutomergeUrl;
  }

  // Otherwise create one and (synchronously) store it
  const root = repo.create<RootDocument>({ taskLists: [] });
  localStorage.setItem(ROOT_DOC_URL_KEY, root.url);
  return root.url;
};
// highlight-end
```

This code:

1. Uses `localStorage` to persist the root document ID
2. Provides a function to get/create the root document



## Using the Root Document

Let's update our main app to use the root document.

Update `src/main.tsx` to initialize the root document:

```tsx
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.tsx";
import "./index.css";

import {
  Repo,
  BroadcastChannelNetworkAdapter,
  WebSocketClientAdapter,
  IndexedDBStorageAdapter,
  RepoContext,
  DocHandle,
} from "@automerge/react";
// highlight-next-line
import { getOrCreateRoot, RootDocument } from "./rootDoc.ts";

const repo = new Repo({
  network: [
    new BroadcastChannelNetworkAdapter(),
    new WebSocketClientAdapter("wss://sync.automerge.org"),
  ],
  storage: new IndexedDBStorageAdapter(),
});

// Add the repo to the global window object so it can be accessed in the browser console
// This is useful for debugging and testing purposes.
declare global {
  interface Window {
    repo: Repo;
    // We also add the handle to the global window object for debugging
    handle: DocHandle<RootDocument>;
  }
}
window.repo = repo;

// highlight-start
const rootDocUrl = getOrCreateRoot(repo);
window.handle = await repo.find(rootDocUrl);
// highlight-end

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading a document...</div>}>
      <RepoContext.Provider value={repo}>
        <App docUrl={window.handle.url} />
      </RepoContext.Provider>
    </Suspense>
  </React.StrictMode>,
);
```

Make sure you've removed this old code from `src/main.tsx`:
```tsx
// highlight-red-start
- // Check the URL for a document to load
- const locationHash = document.location.hash.substring(1);
- // Depending if we have an AutomergeUrl, either find or create the document
- if (isValidAutomergeUrl(locationHash)) {
-   const taskList = await repo.find(locationHash);
-   window.handle = repo.create({ taskLists: [taskList.url] });
- } else {
-  const taskList = repo.create<TaskList>(initTaskList());
-   window.handle = repo.create({ taskLists: [taskList.url] });
-   // Set the location hash to the new document we just made.
-   document.location.hash = taskList.url;
- }
// highlight-red-end
```

Note that we no longer pull a document from the location hash, but instead load it out of local storage.

Let's validate that the root doc code is working so far:

1. Open your browser's developer tools (F12 or right-click and select "Inspect")
2. Go to the "Application" tab
3. In the left sidebar, under "Storage", expand "Local Storage" and click on your server
4. Look for the `root-doc-url` key - it should contain a URL starting with `automerge:`
5. Then, run this code in the developer console

```js
const rootDocUrl = localStorage.getItem("root-doc-url")
const root = await window.repo.find(rootDocUrl);
console.log("Root document:", root.doc());
```
You should see a console log showing the root document with an empty `taskLists` array.

If you open the application, you should be able to create multiple task lists and switch between them in the UI adding items. If you refresh the page, or copy the URL and open it in a new tab, you should see the same task lists and items because the root document URL is now being persisted in local storage.

Now we have the foundation for our document management system. The root document serves as your personal storage space, keeping track of all documents you've opened. This makes it easy to find and access your documents again, even after closing the browser or switching devices.

Next, we're going to add support for syncing our root document across devices.
