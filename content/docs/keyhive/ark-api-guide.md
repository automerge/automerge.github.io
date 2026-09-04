---
title: Automerge Repo Keyhive (ARK) API Guide
template: docs
---

<div class="note">

Keyhive is still in development, and `@automerge/automerge-repo-keyhive` is still in alpha. This guide describes the API in its current form but details will change.

</div>

`@automerge/automerge-repo-keyhive` (ARK) adds access control and end-to-end
encryption to [automerge-repo](https://github.com/automerge/automerge-repo)
using the [keyhive](https://github.com/inkandswitch/keyhive) protocol. This
guide covers the API most applications need:

* initialization
* identity
* keyhive-protected document creation
* delegation and revocation
* access-level queries
* synca
* some lower-level pieces you may need for custom setups.

It is written for use with the default [subduction](https://github.com/inkandswitch/subduction) configuration and notes where the legacy `automerge-repo` `NetworkAdapter` configuration differs.

For an example application using ARK, see the [keyhive TODO demo](https://github.com/inkandswitch/keyhive-todo-app-demo).

## Concepts

- **Keyhive identity.** Each ARK instance holds an Ed25519 key pair. The public
  key is your keyhive identity. The key pair is created on first run and
  persisted to the storage adapter you provide, so the same identity is loaded
  on subsequent runs.
- **Contact card.** A signed, portable representation of an identity. Users
  exchange contact cards (as JSON strings) so they can grant each other access
  to documents.
- **Access levels.** Every document has members, and each member has one of
  four levels: `relay` (sync bytes but no read access), `read`, `edit`,
  and `admin`. If access is granted to a special "public" member, everyone has
  that access level.
- **Peer id.** ARK peer ids are the base64-encoded verifying key, optionally
  followed by `-<suffix>`. The suffix lets several peers (for example, several
  browser tabs) share one keyhive identity while remaining distinct peers on
  the network.

## Installation

```bash
pnpm add @automerge/automerge-repo-keyhive
```

The package bundles the keyhive WASM module (base64-inlined), so no extra
asset configuration is needed for keyhive itself.

## WASM initialization

The init functions initialize the keyhive WASM module automatically. If you
use keyhive WASM types (for example, `ContactCard` or `Access`) before
initializing a hive, call `initKeyhiveWasm()` first. It is idempotent. But
it's generally expected you will initialize a hive first instead.

```ts
import { initKeyhiveWasm } from "@automerge/automerge-repo-keyhive";

initKeyhiveWasm();
```

`isWasmInitialized()` reports whether initialization has happened.

### Initialization

```ts
import { initializeAutomergeRepoKeyhive } from "@automerge/automerge-repo-keyhive";
import { Repo } from "@automerge/automerge-repo";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";

const { hive, repo } = await initializeAutomergeRepoKeyhive({
  createRepo: (config) => new Repo(config),
  storage: new IndexedDBStorageAdapter("my-app-keyhive"),
  peerIdSuffix: "my-app",
  syncServer: "subduction",
  repo: {
    storage: new IndexedDBStorageAdapter(),
    subductionWebsocketEndpoints: ["wss://your-sync-server.example.com"],
    enableRemoteHeadsGossiping: true,
  },
});
```

The initialization function returns `{ hive, repo }` where `hive` is an
`AutomergeRepoKeyhive` and `repo` is a normal automerge-repo `Repo`.
It injects the following into the repo config for you: `signer` (so
subduction and keyhive sign as the same peer), `peerId`, `idFactory` (so new
documents get keyhive-backed document ids), and `subductionBlobInterceptor`
(which encrypts and decrypts document data). It also wires keyhive membership
changes to `repo.shareConfigChanged()`.

Note: `peerIdSuffix` is a readability label. ARK appends a random component
itself, so peers sharing an identity (for example, several tabs) never
collide, even with the same label.

### Initialization options

| Option | Default | Meaning |
| --- | --- | --- |
| `storage` | required | `StorageAdapterInterface` for keyhive state (key pair, archives, events, secrets). Usually a separate database from the repo's document storage. |
| `peerIdSuffix` | required | A label appended to the identity-derived peer id as `-<label>-<random>`. ARK adds the random component itself, so a plain app name is fine. |
| `keyPair` | generated | Supply an existing extractable Ed25519 `CryptoKeyPair` instead of loading or generating one. |
| `syncServer` | required | Which sync server to register as a relay: `"subduction"`, `"keyhive"`, a custom `SyncServerIdentity`, or `"none"`. See "Sync servers" below. `"none"` for the subduction configuration requires an explicit `remotePeerId`, since that path syncs against a single remote. |
| `automaticArchiveIngestion` | `true` | On keyhive changes, automatically persist state and schedule an outbound keyhive sync. |
| `cachingMode` | `"none"` (adapter path), `"periodic"` (subduction configuration) | Event cache strategy for the sync protocol: `"none"` or `"periodic"`. `"periodic"` caches sync state and refreshes it on the `syncRequestInterval` timer. |
| `periodicallyRequestSync` | `true` | Request keyhive sync from peers on an interval. |
| `syncRequestInterval` | `2000` (ms) | Interval for periodic sync requests (and periodic cache refresh). |
| `createRepo` | required | Function that constructs the `Repo` from a `RepoConfig`. Usually `(config) => new Repo(config)`. |
| `repo` | none | Extra `RepoConfig` fields (storage, endpoints, and so on). The hive-derived fields are injected and cannot be overridden. |
| `shareConfigDebounceMs` | `2000` | Debounce for propagating keyhive membership changes to `repo.shareConfigChanged()`. |
| `onBeforeShareConfigChanged` | none | Called immediately before each (debounced) `repo.shareConfigChanged()`. |
| `remotePeerId` | from `syncServer` | Override the sync server peer id. |

## Creating documents

Create documents with `repo.create2`, which routes through the `idFactory` the
init function installed. This ensures the document gets a keyhive document id and is
encrypted:

```ts
const handle = await repo.create2({ title: "hello" });
await hive.addSyncServerRelayToDoc(handle.url);
```

`repo.create` bypasses the id factory and silently creates an unprotected
document, with no access control or encryption. Use `isUnprotectedDoc(url)`
to check for this property.

## The hive object

There are two hive types:

- `AutomergeRepoKeyhive`, from `initializeAutomergeRepoKeyhive`, syncs over
  subduction against a single remote.
- `LegacyAutomergeRepoKeyhive`, from `initializeLegacyAutomergeRepoKeyhive`,
  syncs over an automerge-repo `NetworkAdapter` and can talk to many peers.

Both extend `AutomergeRepoKeyhiveBase`. Code that only needs membership and
access queries should check against the base class type so it works with either.

On the shared `AutomergeRepoKeyhiveBase`:

- `hive.active`: the local identity.
- `hive.keyhive`: the underlying `Keyhive` WASM instance, for operations not
  wrapped by ARK.
- `hive.keyhiveStorage`: the `KeyhiveStorage` wrapper that persists keyhive
  state.
- `hive.emitter`: a `KeyhiveEventEmitter` that emits `"update"` with a keyhive
  `Event` whenever keyhive state changes, and `"encrypt"` when the blob
  interceptor encrypts document data.
- `hive.peerId`: the peer id to give the repo. It includes the
  `-<peerIdSuffix>-<random>` suffix, so it is per-session. For a durable identity
  string use `verifyingKeyPeerIdWithoutSuffix(hive.peerId)`, which is the bare
  verifying key and stable for the life of the key pair, or
  `hive.active.individual.id` for the keyhive identifier.
- `hive.idFactory`: the id factory the init function passed to the repo, so
  new documents get keyhive document ids.
- `hive.createKeyhiveNetworkAdapter(adapter, options?)`: wraps an additional
  raw network adapter. See "Wrapping additional network adapters" below.
- `hive.close()`: stop timers, remove all emitter listeners, and disconnect
  the network adapter. Call on teardown. The hive is unusable afterwards.

On `AutomergeRepoKeyhive` (the subduction configuration):

- `hive.blobInterceptor`: the `KeyhiveBlobInterceptor` that encrypts and
  decrypts document blobs. The init function passes it to the repo.
- `hive.notifySameAgentKeyhiveChange()`: signal a keyhive change made by
  another instance of this same identity (for example, another tab), so the
  repo re-evaluates share configuration.
- `hive.networkAdapter`: a `KeyhiveSubductionAdapter`, which drives keyhive
  sync against the single configured remote.

On `LegacyAutomergeRepoKeyhive`:

- `hive.syncServer`: the resolved `SyncServer`, or `null` when initialized
  with `syncServer: "none"`.
- `hive.buildServerSubductionPolicy()`: see "Running a sync server" below.
- `hive.networkAdapter`: a `KeyhiveNetworkAdapter`, which drives keyhive sync
  across every peer on the wrapped adapter.

## Identity and contact cards

Your own contact card, ready to share:

```ts
const json = hive.active.contactCard.toJson();
```

Receiving someone else's card registers them with your keyhive so you can
grant them access:

```ts
import { ContactCard } from "@automerge/automerge-repo-keyhive";

const card = ContactCard.fromJson(pastedJson);
const individual = await hive.receiveContactCard(card);
```

## Membership and access

All membership and access methods take the document's `AutomergeUrl` (the
`automerge:...` string used with `repo.find`).

Unprotected (pre-keyhive) documents have no keyhive state. Use
`isUnprotectedDoc(url)` to detect them. Access queries return `undefined` (or an
empty list) for unprotected documents, and membership operations throw an
`UnprotectedDocError`:

```ts
import { isUnprotectedDoc } from "@automerge/automerge-repo-keyhive";

if (!isUnprotectedDoc(docUrl)) {
  const access = await hive.bestAccessForDoc(id, docUrl);
  // gate the UI on access
}
```

### Access levels

```ts
import { Access } from "@automerge/automerge-repo-keyhive";

// Constants
const access = Access.edit(); // also Access.relay(), Access.read(), Access.admin()

// Parsing (case-insensitive. Throws on unrecognized input)
const parsed = Access.fromString("edit");
```

`Access` values are ordered (`relay < read < edit < admin`) and comparable:

```ts
access.atLeast(Access.read()); // true for read, edit, and admin
access.compareTo(other);       // -1 | 0 | 1
access.equals(other);
access.level;                  // 0..3, for sorting
access.isReader;               // read or higher
access.isEditor;               // edit or higher
```

These are WASM-backed values. Every WASM call returns a distinct instance, so compare
with equals() rather than ===, and do not use them as React dependencies or Map/Set
keys.

`access.toString()` returns the capitalized form: `"Relay"`, `"Read"`,
`"Edit"`, or `"Admin"`.

`Access.tryFromString` also exists and returns `undefined` instead of
throwing.

All membership mutations (`addMemberToDoc`, `revokeMemberFromDoc`,
`setPublicAccess`, `addSyncServerRelayToDoc`) throw on failure: on unprotected
documents (`UnprotectedDocError`), on documents keyhive does not know yet, and on
unresolvable members. Wrap them in try/catch where failure is expected.

### Add a member

```ts
const card = ContactCard.fromJson(memberContactCardJson);
await hive.addMemberToDoc(docUrl, card, Access.edit());
```

For the subduction configuration, adding any member also rotates the document key and
writes a small "nudge" edit so the new member can decrypt prior history. The
edit sets a timestamp on a namespaced field at the document root:
`__automerge-repo-keyhive__last-added-member-ts`. Applications that iterate
document keys should skip it, and can import `NUDGE_FIELD` rather than hardcoding
the string.

The rotation fires for every member this agent adds and is debounced after
`shareConfigDebounceMs`.

### Revoke a member

```ts
// Pass an Identifier or the string id from a listMembers entry.
await hive.revokeMemberFromDoc(docUrl, member.id);
```

### List members

`listMembers` returns one entry per member:

```ts
const members = await hive.listMembers(docUrl);
// [{ id, access, isSelf, isPublic, isSyncServer }, ...]

for (const member of members) {
  console.log(member.id, member.access.toString(), member.isSelf);
}
```

`id` is a string key (hex-encoded identifier bytes) suitable for
list rendering and for `revokeMemberFromDoc`. `access` is an ordered
`Access` value, so member rows can be compared with `atLeast` or sorted by
`level`. The raw keyhive capabilities remain available via
`docMemberCapabilities(docUrl)`.

### Public access

Public access is a grant to a special "public" member:

```ts
// Make a document publicly editable
await hive.setPublicAccess(docUrl, Access.edit());

// Check public access
const access = await hive.getPublicAccess(docUrl); // Access | undefined

// Revoke public access
import { Identifier, uint8ArrayToHex } from "@automerge/automerge-repo-keyhive";
await hive.revokeMemberFromDoc(
  docUrl,
  uint8ArrayToHex(Identifier.publicId().toBytes())
);
```

### Grant the sync server relay access

A sync server needs at least `relay` access to a document to sync it. Relay
access lets it move ciphertext without being able to read the document:

```ts
await hive.addSyncServerRelayToDoc(docUrl);
```

### Groups

`generateGroup` creates a keyhive group and grants the sync server relay
access to it, so the server can relay the group to its members:

```ts
const group = await hive.generateGroup();
```

Grant the group access to a document through `hive.keyhive`:

```ts
import { docIdFromAutomergeUrl } from "@automerge/automerge-repo-keyhive";

const doc = await hive.keyhive.getDocument(docIdFromAutomergeUrl(docUrl));
if (doc) {
  await hive.keyhive.addMember(
    group.toAgent(),
    doc.toMembered(),
    Access.edit(),
    []
  );
}
```

Everyone in the group then holds `edit` on the document, and adding someone to
the group later grants it to them too.

### Query access

```ts
// A specific agent's direct access
const access = await hive.accessForDoc(identifier, docUrl);

// The higher of direct and public access
const best = await hive.bestAccessForDoc(hive.active.individual.id, docUrl);

// All members and their capabilities
const memberships = await hive.docMemberCapabilities(docUrl);
```

All three return `undefined` or an empty list for unprotected documents.

### Keyhive statistics

```ts
const stats = await hive.stats();
```

## Sync servers

ARK registers a sync server identity as a relay during initialization,
selected via the `syncServer` option. The option is required and has no
default: the identity must match the server the repo actually connects to,
and a mismatched pair fails silently (relay grants and keyhive sync target a
peer that never connects). There is no value that is right by default, so
ARK makes you choose rather than guessing and warning.

Two identities ship with the library, selected by name:

- `"subduction"`: `subduction.sync.inkandswitch.com`
- `"keyhive"`: `keyhive.sync.automerge.org`

To use your own server, pass a `SyncServerIdentity`:

```ts
const { hive, repo } = await initializeAutomergeRepoKeyhive({
  // ...
  syncServer: {
    contactCardJson: myServerContactCardJson,
    peerId: myServerPeerId,
  },
});
```

The card and peer id must belong to the same server. The raw pairs are also
exported as `SUBDUCTION_SYNC_SERVER_CONTACT_CARD_JSON` /
`SUBDUCTION_SYNC_SERVER_PEER_ID` and `KEYHIVE_SYNC_SERVER_CONTACT_CARD_JSON` /
`KEYHIVE_SYNC_SERVER_PEER_ID`.

## Wrapping additional network adapters

If you add network adapters after initialization (for example, MessageChannel
adapters for tabs connecting to a shared worker), wrap each one so its
traffic is signed and verified:

```ts
const keyhiveAdapter = hive.createKeyhiveNetworkAdapter(rawAdapter);

repo.networkSubsystem.addNetworkAdapter(keyhiveAdapter);
```

`WrapNetworkAdapterOptions` does not inherit the options you initialized the
hive with, and its defaults are not the initialization defaults:

| Option | at initialization | when wrapping |
| --- | --- | --- |
| `periodicallyRequestSync` | `true` | `false` |
| `syncRequestInterval` | `2000` | `2000` |
| `onlyShareWithSyncServer` | `false` | `false` |
| `archiveThreshold` | `200` (legacy path only) | inherits the init value on the legacy path; fixed at `200` for the subduction configuration |
| `cachingMode` | `"none"` / `"periodic"` | inherited; not settable per-adapter |

So the call above, with no options, produces an adapter that never
periodically requests keyhive sync, even on a hive that does. Pass
`periodicallyRequestSync: true` explicitly if you want it.

## Keyhive sync

Keyhive state (memberships, key rotations, contact cards) syncs over its own
protocol, separate from document sync. Both adapter types offer these
controls:

- `hive.networkAdapter.syncKeyhive()`: request a sync now.
- `hive.networkAdapter.invalidateCaches()`: force the next sync to recompute
  from current keyhive state. ARK calls this internally when state changes.
- `hive.networkAdapter.whenReady()`: resolves when the transport is
  connected.
- `hive.networkAdapter.disconnect()`: stop timers and disconnect.
- `periodicallyRequestSync` and `syncRequestInterval` (init options) control
  background sync.

`hive.emitter.on("update", (event) => ...)` fires for every keyhive event and
is the hook for reacting to membership changes in your UI.

## Running a sync server

A JS sync server built on subduction can enforce keyhive access control with
`hive.buildServerSubductionPolicy()`. The returned `SubductionPolicy` allows all
connections, requires `relay` access to fetch a document, and requires `edit` access
to push changes. Unprotected (pre-keyhive) document ids bypass the checks.

## Logging

The library is quiet by default: only warnings and errors are printed. To
see informational or debug output while diagnosing an issue:

```ts
import { setKeyhiveLogLevel } from "@automerge/automerge-repo-keyhive";

setKeyhiveLogLevel("debug"); // "silent" | "error" | "warn" | "info" | "debug"
```

## Utilities

- `isUnprotectedDoc(url)`: true if the URL refers to an unprotected (non-keyhive)
  document. Throws only if the URL itself is malformed. This is the supported
  way to distinguish keyhive documents from unprotected ones.
- `UnprotectedDocError`: thrown by membership operations when the target is an
  unprotected document.
- `uint8ArrayToHex(bytes)`: hex-encode bytes (member ids, hashes).
- `peerIdFromSigner(signer, suffix?)`: derive a peer id from a keyhive
  signer.
- `verifyingKeyPeerIdWithoutSuffix(peerId)`: strip the `-suffix` portion of a
  peer id, leaving the base64 verifying key.

## Re-exported keyhive types

The package re-exports the full `@keyhive/keyhive/slim` API, so you rarely
need a direct dependency on the keyhive package. The types you will most
often use are `ContactCard`, `Access`, `Identifier`, `DocumentId`,
`Individual`, `Membership`, `Event`, `Signer`, and `Keyhive` itself.

## Storage layout

ARK persists the following under the storage adapter you pass at
initialization (all namespaced under the `keyhive-db` key, except the key
pair):

- `active-key-pair-2`: the identity key pair (JWK JSON).
- `keyhive-db/archives/...`: compacted keyhive archives.
- `keyhive-db/ops/...`: individual keyhive events, content-addressed.
- `keyhive-db/prekey-secrets`: exported prekey secrets.
- `keyhive-db/leaf-secrets/...`: rotated document key secrets, so sibling
  instances of the same identity can decrypt.

Multiple instances of the same identity (for example, several tabs sharing a
shared worker identity) may share this storage.

Because the key pair lives in this storage, clearing it destroys the
identity. There is currently no key backup or recovery mechanism. Treat the
storage database accordingly.
