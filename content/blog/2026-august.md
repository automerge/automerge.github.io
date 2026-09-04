---
title: "This Month in Automerge: August '26"
description: Automerge 3.4.1, sturdier sync servers, a new access control guide, and news from around the ecosystem.
date: 2026-08-31
template: blog
---

Welcome to the second edition of This Month in Automerge! Last month we [started posting written updates][July post] in between our [quarterly community calls][AM luma].

As always, the community hangs out in [the Automerge Discord][AM Discord] — come say hi, and let us know if you'd like something included in next month's edition!

## <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" style="height: 1em; width: 1em; vertical-align: -0.12em;" role="img" aria-label="Automerge logo"><path d="M28.2485 0.806161L1.00094 28.0537C-0.0739441 29.1286 -0.0739441 30.8714 1.00094 31.9463L28.2485 59.1938C29.3234 60.2687 31.0661 60.2687 32.141 59.1938L59.3886 31.9463C60.4635 30.8714 60.4635 29.1286 59.3886 28.0537L32.141 0.806163C31.0661 -0.268724 29.3234 -0.268725 28.2485 0.806161Z M28.5447 5.25803L5.4522 28.3505C4.54122 29.2615 4.54122 30.7385 5.4522 31.6495L28.5447 54.742C29.4557 55.6529 30.9327 55.6529 31.8436 54.742L54.9361 31.6495C55.8471 30.7385 55.8471 29.2615 54.9361 28.3505L31.8436 5.25803C30.9327 4.34705 29.4557 4.34705 28.5447 5.25803Z" fill="#FFCC33"/><path d="M30.1945 56.3914C29.6656 56.3914 29.137 56.1904 28.7347 55.7879L4.40639 31.4595C3.60152 30.6547 3.60152 29.3453 4.40639 28.5405L28.7347 4.21219C29.1247 3.82214 29.6429 3.60742 30.1942 3.60742C30.7458 3.60742 31.264 3.82214 31.654 4.21219L55.9823 28.5405C56.7872 29.3453 56.7872 30.6547 55.9823 31.4595L31.654 55.7878C31.2518 56.1904 30.7232 56.3914 30.1945 56.3914ZM30.1942 4.98363C30.0105 4.98363 29.8379 5.05532 29.7077 5.18523L5.37943 29.5135C5.11122 29.7817 5.11122 30.2184 5.37943 30.4865L29.7077 54.8148C29.9682 55.0746 30.4206 55.0743 30.681 54.8148L55.0093 30.4865C55.1392 30.3566 55.2106 30.1837 55.2106 30C55.2106 29.8163 55.1392 29.6434 55.0093 29.5135L30.681 5.18523C30.5508 5.05532 30.3782 4.98363 30.1942 4.98363Z" fill="#222" stroke="#222"/><path d="M37.7723 22.9132L30.1948 12.4836L22.6173 22.9132C21.8364 23.988 22.8812 25.436 24.1474 25.0337L27.4426 23.9869V26.1274C27.4426 28.5163 26.5122 30.7625 24.8227 32.4518L19.9766 37.298L22.8962 40.2176L27.4426 35.6713V44.7637H32.9474V23.9871L36.2423 25.0337C37.5085 25.436 38.5532 23.988 37.7723 22.9132Z" fill="#222"/></svg> Automerge

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
