---
title: Core Concepts
template: docs
---

## Architecture of an Automerge App

Building apps with Automerge requires familiarity with two key concepts: **Documents** and **Repositories**.

- An Automerge [Document](/docs/reference/concepts/#documents) (Doc) models app data using a specialized data structure that supports conflict-free collaboration via git-like merges.
- An Automerge [Repository](/docs/reference/concepts/#repositories) (Repo) determines how/where the app stores and synchronizes those documents, locally and/or over the network.

Automerge is built in Rust, but stack-agnostic and useful for building apps on any platform, with client libraries for many popular languages/frameworks.

<a href="https://www.youtube.com/watch?v=Mr0a5KyD6BU" title='Watch "New algorithms for collaborative text editing" by Martin Kleppmann (Strange Loop 2023) on YouTube'>

<Figure
  src={amg-arch-KleppmannStrangeLoop2023.webp}
  alt="Diagram of automerge project components, including automerge and automerge-repo"
  caption='Automerge system diagram from  "New algorithms for collaborative text editing" by Martin Kleppmann (Strange Loop 2023)'
/>

</a>

The foundational `Document` data structure & related algorithms are defined in the [`@automerge/automerge`](https://github.com/automerge/automerge) core library, which used under the hood by the [`@automerge/automerge-repo`](https://github.com/automerge/automerge-repo) library, which exposes the practical conveniences for managing documents via a `Repo`.

## Manage docs with a `Repo`

A [`Repo`](/docs/reference/repositories/) keeps track of all the documents you load and makes sure they're properly synchronized and stored. It provides an interface to:

- create, modify, and manage documents locally
- send & receive changes to/from others, and
- merge multiple changes as needed.

Each Repo needs to know:

- Where its documents should be saved, specified via a [`StorageAdapter`](/docs/reference/repositories/storage/)
- How/Where to send, retrieve, and synchronize doc updates, specified via zero or more [`NetworkAdapter`](/docs/reference/repositories/networking/)s

The `Repo` constructor, which comes from [`@automerge/automerge-repo`](https://github.com/automerge/automerge-repo), lets you create & configure a Repository, specifying the `StorageAdapter` and `NetworkAdapter`(s) you need.

Adapters can be imported from their respective `@automerge/automerge-repo-storage-*` and `@automerge/automerge-repo-network-*` packages.

For convenience, we're going to use the `@automerge/react` package to simplify our imports, but all that package does is re-export the most common dependencies that a React web application might want.

#### Roll your own adapter

If none of the pre-built adapters fit your needs, you can create [custom adapter(s)](/docs/reference/repositories/storage/#roll-your-own) as needed.
