---
title: "This Month in Automerge: October '26"
description: Our quarterly community call, masking changes by author, an experimental automerge-repo 3.0, and Keyline, Keyhive's new authority graph.
date: 2026-10-31
template: blog
---

As always, the community hangs out in [the Automerge Discord][AM Discord]. Come say hi, and let us know if you'd like something included in next month's edition!

## 📺 Community Call

<!-- TODO: date of the call -->
We held our Q4 community call this month, and the [recording is up on YouTube][AM call recording]. <!-- TODO: one or two lines on what was covered / who presented -->

<iframe
  style="aspect-ratio: 16 / 9; border: 0;"
  src="https://www.youtube.com/embed/0rpfOFVDr7g"
  title="2026 Q4 Automerge Community Call"
  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen
  loading="lazy"
></iframe>

Want to join the next one? Follow [the Automerge calendar on Luma][AM luma] to hear when it's scheduled.

## {{include:logo-icon}} Automerge

October was a quieter month for releases: everything below is on `main` and will ship in the next version. <!-- TODO: confirm no Automerge release lands before publishing -->

### Masking Changes by Author

[Last month][September post] Automerge learned to record an _author_ for each change. This month [Fintan Halpenny][fintan] built the next step on top of that: hiding an author's changes from your view of a document.

```js
import * as Automerge from "@automerge/automerge"

// Hide everything `author` wrote after `heads`
doc = Automerge.maskAuthor(doc, author, heads)

Automerge.isAuthorMasked(doc, author) // true

// ...and bring it back
doc = Automerge.revealAuthor(doc, author)
```

The point at which the author is cut off is called a _write frontier_. Changes from that author up to the frontier stay visible, and anything after it is hidden. Masking doesn't delete anything or move the document's heads. It only changes what _your_ replica shows, so you can undo it with `revealAuthor`.

This is the building block for revocation. When someone's access is revoked, you can stop showing changes they made after that point, even if those changes still reach you through sync. [Alex Good] also made masking work when you only have part of the write frontier ([#TODO][am-write-frontier]). Your replica no longer has to wait for every head before it can show the changes you _do_ have.

Fintan made this fast too. Masked reads use Automerge's indexes instead of scanning the whole document, and loading skips the reindex step when the mask hides nothing. Property tests check that patches and hydrated documents agree under every mask.

### Fixes & Polish

