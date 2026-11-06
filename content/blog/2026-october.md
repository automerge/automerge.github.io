---
title: "This Month in Automerge: October '26"
description: Our quarterly community call, masking changes by author, an experimental automerge-repo 3.0, and a big month for Keyhive with Keyline, causal encryption, and new integrations in automerge-repo-keyhive and Pushwork.
date: 2026-10-31
template: blog
---

As always, the community hangs out in [the Automerge Discord][AM Discord]. Come say hi, and let us know if you'd like something included in next month's edition!

## 📺 Community Call

<!-- TODO: date of the call -->
We held our Q4 community call in October, and the [recording is up on YouTube][AM call recording]. <!-- TODO: one or two lines on what was covered / who presented -->

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

### Masking Changes by Author

In [September][September post], Automerge learned to record an _author_ for each change. In October, [Fintan Halpenny][fintan] built the next step on top of that: hiding an author's changes from your view of a document ([#1581][am-1581]).

```js
import * as Automerge from "@automerge/automerge"

// Hide everything `author` wrote after `heads`
doc = Automerge.maskAuthor(doc, author, heads)

Automerge.isAuthorMasked(doc, author) // true

// ...and bring it back
doc = Automerge.revealAuthor(doc, author)
```

The point at which the author is cut off is called a _write frontier_. Changes from that author up to the frontier stay visible, and anything after it is hidden. Masking doesn't delete anything or move the document's heads. It only changes what _your_ replica shows, so you can undo it with `revealAuthor`.

We built this for [Keyhive] revocation. When Keyhive revokes someone's access to a document, Automerge can stop showing the changes they made after that point, even if those changes still reach you through sync.

We think masking is useful well beyond access control. For example, you could hide edits from a misbehaving bot or AI agent, review someone's changes before accepting them, or see what a document looks like without one collaborator's contributions. If you have other ideas, we'd love to hear them!

