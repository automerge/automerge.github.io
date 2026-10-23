---
title: "This Month in Automerge: September '26"
description: Authorship lands in Automerge v3.5.0, a much sturdier BeeKEM, smarter Subduction relays, and Livelymerge learns to stream.
date: 2026-09-30
template: blog
---

As always, the community hangs out in [the Automerge Discord][AM Discord]. Come say hi, and let us know if you'd like something included in next month's edition!

## {{include:logo-icon}} Automerge

**New this month:** [Automerge v3.5.0][AM releases] for JavaScript and [`automerge` v0.12.0][Automerge crate] for Rust. The Rust stack followed with [`autosurgeon` v0.14.0][autosurgeon] and [`samod` v0.15.0][samod], which also adds the ability to bind a transport to an authenticated peer ID.

### Authors

**Automerge changes can now record an _author_.** Automerge has always tracked _actors_, which are fresh random ID for each editing session. An actor tells you that two changes came from the same session, but not that they came from the same _person_. On the other hand, an "author" is some unique identifier which you can use to specify a user account, Keyhive identity, or anything else. Automerge stores it in the first change of each actor, and it survives merging, saving, and loading.

```js
import * as Automerge from "@automerge/automerge"

let doc = Automerge.init({ author: "f0cacc1a" })
doc = Automerge.change(doc, d => { d.title = "Hello" })

Automerge.getAuthors(doc) // ["f0cacc1a"]
```

This was the first half of the work [we teased in July][July post]. The second half (which builds on authors) will be signatures for _provenance_ and _revocation_. Once you know who wrote each change, you can stop accepting changes from someone whose access you've revoked. 

### Faster Marks

