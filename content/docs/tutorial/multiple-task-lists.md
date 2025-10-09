---
title: "Multiple Task Lists"
template: docs
---

You might have noticed that if you lose the URL of a task list, it's gone forever. This is fine for testing and demos, but obviously no good for a real application.

Automerge is built around the document as a building block for your application, and we use `AutomergeUrl` links to connect those documents together. We've already created one kind of document, a task list, and now we're going to build on that foundation by collecting your task lists into something like a folder to keep them organized.

This is going to give us a chance to see a few patterns in action: linking between documents with URLs, working with multiple documents at once, and using a single document as the "entry point" for your application.

You can think of the "entry point" as being akin to a user's account. By synchronizing that document between their devices, a user can get access to their documents from multiple browsers or devices, but be careful: until we implement some kind of security on the sync server, a user's privacy relies on their not sharing that "root" document ID with anyone else.

Here's the plan. We are going to:

1. Create a new "root" document which links to all the task lists the user has opened.
1. Create some UI to handle switching between several different task lists
2. Register task lists we open or create in that root document (if we don't have them already.)
3. Store the root document's ID in localStorage in a well-known key to check during startup.
4. Create a simple UI for copying the root document between browsers, creating rudimentary "accounts".

If this feels different to you from how a traditional database works, that's normal. With Automerge, building an application will feel more like linking together a web of documents than querying a database.


## Create a root document

Our root document is going to track all the task lists the user has created or opened. Let's add a type for it in `src/rootDoc.ts`:

```typescript file="src/rootDoc.ts"
import { type AutomergeUrl } from "@automerge/react";

export type RootDocument = {
  taskLists: AutomergeUrl[];
};
```

It's just a list of `AutomergeUrl`s, each of which points to a document containing a task list.

Intially we'll create a new root document on every page load and we'll put the URL of the current task list in that root document. This will allow us to focus on the UI work but then we'll come back and add the logic to persist the root document.

Add this code to `src/main.tsx` to create the root document:

```tsx title="src/main.tsx"
// highlight-next-line
import { RootDocument } from "./rootDoc.ts"
// ..

// Add the repo to the global window object so it can be accessed in the browser console
// This is useful for debugging and testing purposes.
declare global {
  interface Window {
    repo: Repo;
    // We also add the handle to the global window object for debugging
    // highlight-next-line
    handle: DocHandle<RootDocument>;
  }
}
window.repo = repo;

// Check the URL for a document to load
const locationHash = document.location.hash.substring(1);
// Depending if we have an AutomergeUrl, either find or create the document
if (isValidAutomergeUrl(locationHash)) {
  // highlight-start
  const taskList = await repo.find(locationHash);
  window.handle = repo.create({ taskLists: [taskList.url] });
  // highlight-end
} else {
  // highlight-start
  const taskList = repo.create<TaskList>(initTaskList());
  window.handle = repo.create({ taskLists: [taskList.url] });
  // Set the location hash to the new document we just made.
  document.location.hash = taskList.url;
  // highlight-end
}

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

Now, we're passing the URL of the root document to the `App` component, but the `App` component is still expecting a `TaskList` document, not a `RootDocument`. Let's fix that; add this code to the `App` component:

```ts
// ..
import { TaskList } from "./TaskList";
// highlight-start
import { type AutomergeUrl, useDocument } from "@automerge/react";
import { RootDocument } from "../rootDoc";
// highlight-end
// ..

function App({ docUrl }: { docUrl: AutomergeUrl }) {
  // highlight-start
  const [doc] = useDocument<RootDocument>(docUrl, {
    suspense: true,
  });
  // highlight-end

  return (
    <>
      <header>
        <h1>
          <img src={automergeLogo} alt="Automerge logo" id="automerge-logo" />
          Automerge Task List
        </h1>
      </header>

      <main>
        <div className="task-list">
          // highlight-start
          <TaskList docUrl={doc.taskLists[0]} />
          // highlight-end
        </div>
      </main>
      // ..
```

Now, if you open the application the behavior shouldn't change, but you can check the root document in the browser console:

```js
console.log(window.handle.doc())
```

This should display a document with a `taskLists` array containing the URL of the task list you just created or opened.

## Multiple Task List UI

Now that we have a root document that can manage multiple task lists, we need some UI to allow us to select from those task lists. We're going to add a very simple sidebar which lists all the task lists you have access to. We'll start with a simple list of the task lists you have available, then we'll add features for selecting and creating new task lists.

Add the following code to `src/components/DocumentList.tsx`

```tsx title="src/components/DocumentList.tsx"
import React from "react";
import { useDocument, AutomergeUrl } from "@automerge/react";
import { TaskList } from "./TaskList";

export interface DocumentList {
  taskLists: AutomergeUrl[];
}

export const DocumentList: React.FC<{
  docUrl: AutomergeUrl;
}> = ({ docUrl }) => {
  const [doc, changeDoc] = useDocument<DocumentList>(docUrl, {
    suspense: true,
  });

  return (
    <div className="document-list">
      <div className="documents">
        {doc.taskLists.map((docUrl) => (
          <div key={docUrl} className={`document-item`}>
            <DocumentTitle docUrl={docUrl} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Component to display document title
const DocumentTitle: React.FC<{ docUrl: AutomergeUrl }> = ({ docUrl }) => {
  const [doc] = useDocument<TaskList>(docUrl, { suspense: true });

  // Get the first task's title or use a default
  const title = doc.title || "Untitled Task List";
  return <div>{title}</div>;
};
```

Then render the `DocumentList` in `App.tsx`

```tsx title="src/components/App.tsx"
// ..
// highlight-next-line
import { DocumentList } from "./DocumentList";
// ..

function App({ docUrl }: { docUrl: AutomergeUrl }) {
  const [doc] = useDocument<RootDocument>(docUrl, {
    suspense: true,
  });

  return (
    <>
      <header>
        <h1>
          <img src={automergeLogo} alt="Automerge logo" id="automerge-logo" />
          Automerge Task List
        </h1>
      </header>

      <main>
        // highlight-start
        <div className="document-list">
          <DocumentList docUrl={docUrl} />
        </div>
        // highlight-end
        <div className="task-list">
          <TaskList docUrl={doc.taskLists[0]} />
        </div>
      </main>

      <footer>
        <p className="footer-copy">
          Powered by Automerge + Vite + React + TypeScript
        </p>
      </footer>
    </>
  );
}
```

Loading up the task list should now show something like this:

![An image of the web app showing a sidebar listing task lists](document-list.png)

Here you can see there is now a very basic sidebar to the left of the todo list showing the available task lists.


## Creating a new Task List

Now that we can track task lists we need a way to create a new one. We'll add a button to the sidebar that allows us to create a new task list. This isn't useful on it's own though, we also need some way of signalling to the app that we want to change focus to the new task list. We'll do this by adding two properties to the sidebar, a `selectedDocument` property which sets the focus for the task list, and an `onSelectDocument` callback which the sidebar uses to notify the app when a new task list is selected.

We can split this process into two phases, first we'll add the focus management to the sidebar, then we'll add the button to create a new task list.

### Adding focus management to the sidebar

Here's what we need to do:

* Add `selectedDocument` and `onSelectDocument` props to the `DocumentList` component
* Wire up the `selectedDocument` state to the `DocumentTitle` component so that clicking on a document title will select it
* Modify the `App` component to track the currently selected document URL and pass it to the `TaskList` component

Add the following code to `src/components/DocumentList.tsx`:

```tsx title="src/components/DocumentList.tsx"
import React from "react";
import { useDocument, AutomergeUrl } from "@automerge/react";
import { TaskList } from "./TaskList";

import { RootDocument } from "../rootDoc";

export const DocumentList: React.FC<{
  docUrl: AutomergeUrl;
  // highlight-start
  selectedDocument: AutomergeUrl | null;
  onSelectDocument: (docUrl: AutomergeUrl | null) => void;
}> = ({ docUrl, selectedDocument, onSelectDocument }) => {
  // highlight-end
  const [doc] = useDocument<RootDocument>(docUrl, {
    suspense: true,
  });

  return (
    <div className="document-list">
      <div className="documents">
        {doc.taskLists.map((docUrl) => (
          <div
            key={docUrl}
            // highlight-start
            className={`document-item ${docUrl === selectedDocument ? "active" : ""}`}
            onClick={() => onSelectDocument(docUrl)}
            // highlight-end
          >
            <DocumentTitle docUrl={docUrl} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Component to display document title
const DocumentTitle: React.FC<{ docUrl: AutomergeUrl }> = ({ docUrl }) => {
  const [doc] = useDocument<TaskList>(docUrl, { suspense: true });

  // Get the first task's title or use a default
  const title = doc.title || "Untitled Task List";
  return <div>{title}</div>;
};
```

Add the following code to `src/components/App.tsx`:

```tsx title="src/components/App.tsx"
// ..
// highlight-next-line
import { useState } from "react";

function App({ docUrl }: { docUrl: AutomergeUrl }) {
  const [doc] = useDocument<RootDocument>(docUrl, {
    suspense: true,
  });
  // highlight-start
  const [selectedDocUrl, setSelectedDocUrl] = useState<AutomergeUrl | null>(
    null,
  );
  // highlight-end

  return (
    <>
      <header>
        <h1>
          <img src={automergeLogo} alt="Automerge logo" id="automerge-logo" />
          Automerge Task List
        </h1>
      </header>

      <main>
        <div className="document-list">
          // highlight-start
          <DocumentList
            docUrl={docUrl}
            onSelectDocument={setSelectedDocUrl}
            selectedDocument={selectedDocUrl}
          />
          // highlight-end
        </div>
        <div className="task-list">
          // highlight-next-line
          {selectedDocUrl ? <TaskList docUrl={selectedDocUrl} /> : null}
        </div>
      </main>

      <footer>
        <p className="footer-copy">
          Powered by Automerge + Vite + React + TypeScript
        </p>
      </footer>
    </>
  );
}

export default App;
```

Now when you initially load the app, the main task list will be empty, but you can click on the sidebar to select a task list. The selected task list will be highlighted in the sidebar.


### Creating new task lists

Now that we can manage which task list is focused in the sidebar we can wire up task list creation. We'll add a button to the sidebar that allows us to create a new task list, and when clicked it will create a new task list document, register it in the root document, and fire the `onSelectDocument` callback to switch focus to the new task list.

To create a new document from within a component we use the `useRepo` hook. This gives us access to the `Repo` which we can then call `Repo.find` on to create a new document for the new task list. Finally, we will add the new task list to the root document and fire the `onSelectDocument` callback to switch focus to the new task list.

Add this code to the `DocumentList` component in `src/components/DocumentList.tsx`:

```tsx title="src/components/DocumentList.tsx"
import React from "react";
// highlight-next-line
import { useDocument, AutomergeUrl, useRepo } from "@automerge/react";
// highlight-next-line
import { initTaskList, TaskList } from "./TaskList";

import { RootDocument } from "../rootDoc";

export const DocumentList: React.FC<{
  docUrl: AutomergeUrl;
  selectedDocument: AutomergeUrl | null;
  onSelectDocument: (docUrl: AutomergeUrl | null) => void;
}> = ({ docUrl, selectedDocument, onSelectDocument }) => {
  // highlight-next-line
  const repo = useRepo();
  const [doc, changeDoc] = useDocument<RootDocument>(docUrl, {
    suspense: true,
  });

  // highlight-start
  const handleNewDocument = () => {
    const newTaskList = repo.create<TaskList>(initTaskList());
    changeDoc((d) => d.taskLists.push(newTaskList.url));
    onSelectDocument(newTaskList.url);
  };
  // highlight-end

  return (
    <div className="document-list">
      <div className="documents">
        {doc.taskLists.map((docUrl) => (
          <div
            key={docUrl}
            className={`document-item ${docUrl === selectedDocument ? "active" : ""}`}
            onClick={() => onSelectDocument(docUrl)}
          >
            <DocumentTitle docUrl={docUrl} />
          </div>
        ))}
      </div>
      // highlight-next-line
      <button onClick={handleNewDocument}>+ Task List</button>
    </div>
  );
};

// Component to display document title
const DocumentTitle: React.FC<{ docUrl: AutomergeUrl }> = ({ docUrl }) => {
  const [doc] = useDocument<TaskList>(docUrl, { suspense: true });

  // Get the first task's title or use a default
  const title = doc.title || "Untitled Task List";
  return <div>{title}</div>;
};
```

Now if you load up the app you'll see a "+ Task List" button in the sidebar. Clicking this will create a new task list document, register it in the root document, and switch focus to the new task list.

## URL Management

This has all worked very well, but before we finish this section there's one deficiency we should address. The URL in the browser location hash does not update when we switch task list selection. This means that when we create a new task list, there's no way to share it with others. To fix this, we're going to slightly change how we handle the browser location hash.

At the moment, we look up the document URL from the location hash on boot, then we never change it. Now, we are going to manage the location hash as part of the application. To do this we will push responsibility for the URL hash management into the `App` component. This will allow us to update the URL hash whenever we switch task lists, making it easier to share task lists with others.

Here's how we'll do it:

* First, update the initialization logic to create an empty root document if it doesn't exist
* Add hash management to the `App` component using the `useHash` function from [`react-use`](https://www.npmjs.com/package/react-use)

First, let's update our initialization logic. Remove the lines highlighted in red in the following code snippet, and replace them with the single line `window.handle = repo.create({ taskLists: []})` that follows.

```typescript title="src/main.tsx"
// ..

// highlight-red-start
// Depending if we have an AutomergeUrl, either find or create the document
if (isValidAutomergeUrl(locationHash)) {
  const taskList = await repo.find(locationHash);
  window.handle = repo.create({ taskLists: [taskList.url] });
} else {
  const taskList = repo.create<TaskList>(initTaskList());
  window.handle = repo.create({ taskLists: [taskList.url] });
  // Set the location hash to the new document we just made.
  document.location.hash = taskList.url;
}
// highlight-red-end
window.handle = repo.create({ taskLists: [] });

// ..
```

At this point, loading the application will give you no selected task list at all and creating new task lists via the sidebar will populate the UI but not update the URL hash.

Let's add URL hash management to the `App` component. First, install the `react-use` package:

```bash
npm install react-use
```

Then, update the `App` component to use the `useHash` hook:

```typescript title="src/components/App.tsx"
// ..
// highlight-start
import { type AutomergeUrl, isValidAutomergeUrl } from "@automerge/react";
import { useHash } from "react-use";
// highlight-end

function App({ docUrl }: { docUrl: AutomergeUrl }) {
  // highlight-start
  const [hash, setHash] = useHash();
  const cleanHash = hash.slice(1); // Remove the leading '#'
  const selectedDocUrl =
    cleanHash && isValidAutomergeUrl(cleanHash)
      ? (cleanHash as AutomergeUrl)
      : null;
  // highlight-end

  return (
    <>
      <header>
        <h1>
          <img src={automergeLogo} alt="Automerge logo" id="automerge-logo" />
          Automerge Task List
        </h1>
      </header>

      <main>
        <div className="document-list">
          <DocumentList
            docUrl={docUrl}
            // highlight-start
            onSelectDocument={(url) => {
              if (url) {
                setHash(url);
              } else {
                setHash("");
              }
            }}
            // highlight-end
            selectedDocument={selectedDocUrl}
          />
        </div>
        <div className="task-list">
          {selectedDocUrl ? <TaskList docUrl={selectedDocUrl} /> : null}
        </div>
      </main>

      <footer>
        <p className="footer-copy">
          Powered by Automerge + Vite + React + TypeScript
        </p>
      </footer>
    </>
  );
}

export default App;
```

This is almost there. Loading the app now you'll see that creating new task lists and selecting them in the sidebar updates the URL hash. There is one thing missing though. If you create a new task list, then copy the URL and load it in a new tab, the task list will appear in the main view, but the sidebar will be empty. This is because the sidebar only shows task lists that are registered in the root document, and updating the URL hash does not cause the root document to be updated.

We'll fix this in the `DocumentList` as this is the component responsible for managing the list of task lists. We need to ensure that when a new task list is created or looked up, it is also registered in the root document. Update `DocumentList.tsx` to include the registration logic:

```typescript title="src/components/DocumentList.tsx"
// ..
/
// highlight-next-line
import { useEffect } from "react";

export const DocumentList: React.FC<{
  docUrl: AutomergeUrl;
  selectedDocument: AutomergeUrl | null;
  onSelectDocument: (docUrl: AutomergeUrl | null) => void;
}> = ({ docUrl, selectedDocument, onSelectDocument }) => {
  const repo = useRepo();
  const [doc, changeDoc] = useDocument<RootDocument>(docUrl, {
    suspense: true,
  });

  // highlight-start
  useEffect(() => {
    changeDoc((d) => {
      if (selectedDocument && !d.taskLists.includes(selectedDocument)) {
        // If the selected document is not in the list, add it
        d.taskLists.push(selectedDocument);
      }
    });
  }, [selectedDocument, changeDoc]);
  // highlight-end

  const handleNewDocument = () => {
    const newTaskList = repo.create<TaskList>(initTaskList());
    changeDoc((d) => d.taskLists.push(newTaskList.url));
    onSelectDocument(newTaskList.url);
  };

  return (
    // ..
  );
};
```

### Checking it works

Now, you should be able to load the application, create a new task list and see the URL hash update. If you copy the URL into a new window it should load the task list and show it in the main view, with the sidebar populated with the task list you just created.

## Next Steps

We're keeping track of our tasks lists in the root document, but every time we refresh we still lose the whole root document. In the next section we'll persist the root document so that it survives page reloads and browser restarts. This will allow us to keep track of all the task lists we've created, even if we close the browser or switch devices.