[Alex Good] also made masking work when you only have part of the write frontier ([#1595][am-1595]). Your replica no longer has to wait for every head before it can show the changes you _do_ have.

Fintan made this fast too. Masked reads use Automerge's indexes instead of scanning the whole document, and loading skips the reindex step when the mask hides nothing. Property tests check that patches and hydrated documents agree under every mask.

### Fixes & Polish

- [Aran Donohue][aran] fixed `list_range` on text, which returned the start and end of each mark as if they were characters ([#1608][am-1608]). For `"hello world"` with one mark, you now get eleven characters instead of thirteen items. Aran also added CI coverage for the `utf16-indexing` feature ([#1630][am-1630]).
- Thanks to first-time contributor [Wahaj18][wahaj18], looking up a cursor against the wrong object now returns `InvalidCursor` instead of panicking ([#1597][am-1597]).
- [Fintan Halpenny][fintan] moved more of the [benchmark battery][benchmark battery] off of Criterion.

## 📦 automerge-repo

[Darcy Parker][darcyparker] kept up the steady stream of fixes:

- Sync state is now saved per document, and removing `DocHandle` listeners works correctly ([#773][repo-773]).
- `react-hooks` and `solid-primitives` no longer bundle their dependencies ([#758][repo-758]).
- The minimum versions of `cbor-x` and `ws` went up to pick up fixes ([#756][repo-756]).
- Importing an older copy of a document under the same ID can no longer delete newer stored changes during compaction ([#774][repo-774]).

### automerge-repo v3.0 (Experimental)

[Alex Currie-Clark][acurrieclark] spent much of October rebuilding automerge-repo on top of [Subduction]. Instead of its own network and storage adapters, automerge-repo 3 talks to a _Sedimentree backend_, and the first one is a Subduction backend. The work went out as [`v3.0.0-experimental.1` and `.2`][repo releases] early in the month. Since then it has grown into [`v3.0.0-alpha.0` and `alpha.1`][repo releases], now on npm under the `next` tag.

```ts
import "@automerge/subduction" // initializes Subduction's Wasm
import { Repo } from "@automerge/automerge-repo"
import { SubductionBackend } from "@automerge/automerge-repo-subduction"
import { IndexedDBSubductionStorageAdapter } from "@automerge/automerge-repo-subduction-storage-indexeddb"
import { WebSocketSubductionNetworkAdapter } from "@automerge/automerge-repo-subduction-network-websocket"

const backend = new SubductionBackend({
  storage: new IndexedDBSubductionStorageAdapter(),
  network: [new WebSocketSubductionNetworkAdapter("wss://subduction.sync.inkandswitch.com")],
})
const repo = new Repo({ backend })
```

Highlights:

- **A simpler core.** The old scheduler is gone. Each document now owns its own state, and the Repo just maps document IDs to documents.
- **New APIs.** `Repo.query()` returns an observable you can subscribe to, `DocHandle.hasHeads` checks whether a document has reached some heads, `DocHandle.changeAt` returns a `Promise` of the new heads. On the Subduction backend, a signal-based `syncPolicy` decides which documents sync with which peers.
- **32-byte document IDs.** Existing 16-byte IDs still work in URLs.
- **Faster loading.** Each document loads with a single storage read, and many documents load in parallel. New benchmarks cover large imports, long text histories, and documents with many authors.
- **Clearer failures.** Edits are stored as loose commits and compacted later. If a write fails, the repo stops and reports it, instead of retrying silently.

This is an alpha, not ready for production, and the API will change. If you try it, we'd love to hear how it goes in [the Discord][AM Discord]!

## 🗝️🐝 Keyhive

[Keyhive] is our access control and encryption layer for Automerge and other CRDTs. This was a big month for Keyhive: a lot of work that's been happening behind the scenes finally landed!

In short: a new authority graph (Keyline), sturdier group keys, causal encryption, a stable custom codec, no more "World Public" user, and Keyhive 0.6 running in automerge-repo-keyhive.

### Keyline

**Keyline is Keyhive's new authority graph** ([#230][kh-230]). This is something that used to live directly in `keyhive_core`, but we split out for symmetry with BeeKEM.

As before, it is a set of signed certificates over keys: _delegations_ that give a key some power over a subject, and _revocations_ that withdraw a delegation. There's [a detailed design][keyline design], including the alternatives we rejected, the edge cases, etc. Unlike the prior authority graph, capabilities are now given as a late binding (when we go to use them) rather than an early binding (at delegation time). This is a lesson we imported from [UCAN] and was a natural fit for a causally consistent system.

Keyline also does away with our old "dueling admins" problem. Previously, when two admins revoked each other concurrently, Keyhive broke the cycle by seniority, which was subtle and hard to predict. Keyline replaces that with a simpler, explicit model: you can never revoke the branch of the graph you're standing on, and when peers revoke each other, both revocations stand. You recover by rotating the role, not by a tiebreak, so the result is easy to reason about.

One of the interesting things about Keyline is that it has clear semantics, and can be implemented in terms of SQL, Datalog, or DBSP. The first version is a fully in-memory implementation, but we plan on using databases for things like sync servers in the future. Keyline is also `no_std` and builds for Wasm. Its interface is async, so a backend can use a database, and signing can happen behind WebCrypto or a hardware key.

Expect an [Ink & Switch lab note][keyhive notebook] all about Keyline in the near future!

### CGKA Hardening

[John Mumm] continued hardening [BeeKEM][beekem crate], building on the work from [September][September post]. Group key operations now cite the certificates that authorize them and are checked against those certificates ([#295][kh-295], [#302][kh-302], [#303][kh-303]). Concurrent key updates are merged instead of replayed, with batches sorted by depth ([#256][kh-256], [#252][kh-252]), and merging skips duplicate operations and blanks any path node no member could decrypt ([#305][kh-305], [#306][kh-306]).

Newly invited members can decrypt a document right away ([#262][kh-262]). BeeKEM also stays consistent when signing fails or a path secret is wrong ([#293][kh-293]), and the type system now rules out recording a root secret that hasn't been verified ([#263][kh-263]).

### Causal Encryption

Content encryption now lives in its own crate, `keyhive_content` ([#313][kh-313]), and causal encryption is exposed to both Rust and JS clients ([#317][kh-317]).

Every encrypted block carries the keys of its direct causal ancestors. If you can open one point in a document's history, you can walk back from there and open everything before it, so a new member can read the full history without anyone having to hand over a pile of old keys. In JS, that's `tryEncryptWithAncestors` and `tryCausalDecrypt`. The [design doc][causal design] covers the trade-offs, including why this gives post-compromise security but not forward secrecy.

<svg viewBox="0 0 680 380" role="img" aria-labelledby="causal-title causal-desc" xmlns="http://www.w3.org/2000/svg" style="display: block; width: 100%; max-width: 680px; margin: 1.5rem auto; color: var(--fg); font-family: inherit;" fill="currentColor">
<title id="causal-title">Causal encryption</title>
<desc id="causal-desc">Four encrypted blocks, each holding some content. Block D also holds the keys for blocks B and C, which each hold the key for block A, which has no ancestors. Holding the key for D is enough to open B and C, and through them A.</desc>
<defs><marker id="causal-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>
<rect x="25" y="124" width="140" height="112" rx="8" fill="var(--bg)" stroke="currentColor" stroke-width="1.5"/><text x="95" y="148" text-anchor="middle" font-size="15" font-weight="600">Block A</text><rect x="35" y="160" width="120" height="32" rx="5" fill="var(--current)"/><rect x="45" y="168" width="78" height="4" rx="2" fill="var(--inactive)" opacity="0.7"/><rect x="45" y="176" width="55.00000000000001" height="4" rx="2" fill="var(--inactive)" opacity="0.7"/><rect x="45" y="184" width="68" height="4" rx="2" fill="var(--inactive)" opacity="0.7"/>
<rect x="250" y="26" width="140" height="112" rx="8" fill="var(--bg)" stroke="currentColor" stroke-width="1.5"/><text x="320" y="50" text-anchor="middle" font-size="15" font-weight="600">Block B</text><rect x="260" y="62" width="120" height="32" rx="5" fill="var(--current)"/><rect x="270" y="70" width="78" height="4" rx="2" fill="var(--inactive)" opacity="0.7"/><rect x="270" y="78" width="55.00000000000001" height="4" rx="2" fill="var(--inactive)" opacity="0.7"/><rect x="270" y="86" width="68" height="4" rx="2" fill="var(--inactive)" opacity="0.7"/>
<rect x="250" y="222" width="140" height="112" rx="8" fill="var(--bg)" stroke="currentColor" stroke-width="1.5"/><text x="320" y="246" text-anchor="middle" font-size="15" font-weight="600">Block C</text><rect x="260" y="258" width="120" height="32" rx="5" fill="var(--current)"/><rect x="270" y="266" width="78" height="4" rx="2" fill="var(--inactive)" opacity="0.7"/><rect x="270" y="274" width="55.00000000000001" height="4" rx="2" fill="var(--inactive)" opacity="0.7"/><rect x="270" y="282" width="68" height="4" rx="2" fill="var(--inactive)" opacity="0.7"/>
<rect x="445" y="108" width="140" height="144" rx="8" fill="var(--bg)" stroke="currentColor" stroke-width="1.5"/><text x="515" y="132" text-anchor="middle" font-size="15" font-weight="600">Block D</text><rect x="455" y="144" width="120" height="32" rx="5" fill="var(--current)"/><rect x="465" y="152" width="78" height="4" rx="2" fill="var(--inactive)" opacity="0.7"/><rect x="465" y="160" width="55.00000000000001" height="4" rx="2" fill="var(--inactive)" opacity="0.7"/><rect x="465" y="168" width="68" height="4" rx="2" fill="var(--inactive)" opacity="0.7"/>
<text x="95" y="218" text-anchor="middle" font-size="12" fill="var(--inactive)">no ancestors</text>
<line x1="260" y1="116" x2="168" y2="162" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#causal-arrow)"/>
<line x1="260" y1="312" x2="168" y2="198" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#causal-arrow)"/>
<line x1="455" y1="198" x2="393" y2="102" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#causal-arrow)"/>
<line x1="455" y1="230" x2="393" y2="258" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#causal-arrow)"/>
<line x1="618" y1="140" x2="588" y2="140" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#causal-arrow)"/>
<rect x="260" y="104" width="54" height="24" rx="6" fill="var(--yellow)" stroke="var(--slate)"/><text x="273" y="121.5" text-anchor="middle" font-size="15">🗝️</text><text x="300" y="120.5" text-anchor="middle" font-size="13" font-weight="700" fill="var(--slate)">A</text>
<rect x="260" y="300" width="54" height="24" rx="6" fill="var(--yellow)" stroke="var(--slate)"/><text x="273" y="317.5" text-anchor="middle" font-size="15">🗝️</text><text x="300" y="316.5" text-anchor="middle" font-size="13" font-weight="700" fill="var(--slate)">A</text>
<rect x="455" y="186" width="54" height="24" rx="6" fill="var(--yellow)" stroke="var(--slate)"/><text x="468" y="203.5" text-anchor="middle" font-size="15">🗝️</text><text x="495" y="202.5" text-anchor="middle" font-size="13" font-weight="700" fill="var(--slate)">B</text>
<rect x="455" y="218" width="54" height="24" rx="6" fill="var(--yellow)" stroke="var(--slate)"/><text x="468" y="235.5" text-anchor="middle" font-size="15">🗝️</text><text x="495" y="234.5" text-anchor="middle" font-size="13" font-weight="700" fill="var(--slate)">C</text>
<rect x="618" y="128" width="54" height="24" rx="6" fill="var(--yellow)" stroke="var(--slate)"/><text x="631" y="145.5" text-anchor="middle" font-size="15">🗝️</text><text x="658" y="144.5" text-anchor="middle" font-size="13" font-weight="700" fill="var(--slate)">D</text>
<text x="645" y="118" text-anchor="middle" font-size="12" fill="var(--inactive)">your key</text>
<g transform="translate(155 358)"><rect x="0" y="-11" width="34" height="14" rx="3" fill="var(--current)"/><rect x="5" y="-8" width="22" height="3" rx="1.5" fill="var(--inactive)" opacity="0.7"/><rect x="5" y="-2" width="16" height="3" rx="1.5" fill="var(--inactive)" opacity="0.7"/><text x="42" y="0" font-size="12" fill="var(--inactive)">content</text><rect x="110" y="-11" width="34" height="14" rx="4" fill="var(--yellow)" stroke="var(--slate)"/><text x="124" y="1.5" text-anchor="middle" font-size="12">🗝️</text><text x="152" y="0" font-size="12" fill="var(--inactive)">a parent's key</text><line x1="270" y1="-4" x2="300" y2="-4" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#causal-arrow)"/><text x="308" y="0" font-size="12" fill="var(--inactive)">unlocks</text></g>
</svg>

The format got stricter along the way. Encrypted content is now chunked with a checked nonce ([#297][kh-297]), every block body is an envelope ([#322][kh-322]), and an ancestor key must actually be able to decrypt the content it's listed with ([#323][kh-323]).

### Canonical Encoding

The Keyhive team has been hard at work finalizing Keyhive's custom codec, with two goals:

1. **Remove bincode and serde.** Keyhive now uses its own codecs throughout ([#299][kh-299], [#310][kh-310], [#311][kh-311]).
2. **Reach a stable encoding we can commit to.** Keyhive data is signed, hashed, synced, and stored for the long term, so its byte format needs to stay put as Keyhive evolves.

Getting the bytes right matters for security too. Certificates are signed and hashed as bytes, and [`keyhive_codec`][keyhive codec] requires that each value has exactly one valid encoding. If a value could be encoded two ways, a peer could send the same certificate under two different hashes, and a revocation naming one would miss the other.

We also gave every key derivation its own context ([#309][kh-309]) and signed application bytes under their own kind ([#296][kh-296]), so a key or signature made for one purpose can't be passed off as another.

All of this is out in [`@keyhive/keyhive` v0.6.0][keyhive npm] and [`keyhive_core` v0.10.0][keyhive crate].

### No More "World Public" User

The "World Public" user was always a bit of a hack that we knew we wanted to get rid of. Public documents used to be modeled as a well-known member whose secret any replica could hold. We removed it for a few reasons:

- **It was special-cased throughout the code.** BeeKEM, `keyhive_core`, and the JS API all had to know about it, and the new approach doesn't need any of that.
- **It was a denial-of-service vector.** Anyone could act as the "World Public" user and ask a sync server for _every_ public document it held.

Public documents will now be handled outside this layer using `Read` and `Relay` capabilities and writing keys into applications to be more like "application keys" than "world keys" for content that's public.

Here's the pattern for an "app-public" document. The app creates two principals and ships one secret for each of them, so anyone running the app can read the document, and nobody else can:

{{# Mermaid source for the diagram below (the build doesn't render Mermaid, so the SVG is hand-made):
flowchart TD
  Doc[Document] -->|admin| Owner
  Owner -.-> More[…]
  More -->|read| Reader[App Reader]
  Reader -->|relay| Fetcher[App Fetcher]
  Reader === RK["X25519 secret key (to decrypt with)"]
  Fetcher === SK["Ed25519 signing key (to fetch with)"]
}}

<svg viewBox="0 0 600 600" role="img" aria-labelledby="app-public-title app-public-desc" xmlns="http://www.w3.org/2000/svg" style="display: block; width: 100%; max-width: 600px; margin: 1.5rem auto; color: var(--fg); font-family: inherit;" fill="currentColor">
<title id="app-public-title">An app-public document</title>
<desc id="app-public-desc">The document grants admin to its owner. Through some chain of delegations, read access is granted to an App Reader, and the App Reader grants relay to an App Fetcher. The app ships the App Reader's X25519 secret key, to decrypt with, and the App Fetcher's Ed25519 signing key, to fetch with.</desc>
<defs><marker id="app-public-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>
<line x1="150" y1="50" x2="150" y2="128" stroke="currentColor" stroke-width="1.5" marker-end="url(#app-public-arrow)"/><rect x="120.75" y="79" width="58.5" height="22" rx="11" fill="var(--bg)" stroke="var(--inactive)"/><text x="150" y="94" text-anchor="middle" font-family="'Overpass Mono', monospace" font-size="12">admin</text>
<line x1="150" y1="170" x2="150" y2="240" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#app-public-arrow)"/>
<rect x="110" y="242" width="80" height="36" rx="8" fill="var(--bg)" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="150" y="266" text-anchor="middle" font-size="18" font-weight="700">…</text>
<line x1="150" y1="280" x2="150" y2="378" stroke="currentColor" stroke-width="1.5" marker-end="url(#app-public-arrow)"/><rect x="125" y="319" width="50" height="22" rx="11" fill="var(--bg)" stroke="var(--inactive)"/><text x="150" y="334" text-anchor="middle" font-family="'Overpass Mono', monospace" font-size="12">read</text>
<line x1="150" y1="420" x2="150" y2="518" stroke="currentColor" stroke-width="1.5" marker-end="url(#app-public-arrow)"/><rect x="120.75" y="459" width="58.5" height="22" rx="11" fill="var(--bg)" stroke="var(--inactive)"/><text x="150" y="474" text-anchor="middle" font-family="'Overpass Mono', monospace" font-size="12">relay</text>
<rect x="80" y="10" width="140" height="40" rx="8" fill="var(--bg)" stroke="currentColor" stroke-width="1.5"/><text x="150" y="35" text-anchor="middle" font-size="15" font-weight="600">Document</text>
<rect x="75" y="130" width="150" height="40" rx="8" fill="var(--bg)" stroke="currentColor" stroke-width="1.5"/><text x="150" y="155" text-anchor="middle" font-size="15" font-weight="600">Owner</text>
<rect x="75" y="380" width="150" height="40" rx="8" fill="var(--bg)" stroke="currentColor" stroke-width="1.5"/><text x="150" y="405" text-anchor="middle" font-size="15" font-weight="600">App Reader</text>
<rect x="75" y="520" width="150" height="40" rx="8" fill="var(--bg)" stroke="currentColor" stroke-width="1.5"/><text x="150" y="545" text-anchor="middle" font-size="15" font-weight="600">App Fetcher</text>
<line x1="225" y1="397" x2="325" y2="397" stroke="currentColor" stroke-width="1.5"/><line x1="225" y1="403" x2="325" y2="403" stroke="currentColor" stroke-width="1.5"/>
<line x1="225" y1="537" x2="325" y2="537" stroke="currentColor" stroke-width="1.5"/><line x1="225" y1="543" x2="325" y2="543" stroke="currentColor" stroke-width="1.5"/>
<rect x="309" y="354" width="242" height="232" rx="12" fill="none" stroke="var(--inactive)" stroke-dasharray="6 5"/>
<text x="430" y="346" text-anchor="middle" font-family="'Overpass Mono', monospace" font-size="12" fill="var(--inactive)">shipped with the app</text>
<rect x="325" y="374" width="210" height="52" rx="8" fill="var(--yellow)" stroke="var(--slate)" stroke-width="1.5"/><text x="430" y="397" text-anchor="middle" font-size="15" font-weight="600" fill="var(--slate)">X25519 secret key</text><text x="430" y="415" text-anchor="middle" font-size="12" fill="var(--slate)">to decrypt with</text>
<rect x="325" y="514" width="210" height="52" rx="8" fill="var(--yellow)" stroke="var(--slate)" stroke-width="1.5"/><text x="430" y="537" text-anchor="middle" font-size="15" font-weight="600" fill="var(--slate)">Ed25519 signing key</text><text x="430" y="555" text-anchor="middle" font-size="12" fill="var(--slate)">to fetch with</text>
</svg>

Anyone with read access to the document can set this up, not just its owner. They give the _reader_ read access, and the reader passes relay access on to the _fetcher_. The app ships the reader's X25519 secret key, so anyone with the app can decrypt as the reader, but not its signing key, so nobody can use it to change the document or its membership. It also ships the fetcher's Ed25519 signing key, so anyone can sign in to the sync server as the fetcher and pull ciphertext, which on its own they can't read. Put the two together and you get read-only access for that app's users.

Today this is set up by hand, but we plan to add an API for it.

### automerge-repo-keyhive

[`automerge-repo-keyhive` v0.8.0-alpha.1][ARK npm] (on the `next` npm tag) moves onto Keyhive 0.6.0, thanks to [John Mumm]. Its hand-rolled encryption is gone, replaced by Keyhive's causal encryption. Earlier in the month, v0.7.0-alpha.1 removed the old "nudge edit" machinery.

**This is a breaking change:** with the "World Public" user gone, automerge-repo-keyhive no longer has `setPublicAccess` or `getPublicAccess`. Public access is now up to your application. As always with automerge-repo-keyhive, pin an exact version.

## 🏔️ Subduction

A new batch of [Subduction] releases is out, including [`subduction_core` v0.20.0][Subduction], [`@automerge/subduction` v0.26.0][subduction npm], and `@automerge/automerge-subduction` v0.21.0. Each package is now released and tagged on its own ([#318][sd-318]), which is why the version numbers no longer move together.

- [Alex Good] fixed two Sedimentree sync bugs. Fragment boundaries are kept during minimization ([#325][sd-325]), and they are no longer advertised as held ([#326][sd-326]). In the second bug, a peer could skip sending a commit because it thought the other side already had it.
- `subduction_keyhive` now tracks `keyhive_core` v0.7.0, thanks to [John Mumm] ([#323][sd-323]).
- The Wasm storage API gained `get_head(id)`, and storage errors now carry the backend's original error as their `cause` ([#317][sd-317]).
- On `main` since that release: a relay now waits for upstream fetches before answering, so downstream peers don't wrongly conclude that a document is unavailable ([#334][sd-334]). Metadata that exceeds the wire format's limits now returns an error instead of panicking ([#348][sd-348]).

## 🌱 Around the Ecosystem

### Automerge in Go

[Probo], an open source compliance platform, wrote [a pure-Go implementation of Automerge][probo-1757] to add real-time collaboration to its document editor. The PR reports full V2 wire and state interoperability with the Rust and JS implementations, checked by a differential parity and fuzzing suite that runs against both. It also includes an automerge-repo protocol client and a ProseMirror bridge. A [follow-up PR][probo-1758] wired it into the editor, with the official `@automerge/automerge-repo` client in the browser talking to a Go gateway on the server. Many thanks to [gearnode]!

### A Repo for Python

[`automerge-py`][automerge-py] gained an async `automerge.repo` API that interoperates with the JavaScript `automerge-repo`. Also new are collaborative text, ephemeral messages, authors and commit metadata, read-only sync, and [per-peer share policies][py-share-policy]. It's on `main` and hasn't been released yet.

### Pushwork

[Pushwork] syncs a directory through Automerge, a bit like Git without the merge conflicts. It's also becoming a good way to try Keyhive for real. [chee rabbits][chee]'s work on Subduction and Keyhive support is on npm as [`pushwork@3.0.0-sk.0`][pushwork npm], under the `experimental` tag:

```sh
# Only you can read or write this repo
$ pushwork init --keyhive
INITIALIZED automerge:xtVWLeMLftzvzpw4yA2J4yomix8j

# Anyone with the URL can read, but only you can write
$ pushwork init --keyhive --public-access read
INITIALIZED automerge:zPK4aA9f87Msyb33vBBRRrtWFeZY

# Save collaborators' contact cards under names, then list your contacts
$ pushwork keyhive contacts add alice ./alice-card.json
saved alice (iN8BYtCAVQ+R1MHpcK7KMQPy4dqY3qmvZDLtBoWc1g8=)

$ pushwork keyhive contacts add bob ./bob-card.json
saved bob (6vJtwT8fpanJsZ0TiXIikn9m7CJA29Nc3xxbJv7fNu8=)

$ pushwork keyhive contacts ls
alice  iN8BYtCAVQ+R1MHpcK7KMQPy4dqY3qmvZDLtBoWc1g8=
bob    6vJtwT8fpanJsZ0TiXIikn9m7CJA29Nc3xxbJv7fNu8=

# Share with a contact, see who has access, or take access away
$ pushwork keyhive access alice edit
alice can now edit

$ pushwork keyhive access
you             admin
keyhive server  relay
alice           edit

$ pushwork keyhive access alice none
alice's access revoked
```

By default the server only gets `relay` access: it stores and forwards your documents, but can't read them.

## 🎤 Presentations

### Keyhive at J On The Beach

On October 30, [Brooke Zelenka] gave a talk at [J On The Beach][jotb] in Málaga: [_Keyhive: End-to-end Encrypted Applications_][jotb slides]. It asks what "Signal for documents" would look like, and walks through Keyhive's answer: capabilities that travel inside the data, causal encryption that follows a document's history, BeeKEM group keys without a central server, and sync servers that only ever see ciphertext. The video isn't up yet, but you can [flip through the slides][jotb slides] (some of them are interactive):

<iframe
  style="aspect-ratio: 16 / 9; border: 0; margin-bottom: 3rem;"
  src="https://expede.tngl.io/jotb-2026/"
  title="Keyhive: End-to-end Encrypted Applications (slides)"
  loading="lazy"
  allowfullscreen
></iframe>

# 📬 Get in Touch

Are you building something with Automerge? We'd love to hear about it! Drop us a line in [the Discord][AM Discord]. Knowing how Automerge is used in the wild is how we decide what to build next.

If Automerge is important to your product or organization, consider sponsoring its development: reach out to the team at [hello@inkandswitch.com][I&S email].

---

Until next time 👋

— The Automerge Core Team

<!-- External Links -->

[acurrieclark]: https://github.com/acurrieclark
[Alex Good]: https://github.com/alexjg
[AM call recording]: https://www.youtube.com/watch?v=0rpfOFVDr7g
[AM Discord]: https://discord.gg/zKGe4DCfgR
[AM luma]: https://luma.com/automerge
[am-1581]: https://github.com/automerge/automerge/pull/1581
[am-1595]: https://github.com/automerge/automerge/pull/1595
[am-1597]: https://github.com/automerge/automerge/pull/1597
[am-1608]: https://github.com/automerge/automerge/pull/1608
[am-1630]: https://github.com/automerge/automerge/pull/1630
[aran]: https://github.com/aran
[ARK npm]: https://www.npmjs.com/package/@automerge/automerge-repo-keyhive
[automerge-py]: https://github.com/automerge/automerge-py
[beekem crate]: https://crates.io/crates/beekem
[benchmark battery]: https://github.com/automerge/automerge/tree/main/rust/benchmark-battery
[Brooke Zelenka]: https://github.com/expede
[causal design]: https://github.com/inkandswitch/keyhive/blob/main/design/causal_encryption.md
[chee]: https://github.com/chee
[darcyparker]: https://github.com/darcyparker
[fintan]: https://github.com/FintanH
[gearnode]: https://github.com/gearnode
[I&S email]: mailto:hello@inkandswitch.com
[John Mumm]: https://github.com/jtfmumm
[jotb slides]: https://expede.tngl.io/jotb-2026/
[jotb]: https://www.jonthebeach.com
[keyhive codec]: https://github.com/inkandswitch/keyhive/blob/main/keyhive_codec/src/lib.rs
[keyhive crate]: https://crates.io/crates/keyhive_core
[keyhive notebook]: https://www.inkandswitch.com/keyhive/notebook/
[keyhive npm]: https://www.npmjs.com/package/@keyhive/keyhive
[Keyhive]: https://github.com/inkandswitch/keyhive
[keyline design]: https://github.com/inkandswitch/keyhive/blob/main/design/keyline/README.md
[kh-230]: https://github.com/inkandswitch/keyhive/pull/230
[kh-252]: https://github.com/inkandswitch/keyhive/pull/252
[kh-256]: https://github.com/inkandswitch/keyhive/pull/256
[kh-262]: https://github.com/inkandswitch/keyhive/pull/262
[kh-263]: https://github.com/inkandswitch/keyhive/pull/263
[kh-288]: https://github.com/inkandswitch/keyhive/pull/288
[kh-293]: https://github.com/inkandswitch/keyhive/pull/293
[kh-295]: https://github.com/inkandswitch/keyhive/pull/295
[kh-296]: https://github.com/inkandswitch/keyhive/pull/296
[kh-297]: https://github.com/inkandswitch/keyhive/pull/297
[kh-299]: https://github.com/inkandswitch/keyhive/pull/299
[kh-302]: https://github.com/inkandswitch/keyhive/pull/302
[kh-303]: https://github.com/inkandswitch/keyhive/pull/303
[kh-305]: https://github.com/inkandswitch/keyhive/pull/305
[kh-306]: https://github.com/inkandswitch/keyhive/pull/306
[kh-309]: https://github.com/inkandswitch/keyhive/pull/309
[kh-310]: https://github.com/inkandswitch/keyhive/pull/310
[kh-311]: https://github.com/inkandswitch/keyhive/pull/311
[kh-313]: https://github.com/inkandswitch/keyhive/pull/313
[kh-317]: https://github.com/inkandswitch/keyhive/pull/317
[kh-322]: https://github.com/inkandswitch/keyhive/pull/322
[kh-323]: https://github.com/inkandswitch/keyhive/pull/323
[probo-1757]: https://github.com/getprobo/probo/pull/1757
[probo-1758]: https://github.com/getprobo/probo/pull/1758
[Probo]: https://github.com/getprobo/probo
[pushwork npm]: https://www.npmjs.com/package/pushwork
[Pushwork]: https://github.com/inkandswitch/pushwork
[py-share-policy]: https://github.com/automerge/automerge-py/blob/main/docs/share-policy.md
[repo releases]: https://github.com/automerge/automerge-repo/releases
[repo-756]: https://github.com/automerge/automerge-repo/pull/756
[repo-758]: https://github.com/automerge/automerge-repo/pull/758
[repo-773]: https://github.com/automerge/automerge-repo/pull/773
[repo-774]: https://github.com/automerge/automerge-repo/pull/774
[sd-317]: https://github.com/inkandswitch/subduction/pull/317
[sd-318]: https://github.com/inkandswitch/subduction/pull/318
[sd-323]: https://github.com/inkandswitch/subduction/pull/323
[sd-325]: https://github.com/inkandswitch/subduction/pull/325
[sd-326]: https://github.com/inkandswitch/subduction/pull/326
[sd-334]: https://github.com/inkandswitch/subduction/pull/334
[sd-348]: https://github.com/inkandswitch/subduction/pull/348
[September post]: /blog/2026-september/
[subduction npm]: https://www.npmjs.com/package/@automerge/subduction
[Subduction]: https://github.com/inkandswitch/subduction
[UCAN]: https://ucan.xyz
[wahaj18]: https://github.com/Wahaj18
