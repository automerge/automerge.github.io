"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[3089],{3905:(e,t,n)=>{n.d(t,{Zo:()=>l,kt:()=>m});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var h=a.createContext({}),c=function(e){var t=a.useContext(h),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},l=function(e){var t=c(e.components);return a.createElement(h.Provider,{value:t},e.children)},d="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,h=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),d=c(n),u=o,m=d["".concat(h,".").concat(u)]||d[u]||p[u]||r;return n?a.createElement(m,i(i({ref:t},l),{},{components:n})):a.createElement(m,i({ref:t},l))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,i=new Array(r);i[0]=u;var s={};for(var h in t)hasOwnProperty.call(t,h)&&(s[h]=t[h]);s.originalType=e,s[d]="string"==typeof e?e:o,i[1]=s;for(var c=2;c<r;c++)i[c]=n[c];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},4892:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>h,contentTitle:()=>i,default:()=>p,frontMatter:()=>r,metadata:()=>s,toc:()=>c});var a=n(7462),o=(n(7294),n(3905));const r={sidebar_position:1},i="Storage",s={unversionedId:"under-the-hood/storage",id:"under-the-hood/storage",title:"Storage",description:"In the getting started section we introduced a simple application which synchronized the value of a counter between any number of tabs. If you close all the tabs and open a new one you will see that the value of the counter is persisted. How is this working? What's going on?",source:"@site/docs/under-the-hood/storage.md",sourceDirName:"under-the-hood",slug:"/under-the-hood/storage",permalink:"/docs/under-the-hood/storage",draft:!1,editUrl:"https://github.com/automerge/automerge.github.io/edit/main/docs/under-the-hood/storage.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Modeling Data",permalink:"/docs/cookbook/modeling-data"},next:{title:"Merge Rules",permalink:"/docs/under-the-hood/merge_rules"}},h={},c=[{value:"Under the hood",id:"under-the-hood",level:2},{value:"The storage model",id:"the-storage-model",level:2}],l={toc:c},d="wrapper";function p(e){let{components:t,...r}=e;return(0,o.kt)(d,(0,a.Z)({},l,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"storage"},"Storage"),(0,o.kt)("p",null,"In the ",(0,o.kt)("a",{parentName:"p",href:"/docs/quickstart"},"getting started")," section we introduced a simple application which synchronized the value of a counter between any number of tabs. If you close all the tabs and open a new one you will see that the value of the counter is persisted. How is this working? What's going on?"),(0,o.kt)("p",null,"Before we dive into that, try this experiment. Modify the definition of the ",(0,o.kt)("inlineCode",{parentName:"p"},"repo")," in ",(0,o.kt)("inlineCode",{parentName:"p"},"main.tsx")," to look like this:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},"const repo = new Repo({\n  network: [], // This part means that we're not sending live changes anywhere\n  storage: new IndexedDBStorageAdapter(),\n})\n")),(0,o.kt)("p",null,"Now if you open two tabs with the same URL (including the hash component, the easiest way to achieve this is to open one tab and then duplicate it) you'll notice that the counter value is not updated live between tabs. However, if you increment the count in both tabs and then refresh either tab the count will include the increments from the other tab."),(0,o.kt)("p",null,"Clearly there is more going on here than just saving the current state of the document somewhere."),(0,o.kt)("h2",{id:"under-the-hood"},"Under the hood"),(0,o.kt)("p",null,"Both tabs initialize a ",(0,o.kt)("inlineCode",{parentName:"p"},"Repo")," pointing at an IndexedDB storage adapter, because the tabs are on the same domain this means they have access to the same storage. "),(0,o.kt)("p",null,"Let's mess around with this in the browser. First, clear your local IndexedDB for the ",(0,o.kt)("inlineCode",{parentName:"p"},"localhost")," domain, then open ",(0,o.kt)("inlineCode",{parentName:"p"},"http://localhost:5173")," (without a hash component). The browser will update to contain a hash component with the document ID in it. In this example the URL in the browser window is ",(0,o.kt)("inlineCode",{parentName:"p"},"http://localhost:5173/#automerge:3RFyJzsLsZ7MsbG98rcuZ4FqtGW7"),", so the document URL is ",(0,o.kt)("inlineCode",{parentName:"p"},"automerge:3RFyJzsLsZ7MsbG98rcuZ4FqtGW7"),". "),(0,o.kt)("p",null,"Open the browser tools and take a look at IndexedDB you'll see a database called ",(0,o.kt)("inlineCode",{parentName:"p"},"automerge")," and within that an object store called ",(0,o.kt)("inlineCode",{parentName:"p"},"automerge"),". For me, in Firefox, this looks like:"),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"IndexedDB browser tools",src:n(7982).Z,width:"1010",height:"756"})),(0,o.kt)("p",null,"You can see that there is a key which looks roughly like our document URL (it doesn't have the ",(0,o.kt)("inlineCode",{parentName:"p"},"automerge:")," prefix) and some kind of value. If we expand that we see:"),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"IndexedDB detailed",src:n(3416).Z,width:"1010",height:"956"})),(0,o.kt)("p",null,"If you're not familiar with IndexedDB this might be a little confusing. IndexedDB is a sort of key/value store where the keys are arrays. So what we are seeing here is a binary array (the ",(0,o.kt)("inlineCode",{parentName:"p"},"binary: Object")," part in the above screenshot) stored under the key ",(0,o.kt)("inlineCode",{parentName:"p"},'["3RFyJzsLsZ7MsbG98rcuZ4FqtGW7", "incremental", "0290cdc2dcebc1ecb3115c3635bf1cb0f857ce971d9aab1c44a0d3ab19a88cd8"]'),"."),(0,o.kt)("p",null,'Okay, so creating a document (which is what happens when we load the page) stores a binary array under some key in the object database. This binary array is a single "incremental" change. An incremental change is not the entire history of the document but just some set of chagnes to the document. In this case it\'s the change that initializes the document with a ',(0,o.kt)("inlineCode",{parentName:"p"},'"counter"')," field."),(0,o.kt)("p",null,'Now click the "count" button and take another look at the IndexedDB.'),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"IndexedDB snapshot",src:n(5710).Z,width:"1010",height:"956"})),(0,o.kt)("p",null,"Well, there's still one entry, but it's changed. The ",(0,o.kt)("inlineCode",{parentName:"p"},'[.., "incremental", ..]')," key has been deleted and replaced with ",(0,o.kt)("inlineCode",{parentName:"p"},'[.., "snapshot", ..]'),". What's happened here? Every time you make a change automerge-repo saves that change to your storage adapters. Occasionally automerge-repo will decide that it's time to \"compact\" the document, it will take every change that has been written to storage so far (in this case, every key beginning with ",(0,o.kt)("inlineCode",{parentName:"p"},"[<document URL>, .., ..]")," and combine them into a single snapshot and then save it as this ",(0,o.kt)("inlineCode",{parentName:"p"},'[.., "snapshot", ..]')," key."),(0,o.kt)("p",null,"All well and good in one tab. Open a new tab with the same URL (including the hash) and click the count button a few times in both tabs. If you look at the IndexedDB browser tools (in either tab, it's shared between them) you'll something like this:"),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"IndexedDB many keys",src:n(4237).Z,width:"1010",height:"778"})),(0,o.kt)("p",null,"You can see here that there are two snapshot files. This is because when each tab compacts incremental changes and then deletes the original incremental files, it only deletes the incremental changes it had previously loaded. This is what makes it safe to use concurrently, because it only deletes data which is incorporated into the compacted document. But the real magic comes with how this is loaded. If you load another tab with the same URL it will sum the counts from both the previous tabs. This works because when the repo starts up it loads all the changes it can find in storage and merges them which it can do because automerge is a CRDT."),(0,o.kt)("h2",{id:"the-storage-model"},"The storage model"),(0,o.kt)("p",null,"The objective of the storage engine in automerge-repo is to be easy to implement over a wide range of backing stores (e.g. an S3 bucket, or a postgres database, or a local directory) and support compaction without requiring any concurrency control on the part of the implementor. Compaction is crucial to make the approach of storing every change that is made to a document feasible."),(0,o.kt)("p",null,"The simplest model of storage is a key/value model. We could attempt to build storage on top of such a model by using the document ID as a key, appending new changes for a document to that key and occasionally compacting the document and rewriting the value at that key entirely. The problem with this is that it makes it complicated to use the storage engine from multiple processes. Imagine multiple processes are making changes to a document and writing them to the storage backend. If both of these processes decide to compact at the same time then the storage engine would need to have some kind of transaction to ensure that between the time a compacting process read from storage and then wrote to it no other process added new changes to storage. This is not hard for something like a postgres database, but it's very fiddly for simple mediums like a directory on the local filesystem. "),(0,o.kt)("p",null,"What we want to be able to do then is to know that if we are writing a compacted documnt to storage we will never overwrite data which contains changes we did not compact. Conveniently the set of changes in the document is uniquely identified by the heads of the document. This means that if we use the tuple ",(0,o.kt)("inlineCode",{parentName:"p"},"(document ID, <heads of document>)")," as the key to the storage we know that even if we overwrite data another process has written it must contain the same changes as the data we are writing. "),(0,o.kt)("p",null,"Of course, we also want to remove the un-compacted data. A compacting process can't just delete everything because another process might have written new changes since it started compaction. Each process then needs to keep track of every change it has loaded from storage and then when compacting ",(0,o.kt)("em",{parentName:"p"},"only delete those changes"),". "),(0,o.kt)("p",null,"The upshot of all this then is that our model for storage is not a key value store with document IDs as keys and byte arrays as values, but instead a slightly more complex model where the keys are arrays of the form ",(0,o.kt)("inlineCode",{parentName:"p"},"[<document ID>, <chunk type>, <chunk identifier>]")," where chunk type is either ",(0,o.kt)("inlineCode",{parentName:"p"},'"snapshot"'),' or "',(0,o.kt)("inlineCode",{parentName:"p"},'incremental"'),' and the chunk ID is either the heads of the documnt at compaction time or the hash of the change bytes respectively. The storage backend then must implement range queries so the storage system can do things like "load all the chunks for document ID x". '),(0,o.kt)("p",null,"In typescript that looks like this:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},"export type  StorageKey = string[]\n\nexport abstract class StorageAdapter {\n  abstract load(key: StorageKey): Promise<Uint8Array | undefined>\n  abstract save(key: StorageKey, data: Uint8Array): Promise<void>\n  abstract remove(key: StorageKey): Promise<void>\n  abstract loadRange(keyPrefix: StorageKey): Promise<{key: StorageKey, data: Uint8Array}[]>\n  abstract removeRange(keyPrefix: StorageKey): Promise<void>\n}\n")))}p.isMDXComponent=!0},3416:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/indexedb-screenshot-detailed-6e26f5cc4a19c298e08b9b87fda60113.png"},4237:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/indexeddb-screenshot-manykeys-a64d03070537caf6e7d5e8b41ac813d9.png"},5710:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/indexeddb-screenshot-snapshot-33bb8a01fef928c7aae538dcaed88de4.png"},7982:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/indexeddb-screenshot-f0b20167b650af36cf404b5b19f829fd.png"}}]);