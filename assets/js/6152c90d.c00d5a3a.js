"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[6905],{8548:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>a,contentTitle:()=>c,default:()=>h,frontMatter:()=>i,metadata:()=>r,toc:()=>d});var o=n(4848),s=n(8453);const i={sidebar_position:6},c="Conflicts",r={id:"documents/conflicts",title:"Conflicts",description:"Automerge allows different nodes to independently make arbitrary changes to their respective copies",source:"@site/docs/documents/conflicts.md",sourceDirName:"documents",slug:"/documents/conflicts",permalink:"/docs/documents/conflicts",draft:!1,unlisted:!1,editUrl:"https://github.com/automerge/automerge.github.io/edit/main/docs/documents/conflicts.md",tags:[],version:"current",sidebarPosition:6,frontMatter:{sidebar_position:6},sidebar:"tutorialSidebar",previous:{title:"Rich Text",permalink:"/docs/documents/rich_text"},next:{title:"Repositories",permalink:"/docs/repositories/"}},a={},d=[{value:"What is a Conflict?",id:"what-is-a-conflict",level:2}];function l(e){const t={code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",strong:"strong",...(0,s.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.h1,{id:"conflicts",children:"Conflicts"}),"\n",(0,o.jsx)(t.p,{children:"Automerge allows different nodes to independently make arbitrary changes to their respective copies\nof a document. In most cases, those changes can be combined without any trouble. For example, if\nusers modify two different objects, or two different properties in the same object, then it is\nstraightforward to combine those changes."}),"\n",(0,o.jsx)(t.h2,{id:"what-is-a-conflict",children:"What is a Conflict?"}),"\n",(0,o.jsx)(t.p,{children:"If users concurrently insert or delete items in a list (or characters in a text document), Automerge\npreserves all the insertions and deletions. If two users concurrently insert at the same position,\nAutomerge will ensure that on all nodes the inserted items are placed in the same order."}),"\n",(0,o.jsxs)(t.p,{children:["The only case Automerge cannot handle automatically, because there is no well-defined resolution, is\n",(0,o.jsx)(t.strong,{children:"when users concurrently update the same property in the same object"}),' (or, similarly, the same\nindex in the same list). In this case, Automerge picks one of the concurrently written\nvalues as the "winner", and it ensures that this winner is the same on all nodes:']}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-js",children:"// Create two different documents\nlet doc1 = Automerge.change(Automerge.init(), (doc) => {\n  doc.x = 1;\n});\nlet doc2 = Automerge.change(Automerge.init(), (doc) => {\n  doc.x = 2;\n});\ndoc1 = Automerge.merge(doc1, doc2);\ndoc2 = Automerge.merge(doc2, doc1);\n// Now, we can't tell which value doc1.x and doc2.x are going to assume --\n// the choice is random. However, what's for certain is that they are equal.\nassert.deepEqual(doc1, doc2);\n"})}),"\n",(0,o.jsxs)(t.p,{children:["Although only one of the concurrently written values shows up in the object, the other values are\nnot lost. They are merely relegated to a conflicts object. Suppose ",(0,o.jsx)(t.code,{children:"doc.x = 2"}),' is chosen as the\n"winning" value:']}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-js",children:"doc1; // {x: 2}\ndoc2; // {x: 2}\nAutomerge.getConflicts(doc1, \"x\"); // {'1@01234567': 1, '1@89abcdef': 2}\nAutomerge.getConflicts(doc2, \"x\"); // {'1@01234567': 1, '1@89abcdef': 2}\n"})}),"\n",(0,o.jsxs)(t.p,{children:["Here, we've recorded a conflict on property ",(0,o.jsx)(t.code,{children:"x"}),". The object returned by ",(0,o.jsx)(t.code,{children:"getConflicts"}),' contains the\nconflicting values, both the "winner" and the "loser". You might use the information in the\nconflicts object to show the conflict in the user interface. The keys in the conflicts object are\nthe internal IDs of the operations that updated the property ',(0,o.jsx)(t.code,{children:"x"}),"."]}),"\n",(0,o.jsxs)(t.p,{children:["The next time you assign to a conflicting property, the conflict is automatically considered to be\nresolved, and the conflict disappears from the object returned by ",(0,o.jsx)(t.code,{children:"Automerge.getConflicts()"}),"."]}),"\n",(0,o.jsxs)(t.p,{children:["Automerge uses a combination of LWW (last writer wins) and multi-value register. By default, if you read from ",(0,o.jsx)(t.code,{children:"doc.foo"})," you will get the LWW semantics, but you can also see the conflicts by calling ",(0,o.jsx)(t.code,{children:"Automerge.getConflicts(doc, 'foo')"})," which has multi-value semantics."]}),"\n",(0,o.jsx)(t.p,{children:"Every operation has a unique operation ID that is the combination of a counter and the actorId that generated it. Conflicts are ordered based on the counter first (using the actorId only to break ties when operations have the same counter value)."})]})}function h(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(l,{...e})}):l(e)}},8453:(e,t,n)=>{n.d(t,{R:()=>c,x:()=>r});var o=n(6540);const s={},i=o.createContext(s);function c(e){const t=o.useContext(i);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:c(e.components),o.createElement(i.Provider,{value:t},e.children)}}}]);