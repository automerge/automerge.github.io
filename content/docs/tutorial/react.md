---
title: "React Integration"
template: docs
---

import { jsx } from "react/jsx-runtime";
import Admonition from "@theme/Admonition";
import Exercise from "../components/Exercise";
import Solution from "../components/Solution";

### Repos in React: `RepoContext`

We've set up a `Repo` which stores its data locally and syncs documents between tabs, and we have a mechanism for sharing documents via URL. Now we need to actually integrate this with our task list, which is a React application.

The [`@automerge/react` package](https://github.com/automerge/automerge-repo/tree/main/packages/automerge-repo-react-hooks) provides some React-specific conveniences for working with Automerge repositories. The first thing we have to do is setup a `RepoContext` to make the `Repo` available inside our React components. Then, we can use the hooks provided by `@automerge/react` to load and modify documents from within the React app.

<Exercise>

#### Add a `RepoContext` to the React app

A `RepoContext` makes your repo and its documents available throughout your React application, via `useRepo` and `useDocument` hooks which can be called in any client component.

In `main.tsx`, import `RepoContext` and modify the `React.render()` call to wrap the `App` component with a `RepoContext.Provider`, passing in your fresh new `repo` to the context's `value` prop.

```tsx title="src/main.tsx"
// ...

import { initTaskList, TaskList } from "./components/TaskList.tsx";
import {
  Repo,
  BroadcastChannelNetworkAdapter,
  IndexedDBStorageAdapter,
  // highlight-next-line
  RepoContext,
  isValidAutomergeUrl,
  DocHandle,
} from "@automerge/react";

// ...

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading a document...</div>}>
      // highlight-next-line
      <RepoContext.Provider value={repo}>
        <App taskList={initTaskList()} />
      // highlight-next-line
      </RepoContext.Provider>
    </Suspense>
  </React.StrictMode>,
);
```

</Exercise>

## Working with Documents in React

Now that we have a `RepoContext` set up we can use the `useDocument` hook to load the URL which we have extracted from the page's hash. This will give us access to the document we want to work with.

Similar to React's `useState`, `useDocument` returns a two-item array with a reactive `doc` value representing the document's current contents and a `changeDoc` function which can be used to update that value.

The `doc` object will look and feel just like a Plain Old Javascript Object, because it is one. Just like with `useState`, changes directly to the value won't behave the way you expect. Use the `changeDoc` callback to update the document, recording your changes, and both saving and replicating them.

There are two steps to updating the app to use this new functionality:

* Modify the `App` and `TaskList` components to accept an `AutomergeUrl` instead of a `TaskList`
* Modify the `App` component to use `useDocument` to load and modify the document

<Exercise>

#### Pass an `AutomergeUrl` to the `App`

The `App` and `TaskList` components currently expect a `TaskList` object to be passed to them, but now we are moving to using Automerge we want to pass an `AutomergeUrl` and have the `TaskList` component load the document using `useDocument`. The first step then is to modify these components to accept an `AutomergeUrl` instead of a `TaskList` and modify `main.tsx` to pass the URL to `App`.

First modify the `TaskList` component:

```tsx title="src/components/TaskList.tsx"
// ..
// higlight-next-line
import { type AutomergeUrl } from "@automerge/react";

// ..

export const TaskList: React.FC<{
  // highlight-next-line
  docUrl: AutomergeUrl;
}> = ({ docUrl }) => {
  // ..
};
```

Next the `App` component:


```tsx title="src/App.tsx"
//..
// highlight-next-line
import { type AutomergeUrl } from "@automerge/react";

// highlight-next-line
function App({ docUrl }: { docUrl: AutomergeUrl }) {
  return (
    <>
      // ..

      <main>
        <div className="task-list">
          // highlight-next-line
          <TaskList docUrl={docUrl} />
        </div>
      </main>

      // ..
    </>
  );
}
// ..
```

Finally, update `main.tsx` to pass the `docUrl` to the `App` component:

```tsx title="src/main.tsx"
// ...

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading a document...</div>}>
      <RepoContext.Provider value={repo}>
        // highlight-next-line
        <App docUrl={window.handle.url} />
      </RepoContext.Provider>
    </Suspense>
  </React.StrictMode>,
);
```

At this point, the `App` component is set up to accept an `AutomergeUrl`, and the `TaskList` component is ready to load the document using that URL. However, we still need to implement the logic to read and modify the document.

</Exercise>

<Exercise>

### Reading a document

Let's look at reading the contents of a document. Until the document loads, it's undefined. After that, it will become a POJO. First, let's update the `TaskList` component to use the `useDocument` hook to load the task list state.

```tsx title="src/TaskList.tsx"
// ..

// highlight-next-line
import { AutomergeUrl, useDocument } from "@automerge/react";

// ..

export const TaskList: React.FC<{
  docUrl: AutomergeUrl;
}> = ({ docUrl }) => {
  // highlight-start
  const [doc, changeDoc] = useDocument<TaskList>(docUrl, {
    // This hooks the `useDocument` into reacts suspense infrastructure so the whole component
    // only renders once the document is loaded
    suspense: true,
  });

  return (
    <>
      <button type="button">
        <b>+</b> New task
      </button>

      <div id="task-list">
        {doc &&
          doc.tasks?.map(({ title, done }, index) => (
            <div className="task" key={index}>
              <input type="checkbox" checked={done} />

              <input
                type="text"
                placeholder="What needs doing?"
                value={title || ""}
                style={done ? { textDecoration: "line-through" } : {}}
              />
            </div>
          ))}
      </div>
    </>
  );
  // highlight-end
};
```

#### Checking it works

At this point we haven't hooked up any way of modifying the document. But we can check that the state of the document is reflected in the UI using `window.handle`.

First, create a new list item. Open the console and type:

```js
window.handle.change(d => d.tasks.push({title: "Milk", done: false}))
```

You should see a new task titled "Milk" appear in the UI.

Now let's mark it as done. Open the console again and type:

```js
window.handle.change(d => d.tasks[d.tasks.length - 1].done = true)
```

You should see the checkbox for the final task in the list become ticked in the UI.

</Exercise>

### Editing a document

The Automerge equivalent of `setState(state => state + 1)` is `changeDoc(doc => doc.state += 1)`. `changeDoc` is the only way to update a document and will record any mutations you make in your callback to the `doc` object.

There's one important difference between your usual JS style and working with an Automerge document: you will generally want to avoid immutable style.

It's idiomatic in JS to use syntax like spread operators to update a document, but if you do this, you'll make merging with other users ineffective. That's because Automerge doesn't second-guess your intention: if you replace the whole array, we'll trust that's what you meant to do! Instead, you'll want to only update the data you actually want to change.

We've got three places we edit the document: creating a new item, toggling completion, and editing the item's text.

#### Creating a new Item

```tsx title="src/TaskList.tsx"
// ...

export const TaskList: React.FC<{
  docUrl: AutomergeUrl;
}> = ({ docUrl }) => {
  const [doc, changeDoc] = useDocument<TaskList>(docUrl, {
    // This hooks the `useDocument` into reacts suspense infrastructure so the whole component
    // only renderes once the document is loaded
    suspense: true,
  });

  return (
    <>
      <button
        type="button"
        // highlight-start
        onClick={() => {
          changeDoc((d) =>
            d.tasks.unshift({
              title: "",
              done: false,
            }),
          );
        }}
        // highlight-end
      >
        <b>+</b> New task
      </button>

      <div id="task-list">
        {doc &&
          doc.tasks?.map(({ title, done }, index) => (
            <div className="task" key={index}>
              <input type="checkbox" checked={done} />

              <input
                type="text"
                placeholder="What needs doing?"
                value={title || ""}
                style={done ? { textDecoration: "line-through" } : {}}
              />
            </div>
          ))}
      </div>
    </>
  );
};
```

Here, we replace the React `setState` style array spread syntax with an "unshift" call. Remember, Automerge does what you ask, so if you replace the complete array, your changes won't merge well with other users'.

### Updating the `done` state

Updating the task's state is similar, but we use the index of the item to make sure we target the right item. If we weren't iterating over the array already, we could use `.find()` to determine the index of the item we need.

```tsx title="src/TaskList.tsx"
// ..

export const TaskList: React.FC<{
  docUrl: AutomergeUrl;
}> = ({ docUrl }) => {
  const [doc, changeDoc] = useDocument<TaskList>(docUrl, {
    // This hooks the `useDocument` into reacts suspense infrastructure so the whole component
    // only renderes once the document is loaded
    suspense: true,
  });

  return (
    <>
      <button
        type="button"
        onClick={() => {
          changeDoc((d) =>
            d.tasks.unshift({
              title: "",
              done: false,
            }),
          );
        }}
      >
        <b>+</b> New task
      </button>

      <div id="task-list">
        {doc &&
          doc.tasks?.map(({ title, done }, index) => (
            <div className="task" key={index}>
              <input
                type="checkbox"
                checked={done}
                // highlight-start
                onChange={() =>
                  changeDoc((d) => {
                    d.tasks[index].done = !d.tasks[index].done;
                  })
                }
                //highlight-end
              />

              <input
                type="text"
                placeholder="What needs doing?"
                value={title || ""}
                style={done ? { textDecoration: "line-through" } : {}}
              />
            </div>
          ))}
      </div>
    </>
  );
};
```

### Updating text

Finally, we're going to handle text a little differently in this example. Following the same principle we discuss above, if you reassign a text field in an Automerge document, we will replace the whole string. This might be what you want in some cases, but often, you'll want to support collaborative editing. This can be particularly important on large documents.

There are two approaches you can use here. The simplest approach is to use the utility function `updateText`. It compares the before-and-after values of a string and applies a minimum edit script to combine the two. Typically for a more advanced integration with a text editor, you would use the `Automerge.splice()` function as part of an event handler, or -- ideally -- you'd just use an existing text-editor plugin like `@automerge/codemirror`.

First, we'll add `updateText` to our imports from the library.

```tsx
import { updateText } from "@automerge/react";
```

Next, we replace the text updating function with one that uses it instead of just replacing the value completely.

```tsx title="src/TaskList.tsx"
// ...

export const TaskList: React.FC<{
  docUrl: AutomergeUrl;
}> = ({ docUrl }) => {
  const [doc, changeDoc] = useDocument<TaskList>(docUrl, {
    // This hooks the `useDocument` into reacts suspense infrastructure so the whole component
    // only renderes once the document is loaded
    suspense: true,
  });

  return (
    <>
      <button
        type="button"
        onClick={() => {
          changeDoc((d) =>
            d.tasks.unshift({
              title: "",
              done: false,
            }),
          );
        }}
      >
        <b>+</b> New task
      </button>

      <div id="task-list">
        {doc &&
          doc.tasks?.map(({ title, done }, index) => (
            <div className="task" key={index}>
              <input
                type="checkbox"
                checked={done}
                onChange={() =>
                  changeDoc((d) => {
                    d.tasks[index].done = !d.tasks[index].done;
                  })
                }
              />

              <input
                type="text"
                placeholder="What needs doing?"
                value={title || ""}
                // highlight-start
                onChange={(e) =>
                  changeDoc((d) => {
                    updateText(d, ["tasks", index, "title"], e.target.value);
                  })
                }
                // highlight-end
                style={done ? { textDecoration: "line-through" } : {}}
              />
            </div>
          ))}
      </div>
    </>
  );
};
```

## Checking your work

We've finished wiring up the UI, we've got link sharing via the URL hash and storage and synchronisation between tabs. If you open the application in one tab, then copy the URL and open it in another you should be able to create new tasks, toggle their done state, and update the description and see the changes synchronise between tabs.

Next, to sync over the network.
