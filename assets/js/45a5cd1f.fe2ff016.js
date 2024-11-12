"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[4e3],{3357:(e,o,t)=>{t.r(o),t.d(o,{assets:()=>c,contentTitle:()=>i,default:()=>l,frontMatter:()=>r,metadata:()=>a,toc:()=>d});var n=t(4848),s=t(8453);const r={sidebar_position:2},i="Concepts",a={id:"concepts",title:"Concepts",description:'This documentation is mostly focused on the javascript implementation of automerge. Some things will translate to other languages but some things - in particular the "repository" concept and automerge-repo library - will not.',source:"@site/docs/concepts.md",sourceDirName:".",slug:"/concepts",permalink:"/docs/concepts",draft:!1,unlisted:!1,editUrl:"https://github.com/automerge/automerge.github.io/edit/main/docs/concepts.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"A Builder's Tour of Automerge",permalink:"/docs/quickstart"},next:{title:"Library Initialization",permalink:"/docs/library_initialization"}},c={},d=[{value:"Core concepts",id:"core-concepts",level:2},{value:"Documents",id:"documents",level:3},{value:"Repositories",id:"repositories",level:3},{value:"DocHandles",id:"dochandles",level:3},{value:"Document URLs",id:"document-urls",level:3},{value:"Sync Protocol",id:"sync-protocol",level:3},{value:"Storage Format",id:"storage-format",level:3}];function h(e){const o={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,s.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(o.h1,{id:"concepts",children:"Concepts"}),"\n",(0,n.jsx)(o.admonition,{type:"info",children:(0,n.jsxs)(o.p,{children:['This documentation is mostly focused on the javascript implementation of automerge. Some things will translate to other languages but some things - in particular the "repository" concept and ',(0,n.jsx)(o.code,{children:"automerge-repo"})," library - will not."]})}),"\n",(0,n.jsx)(o.h2,{id:"core-concepts",children:"Core concepts"}),"\n",(0,n.jsxs)(o.p,{children:["Using automerge means storing your data in automerge ",(0,n.jsx)(o.a,{href:"#Documents",children:"documents"}),". Documents have ",(0,n.jsx)(o.a,{href:"#Document-URLs",children:"URL"}),"s which you can use to share or request documents with/from other peers using a ",(0,n.jsx)(o.a,{href:"#Repositories",children:"repository"}),". Repositories give you ",(0,n.jsx)(o.a,{href:"#dochandles",children:(0,n.jsx)(o.code,{children:"DocHandle"})}),"s which you use to make changes to the document and listen for changes from other peers."]}),"\n",(0,n.jsxs)(o.p,{children:["Automerge as used in javascript applications is actually a composition of two libraries. ",(0,n.jsx)(o.a,{href:"https://www.npmjs.com/package/@automerge/automerge-repo",children:(0,n.jsx)(o.code,{children:"automerge-repo"})})," which provides the networking and storage plumbing, and ",(0,n.jsx)(o.a,{href:"https://www.npmjs.com/package/@automerge/automerge",children:(0,n.jsx)(o.code,{children:"automerge"})})," which provides the CRDT implementation, a transport agnostic ",(0,n.jsx)(o.a,{href:"#sync-protocol",children:"sync protocol"}),", and a compressed ",(0,n.jsx)(o.a,{href:"#storage-format",children:"storage format"})," which ",(0,n.jsx)(o.code,{children:"automerge-repo"})," uses to implement various networking and storage plugins."]}),"\n",(0,n.jsx)(o.h3,{id:"documents",children:"Documents"}),"\n",(0,n.jsx)(o.p,{children:'A document is the "unit of change" in automerge. It\'s like a combination of a JSON object and a git repository. What does that mean?'}),"\n",(0,n.jsxs)(o.p,{children:["Like a JSON object, an automerge document is a map from strings to values, where the values can be maps, arrays, or simple types like strings or numbers. See the ",(0,n.jsx)(o.a,{href:"/docs/documents/",children:"data model"})," section for more details."]}),"\n",(0,n.jsxs)(o.p,{children:["Like a git repository, an automerge document has a history made up of commits. Every time you make a change to a document you are adding to the history of the document. The combination of this history and some rules about how to handle conflicts means that any two automerge documents can always be merged. See ",(0,n.jsx)(o.a,{href:"/docs/under-the-hood/merge_rules",children:"merging"})," for the gory details."]}),"\n",(0,n.jsx)(o.h3,{id:"repositories",children:"Repositories"}),"\n",(0,n.jsxs)(o.p,{children:["A repository manages connections to remote peers and access to some kind of local storage. Typically you create a repository at application startup and then inject it into the parts of your application which need it. The repository gives out ",(0,n.jsx)(o.code,{children:"DocHandle"}),"s, which allow you to access the current state of a document and make changes to it without thinking about how to store those changes, transmit them to others, or fetch changes from others."]}),"\n",(0,n.jsx)(o.p,{children:"Networking and storage for a repository are pluggable. There are various ready-made network transports and storage implementations but it is also easy to build your own."}),"\n",(0,n.jsx)(o.h3,{id:"dochandles",children:"DocHandles"}),"\n",(0,n.jsxs)(o.p,{children:["A ",(0,n.jsx)(o.code,{children:"DocHandle"})," is an object returned from the various methods on a repository which create or request a document. The ",(0,n.jsx)(o.code,{children:"DocHandle"})," has methods on it to access the underlying automerge document and to create new changes which are stored locally and transmitted to connected peers."]}),"\n",(0,n.jsx)(o.h3,{id:"document-urls",children:"Document URLs"}),"\n",(0,n.jsx)(o.p,{children:"Documents in a repository have a URL. An automerge URL looks like this:"}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{children:"automerge:2akvofn6L1o4RMUEMQi7qzwRjKWZ\n"})}),"\n",(0,n.jsxs)(o.p,{children:["That is, a string of the form ",(0,n.jsx)(o.code,{children:"automerge:<base58>"}),". This URL can be passed to a repository which will use it to check if the document is in any local storage or available from any connected peers."]}),"\n",(0,n.jsx)(o.h3,{id:"sync-protocol",children:"Sync Protocol"}),"\n",(0,n.jsxs)(o.p,{children:["Repositories communicate with each other using an efficient sync protocol which is implemented in ",(0,n.jsx)(o.code,{children:"automerge"}),". This protocol is transport agnostic and works on a per-document basis, a lot of the work ",(0,n.jsx)(o.code,{children:"automerge-repo"})," does is handling running this sync protocol for multiple documents over different kinds of network."]}),"\n",(0,n.jsx)(o.h3,{id:"storage-format",children:"Storage Format"}),"\n",(0,n.jsxs)(o.p,{children:[(0,n.jsx)(o.code,{children:"automerge"})," implements a compact binary storage format which makes it feasible to store all the editing history of a document (for example, storing every keystroke in a large text document). ",(0,n.jsx)(o.code,{children:"automerge-repo"})," implements the common logic of figuring out when to compress documents and doing so in a way which is safe for concurrent reads and writes."]})]})}function l(e={}){const{wrapper:o}={...(0,s.R)(),...e.components};return o?(0,n.jsx)(o,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}},8453:(e,o,t)=>{t.d(o,{R:()=>i,x:()=>a});var n=t(6540);const s={},r=n.createContext(s);function i(e){const o=n.useContext(r);return n.useMemo((function(){return"function"==typeof e?e(o):{...o,...e}}),[o,e])}function a(e){let o;return o=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),n.createElement(r.Provider,{value:o},e.children)}}}]);