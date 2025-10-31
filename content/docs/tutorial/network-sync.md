---
title: Network Sync
template: docs
---

## Collaborating over the internet

Thus far, we've been using the BroadcastChannel NetworkAdapter to move data between tabs in the same browser. Automerge treats all network adapters similarly: they are just peers you may choose to synchronize documents with.

One straightforward way of getting data to other people is to send it to the cloud; then they can come along and fetch the data at their leisure.

When you configure automerge to run on an internet server, listen for connections, and store data on disk, then we call that a "sync server". There's nothing really special about a sync server: it runs the exact same version of Automerge as you run locally. With a little configuration work, you could even connect to multiple sync servers and choose what data you want to send.

The Automerge team provides a public community sync server at `wss://sync.automerge.org`. For production software, you should run your own server, but for prototyping and development you are welcome to use ours on an "as-is" basis.

### Exercise

#### Connect to a sync server via a websocket

This is as simple as adding `WebSocketClientAdapter` to your Repo's network subsystem. We'll do this at creation time, but remember you can add and remove adapters later, too.

#### Solution

```tsx title="src/main.tsx"
//...
// highlight-next-line
import { WebSocketClientAdapter } from "@automerge/react";

const repo = new Repo({
  network: [
    new BroadcastChannelNetworkAdapter(),
    // highlight-next-line
    new WebSocketClientAdapter("wss://sync.automerge.org"),
  ],
  storage: new IndexedDBStorageAdapter(),
});
```

Now, when the Repo sees any changes it will sync them not only locally via the BroadcastChannel, but also over a websocket connection to `sync.automerge.org`, and any other process can connect to that server and use the URL to get the changes we've made.

<div class="caution">

#### Caution
The Automerge project provides a public sync server for you to experiment with, at `sync.automerge.org`. This is not a private instance, and as an experimental service has no reliability or data safety guarantees. Feel free to use it for demos and prototyping, but run your own sync server for production apps.

</div>

To see this in action, open the same URL (including the document ID) in a different browser, or on a different device. Unlike the local-only version, you'll now see the data updates synced across _all_ open clients.

{{ figure ![Screen capture of two browser windows side-by-side showing the same app titled "Automerge Task List". As the user clicks buttons, enters text or checks boxes in one window, their changes show up immediately in the other window.](/docs/tutorial/task-list-sync.webm) Local collaboration via the BroadcastChannelNetworkAdapter }}

## Network Not Required

Now that the Repo is syncing changes remotely, what happens when the websocket connection is unavailable?

Since the repo stores documents locally with the `IndexedDBStorageAdapter`, methods like `Repo.find` will consult local storage to retrieve/modify documents, so clients can create new documents while disconnected, and any clients who've already loaded a given document will still be able to make changes to it while offline.

Once connectivity has been re-established, the Repo will sync any local changes with those from remote peers, so everyone ultimately sees the same data.

Go ahead and experiment with this by opening your site in two browsers, turning off wifi, making some changes, and turning it back on.
