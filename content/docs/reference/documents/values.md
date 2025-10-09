---
sidebar_position: 2
template: docs
---

# Simple Values

All JSON primitive datatypes are supported in an Automerge document. In addition, JavaScript [Date objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) are supported.

_Remember, never modify `currentDoc` directly, only ever change `doc` inside the callback to `Automerge.change`!_

```js
newDoc = Automerge.change(currentDoc, (doc) => {
  doc.property = "value"; // assigns a string value to a property
  doc["property"] = "value"; // equivalent to the previous line
  delete doc["property"]; // removes a property

  doc.stringValue = "value";
  doc.numberValue = 1;
  doc.boolValue = true;
  doc.nullValue = null;
  doc.nestedObject = {}; // creates a nested object
  doc.nestedObject.property = "value";
  // you can also assign an object that already has some properties
  doc.otherObject = { key: "value", number: 42 };

  // By default, strings are collaborative sequences of characters. There are
  // cases where you want a string which is not collaborative - URLs for example
  // should generally be updated in one go. In this case you can use `ImmutableString`,
  // which does not allow concurrent updates.
  doc.atomicStringValue = new Automerge.ImmutableString("")
});
```
