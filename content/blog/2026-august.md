---
title: "This Month in Automerge: August '26"
description: Automerge 3.4.1, sturdier sync servers, a new access control guide, and news from around the ecosystem.
date: 2026-08-31
template: blog
---

Welcome to the second edition of This Month in Automerge! Last month we [started posting written updates][July post] in between our [quarterly community calls][AM luma].

As always, the community hangs out in [the Automerge Discord][AM Discord] — come say hi, and let us know if you'd like something included in next month's edition!

## {{include:logo-icon}} Automerge

**New this month:** [Automerge 3.4.1][AM releases] for JavaScript and [`automerge` 0.11.0][Automerge crate] for Rust. The wider Rust stack followed the same day — [`autosurgeon` 0.13.0][autosurgeon] (derive-based structs backed by Automerge documents) and [`samod` 0.13.0][samod] (the Rust automerge-repo implementation, wire-compatible with the JavaScript one) both track 0.11.0.

### Under the Hood

**`automerge` 0.11.0 no longer exposes Hexane types in its public API.**

Previously, Hexane's types leaked through Automerge's surface, which meant any change to the storage engine was potentially a breaking change to Automerge. Now the boundary is sealed. Hexane can keep evolving quickly toward a stable v1, and you don't need to worry about it in your application.

[July brought Hexane v1][July hexane], the rewritten columnar storage engine that made saving and loading documents [2–9× faster][July hexane]. [Orion Henry] spent August hardening the edge cases: overflow safety, boundary conditions, and encoder invariants that reject malformed data up front rather than writing bytes nothing can read back.

None of that changes the public Automerge API, but it makes a huge difference in performance and raises the ceiling on what kinds of applications can use Automerge, how many documents they can have open at once, and so on.

### 👻 Haunted Documents Wanted!