- [Aran Donohue][aran] fixed `list_range` on text, which returned the start and end of each mark as if they were characters. For `"hello world"` with one mark, you now get eleven characters instead of thirteen items. Aran also added CI coverage for the `utf16-indexing` feature.
- Thanks to first-time contributor [Wahaj18][wahaj18], looking up a cursor against the wrong object now returns `InvalidCursor` instead of panicking ([#1593][am-1593]).
- [Fintan Halpenny][fintan] moved more of the [benchmark battery][benchmark battery] off of Criterion.

## 📦 automerge-repo

[Darcy Parker][darcyparker] kept up the steady stream of fixes:

- Sync state is now saved per document, and removing `DocHandle` listeners works correctly ([#773][repo-773]).
- `react-hooks` and `solid-primitives` no longer bundle their dependencies ([#758][repo-758]).
- The minimum versions of `cbor-x` and `ws` went up to pick up fixes ([#756][repo-756]).

### v3.0 (Experimental)

[Alex Good] published [`v3.0.0-experimental.1` and `experimental.2`][repo releases], an early look at an automerge-repo built on [Subduction]. <!-- TODO: confirm framing and which npm tag these are published under --> The main changes are:

- 32-byte document IDs. Existing 16-byte IDs are normalized, so old URLs still work.
- A dedicated `automerge-repo-subduction` package with a WebSocket network adapter and an IndexedDB storage adapter.
- Simpler storage: edits are saved as loose commits and compacted later, per document. Write failures stop the repo and report the error, instead of retrying silently.
- `DocHandle.changeAt` now returns a `Promise` that resolves to the new heads.

This is experimental and the API will change. If you try it, we'd love to hear how it goes in [the Discord][AM Discord]!

## 🗝️🐝 Keyhive

[Keyhive] is our access control and encryption layer for Automerge and other CRDTs. This month saw a lot of work that's been happening behind the scenes land in Keyhive!

### Keyline

**Keyline is Keyhive's new authority graph** ([#230][kh-230]). This is something that used to live directly in `keyhive_core`, but we split out for symmetry with BeeKEM.

As before, it is a set of signed certificates over keys: _delegations_ that give a key some power over a subject, and _revocations_ that withdraw a delegation. There's [a detailed design][keyline design], including the alternatives we rejected, the edge cases, etc. Unlike the prior authority graph, capabilties are now given as a late binding (when we go to use them) rather than an early binding (at delegation time). This is a lesson we imported from UCAN and was a natural fit for a causally consistent system.

One of the interesting things about Keyline is that it has clear semantics, and can be implemented in terms of SQL, Datalog, or DBSP. The first version is a fully in-memory implementation, but we plan on using databases for things like sync servers in the future. Keyline is also `no_std` and builds for Wasm. Its interface is async, so a backend can use a database, and signing can happen behind WebCrypto or a hardware key.

### CGKA Hardening

[John Mumm] continued the BeeKEM work from [last month][September post]:

- Group key operations now cite the certificates that allow them, and are checked against those certificates ([#295][kh-295], [#302][kh-302], [#303][kh-303]).
- Concurrent key updates are now merged, not replayed ([#256][kh-256]). Batches are sorted by depth, which is simpler and more predictable ([#252][kh-252]).
- An invited member can decrypt a document right away, because the "add" operation now carries their invitation ([#262][kh-262]).
- The type system now prevents recording a root secret that hasn't been verified ([#263][kh-263]).
- BeeKEM stays consistent when signing fails or a path secret is wrong ([#293][kh-293]).

### No More "Public" User

The `Public` "user" was always a bit of a hack that we knew we wanted to get rid of. Public documents used to be modeled as a well-known member whose secret any replica could hold. That special case reached into a lot of places, so we removed it. Public documents will be handled outside this layer using `Read` and `Realy` capabilities and writing keys into applications to be more like "application keys" than "world keys" for content that's public.

## 🏔️ Subduction

A new batch of [Subduction] releases is out, including [`subduction_core` v0.20.0][Subduction], [`@automerge/subduction` v0.26.0][subduction npm], and `@automerge/automerge-subduction` v0.21.0. Each package is now released and tagged on its own ([#318][sd-318]), which is why the version numbers no longer move together.

- [Alex Good] fixed two Sedimentree sync bugs. Fragment boundaries are kept during minimization ([#325][sd-325]), and they are no longer advertised as held ([#326][sd-326]). In the second bug, a peer could skip sending a commit because it thought the other side already had it.
- `subduction_keyhive` now tracks Keyhive 0.7.0, thanks to [John Mumm] ([#323][sd-323]).
- The Wasm storage API gained `get_head(id)`, and storage errors now carry the backend's original error as their `cause` ([#317][sd-317]).

## 🌱 Around the Ecosystem

<!-- TODO: community projects, talks, Livelymerge lab notes, etc. -->

# 📬 Get in Touch

Are you building something with Automerge? We'd love to hear about it! Drop us a line in [the Discord][AM Discord]. Knowing how Automerge is used in the wild is how we decide what to build next.

If Automerge is important to your product or organization, consider sponsoring its development: reach out to the team at [hello@inkandswitch.com][I&S email].

---

Until next time 👋

— The Automerge Core Team

<!-- External Links -->

[AM Discord]: https://discord.gg/zKGe4DCfgR
[AM call recording]: https://www.youtube.com/watch?v=0rpfOFVDr7g
[AM luma]: https://luma.com/automerge
[Alex Good]: https://github.com/alexjg
[Brooke Zelenka]: https://github.com/expede
[I&S email]: mailto:hello@inkandswitch.com
[John Mumm]: https://github.com/jtfmumm
[Keyhive]: https://github.com/inkandswitch/keyhive
[September post]: /blog/2026-september/
[Subduction]: https://github.com/inkandswitch/subduction
[am-1593]: https://github.com/automerge/automerge/issues/1593
[am-write-frontier]: https://github.com/automerge/automerge/pulls
[aran]: https://github.com/aran
[benchmark battery]: https://github.com/automerge/automerge/tree/main/rust/benchmark-battery
[darcyparker]: https://github.com/darcyparker
[fintan]: https://github.com/FintanH
[keyline design]: https://github.com/inkandswitch/keyhive/blob/main/design/keyline/README.md
[kh-230]: https://github.com/inkandswitch/keyhive/pull/230
[kh-252]: https://github.com/inkandswitch/keyhive/pull/252
[kh-256]: https://github.com/inkandswitch/keyhive/pull/256
[kh-262]: https://github.com/inkandswitch/keyhive/pull/262
[kh-263]: https://github.com/inkandswitch/keyhive/pull/263
[kh-288]: https://github.com/inkandswitch/keyhive/pull/288
[kh-293]: https://github.com/inkandswitch/keyhive/pull/293
[kh-295]: https://github.com/inkandswitch/keyhive/pull/295
[kh-302]: https://github.com/inkandswitch/keyhive/pull/302
[kh-303]: https://github.com/inkandswitch/keyhive/pull/303
[repo releases]: https://github.com/automerge/automerge-repo/releases
[repo-756]: https://github.com/automerge/automerge-repo/pull/756
[repo-758]: https://github.com/automerge/automerge-repo/pull/758
[repo-773]: https://github.com/automerge/automerge-repo/pull/773
[sd-317]: https://github.com/inkandswitch/subduction/pull/317
[sd-318]: https://github.com/inkandswitch/subduction/pull/318
[sd-323]: https://github.com/inkandswitch/subduction/pull/323
[sd-325]: https://github.com/inkandswitch/subduction/pull/325
[sd-326]: https://github.com/inkandswitch/subduction/pull/326
[subduction npm]: https://www.npmjs.com/package/@automerge/subduction
[wahaj18]: https://github.com/Wahaj18
