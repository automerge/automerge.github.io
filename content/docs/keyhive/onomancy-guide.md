---
title: Onomancy Names API Guide
template: docs
---

<div class="note">

Onomancy is highly experimental, and `@inkandswitch/onomancy` is at `0.1.0`. Wire formats, specifications, and every interface below change without notice. The keyhive-react and Keyhive TODO demo integrations described at the end are **in progress**, not shipped.

</div>

[Onomancy](https://github.com/inkandswitch/onomancy) is a local-first _name system_. It gives Automerge documents human-meaningful names that resolve offline: petnames you assign yourself, doc anchors that are just Automerge URLs, and DNSSEC-rooted global names that verify from the IANA root key without trusting any resolver, certificate authority, or server.

`@inkandswitch/onomancy` is the Wasm/JavaScript binding for `onomancer`, the reference implementation. This guide covers:

- the name grammar and the `Name` parser
- namestores, edges, and the resolution walk
- live DNSSEC resolution in the browser
- using [ARK](/docs/keyhive/ark-api-guide/) documents as the substrate
- where the keyhive-react and TODO demo integration currently stands

For the normative protocol, see [`specs/`](https://github.com/inkandswitch/onomancy/tree/main/specs); for why the design is shaped this way, see [`design/`](https://github.com/inkandswitch/onomancy/tree/main/design).

## Concepts

- **Edgename.** A name is a _trust anchor_ followed by path segments, where each segment matches an edge in a namestore and every matched edge lands in another namestore. Names are relative walks, not global lookups.
- **Anchor.** One of three, discriminated entirely by the leading token. Parsers never fall back between families, which is what makes the spellings unphishable.

  | Spelling                | Anchor kind | Rooted in                                           | Shareable |
  | ----------------------- | ----------- | --------------------------------------------------- | --------- |
  | `automerge:3RFyJz…/foo` | `doc`       | the Automerge URL itself (an ed25519 verifying key) | yes       |
  | `~/bob/pics`            | `local`     | _your_ root document                                | no        |
  | `@expede.wtf/foo`       | `dns`       | a DNSSEC chain from the IANA root KSK               | yes       |

- **Namestore.** A flat string-keyed map living at a reserved key (currently `onomancy`, provisional) inside an ordinary Automerge document. Keys are paths (`"team/john"`); values are bare references to other documents. Namestores are flat by specification: multi-segment reach uses multi-segment _keys_, never nesting.
- **The walk.** Resolution does a greedy longest-key match, consumes those segments, hops to the target document, and repeats. It never backtracks and never follows a name inside a value — there are no symlinks, which is what makes termination structural rather than a hop limit.
- **Partial is normal.** A walk that reaches a document you have not synced yet returns `partial`, not an error. Under partition, unavailable is not wrong.
- **Authority grade.** Every resolved verdict carries how much was actually checked: `trusted-substrate` (nothing verified beyond what the substrate enforced) or `carriage-verified` (the Keyhive delegation chain replayed and checked). Content authorship is not yet checkable — see [Verification status](#verification-status).

## Installation

```bash
pnpm add @inkandswitch/onomancy
```

The package ships browser, Node, bundler, and workerd entrypoints, with the Wasm module embedded. A `./slim` export is available when you want to supply the Wasm yourself, and `./wasm` / `./wasm-base64` expose the module directly.

## Wasm initialization

The default entrypoints initialize the module on import. Call `setup()` once to install the panic hook so Rust panics surface as readable console errors:

```ts
import { setup } from "@inkandswitch/onomancy"

setup()
```

## Names

`Name` parses a raw string into a structured value. There is no string name downstream of the parser: parse, don't validate.

```ts
import { Name } from "@inkandswitch/onomancy"

const name = new Name("@brooklynzelenka.com/team/john")

name.value // "@brooklynzelenka.com/team/john" (canonical form)
name.anchorKind // "dns" | "local" | "doc"
name.anchor // "@brooklynzelenka.com"
name.segments // ["team", "john"]
```

The constructor throws on a missing sigil, a malformed anchor, or an invalid segment. Segments may not be empty, `.`, `..`, or contain `/` or `#`. A doc anchor whose bs58check payload fails its checksum is a parse error, so transcription typos fail loudly instead of denoting some other valid key. A legacy 16-byte Automerge document ID is rejected with a distinct error: it is a valid Automerge URL, but it is not self-certifying, so it cannot anchor a name.

Names carry no version pins. `#` is reserved everywhere it could appear, and every namestore in a walk is read live.

## Held documents

`HeldDocuments` is an in-memory document set: the replication substrate reduced to "documents this tab happens to have". It drives the real `onomancy_protocol` resolver over the real `onomancy_automerge` adapter, so it is production code with a toy substrate, not a mock.

```ts
import { HeldDocuments } from "@inkandswitch/onomancy"

const held = new HeldDocuments()

const root = held.createDocument() // mint under a fresh self-certifying anchor
const team = held.createDocument()
const john = held.createDocument()

held.bind(root, "team", team) // an edge: root names `team`
held.bind(team, "john", john)
held.setNote(john, "John's document")

held.anchors // every held anchor, sorted
held.edges(root) // [{ path: "team", target: "automerge:…" }]
```

| Method                                   | Meaning                                                                                                                       |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `createDocument()`                       | Mint a fresh document under a fresh anchor. Returns the `automerge:…` anchor.                                                 |
| `holdAt(anchor)`                         | Hold an empty stand-in at a caller-supplied anchor. Never clobbers a real document.                                           |
| `hold(anchor, bytes)`                    | Hold a real document's saved bytes at its anchor — replication by hand (file drop, HTTP fetch, AirDrop). Replaces a stand-in. |
| `save(anchor)`                           | The held document's saved bytes, for carrying elsewhere.                                                                      |
| `anchors`                                | Every held anchor, sorted.                                                                                                    |
| `bind(anchor, path, target)`             | Write a namestore edge.                                                                                                       |
| `edges(anchor)`                          | `[{ path, target }]` for one document.                                                                                        |
| `setNote(anchor, note)` / `note(anchor)` | A display note on the document root.                                                                                          |
| `resolve(name, root?, dohUrl?)`          | Walk a full name across the held documents.                                                                                   |

### Resolving

```ts
const verdict = await held.resolve(`${root}/team/john`)
// { status: "resolved", authority: "trusted-substrate", document: "automerge:…", note: "John's document" }
```

`~` names need the root document to resolve from, since the anchor is _you_:

```ts
await held.resolve("~/bob/pics", myRootAnchor)
```

`@hostname` names anchor live: the DNSSEC chain is fetched over DNS-over-HTTPS, validated from the IANA anchors baked into the Wasm, and the zone's attested document becomes the walk's root. Pass a third argument to use a DoH endpoint other than Cloudflare.

```ts
await held.resolve("@brooklynzelenka.com/team/john", undefined, "https://dns.google/dns-query")
```

### Verdicts

A verdict is one of two shapes:

```ts
// Resolved
{ status: "resolved", authority: "trusted-substrate" | "carriage-verified",
  warning: string, document: "automerge:…", note?: string }

// Partial
{ status: "partial", consumed: number, total: number,
  reason: "dangling segment" | "unsynced target", target?: "automerge:…" }
```

`dangling segment` means no key matched: the name is wrong, or the edge was never written. `unsynced target` means the walk knows exactly which document it needs and does not have it — hold a replica (`holdAt`, or fetch and `hold` the bytes) and retry. An unheld _root_ is the same partial as any other unsynced hop, with `consumed: 0`.

`resolve` only rejects for unparsable names, a missing `root` on a `~` name, and live-anchoring failures.

## Live DNSSEC resolution

`resolveHostname` is the one-call verifier, independent of any documents: fetch the chain over DoH, validate it from the baked-in IANA anchors, and grade its freshness against the current clock.

```ts
import { resolveHostname } from "@inkandswitch/onomancy"

await resolveHostname("brooklynzelenka.com")
// { hostname: "brooklynzelenka.com", links: 6, freshness: "fresh", records: ["v=ONO0;…"] }
```

Pass the bare hostname, without the `@` sigil. `freshness` is `"fresh"`, `"stale"`, or `"deferred"` (the validity window has not begun). The transport is untrusted by construction — it is a byte courier, and all validation happens locally against anchors compiled into the Wasm. This works in windows, workers, and Node 18+ alike.

## Using ARK documents as the substrate

Onomancy and [ARK](/docs/keyhive/ark-api-guide/) name documents identically, by construction: a Keyhive document ID _is_ an ed25519 verifying key, and its `automerge:…` URL parses verbatim as an Onomancy doc anchor.

```
  DNS zone (DNSSEC-signed)                Keyhive document
    TXT _onomancy.<host>                    doc ID = ed25519 verifying key
      n=serial g=generation p=doc-id                │
           │  verified from IANA root               │  delegation graph
           ▼                                        │  (verification: partial)
    Onomancy certificate  ──────────────────────────┘
           │
           ▼
    root namestore ──"team"──▶ namestore ──"john"──▶ John's document
```

A working spike lives at [`onomancy_wasm/demo-ark`](https://github.com/inkandswitch/onomancy/tree/main/onomancy_wasm/demo-ark). Its shape:

```ts
import "@automerge/automerge-subduction" // Node: initSync on the shared Wasm module
import { initializeAutomergeRepoKeyhive } from "@automerge/automerge-repo-keyhive"
import { ImmutableString } from "@automerge/automerge"
import { Repo } from "@automerge/automerge-repo"

const { hive, repo } = await initializeAutomergeRepoKeyhive({
  createRepo: (config) => new Repo(config),
  storage: new MemoryStorage(),
  peerIdSuffix: "onomancy",
  syncServer: "none",
  repo: { storage: new MemoryStorage(), subductionWebsocketEndpoints: [] },
})

const john = await repo.create2({ note: "hi from ARK 🐝" })
const root = await repo.create2({})

// A namestore edge, written by hand into the reserved key.
await root.change((doc) => {
  doc.onomancy = { "team/john": new ImmutableString(john.url) }
})
```

Extract the bytes and walk them with the real resolver:

```ts
import * as A from "@automerge/automerge"

held.hold(root.url, A.save(await root.doc()))
held.hold(john.url, A.save(await john.doc()))

const verdict = await held.resolve(`${root.url}/team/john`)
verdict.document === john.url // true
```

### Bridge notes

Three things that are easy to get wrong, all found the hard way:

- **Use `repo.create2`.** It routes through ARK's `idFactory`, so the document gets a Keyhive document ID. `repo.create` silently produces an unprotected document whose ID is not a verifying key, and therefore not an anchor.
- **Namestore values must be atomic.** Automerge JS strings are collaborative `Text` by default, and concurrent character-level merges could splice two anchors into garbage. The resolution spec makes composite and non-atomic values non-resolving, so JS writers must use `new ImmutableString(url)`. A `writeEdge(handle, path, target)` helper belongs in the package so this cannot be gotten wrong; it does not exist yet.
- **Pin one copy of `@automerge/automerge-repo`.** ARK rides a `-subduction.*` lineage; a second copy from the main line breaks `repo.subduction`.

Under Node, import `@automerge/automerge-subduction` (not `/slim`) before ARK, so its node entrypoint runs `initSync` on the shared Wasm module.

## Verification status

Onomancy grades what it actually checked, and today that grade is honest about a gap. ARK enforces membership on _sync_, but nothing yet verifies the bytes a resolver extracts from a document, so ARK-substrate walks grade `trusted-substrate` and the verdict carries a `warning` saying so. The grade rises to full verification when a verifier can check that every operation's author lies on the delegation path from the document root — either through signed Automerge operations or through inherited verified ingest. The seam for that already exists in the protocol.

Several coordination questions between Onomancy and Keyhive are open, and they gate the interesting integrations. They are written up in [`design/keyhive-coordination.md`](https://github.com/inkandswitch/onomancy/blob/main/design/keyhive-coordination.md):

| Question                                    | Blocks                                                                 |
| ------------------------------------------- | ---------------------------------------------------------------------- |
| Public, world-readable documents under ARK  | Strangers resolving through a namestore at all                         |
| A pure bytes-in delegation verification API | In-browser authority verification without a throwaway Keyhive instance |
| `Signed<Delegation>` encoding stability     | Certificates and statements still verifying in ten years               |
| Signed operations and what ingest exposes   | Upgrading `carriage-verified` to full verification                     |

## Integrating with keyhive-react

<div class="note">

This section describes work in progress. Nothing here ships in `@automerge/keyhive-react` today.

</div>

[`@automerge/keyhive-react`](https://github.com/inkandswitch/keyhive-react) already has the seam Onomancy plugs into. Its components never look a peer up directly; they ask the `NameDirectory` in scope, and a directory declares its own limits so the UI can tell the truth about them:

```ts
interface NameDirectory {
  readonly source: string
  readonly trust: "unverified" | "verified"
  readonly writable: boolean
  readonly enumerable: boolean
  readonly notice?: string

  lookup(id: string): DirectoryEntry | undefined
  list(): DirectoryEntry[]
  publish?(entry: DirectoryEntry): Promise<void> | void
  subscribe?(listener: () => void): () => void
}
```

The [Keyhive TODO demo](https://github.com/inkandswitch/keyhive-todo-app-demo) currently supplies `createAutomergeDocDirectory`, backed by a "phonebook": one unencrypted shared document that every peer writes its own name and avatar into. It is `trust: "unverified"`, and it says so in the UI, because anyone holding the document ID can edit any entry. It is a placeholder, and it was always meant to be one.

Onomancy replaces it with a directory whose entries are _resolved_ rather than asserted:

```
  AccessEditor / ContactBook / AccountView
              │  useDirectoryEntry(id)
              ▼
        DirectoryProvider
              │
   ┌──────────┴───────────┐
   │                      │
 phonebook           onomancy directory
 (today)             (in progress)
 unverified          per-entry: petname · verified · diverged
 one shared doc      the walk, over ARK documents
```

The pieces already in place:

- Doc-ID alignment between Keyhive and Onomancy — proven by the spike, no adapter needed.
- Namestore edges written and read through an ARK repo.
- The resolution walk over those documents, in the browser, from the real protocol crates.
- A directory abstraction in keyhive-react that the components already route through.

The pieces still missing:

- A `NameDirectory` implementation over the walk, mapping Keyhive identifiers to resolved names.
- The binding cache, which is where verified DNS bindings and introduction provenance belong. They must not go into the petname store: that document is signed by _you_, and writing "expede.wtf is key K" under your own signature is an attestation you have no basis to make.
- Per-entry status in the UI. A verified badge must be computed from the cache, never inferred from a label's spelling. One QR scan can plant `~/wellsfargo.com`, and the only honest thing an interface can say about that label is what the cache knows.
- Public documents under ARK, so a stranger can resolve through a namestore at all.

Until then, the demo keeps the phonebook and its notice.

## Troubleshooting

| Symptom                                          | Cause                                                                                              |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `Name` constructor throws on a valid-looking URL | A 16-byte legacy Automerge document ID, or a failed bs58check checksum. Neither can anchor a name. |
| Every walk returns `partial` with `consumed: 0`  | The root document is not held. `holdAt` a stand-in or `hold` its real bytes.                       |
| An edge written from JS never matches            | The value is `Text`, not `ImmutableString`. Non-atomic values do not resolve, by design.           |
| `repo.subduction` is undefined                   | Two copies of `@automerge/automerge-repo`. Pin ARK's `-subduction.*` lineage.                      |
| Verdicts say "nothing checked — dev bridge"      | Expected: `trusted-substrate` is the honest grade until verified ingest lands.                     |

## Further reading

- [Onomancy repository](https://github.com/inkandswitch/onomancy) — specifications, design notes, and the `onomancer` agent
- [Path resolution specification](https://github.com/inkandswitch/onomancy/blob/main/specs/path-resolution.md) — the walk, greedy matching, and termination
- [Name grammar specification](https://github.com/inkandswitch/onomancy/blob/main/specs/name-grammar.md) — anchors, segments, and disjointness
- [Petname anchoring](https://github.com/inkandswitch/onomancy/blob/main/specs/anchoring/petname-anchor.md) — why `~` names never hit the wire
- [ARK API Guide](/docs/keyhive/ark-api-guide/) — the access control and encryption layer underneath