[Alex Good] added a [benchmark battery](https://github.com/automerge/automerge/tree/main/rust/benchmark-battery) to the Rust workspace: a standard set of documents and operations we can run against every change.

Combined with the [document anonymizer][anonymizer], you can now submit documents without having to worry that you're publishing your data to the entire internet. The anonymizer strips your content while preserving the exact structure that causes the problem, so you can share a pathological document without sharing anything private.

**Please send us your slow, buggy, or haunted documents.** [The Discord][AM Discord] or [an issue][AM issues], whichever you prefer. Real-world documents that behave badly are incredibly useful as they let us focus on the optimizations that will actually help in the wild!

### Easier Contribution

A big thank you to [Fintan Halpenny][fintan], who has been documenting Automerge's internals — op set, clocks, visibility, and change tracking now have prose explaining what they're for and why they work the way they do.

Also for the Nix users out there: Fintan got the JavaScript test suite and CI running under Nix, so `nix develop` now gets you a working environment for the whole project.

## 📦 automerge-repo

Thanks once again to [Darcy Parker][darcyparker], who has been continuing his push for better stability. There's also a **memory profiling harness** in the repo now, so the next leak gets measured instead of guessed at.

Thanks also to [Maciek Sakrejda][msakrejda] for tightening up the storage adapter contract, and to [Alex Good] for rebuilding the release process so that publishing a new version no longer requires a ceremony.

## 🗝️🐝 Keyhive

[Keyhive] is our access control and encryption layer (for Automerge and other CRDTs).

### New: The ARK API Guide

[`@automerge/automerge-repo-keyhive`](https://www.npmjs.com/package/@automerge/automerge-repo-keyhive) (also known as "ARK") adds access control and end-to-end encryption to `automerge-repo`. There's now [a proper API guide][ARK guide], covering initialization, identity, creating protected documents, granting and revoking access, querying who has access to what, and the lower-level pieces you need for custom setups.

For a worked example, see the [Keyhive Todo MVC demo][Todo demo]:

<figure>
  <a href="https://github.com/inkandswitch/keyhive-todo-app-demo">
    <img src="keyhive-demo.png" width="1835" height="1026" alt="The Keyhive Todo MVC demo, showing a shared todo list with per-document access control" />
  </a>
</figure>

## 🌱 Around the Ecosystem

The best part of this work is watching what people build. A few things that we'd like to highlight this month:

### Automerge Is on CRAN

**Automerge has [R bindings][automerge-r], they're on CRAN, and they're largely community-maintained.** Version 0.5.0 no longer needs CMake to build from source, and this month brought a Windows ARM64 build fix. Thanks to [Jeroen Ooms][jeroen] and [Charlie Gao][shikokuchuo].

### Livelymerge: Convergence Isn't Correctness

[Livelymerge][livelymerge] is an Ink & Switch research project by [Alex Warth][awarth], [Dan Ingalls][ingalls], and [Peter van Hardenberg][pvh] that uses an Automerge document as the **heap of a live programming environment**. Every object, class, and method is CRDT data. They published three lab notes in August, on [the object model][lm-03], [local state][lm-04], and [performance][lm-05].

We'd particularly point you at the note just before those, [_Convergence Is Not Enough_][lm-02], because it's a property we talk about a great deal internally. Automerge guarantees convergence: exchange changes, and every peer deterministically reaches the same state. Livelymerge points out that convergence is not the same as correctness. This is a good criticism! It doesn't have a widely agreed upon general solution today. In some ways it's an argument for merge-aware data types that encode what the programmer _meant_ rather than the structure they happened to use.

### Prototype Using Keyhive with ATProto

[Jedi Wright][jediwright] has been prototyping [governed publishing from a Keyhive-protected Automerge document to Bluesky][substrate-crossing]. The Keyhive grant acts as the gate: before a post goes out, an intent record (with a hash of the authorized content) is written into the document itself; the post is published as a [WhiteWind][whtwnd] blog entry carrying a back-pointer to the source document; and a completion record closes the loop. If the document changes between intent and publish, the hash mismatch blocks the publish, and every step is auditable from the Automerge side. It's an early prototype against the ARK alpha, but it's the first thing we've seen combining Keyhive with ATProto, and the [implementation notes][substrate-crossing] surfaced some useful rough edges in our packaging along the way.

# 📬 Get in Touch

Are you building something with Automerge? We'd love to hear about it — drop us a line in [the Discord][AM Discord]. Knowing how Automerge gets used in the wild is genuinely how we decide what to build next.

If Automerge is important to your product or organization, consider sponsoring its development: reach out to the team at [hello@inkandswitch.com][I&S email].

---

Until next time 👋

— The Automerge Core Team

<!-- External Links -->

[AM Discord]: https://discord.gg/zKGe4DCfgR
[AM issues]: https://github.com/automerge/automerge/issues
[AM luma]: https://luma.com/automerge
[AM releases]: https://github.com/automerge/automerge/releases
[ARK guide]: /docs/keyhive/ark-api-guide/
[Alex Good]: https://github.com/alexjg
[Automerge crate]: https://crates.io/crates/automerge
[I&S email]: mailto:hello@inkandswitch.com
[July hexane]: /blog/2026-july/#hexane
[July post]: /blog/2026-july/
[Keyhive]: https://github.com/inkandswitch/keyhive
[Orion Henry]: https://github.com/orionz
[Todo demo]: https://github.com/inkandswitch/keyhive-todo-app-demo
[anonymizer]: https://github.com/automerge/automerge/tree/main/rust/automerge-cli#anonymize-a-document
[automerge-r]: https://posit-dev.github.io/automerge-r/
[awarth]: https://github.com/alexwarth
[darcyparker]: https://github.com/darcyparker
[fintan]: https://github.com/FintanH
[ingalls]: https://en.wikipedia.org/wiki/Dan_Ingalls
[jediwright]: https://github.com/jediwright
[jeroen]: https://github.com/jeroen
[livelymerge]: https://www.inkandswitch.com/livelymerge/notebook/
[lm-02]: https://www.inkandswitch.com/livelymerge/notebook/lm-02/
[lm-03]: https://www.inkandswitch.com/livelymerge/notebook/lm-03/
[lm-04]: https://www.inkandswitch.com/livelymerge/notebook/lm-04/
[lm-05]: https://www.inkandswitch.com/livelymerge/notebook/lm-05/
[msakrejda]: https://github.com/msakrejda
[pvh]: https://github.com/pvh
[shikokuchuo]: https://github.com/shikokuchuo
[substrate-crossing]: https://github.com/jediwright/employment-seam/tree/main/substrate-crossing
[whtwnd]: https://whtwnd.com
[autosurgeon]: https://github.com/automerge/autosurgeon
[samod]: https://github.com/alexjg/samod
