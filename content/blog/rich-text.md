---
# The bare colon is perfectly fine in this build system, even if syntax highlighters hate it :)
title: Automerge 2.2: Rich Text
description: Realtime and asynchronous editing of rich text including inline formatting, block elements, and more.
date: 2024-04-06
template: blog
---

We are delighted to announce the release of rich text support in Automerge, including a fully supported ProseMirror binding as the initial reference implementation. This means that you can now build collaborative applications on Automerge with realtime and asynchronous editing of rich text including inline formatting, block elements, and more.

If you want to get started building right away, check out the library here: [automerge-prosemirror](https://github.com/automerge/automerge-prosemirror)

For everyone else, let's start with a demo, before moving on to discuss what rich text is and how Automerge helps you use it.

## Demo

<iframe src="https://automerge.org/automerge-prosemirror">

On its own, this should seem pretty boring: it's a rich text editor which  supports most of the features users typically expect from a rich text editor. What makes this demo interesting is the support for real time collaboration which means that we can manage concurrent changes to complex formatting, like this:

<video controls playsinline autoplay muted loop>
  <source src="/img/automerge-formatting-change.webm" type="video/webm" />
  Merging formatting and structure changes in Automerge
</video>

The Automerge-ProseMirror binding is designed to be easy to integrate into any ProseMirror editor you might want to build.  To see how it works, refer to [the cookbook](/docs/cookbook/rich-text-prosemirror-vanilla), but the short story is that it takes just a few lines of code.

## Why is rich text a custom datatype in Automerge?

Automerge aims to make the experience of building production-ready collaborative applications as close as possible to the ease and speed of writing a local prototype. This is why the Automerge API focuses on giving you something that feels like just modifying a local Javascript object. Automerge provides a consistent abstraction for your data so that you can focus on your users' needs and not on the finer points of storage and synchronization.

In this context, rich text poses a problem. As we discuss at length in our past paper, [Peritext](https://inkandswitch.com/peritext), rich text doesn't map easily on to plain-text or tree structures. Attempting to do so can lead to incorrect behaviour during a merge.

For a real-world example of the kind of data-loss that is difficult to avoid with traditional approaches, here's an example using the yjs prosemirror bindings:

<video controls playsinline autoplay muted loop>
  <source src="/img/yjs-structure-change.webm" type="video/webm" />
  Conflicting structure changes in yjs can cause loss of text
</video>

When the edits from the two sides come together, the representation of the data requires the editor to choose between either adding a list item, or converting the list into a paragraph. In this case, the extra list item is lost (though it could have been the opposite.)

This kind of conflict is very rare in online editing scenarios. It only occurs when two users manage to submit conflicting structural edits concurrently. This becomes much more likely during longer sessions of offline collaboration Automerge is designed to support. Our goal is to ensure consistent and correct behaviour under all network and collaboration conditions, so for us this was an important problem.

Our goal has been to provide an implementation of rich-text support which allows both edits to be kept.

## How it works

Rather than representing rich text as a tree structure like HTML, we represent it as plain text annotatedwith spans and blocks:

|        | examples | behaviour |
| ------ | -------- | --------- |
| spans  | &lt;a&gt; &lt;em&gt; | overlapping |
| blocks | &lt;p&gt; &lt;li&gt; | independent |

The difference between the two is that text may appear in many spans, but should only ever be in a single block. A sentence may be bold *and* italic, but it cannot be simultaneously part of two paragraphs.

Formatting spans, originally described in [Peritext](https://inkandswitch.com/peritext) are conceptually stored outside the text. A formatting span has a beginning and an end within the text sequence and a flag detailing whether the span should expand when characters are inserted at the boundaries of the span.

Block markers have a type - such as "ordered list item" - and parents - such as "blockquote". The parents represent the hierarchical structure of the document. Block markers are inserted into the sequence of text characters.

These elements map quite closely to user actions whilst editing. Typically a text editor allows you to highlight a sequence of characters and format them - regardless of whether they are in different regions of the document (try highlighting and bolding half of a list item and preceding paragraph in Google Docs for example). On the other hand, inserting a new list item is usually achieved by pressing Enter at the end of the current list item - inserting a block marker; and indenting a list item is done by pressing a button in the toolbar - inserting a new parent into the block parents.

Choosing operations on the underlying data structure which map well to typical actions performed while editing text means we can provide accurate representations of the difference between two versions of the text. Here's the same  structure change example in automerge

<video controls playsinline autoplay muted loop>
  <source src="/img/automerge-structure-change.webm" type="video/webm" />
  Structure change in Automerge preserves edits
</video>

We plan to write a more detailed description of these algorithms (which were developed in concert with Martin Kleppmann) in a future paper.

## How can I try it?

Support for rich text landed in Automerge 2.2 and you can find a writeup of the API [here](/docs/reference/documents/rich-text). You can find several examples of how to use the Prosemirror bindings in the [Automerge-ProseMirror](https://github.com/automerge/automerge-prosemirror)  repository. We've also made a [simple starter project](https://github.com/automerge/prosemirror-quickstart) to a starter project you can fork. Please feel free to experiment with the playground above. If you find any behaviours that seem surprising, we'd love to hear about it. Whatever you're doing, we hope you'll join us in the [Automerge Discord](https://discord.gg/TrgN9FkYSa) and let us know how you're getting on.

## Commercial Support for Automerge

If you're a business building a commercial product on top of Automerge, we recommend becoming a commercial sponsor. Automerge is only available for production use thanks to our supporters and we are highly motivated to ensure their success.

Sponsors of the project receive ongoing support from our team, including architecture review early in a project, advice around scaling or launch issues, and extra visibility and influence into our roadmap. Sponsors also get a private Discord channel for asking questions specific to their project.

Email [alex@inkandswitch.com](mailto:alex@inkandswitch.com) or message us in the [Automerge Discord](https://discord.gg/TrgN9FkYSa) if you'd like to learn more about sponsorship and support options.
