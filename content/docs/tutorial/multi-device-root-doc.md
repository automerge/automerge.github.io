---
title: "Multi Device Root Document"
template: docs
---

## Syncing Across Devices

We have a root document that contains all our task lists, but right now it's only accessible in the browser where we created it. It would be very useful to be able to share this root document between our devices. To achieve this we'll need to share our root document ID. First, let's add a method to update the root document ID in `src/rootDoc.ts`:

```typescript title="src/rootDoc.ts"
import { AutomergeUrl, Repo } from "@automerge/react";

const ROOT_DOC_URL_KEY = "root-doc-url";

export type RootDocument = {
  taskLists: AutomergeUrl[];
};

// highlight-start
export const setRootDocUrl = (url: AutomergeUrl): void => {
  localStorage.setItem(ROOT_DOC_URL_KEY, url);
};
// highlight-end

export const getOrCreateRoot = (repo: Repo): AutomergeUrl => {
  // Check if we already have a root document
  const existingId = localStorage.getItem(ROOT_DOC_URL_KEY);
  if (existingId) {
    return existingId as AutomergeUrl;
  }

  // Otherwise create one and (synchronously) store it
  const root = repo.create<RootDocument>({ taskLists: [] });
  localStorage.setItem(ROOT_DOC_URL_KEY, root.url);
  return root.url;
};
```

Now, let's add a component to handle the export and import of the root document ID.

Create a new file `src/components/SyncControls.tsx`:


```typescript
import { useState } from "react";
import { type AutomergeUrl, isValidAutomergeUrl } from "@automerge/react";
import { setRootDocUrl } from "../rootDoc";

interface SyncControlsProps {
  docUrl: AutomergeUrl;
}

export const SyncControls: React.FC<SyncControlsProps> = ({ docUrl }) => {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [error, setError] = useState("");

  const handleExport = () => {
    navigator.clipboard.writeText(docUrl);
  };

  const handleImport = () => {
    if (!isValidAutomergeUrl(importUrl)) {
      setError("Invalid Automerge URL");
      return;
    }

    setRootDocUrl(importUrl);
    window.location.reload();
  };

  const closeDialog = () => {
    setShowImportDialog(false);
    setImportUrl("");
    setError("");
  };

  return (
    <div className="sync-controls">
      <button onClick={handleExport}>Copy account token</button>
      <button onClick={() => setShowImportDialog(true)}>
        Import account token
      </button>

      {showImportDialog && (
        <dialog open>
          <article>
            <header>
              <h3>Import your account token</h3>
            </header>
            <input
              type="text"
              value={importUrl}
              onChange={(e) => {
                setImportUrl(e.target.value);
                setError("");
              }}
              placeholder="Paste your account token URL here"
            />
            {error && <p style=&lbrace;&lbrace; color: "red" &rbrace;&rbrace;>{error}</p>}
            <footer>
              <button onClick={handleImport}>Import</button>
              <button onClick={closeDialog}>Cancel</button>
            </footer>
          </article>
        </dialog>
      )}
    </div>
  );
};
```

Now let's add it to our footer in `src/components/App.tsx`:

```typescript
// ..
import { useHash } from "react-use";
// highlight-next-line
import { SyncControls } from "./SyncControls";
// ..

<footer>
  // highlight-next-line
  <SyncControls docUrl={docUrl} />
  <p className="footer-copy">
    Powered by Automerge + Vite + React + TypeScript
  </p>
</footer>
```

This component provides buttons to export the current root document ID to the clipboard and to import a new root document ID. When the user clicks "Copy account token", the current document URL is copied to the clipboard. When they click "Import account token", a dialog appears where they can paste a new root document ID. When the root document is pasted we update the stored root document ID and reload the page to reflect the changes.

### Checking it works

Open the application and create a few task lists, then click the "Copy account token" button. This will copy the root document ID to your clipboard. Now, open a new browser, or an incognito window, and paste the copied URL into the address bar. You should see the same task lists and items you created earlier.
