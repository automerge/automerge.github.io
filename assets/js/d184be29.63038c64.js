"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[6],{659:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>l,contentTitle:()=>s,default:()=>h,frontMatter:()=>i,metadata:()=>a,toc:()=>c});var n=t(4848),o=t(8453);const i={sidebar_position:2},s="Prosemirror + React + Automerge",a={id:"cookbook/rich-text-prosemirror-react",title:"Prosemirror + React + Automerge",description:"Automerge supports rich text editing on top of ProseMirror. This guide will show you how to set up a simple collaborative rich text editor in React using Automerge and ProseMirror.",source:"@site/docs/cookbook/rich-text-prosemirror-react.md",sourceDirName:"cookbook",slug:"/cookbook/rich-text-prosemirror-react",permalink:"/docs/cookbook/rich-text-prosemirror-react",draft:!1,unlisted:!1,editUrl:"https://github.com/automerge/automerge.github.io/edit/main/docs/cookbook/rich-text-prosemirror-react.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Modeling Data",permalink:"/docs/cookbook/modeling-data"},next:{title:"Prosemirror + VanillaJS + Automerge",permalink:"/docs/cookbook/rich-text-prosemirror-vanilla"}},l={},c=[];function d(e){const r={a:"a",code:"code",h1:"h1",p:"p",pre:"pre",...(0,o.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:"prosemirror--react--automerge",children:"Prosemirror + React + Automerge"}),"\n",(0,n.jsxs)(r.p,{children:["Automerge supports rich text editing on top of ",(0,n.jsx)(r.a,{href:"https://prosemirror.net/",children:"ProseMirror"}),". This guide will show you how to set up a simple collaborative rich text editor in React using Automerge and ProseMirror."]}),"\n",(0,n.jsxs)(r.p,{children:["All the code here can be found at ",(0,n.jsx)(r.a,{href:"https://github.com/automerge/automerge-prosemirror/examples/react",children:"https://github.com/automerge/automerge-prosemirror/examples/react"})]}),"\n",(0,n.jsxs)(r.p,{children:["First, create a an example vite app using the ",(0,n.jsx)(r.code,{children:"@automerge/vite-app"})," template. This will give you a basic React app with the Automerge dependencies already installed."]}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-bash",children:"yarn create @automerge/vite-app\n"})}),"\n",(0,n.jsx)(r.p,{children:"Then install our prosemirror dependencies"}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-bash",children:"yarn add @automerge/prosemirror prosemirror-example-setup prosemirror-model prosemirror-state prosemirror-view\n"})}),"\n",(0,n.jsxs)(r.p,{children:["Now, the app created by ",(0,n.jsx)(r.code,{children:"@automerge/vite-app"})," creates a document which contains a ",(0,n.jsx)(r.code,{children:"Counter"}),", but we want a ",(0,n.jsx)(r.code,{children:"string"})," which will contain the text. Modify ",(0,n.jsx)(r.code,{children:"main.tsx"})," so that the handle initialization logic looks like this:"]}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-jsx",metastring:'title="src/main.tsx"',children:'...\nlet handle\nif (isValidAutomergeUrl(rootDocUrl)) {\n  handle = repo.find(rootDocUrl)\n} else {\n  handle = repo.create({text: ""})\n}\n...\n'})}),"\n",(0,n.jsx)(r.p,{children:"First, let's create a basic skeleton component which just loads the document handle. The prosemirror bindings require that the document handle be loaded before we begin, so we'll add a bit of boilerplate to achieve this:"}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-jsx",metastring:'title="src/App.tsx"',children:'import { AutomergeUrl } from "@automerge/automerge-repo"\nimport { useHandle } from "@automerge/automerge-repo-react-hooks"\nimport { useEffect, useState } from "react"\n\nfunction App({ docUrl }: { docUrl: AutomergeUrl }) {\n  const handle = useHandle<{text: string}>(docUrl)\n  const [loaded, setLoaded] = useState(handle && handle.docSync() != null)\n  useEffect(() => {\n    if (handle != null) {\n      handle.whenReady().then(() => {\n        if (handle.docSync() != null) {\n          setLoaded(true)\n        }\n      })\n    }\n  }, [handle])\n\n  return <div id="editor"></div>\n}\n\nexport default App\n'})}),"\n",(0,n.jsxs)(r.p,{children:["Now, we're going to create a ProseMirror editor. Prosemirror manages its own UI and state, it just needs to be attached to the DOM somehow. To achieve this we'll use the ",(0,n.jsx)(r.code,{children:"useRef"})," hook to get hold of a reference to a dom element inside a React component which we can pass to prosemirror."]}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-jsx",metastring:'title="src/App.tsx"',children:'import { AutomergeUrl } from "@automerge/automerge-repo"\nimport { useHandle } from "@automerge/automerge-repo-react-hooks"\n// highlight-start\nimport { useEffect, useRef, useState } from "react"\nimport {EditorState} from "prosemirror-state"\nimport {EditorView} from "prosemirror-view"\nimport {exampleSetup} from "prosemirror-example-setup"\nimport { AutoMirror } from "@automerge/prosemirror"\nimport "prosemirror-example-setup/style/style.css"\nimport "prosemirror-menu/style/menu.css"\nimport "prosemirror-view/style/prosemirror.css"\nimport "./App.css"\n// highlight-end\n\nfunction App({ docUrl }: { docUrl: AutomergeUrl }) {\n  const editorRoot = useRef<HTMLDivElement>(null)\n  const handle = useHandle<{text: string}>(docUrl)\n  const [loaded, setLoaded] = useState(handle && handle.docSync() != null)\n  useEffect(() => {\n    if (handle != null) {\n      handle.whenReady().then(() => {\n        if (handle.docSync() != null) {\n          setLoaded(true)\n        }\n      })\n    }\n  }, [handle])\n\n  // highlight-start\n  const [view, setView] = useState<EditorView | null>(null)\n  useEffect(() => {\n    // We\'re not using this for anything yet, but this `AutoMirror` object is\n    // where we will integrate prosemirror with automerge\n    const mirror = new AutoMirror(["text"])\n    if (editorRoot.current != null && loaded) {\n      const view = new EditorView(editorRoot.current, {\n        state: EditorState.create({\n          schema: mirror.schema, // It\'s important that we use the schema from the mirror\n          plugins: exampleSetup({schema: mirror.schema}),\n          doc: mirror.initialize(handle!, ["text"])\n        }),\n      })\n      setView(view)\n    }\n    return () => {\n      if (view) {\n        view.destroy()\n        setView(null)\n      }\n    }\n  }, [editorRoot, loaded])\n  // highlight-end\n\n  return <div id="editor" ref={editorRoot}></div>\n}\n\nexport default App\n'})}),"\n",(0,n.jsxs)(r.p,{children:["At this point if you run the application you'll find that there's a working prosemirror editor but it looks rubbish. Add the following to ",(0,n.jsx)(r.code,{children:"src/App.css"})," and things will look a lot better:"]}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-css",metastring:'title="src/App.css"',children:"#root {\n  max-width: 1280px;\n  margin: 0 auto;\n  padding: 2rem;\n  display:flex;\n  flex-direction: column;\n  width: 100%;\n  height: 100vh;\n}\n\n/* center the editor inside the #root */\n#editor {\n  margin: 0 auto;\n  width: 100%;\n  max-width: 800px;\n  flex: 1;\n  background-color: #f8f9fa;\n  color: #333;\n}\n"})}),"\n",(0,n.jsx)(r.p,{children:"Alright, now we're ready to collaborate."}),"\n",(0,n.jsxs)(r.p,{children:["Update ",(0,n.jsx)(r.code,{children:"src/App.tsx"})," with the following changes:"]}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-jsx",metastring:'title="src/App.tsx"',children:'import { AutomergeUrl, DocHandleChangePayload } from "@automerge/automerge-repo"\nimport { useHandle } from "@automerge/automerge-repo-react-hooks"\nimport { useEffect, useRef, useState } from "react"\nimport {EditorState, Transaction} from "prosemirror-state"\nimport {EditorView} from "prosemirror-view"\nimport {exampleSetup} from "prosemirror-example-setup"\nimport { AutoMirror } from "@automerge/prosemirror"\nimport "prosemirror-example-setup/style/style.css"\nimport "prosemirror-menu/style/menu.css"\nimport "prosemirror-view/style/prosemirror.css"\nimport "./App.css"\n\nfunction App({ docUrl }: { docUrl: AutomergeUrl }) {\n  const editorRoot = useRef<HTMLDivElement>(null)\n  const handle = useHandle<{text: string}>(docUrl)\n  const [loaded, setLoaded] = useState(handle && handle.docSync() != null)\n  useEffect(() => {\n    if (handle != null) {\n      handle.whenReady().then(() => {\n        if (handle.docSync() != null) {\n          setLoaded(true)\n        }\n      })\n    }\n  }, [handle])\n\n  const [view, setView] = useState<EditorView | null>(null)\n  useEffect(() => {\n    // We\'re not using this for anything yet, but this `AutoMirror` object is\n    // where we will integrate prosemirror with automerge\n    const mirror = new AutoMirror(["text"])\n    // highlight-start\n    let view: EditorView // We need a forward reference to use next\n    // This is a callback which will update the prosemirror view whenever the document changes\n    const onPatch: (args: DocHandleChangePayload<unknown>) => void = ({\n      doc,\n      patches,\n      patchInfo,\n    }) => {\n      const newState = mirror.reconcilePatch(\n        patchInfo.before,\n        doc,\n        patches,\n        view!.state,\n      )\n      view!.updateState(newState)\n    }\n    // highlight-end\n    if (editorRoot.current != null && loaded) {\n      view = new EditorView(editorRoot.current, {\n        state: EditorState.create({\n          schema: mirror.schema, // It\'s important that we use the schema from the mirror\n          plugins: exampleSetup({schema: mirror.schema}),\n          doc: mirror.initialize(handle!, ["text"]),\n        }),\n        // highlight-start\n        // Here we\'re intercepting the prosemirror transaction and feeding it through the AutoMirror\n        dispatchTransaction: (tx: Transaction) => {\n          const newState = mirror.intercept(handle!, tx, view!.state)\n          view!.updateState(newState)\n        },\n        // highlight-end\n      })\n      setView(view)\n      // highlight-next-line\n      handle!.on("change", onPatch)\n    }\n    return () => {\n      // highlight-start\n      // we have to remove the listener when tearing down\n      if (handle != null) {\n        handle.off("change", onPatch)\n      }\n      // highlight-end\n      setView(null)\n      if (view != null) {\n        view.destroy()\n      }\n    }\n  }, [editorRoot, loaded])\n\n  return <div id="editor" ref={editorRoot}></div>\n}\n\nexport default App\n'})}),"\n",(0,n.jsxs)(r.p,{children:["Now, you can load up the app in a different tab, or a different browser (the URL will contain a document URL after the ",(0,n.jsx)(r.code,{children:"#"}),"), and you can see changes being merged from one side to the other."]})]})}function h(e={}){const{wrapper:r}={...(0,o.R)(),...e.components};return r?(0,n.jsx)(r,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}},8453:(e,r,t)=>{t.d(r,{R:()=>s,x:()=>a});var n=t(6540);const o={},i=n.createContext(o);function s(e){const r=n.useContext(i);return n.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function a(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:s(e.components),n.createElement(i.Provider,{value:r},e.children)}}}]);