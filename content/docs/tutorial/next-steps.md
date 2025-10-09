---
title: "Next Steps"
template: docs
---

import { jsx } from "react/jsx-runtime";
import Admonition from "@theme/Admonition";

## Congratulations!

You've built a local-first, offline-capable app that supports multiplayer collaboration locally and over the network.

## Production Considerations

While the URL-based sharing mechanism we implemented is great for prototyping, there are some considerations for production applications:

1. **Security**: The public sync server is not secure for production use
2. **Reliability**: You should run your own sync server for production
3. **User Experience**: Consider implementing a more user-friendly sharing mechanism
4. **Performance**: Monitor document size and consider splitting large documents
5. **Error Handling**: Add proper error handling for network issues

## Further Learning

If you're hungry for more:

- Look at the [Cookbook](/docs/cookbook/modeling-data/) section for tips on how to model your app's data in Automerge
- Dive deeper into how Automerge [stores](https://automerge.org/docs/under-the-hood/storage/) and [merges](https://automerge.org/docs/under-the-hood/merge_rules/) documents in the 'Under the Hood' section
- Explore advanced features like:
  - [Rich Text Editing](/docs/cookbook/rich-text-prosemirror-vanilla/)
  - [Custom Network Adapters](/docs/reference/repositories/networking/)
  - [Custom Storage Adapters](/docs/reference/repositories/storage/)

## Community

Join the [Discord](https://discord.gg/zKGe4DCfgR) to:

- Ask questions
- Show off your Automerge apps
- Connect with the Automerge team & community
- Get help with implementation
- Share your experiences