Thanks to [Aran Donohue][aran], `get_marks` now reads from the mark index instead of scanning the text ([#1571][am-1571]). This speeds up reading marks at the end of a 100k-character run of text from **9.05ms to 1.6µs**. This is on `main` now and will ship in the next release.

### Fixes & Polish

- Large list insertions no longer fail with "Maximum call stack size exceeded". The Wasm bindings now apply them in bounded chunks.
- `applyPatch` and `applyPatches` now handle embedded rich-text blocks, and patches that restore deleted rich text include its marks and blocks.
- [Vincent Liu][vincent] added `i32` column support to [Hexane][hexane]. Vincent works on [Coln][coln], which uses Hexane — it's great to see contributions coming upstream!

## 📦 automerge-repo

[automerge-repo v2.6.0-alpha.4 and alpha.5][repo releases] shipped this month:

- **Ephemeral messages are more reliable.** [Alex Warth][awarth] fixed two ways that presence- and cursor-style messages could quietly stop flowing in one direction through a sync server ([#742][repo-742]). The fix came straight out of Livelymerge, which streams a _lot_ of ephemeral traffic (more on that [below](#livelymerge-streams-its-hands)).
- [Tanya Shukla][tanya] fixed a race where a peer asking for a document could get a "don't have it" reply before storage had been checked.
- [Dmytro Maretskyi][dmaretskyi] stopped the Repo from writing to storage just because it loaded a document ([#712][repo-712]).
- [Darcy Parker][darcyparker] continued the memory work with groundwork for garbage-collecting documents that nobody is using: weak caches, plus test infrastructure that can actually observe collection happening ([#736][repo-736]).

## 🗝️🐝 Keyhive

[Keyhive] is our access control and encryption layer for Automerge and other CRDTs.

### A Much Sturdier BeeKEM

[John Mumm] improved [BeeKEM][BeeKEM preprint] (Keyhive's group key agreement) performance and correctlness, especially where peers make membership changes concurrently. None of this changes the API, but it's exactly the kind of work that turns a research prototype into something you can trust.

### Threat Model

Keyhive now has a written [threat model][kh-threats] and [glossary][kh-glossary]. The threat model sets out who Keyhive defends against, which assets it protects (and which it doesn't), the trust assumptions, and the known gaps between the design and today's code. If you're evaluating Keyhive for your app, it's the place to start.

## 🏔️ Subduction

[Brooke Zelenka] and [Alex Good] continued work on making [Subduction] behave well in more complex deployments. [Subduction v0.17.x][Subduction] and [`@automerge/subduction` v0.23.0][subduction npm] are out.

### Smarter Relays

Subscriptions now propagate only _upstream_ ([#298][sd-298]), where "upstream" is who accepted (as opposed to initiated) a connection. This means that a hub like a sync server no longer fans subscriptions out to every client connected to it. A relay in a chain forwards each subscription one hop further up. Whatever a relay learns from upstream, it pushes to its own subscribers. This makes the network behave more efficiently.

### Bring Your Own Server

New crate: [`subduction_hyper`][sd-292] accepts Subduction WebSocket connections from any HTTP server built on [hyper], with an [axum] extractor behind a feature flag. If you already have a Rust web server, you can now mount Subduction inside it instead of running a separate listener.

### Fixes

- [Alex Good] fixed a bug where Sedimentree included a fragment's _boundary_ in the heads it reported, instead of the fragment's heads. It's a subtle naming confusion with real consequences!
- Many thanks to [Lilith Silver][lilithsilver] for adding remote heads to the connection builder ([#271][sd-271]).
- `subduction_keyhive` now tracks the latest Keyhive, thanks to [John Mumm] ([#308][sd-308]).

## 🌱 Around the Ecosystem

### Livelymerge Streams Its Hands

[Livelymerge][livelymerge] (the live programming environment whose heap is an Automerge document) published three more lab notes in September:

- [_A Morphic Programming Kernel_][lm-06]: Dan Ingalls's tour of the Morphic kernel at the heart of the system.
- [_Improving the Multi-User Experience_][lm-07]: what to do when dragging a shape writes ~120 Automerge ops per second. In short, keep rapidly changing state in an ephemeral object during the gesture, broadcast it with automerge-repo's [ephemeral messages][ephemeral docs], and commit to the document once at the end. This is useful advice for _any_ Automerge app with drag or resize interactions, and it's the workload that led to [the ephemeral message fixes above](#automerge-repo).
- [_Early Experiments with AI Programming_][lm-08]: since Livelymerge already supports multiple users, the easiest way to give an LLM agent live access was to make it… another user.

[Alex Warth][awarth] also wrote a short note on [_effective expressiveness_][effective-expressiveness]: not what a language _can_ express, but what kinds of problems make you want to reach for it.

### Byzantine Eventual Consistency at SRDS

[Martin Kleppmann][kleppmann] gave the keynote at [SRDS 2026][srds keynote] in Rome on September 24: [_Byzantine Eventual Consistency for Reliable Local-first Software_][bec slides]. The question is how collaborative apps without a central server can still converge when some participants are actively malicious, and it uses Automerge as the example of a library that makes this approach efficient in practice. If you've ever wondered why Automerge's change history is a hash graph, this talk is a great answer.

### linXiv: Local-First Research Papers

[linXiv][linxiv] is a local-first desktop app for researchers. It helps you search arXiv, organize papers into projects, and annotate PDFs, with a graph view to see how it all connects, using Automerge (via [autosurgeon]) under the hood!

# 📬 Get in Touch

Are you building something with Automerge? We'd love to hear about it! Drop us a line in [the Discord][AM Discord]. Knowing how Automerge is used in the wild is how we decide what to build next.

If Automerge is important to your product or organization, consider sponsoring its development: reach out to the team at [hello@inkandswitch.com][I&S email].

---

Until next time 👋

— The Automerge Core Team

<!-- External Links -->

[AM Discord]: https://discord.gg/zKGe4DCfgR
[AM luma]: https://luma.com/automerge
[AM releases]: https://github.com/automerge/automerge/releases
[ARK guide]: /docs/keyhive/ark-api-guide/
[ARK npm]: https://www.npmjs.com/package/@automerge/automerge-repo-keyhive
[Alex Good]: https://github.com/alexjg
[August post]: /blog/2026-august/
[Automerge crate]: https://crates.io/crates/automerge
[BeeKEM preprint]: https://eprint.iacr.org/2026/1434
[Brooke Zelenka]: https://github.com/expede
[I&S email]: mailto:hello@inkandswitch.com
[John Mumm]: https://github.com/jtfmumm
[July post]: /blog/2026-july/
[Keyhive]: https://github.com/inkandswitch/keyhive
[Subduction]: https://github.com/inkandswitch/subduction
[aran]: https://github.com/aran
[am-1571]: https://github.com/automerge/automerge/pull/1571
[autosurgeon]: https://github.com/automerge/autosurgeon
[awarth]: https://github.com/alexwarth
[axum]: https://github.com/tokio-rs/axum
[bolero]: https://github.com/camshaft/bolero
[coln]: https://github.com/coln-project/Coln
[darcyparker]: https://github.com/darcyparker
[dmaretskyi]: https://github.com/dmaretskyi
[effective-expressiveness]: https://www.inkandswitch.com/malleable-software/effective-expressiveness/
[ephemeral docs]: /docs/reference/repositories/ephemeral/
[fintan]: https://github.com/FintanH
[haven]: https://haven.mindoodb.com
[haven-app-builder]: https://mindoodb.com/blog/2026/09/23.09.2026090000KLEABL/
[hexane]: https://crates.io/crates/hexane
[hyper]: https://hyper.rs/
[bec slides]: https://speakerdeck.com/ept/byzantine-eventual-consistency-for-reliable-local-first-software
[iroh]: https://www.iroh.computer/
[jakeuribe]: https://bsky.app/profile/jakeuribe.bsky.social
[kh-222]: https://github.com/inkandswitch/keyhive/pull/222
[kh-226]: https://github.com/inkandswitch/keyhive/pull/226
[kh-228]: https://github.com/inkandswitch/keyhive/pull/228
[kh-234]: https://github.com/inkandswitch/keyhive/pull/234
[kh-237]: https://github.com/inkandswitch/keyhive/pull/237
[kh-238]: https://github.com/inkandswitch/keyhive/pull/238
[kh-240]: https://github.com/inkandswitch/keyhive/pull/240
[kh-242]: https://github.com/inkandswitch/keyhive/pull/242
[kh-243]: https://github.com/inkandswitch/keyhive/pull/243
[kh-248]: https://github.com/inkandswitch/keyhive/pull/248
[kh-253]: https://github.com/inkandswitch/keyhive/pull/253
[kh-255]: https://github.com/inkandswitch/keyhive/pull/255
[kh-glossary]: https://github.com/inkandswitch/keyhive/blob/main/design/glossary.md
[kh-threats]: https://github.com/inkandswitch/keyhive/blob/main/design/threat_model.md
[kleppmann]: https://martin.kleppmann.com/
[klehmann]: https://github.com/klehmann
[lilithsilver]: https://github.com/LilithSilver
[linxiv]: https://linxiv.dev
[livelymerge]: https://www.inkandswitch.com/livelymerge/notebook/
[lm-06]: https://www.inkandswitch.com/livelymerge/notebook/lm-06/
[lm-07]: https://www.inkandswitch.com/livelymerge/notebook/lm-07/
[lm-08]: https://www.inkandswitch.com/livelymerge/notebook/lm-08/
[lofi-40]: https://youtube.com/live/IWt96NvcVYs
[mindoodb]: https://github.com/klehmann/MindooDB
[repo releases]: https://github.com/automerge/automerge-repo/releases
[repo-712]: https://github.com/automerge/automerge-repo/pull/712
[repo-736]: https://github.com/automerge/automerge-repo/pull/736
[repo-742]: https://github.com/automerge/automerge-repo/pull/742
[samod]: https://github.com/alexjg/samod
[sd-271]: https://github.com/inkandswitch/subduction/pull/271
[sd-292]: https://github.com/inkandswitch/subduction/pull/292
[sd-297]: https://github.com/inkandswitch/subduction/pull/297
[sd-298]: https://github.com/inkandswitch/subduction/pull/298
[sd-308]: https://github.com/inkandswitch/subduction/pull/308
[srds keynote]: https://martin.kleppmann.com/2026/09/24/srds-keynote.html
[subduction npm]: https://www.npmjs.com/package/@automerge/subduction
[tanya]: https://github.com/automerge/automerge-repo/commits?author=tanya.shukla@flexcompute.com
[vincent]: https://github.com/automerge/automerge/pull/1529
