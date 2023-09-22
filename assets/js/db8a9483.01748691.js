"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[8747],{3905:(e,t,n)=>{n.d(t,{Zo:()=>l,kt:()=>g});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=r.createContext({}),c=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},l=function(e){var t=c(e.components);return r.createElement(s.Provider,{value:t},e.children)},p="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,l=u(e,["components","mdxType","originalType","parentName"]),p=c(n),d=o,g=p["".concat(s,".").concat(d)]||p[d]||m[d]||a;return n?r.createElement(g,i(i({ref:t},l),{},{components:n})):r.createElement(g,i({ref:t},l))}));function g(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=d;var u={};for(var s in t)hasOwnProperty.call(t,s)&&(u[s]=t[s]);u.originalType=e,u[p]="string"==typeof e?e:o,i[1]=u;for(var c=2;c<a;c++)i[c]=n[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},6780:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>m,frontMatter:()=>a,metadata:()=>u,toc:()=>c});var r=n(7462),o=(n(7294),n(3905));const a={sidebar_position:3},i="Counters",u={unversionedId:"documents/counters",id:"documents/counters",title:"Counters",description:"If you have a numeric value that is only ever changed by adding or subtracting (e.g. counting how",source:"@site/docs/documents/counters.md",sourceDirName:"documents",slug:"/documents/counters",permalink:"/docs/documents/counters",draft:!1,editUrl:"https://github.com/automerge/automerge.github.io/edit/main/docs/documents/counters.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Simple Values",permalink:"/docs/documents/values"},next:{title:"Lists",permalink:"/docs/documents/lists"}},s={},c=[],l={toc:c},p="wrapper";function m(e){let{components:t,...n}=e;return(0,o.kt)(p,(0,r.Z)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"counters"},"Counters"),(0,o.kt)("p",null,"If you have a numeric value that is only ever changed by adding or subtracting (e.g. counting how\nmany times the user has done a particular thing), you should use the ",(0,o.kt)("inlineCode",{parentName:"p"},"Automerge.Counter")," datatype\ninstead of a plain number, because it deals with concurrent changes correctly."),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},(0,o.kt)("strong",{parentName:"p"},"Note:")," Using the ",(0,o.kt)("inlineCode",{parentName:"p"},"Automerge.Counter")," datatype is safer than changing a number value yourself\nusing the ",(0,o.kt)("inlineCode",{parentName:"p"},"++")," or ",(0,o.kt)("inlineCode",{parentName:"p"},"+= 1")," operators. For example, suppose the value is currently ",(0,o.kt)("strong",{parentName:"p"},"3"),":"),(0,o.kt)("ul",{parentName:"blockquote"},(0,o.kt)("li",{parentName:"ul"},"If two users increment it concurrently, they will both register ",(0,o.kt)("strong",{parentName:"li"},"4")," as the new value, whereas\nthe two increments should result in a value of ",(0,o.kt)("strong",{parentName:"li"},"5"),"."),(0,o.kt)("li",{parentName:"ul"},"If one user increments twice and the other user increments three times before the documents are\nmerged, we will now have ",(0,o.kt)("a",{parentName:"li",href:"#conflicting-changes"},"conflicting changes")," (",(0,o.kt)("strong",{parentName:"li"},"5")," vs. ",(0,o.kt)("strong",{parentName:"li"},"6"),"), rather\nthan the desired value of ",(0,o.kt)("strong",{parentName:"li"},"8")," (3 + 2 + 3)."))),(0,o.kt)("p",null,"To set up a ",(0,o.kt)("inlineCode",{parentName:"p"},"Counter"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"state = Automerge.change(state, doc => {\n  // The counter is initialized to 0 by default. You can pass a number to the\n  // Automerge.Counter constructor if you want a different initial value.\n  doc.buttonClicks = new Automerge.Counter()\n})\n")),(0,o.kt)("p",null,"To get the current counter value, use ",(0,o.kt)("inlineCode",{parentName:"p"},"doc.buttonClicks.value"),". Whenever you want to increase or\ndecrease the counter value, you can use the ",(0,o.kt)("inlineCode",{parentName:"p"},".increment()")," or ",(0,o.kt)("inlineCode",{parentName:"p"},".decrement()")," method:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"state = Automerge.change(state, doc => {\n  doc.buttonClicks.increment() // Add 1 to counter value\n  doc.buttonClicks.increment(4) // Add 4 to counter value\n  doc.buttonClicks.decrement(3) // Subtract 3 from counter value\n})\n")),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},(0,o.kt)("strong",{parentName:"p"},"Note:")," In relational databases it is common to use an auto-incrementing counter to generate\nprimary keys for rows in a table, but this is not safe in Automerge, since several users may end\nup generating the same counter value! Instead it is best to use UUIDs to identify entities.")))}m.isMDXComponent=!0}}]);