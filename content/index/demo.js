var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var require_stdin = __commonJS({
  "<stdin>"(exports, module) {
    (async () => {
      (function() {
        const e = document.createElement("link").relList;
        if (e && e.supports && e.supports("modulepreload")) return;
        for (const o of document.querySelectorAll('link[rel="modulepreload"]')) r(o);
        new MutationObserver((o) => {
          for (const s of o) if (s.type === "childList") for (const c of s.addedNodes) c.tagName === "LINK" && c.rel === "modulepreload" && r(c);
        }).observe(document, {
          childList: true,
          subtree: true
        });
        function n(o) {
          const s = {};
          return o.integrity && (s.integrity = o.integrity), o.referrerPolicy && (s.referrerPolicy = o.referrerPolicy), o.crossOrigin === "use-credentials" ? s.credentials = "include" : o.crossOrigin === "anonymous" ? s.credentials = "omit" : s.credentials = "same-origin", s;
        }
        function r(o) {
          if (o.ep) return;
          o.ep = true;
          const s = n(o);
          fetch(o.href, s);
        }
      })();
      let Ne;
      const ie = typeof TextEncoder < "u" ? new TextEncoder("utf-8") : {
        encode: () => {
          throw Error("TextEncoder not available");
        }
      };
      ie.encodeInto;
      const Bn = typeof TextDecoder < "u" ? new TextDecoder("utf-8", {
        ignoreBOM: true,
        fatal: true
      }) : {
        decode: () => {
          throw Error("TextDecoder not available");
        }
      };
      typeof TextDecoder < "u" && Bn.decode();
      typeof FinalizationRegistry > "u" || new FinalizationRegistry((t) => Ne.__wbg_automerge_free(t >>> 0, 1));
      typeof FinalizationRegistry > "u" || new FinalizationRegistry((t) => Ne.__wbg_syncstate_free(t >>> 0, 1));
      let Ln = [];
      function Fn(t) {
        for (const e in t) me[e] = t[e];
        for (const e of Ln) e();
      }
      const me = {
        create(t) {
          throw new RangeError("Automerge.use() not called");
        },
        load(t, e) {
          throw new RangeError("Automerge.use() not called (load)");
        },
        encodeChange(t) {
          throw new RangeError("Automerge.use() not called (encodeChange)");
        },
        decodeChange(t) {
          throw new RangeError("Automerge.use() not called (decodeChange)");
        },
        initSyncState() {
          throw new RangeError("Automerge.use() not called (initSyncState)");
        },
        encodeSyncMessage(t) {
          throw new RangeError("Automerge.use() not called (encodeSyncMessage)");
        },
        decodeSyncMessage(t) {
          throw new RangeError("Automerge.use() not called (decodeSyncMessage)");
        },
        encodeSyncState(t) {
          throw new RangeError("Automerge.use() not called (encodeSyncState)");
        },
        decodeSyncState(t) {
          throw new RangeError("Automerge.use() not called (decodeSyncState)");
        },
        exportSyncState(t) {
          throw new RangeError("Automerge.use() not called (exportSyncState)");
        },
        importSyncState(t) {
          throw new RangeError("Automerge.use() not called (importSyncState)");
        }
      }, Hn = "/index/automerge_wasm_bg.wasm", zn = async (t = {}, e) => {
        let n;
        if (e.startsWith("data:")) {
          const r = e.replace(/^data:.*?base64,/, "");
          let o;
          if (typeof Buffer == "function" && typeof Buffer.from == "function") o = Buffer.from(r, "base64");
          else if (typeof atob == "function") {
            const s = atob(r);
            o = new Uint8Array(s.length);
            for (let c = 0; c < s.length; c++) o[c] = s.charCodeAt(c);
          } else throw new Error("Cannot decode base64-encoded data URL");
          n = await WebAssembly.instantiate(o, t);
        } else {
          const r = await fetch(e), o = r.headers.get("Content-Type") || "";
          if ("instantiateStreaming" in WebAssembly && o.startsWith("application/wasm")) n = await WebAssembly.instantiateStreaming(r, t);
          else {
            const s = await r.arrayBuffer();
            n = await WebAssembly.instantiate(s, t);
          }
        }
        return n.instance.exports;
      };
      let i;
      function We(t) {
        i = t;
      }
      let S = 0, Y = null;
      function z() {
        return (Y === null || Y.byteLength === 0) && (Y = new Uint8Array(i.memory.buffer)), Y;
      }
      const $n = typeof TextEncoder > "u" ? (0, module.require)("util").TextEncoder : TextEncoder;
      let K = new $n("utf-8");
      const Un = typeof K.encodeInto == "function" ? function(t, e) {
        return K.encodeInto(t, e);
      } : function(t, e) {
        const n = K.encode(t);
        return e.set(n), {
          read: t.length,
          written: n.length
        };
      };
      function E(t, e, n) {
        if (n === void 0) {
          const _ = K.encode(t), g = e(_.length, 1) >>> 0;
          return z().subarray(g, g + _.length).set(_), S = _.length, g;
        }
        let r = t.length, o = e(r, 1) >>> 0;
        const s = z();
        let c = 0;
        for (; c < r; c++) {
          const _ = t.charCodeAt(c);
          if (_ > 127) break;
          s[o + c] = _;
        }
        if (c !== r) {
          c !== 0 && (t = t.slice(c)), o = n(o, r, r = c + t.length * 3, 1) >>> 0;
          const _ = z().subarray(o + c, o + r), g = Un(t, _);
          c += g.written, o = n(o, r, c, 1) >>> 0;
        }
        return S = c, o;
      }
      let B = null;
      function C() {
        return (B === null || B.buffer.detached === true || B.buffer.detached === void 0 && B.buffer !== i.memory.buffer) && (B = new DataView(i.memory.buffer)), B;
      }
      function p(t) {
        const e = i.__externref_table_alloc();
        return i.__wbindgen_export_4.set(e, t), e;
      }
      function T(t, e) {
        try {
          return t.apply(this, e);
        } catch (n) {
          const r = p(n);
          i.__wbindgen_exn_store(r);
        }
      }
      const Nn = typeof TextDecoder > "u" ? (0, module.require)("util").TextDecoder : TextDecoder;
      let Ve = new Nn("utf-8", {
        ignoreBOM: true,
        fatal: true
      });
      Ve.decode();
      function x(t, e) {
        return t = t >>> 0, Ve.decode(z().subarray(t, t + e));
      }
      function Wn(t, e) {
        return t = t >>> 0, z().subarray(t / 1, t / 1 + e);
      }
      function ge(t) {
        const e = typeof t;
        if (e == "number" || e == "boolean" || t == null) return `${t}`;
        if (e == "string") return `"${t}"`;
        if (e == "symbol") {
          const o = t.description;
          return o == null ? "Symbol" : `Symbol(${o})`;
        }
        if (e == "function") {
          const o = t.name;
          return typeof o == "string" && o.length > 0 ? `Function(${o})` : "Function";
        }
        if (Array.isArray(t)) {
          const o = t.length;
          let s = "[";
          o > 0 && (s += ge(t[0]));
          for (let c = 1; c < o; c++) s += ", " + ge(t[c]);
          return s += "]", s;
        }
        const n = /\[object ([^\]]+)\]/.exec(toString.call(t));
        let r;
        if (n && n.length > 1) r = n[1];
        else return toString.call(t);
        if (r == "Object") try {
          return "Object(" + JSON.stringify(t) + ")";
        } catch {
          return "Object";
        }
        return t instanceof Error ? `${t.name}: ${t.message}
${t.stack}` : r;
      }
      function b(t) {
        return t == null;
      }
      function l(t) {
        const e = i.__wbindgen_export_4.get(t);
        return i.__externref_table_dealloc(t), e;
      }
      function k(t, e) {
        if (!(t instanceof e)) throw new Error(`expected instance of ${e.name}`);
      }
      function Vn(t) {
        const e = i.create(t);
        if (e[2]) throw l(e[1]);
        return R.__wrap(e[0]);
      }
      function Yn(t, e) {
        const n = i.load(t, e);
        if (n[2]) throw l(n[1]);
        return R.__wrap(n[0]);
      }
      function qn(t) {
        const e = i.encodeChange(t);
        if (e[2]) throw l(e[1]);
        return l(e[0]);
      }
      function Jn(t) {
        const e = i.decodeChange(t);
        if (e[2]) throw l(e[1]);
        return l(e[0]);
      }
      function Kn() {
        const t = i.initSyncState();
        return A.__wrap(t);
      }
      function Xn(t) {
        const e = i.importSyncState(t);
        if (e[2]) throw l(e[1]);
        return A.__wrap(e[0]);
      }
      function Gn(t) {
        return k(t, A), i.exportSyncState(t.__wbg_ptr);
      }
      function Zn(t) {
        const e = i.encodeSyncMessage(t);
        if (e[2]) throw l(e[1]);
        return l(e[0]);
      }
      function Qn(t) {
        const e = i.decodeSyncMessage(t);
        if (e[2]) throw l(e[1]);
        return l(e[0]);
      }
      function er(t) {
        return k(t, A), i.encodeSyncState(t.__wbg_ptr);
      }
      function tr(t) {
        const e = i.decodeSyncState(t);
        if (e[2]) throw l(e[1]);
        return A.__wrap(e[0]);
      }
      const Me = typeof FinalizationRegistry > "u" ? {
        register: () => {
        },
        unregister: () => {
        }
      } : new FinalizationRegistry((t) => i.__wbg_automerge_free(t >>> 0, 1));
      class R {
        static __wrap(e) {
          e = e >>> 0;
          const n = Object.create(R.prototype);
          return n.__wbg_ptr = e, Me.register(n, n.__wbg_ptr, n), n;
        }
        __destroy_into_raw() {
          const e = this.__wbg_ptr;
          return this.__wbg_ptr = 0, Me.unregister(this), e;
        }
        free() {
          const e = this.__destroy_into_raw();
          i.__wbg_automerge_free(e, 0);
        }
        static new(e) {
          var n = b(e) ? 0 : E(e, i.__wbindgen_malloc, i.__wbindgen_realloc), r = S;
          const o = i.automerge_new(n, r);
          if (o[2]) throw l(o[1]);
          return R.__wrap(o[0]);
        }
        clone(e) {
          var n = b(e) ? 0 : E(e, i.__wbindgen_malloc, i.__wbindgen_realloc), r = S;
          const o = i.automerge_clone(this.__wbg_ptr, n, r);
          if (o[2]) throw l(o[1]);
          return R.__wrap(o[0]);
        }
        fork(e, n) {
          var r = b(e) ? 0 : E(e, i.__wbindgen_malloc, i.__wbindgen_realloc), o = S;
          const s = i.automerge_fork(this.__wbg_ptr, r, o, n);
          if (s[2]) throw l(s[1]);
          return R.__wrap(s[0]);
        }
        pendingOps() {
          return i.automerge_pendingOps(this.__wbg_ptr);
        }
        commit(e, n) {
          var r = b(e) ? 0 : E(e, i.__wbindgen_malloc, i.__wbindgen_realloc), o = S;
          return i.automerge_commit(this.__wbg_ptr, r, o, !b(n), b(n) ? 0 : n);
        }
        merge(e) {
          k(e, R);
          const n = i.automerge_merge(this.__wbg_ptr, e.__wbg_ptr);
          if (n[2]) throw l(n[1]);
          return l(n[0]);
        }
        rollback() {
          return i.automerge_rollback(this.__wbg_ptr);
        }
        keys(e, n) {
          const r = i.automerge_keys(this.__wbg_ptr, e, b(n) ? 0 : p(n));
          if (r[2]) throw l(r[1]);
          return l(r[0]);
        }
        text(e, n) {
          let r, o;
          try {
            const _ = i.automerge_text(this.__wbg_ptr, e, b(n) ? 0 : p(n));
            var s = _[0], c = _[1];
            if (_[3]) throw s = 0, c = 0, l(_[2]);
            return r = s, o = c, x(s, c);
          } finally {
            i.__wbindgen_free(r, o, 1);
          }
        }
        spans(e, n) {
          const r = i.automerge_spans(this.__wbg_ptr, e, b(n) ? 0 : p(n));
          if (r[2]) throw l(r[1]);
          return l(r[0]);
        }
        splice(e, n, r, o) {
          const s = i.automerge_splice(this.__wbg_ptr, e, n, r, o);
          if (s[1]) throw l(s[0]);
        }
        updateText(e, n) {
          const r = i.automerge_updateText(this.__wbg_ptr, e, n);
          if (r[1]) throw l(r[0]);
        }
        updateSpans(e, n, r) {
          const o = i.automerge_updateSpans(this.__wbg_ptr, e, n, r);
          if (o[1]) throw l(o[0]);
        }
        push(e, n, r) {
          const o = i.automerge_push(this.__wbg_ptr, e, n, r);
          if (o[1]) throw l(o[0]);
        }
        pushObject(e, n) {
          let r, o;
          try {
            const _ = i.automerge_pushObject(this.__wbg_ptr, e, n);
            var s = _[0], c = _[1];
            if (_[3]) throw s = 0, c = 0, l(_[2]);
            return r = s, o = c, x(s, c);
          } finally {
            i.__wbindgen_free(r, o, 1);
          }
        }
        insert(e, n, r, o) {
          const s = i.automerge_insert(this.__wbg_ptr, e, n, r, o);
          if (s[1]) throw l(s[0]);
        }
        splitBlock(e, n, r) {
          const o = i.automerge_splitBlock(this.__wbg_ptr, e, n, r);
          if (o[1]) throw l(o[0]);
        }
        joinBlock(e, n) {
          const r = i.automerge_joinBlock(this.__wbg_ptr, e, n);
          if (r[1]) throw l(r[0]);
        }
        updateBlock(e, n, r) {
          const o = i.automerge_updateBlock(this.__wbg_ptr, e, n, r);
          if (o[1]) throw l(o[0]);
        }
        getBlock(e, n, r) {
          const o = i.automerge_getBlock(this.__wbg_ptr, e, n, b(r) ? 0 : p(r));
          if (o[2]) throw l(o[1]);
          return l(o[0]);
        }
        insertObject(e, n, r) {
          let o, s;
          try {
            const g = i.automerge_insertObject(this.__wbg_ptr, e, n, r);
            var c = g[0], _ = g[1];
            if (g[3]) throw c = 0, _ = 0, l(g[2]);
            return o = c, s = _, x(c, _);
          } finally {
            i.__wbindgen_free(o, s, 1);
          }
        }
        put(e, n, r, o) {
          const s = i.automerge_put(this.__wbg_ptr, e, n, r, o);
          if (s[1]) throw l(s[0]);
        }
        putObject(e, n, r) {
          const o = i.automerge_putObject(this.__wbg_ptr, e, n, r);
          if (o[2]) throw l(o[1]);
          return l(o[0]);
        }
        increment(e, n, r) {
          const o = i.automerge_increment(this.__wbg_ptr, e, n, r);
          if (o[1]) throw l(o[0]);
        }
        get(e, n, r) {
          const o = i.automerge_get(this.__wbg_ptr, e, n, b(r) ? 0 : p(r));
          if (o[2]) throw l(o[1]);
          return l(o[0]);
        }
        getWithType(e, n, r) {
          const o = i.automerge_getWithType(this.__wbg_ptr, e, n, b(r) ? 0 : p(r));
          if (o[2]) throw l(o[1]);
          return l(o[0]);
        }
        objInfo(e, n) {
          const r = i.automerge_objInfo(this.__wbg_ptr, e, b(n) ? 0 : p(n));
          if (r[2]) throw l(r[1]);
          return l(r[0]);
        }
        getAll(e, n, r) {
          const o = i.automerge_getAll(this.__wbg_ptr, e, n, b(r) ? 0 : p(r));
          if (o[2]) throw l(o[1]);
          return l(o[0]);
        }
        enableFreeze(e) {
          const n = i.automerge_enableFreeze(this.__wbg_ptr, e);
          if (n[2]) throw l(n[1]);
          return n[0] !== 0;
        }
        registerDatatype(e, n, r) {
          const o = i.automerge_registerDatatype(this.__wbg_ptr, e, n, r);
          if (o[1]) throw l(o[0]);
        }
        applyPatches(e, n) {
          const r = i.automerge_applyPatches(this.__wbg_ptr, e, n);
          if (r[2]) throw l(r[1]);
          return l(r[0]);
        }
        applyAndReturnPatches(e, n) {
          const r = i.automerge_applyAndReturnPatches(this.__wbg_ptr, e, n);
          if (r[2]) throw l(r[1]);
          return l(r[0]);
        }
        diffIncremental() {
          const e = i.automerge_diffIncremental(this.__wbg_ptr);
          if (e[2]) throw l(e[1]);
          return l(e[0]);
        }
        updateDiffCursor() {
          i.automerge_updateDiffCursor(this.__wbg_ptr);
        }
        resetDiffCursor() {
          i.automerge_resetDiffCursor(this.__wbg_ptr);
        }
        diff(e, n) {
          const r = i.automerge_diff(this.__wbg_ptr, e, n);
          if (r[2]) throw l(r[1]);
          return l(r[0]);
        }
        isolate(e) {
          const n = i.automerge_isolate(this.__wbg_ptr, e);
          if (n[1]) throw l(n[0]);
        }
        integrate() {
          i.automerge_integrate(this.__wbg_ptr);
        }
        length(e, n) {
          const r = i.automerge_length(this.__wbg_ptr, e, b(n) ? 0 : p(n));
          if (r[2]) throw l(r[1]);
          return r[0];
        }
        delete(e, n) {
          const r = i.automerge_delete(this.__wbg_ptr, e, n);
          if (r[1]) throw l(r[0]);
        }
        save() {
          return i.automerge_save(this.__wbg_ptr);
        }
        saveIncremental() {
          return i.automerge_saveIncremental(this.__wbg_ptr);
        }
        saveSince(e) {
          const n = i.automerge_saveSince(this.__wbg_ptr, e);
          if (n[2]) throw l(n[1]);
          return l(n[0]);
        }
        saveNoCompress() {
          return i.automerge_saveNoCompress(this.__wbg_ptr);
        }
        saveAndVerify() {
          const e = i.automerge_saveAndVerify(this.__wbg_ptr);
          if (e[2]) throw l(e[1]);
          return l(e[0]);
        }
        loadIncremental(e) {
          const n = i.automerge_loadIncremental(this.__wbg_ptr, e);
          if (n[2]) throw l(n[1]);
          return n[0];
        }
        applyChanges(e) {
          const n = i.automerge_applyChanges(this.__wbg_ptr, e);
          if (n[1]) throw l(n[0]);
        }
        getChanges(e) {
          const n = i.automerge_getChanges(this.__wbg_ptr, e);
          if (n[2]) throw l(n[1]);
          return l(n[0]);
        }
        getChangesMeta(e) {
          const n = i.automerge_getChangesMeta(this.__wbg_ptr, e);
          if (n[2]) throw l(n[1]);
          return l(n[0]);
        }
        getChangeByHash(e) {
          const n = i.automerge_getChangeByHash(this.__wbg_ptr, e);
          if (n[2]) throw l(n[1]);
          return l(n[0]);
        }
        getChangeMetaByHash(e) {
          const n = i.automerge_getChangeMetaByHash(this.__wbg_ptr, e);
          if (n[2]) throw l(n[1]);
          return l(n[0]);
        }
        getDecodedChangeByHash(e) {
          const n = i.automerge_getDecodedChangeByHash(this.__wbg_ptr, e);
          if (n[2]) throw l(n[1]);
          return l(n[0]);
        }
        getChangesAdded(e) {
          return k(e, R), i.automerge_getChangesAdded(this.__wbg_ptr, e.__wbg_ptr);
        }
        getHeads() {
          return i.automerge_getHeads(this.__wbg_ptr);
        }
        getActorId() {
          let e, n;
          try {
            const r = i.automerge_getActorId(this.__wbg_ptr);
            return e = r[0], n = r[1], x(r[0], r[1]);
          } finally {
            i.__wbindgen_free(e, n, 1);
          }
        }
        getLastLocalChange() {
          return i.automerge_getLastLocalChange(this.__wbg_ptr);
        }
        dump() {
          i.automerge_dump(this.__wbg_ptr);
        }
        getMissingDeps(e) {
          const n = i.automerge_getMissingDeps(this.__wbg_ptr, b(e) ? 0 : p(e));
          if (n[2]) throw l(n[1]);
          return l(n[0]);
        }
        receiveSyncMessage(e, n) {
          k(e, A);
          const r = i.automerge_receiveSyncMessage(this.__wbg_ptr, e.__wbg_ptr, n);
          if (r[1]) throw l(r[0]);
        }
        generateSyncMessage(e) {
          return k(e, A), i.automerge_generateSyncMessage(this.__wbg_ptr, e.__wbg_ptr);
        }
        toJS(e) {
          const n = i.automerge_toJS(this.__wbg_ptr, e);
          if (n[2]) throw l(n[1]);
          return l(n[0]);
        }
        materialize(e, n, r) {
          const o = i.automerge_materialize(this.__wbg_ptr, e, b(n) ? 0 : p(n), r);
          if (o[2]) throw l(o[1]);
          return l(o[0]);
        }
        getCursor(e, n, r, o) {
          let s, c;
          try {
            const d = i.automerge_getCursor(this.__wbg_ptr, e, n, b(r) ? 0 : p(r), o);
            var _ = d[0], g = d[1];
            if (d[3]) throw _ = 0, g = 0, l(d[2]);
            return s = _, c = g, x(_, g);
          } finally {
            i.__wbindgen_free(s, c, 1);
          }
        }
        getCursorPosition(e, n, r) {
          const o = i.automerge_getCursorPosition(this.__wbg_ptr, e, n, b(r) ? 0 : p(r));
          if (o[2]) throw l(o[1]);
          return o[0];
        }
        emptyChange(e, n) {
          var r = b(e) ? 0 : E(e, i.__wbindgen_malloc, i.__wbindgen_realloc), o = S;
          return i.automerge_emptyChange(this.__wbg_ptr, r, o, !b(n), b(n) ? 0 : n);
        }
        mark(e, n, r, o, s) {
          const c = i.automerge_mark(this.__wbg_ptr, e, n, r, o, s);
          if (c[1]) throw l(c[0]);
        }
        unmark(e, n, r) {
          const o = i.automerge_unmark(this.__wbg_ptr, e, n, r);
          if (o[1]) throw l(o[0]);
        }
        marks(e, n) {
          const r = i.automerge_marks(this.__wbg_ptr, e, b(n) ? 0 : p(n));
          if (r[2]) throw l(r[1]);
          return l(r[0]);
        }
        marksAt(e, n, r) {
          const o = i.automerge_marksAt(this.__wbg_ptr, e, n, b(r) ? 0 : p(r));
          if (o[2]) throw l(o[1]);
          return l(o[0]);
        }
        hasOurChanges(e) {
          return k(e, A), i.automerge_hasOurChanges(this.__wbg_ptr, e.__wbg_ptr) !== 0;
        }
        topoHistoryTraversal() {
          return i.automerge_topoHistoryTraversal(this.__wbg_ptr);
        }
        stats() {
          return i.automerge_stats(this.__wbg_ptr);
        }
      }
      const De = typeof FinalizationRegistry > "u" ? {
        register: () => {
        },
        unregister: () => {
        }
      } : new FinalizationRegistry((t) => i.__wbg_syncstate_free(t >>> 0, 1));
      class A {
        static __wrap(e) {
          e = e >>> 0;
          const n = Object.create(A.prototype);
          return n.__wbg_ptr = e, De.register(n, n.__wbg_ptr, n), n;
        }
        __destroy_into_raw() {
          const e = this.__wbg_ptr;
          return this.__wbg_ptr = 0, De.unregister(this), e;
        }
        free() {
          const e = this.__destroy_into_raw();
          i.__wbg_syncstate_free(e, 0);
        }
        get sharedHeads() {
          return i.syncstate_sharedHeads(this.__wbg_ptr);
        }
        get lastSentHeads() {
          return i.syncstate_lastSentHeads(this.__wbg_ptr);
        }
        set lastSentHeads(e) {
          const n = i.syncstate_set_lastSentHeads(this.__wbg_ptr, e);
          if (n[1]) throw l(n[0]);
        }
        set sentHashes(e) {
          const n = i.syncstate_set_sentHashes(this.__wbg_ptr, e);
          if (n[1]) throw l(n[0]);
        }
        clone() {
          const e = i.syncstate_clone(this.__wbg_ptr);
          return A.__wrap(e);
        }
      }
      function Ye(t, e) {
        const n = String(e), r = E(n, i.__wbindgen_malloc, i.__wbindgen_realloc), o = S;
        C().setInt32(t + 4 * 1, o, true), C().setInt32(t + 4 * 0, r, true);
      }
      function qe() {
        return T(function(t, e, n) {
          return Reflect.apply(t, e, n);
        }, arguments);
      }
      function Je(t, e) {
        return Object.assign(t, e);
      }
      function Ke(t) {
        return t.buffer;
      }
      function Xe() {
        return T(function(t, e) {
          return t.call(e);
        }, arguments);
      }
      function Ge() {
        return T(function(t, e, n) {
          return t.call(e, n);
        }, arguments);
      }
      function Ze(t, e) {
        return t.concat(e);
      }
      function Qe(t, e, n) {
        return Object.defineProperty(t, e, n);
      }
      function et() {
        return T(function(t, e) {
          return Reflect.deleteProperty(t, e);
        }, arguments);
      }
      function tt(t) {
        return t.done;
      }
      function nt(t) {
        return Object.entries(t);
      }
      function rt(t, e) {
        let n, r;
        try {
          n = t, r = e, console.error(x(t, e));
        } finally {
          i.__wbindgen_free(n, r, 1);
        }
      }
      function ot(t, e) {
        return Symbol.for(x(t, e));
      }
      function st(t) {
        return Object.freeze(t);
      }
      function at(t) {
        return Array.from(t);
      }
      function ct() {
        return T(function(t, e) {
          globalThis.crypto.getRandomValues(Wn(t, e));
        }, arguments);
      }
      function it(t) {
        return t.getTime();
      }
      function _t() {
        return T(function(t, e) {
          return Reflect.get(t, e);
        }, arguments);
      }
      function ut(t, e) {
        return t[e >>> 0];
      }
      function lt(t) {
        let e;
        try {
          e = t instanceof ArrayBuffer;
        } catch {
          e = false;
        }
        return e;
      }
      function gt(t) {
        let e;
        try {
          e = t instanceof Date;
        } catch {
          e = false;
        }
        return e;
      }
      function ft(t) {
        let e;
        try {
          e = t instanceof Object;
        } catch {
          e = false;
        }
        return e;
      }
      function dt(t) {
        let e;
        try {
          e = t instanceof Uint8Array;
        } catch {
          e = false;
        }
        return e;
      }
      function ht(t) {
        return Array.isArray(t);
      }
      function bt() {
        return Symbol.iterator;
      }
      function mt(t) {
        return Object.keys(t);
      }
      function pt(t) {
        return t.length;
      }
      function wt(t) {
        return t.length;
      }
      function yt(t) {
        return t.length;
      }
      function St(t, e) {
        console.log(t, e);
      }
      function xt(t) {
        console.log(t);
      }
      function At(t, e) {
        return new RangeError(x(t, e));
      }
      function Ct(t) {
        return new Date(t);
      }
      function vt() {
        return new Object();
      }
      function Rt() {
        return new Array();
      }
      function jt() {
        return new Error();
      }
      function Et(t) {
        return new Uint8Array(t);
      }
      function Ot(t, e) {
        return new Error(x(t, e));
      }
      function It(t, e, n) {
        return new Uint8Array(t, e >>> 0, n >>> 0);
      }
      function Tt(t) {
        return t.next;
      }
      function Mt() {
        return T(function(t) {
          return t.next();
        }, arguments);
      }
      function Dt() {
        return T(function(t) {
          return Reflect.ownKeys(t);
        }, arguments);
      }
      function kt(t, e) {
        return t.push(e);
      }
      function Pt(t, e, n) {
        t[e >>> 0] = n;
      }
      function Bt(t, e, n) {
        t[e] = n;
      }
      function Lt(t, e, n) {
        t.set(e, n >>> 0);
      }
      function Ft() {
        return T(function(t, e, n) {
          return Reflect.set(t, e, n);
        }, arguments);
      }
      function Ht(t, e, n) {
        return t.slice(e >>> 0, n >>> 0);
      }
      function zt(t, e) {
        const n = e.stack, r = E(n, i.__wbindgen_malloc, i.__wbindgen_realloc), o = S;
        C().setInt32(t + 4 * 1, o, true), C().setInt32(t + 4 * 0, r, true);
      }
      function $t(t) {
        return t.toString();
      }
      function Ut(t, e) {
        return t.unshift(e);
      }
      function Nt(t) {
        return t.value;
      }
      function Wt(t) {
        return Object.values(t);
      }
      function Vt(t) {
        return t;
      }
      function Yt(t) {
        return BigInt.asUintN(64, t);
      }
      function qt(t) {
        const e = t;
        return typeof e == "boolean" ? e ? 1 : 0 : 2;
      }
      function Jt(t, e) {
        const n = ge(e), r = E(n, i.__wbindgen_malloc, i.__wbindgen_realloc), o = S;
        C().setInt32(t + 4 * 1, o, true), C().setInt32(t + 4 * 0, r, true);
      }
      function Kt(t, e) {
        return new Error(x(t, e));
      }
      function Xt() {
        const t = i.__wbindgen_export_4, e = t.grow(4);
        t.set(0, void 0), t.set(e + 0, void 0), t.set(e + 1, null), t.set(e + 2, true), t.set(e + 3, false);
      }
      function Gt(t) {
        return Array.isArray(t);
      }
      function Zt(t) {
        return typeof t == "function";
      }
      function Qt(t) {
        return t === null;
      }
      function en(t) {
        const e = t;
        return typeof e == "object" && e !== null;
      }
      function tn(t) {
        return typeof t == "string";
      }
      function nn(t) {
        return t === void 0;
      }
      function rn(t, e) {
        const n = e, r = JSON.stringify(n === void 0 ? null : n), o = E(r, i.__wbindgen_malloc, i.__wbindgen_realloc), s = S;
        C().setInt32(t + 4 * 1, s, true), C().setInt32(t + 4 * 0, o, true);
      }
      function on(t, e) {
        return t == e;
      }
      function sn() {
        return i.memory;
      }
      function an(t, e) {
        const n = e, r = typeof n == "number" ? n : void 0;
        C().setFloat64(t + 8 * 1, b(r) ? 0 : r, true), C().setInt32(t + 4 * 0, !b(r), true);
      }
      function cn(t) {
        return t;
      }
      function _n(t, e) {
        const n = e, r = typeof n == "string" ? n : void 0;
        var o = b(r) ? 0 : E(r, i.__wbindgen_malloc, i.__wbindgen_realloc), s = S;
        C().setInt32(t + 4 * 1, s, true), C().setInt32(t + 4 * 0, o, true);
      }
      function un(t, e) {
        return x(t, e);
      }
      function ln(t, e) {
        throw new Error(x(t, e));
      }
      URL = globalThis.URL;
      const u = await zn({
        "./automerge_wasm_bg.js": {
          __wbindgen_string_get: _n,
          __wbindgen_error_new: Kt,
          __wbindgen_string_new: un,
          __wbindgen_number_new: cn,
          __wbindgen_number_get: an,
          __wbindgen_is_undefined: nn,
          __wbindgen_boolean_get: qt,
          __wbindgen_is_null: Qt,
          __wbindgen_is_string: tn,
          __wbindgen_is_function: Zt,
          __wbindgen_is_object: en,
          __wbindgen_is_array: Gt,
          __wbindgen_json_serialize: rn,
          __wbg_new_8a6f238a6ece86ea: jt,
          __wbg_stack_0ed75d68575b0f3c: zt,
          __wbg_error_7534b8e9a36f1ab4: rt,
          __wbindgen_jsval_loose_eq: on,
          __wbg_String_8f0eb39a4a4c2f66: Ye,
          __wbindgen_bigint_from_i64: Vt,
          __wbindgen_bigint_from_u64: Yt,
          __wbg_set_3f1d0b984ed272ed: Bt,
          __wbg_getRandomValues_3c9c0d586e575a16: ct,
          __wbg_log_c222819a41e063d3: xt,
          __wbg_log_1ae1e9f741096e91: St,
          __wbg_get_b9b93047fe3cf45b: ut,
          __wbg_length_e2d2a49132c1b256: yt,
          __wbg_new_78feb108b6472713: Rt,
          __wbg_next_25feadfc0913fea9: Tt,
          __wbg_next_6574e1a8a62d1055: Mt,
          __wbg_done_769e5ede4b31c67b: tt,
          __wbg_value_cd1ffa7b1ab794f1: Nt,
          __wbg_iterator_9a24c88df860dc65: bt,
          __wbg_get_67b2ba62fc30de12: _t,
          __wbg_call_672a4d21634d4a24: Xe,
          __wbg_new_405e22f390576ce2: vt,
          __wbg_length_d56737991078581b: wt,
          __wbg_set_37837023f3d740e8: Pt,
          __wbg_from_2a5d3e218e67aa85: at,
          __wbg_isArray_a1eab7e0d067391b: ht,
          __wbg_push_737cfc8c1432c2c6: kt,
          __wbg_unshift_c290010f73f04fb1: Ut,
          __wbg_instanceof_ArrayBuffer_e14585432e3737fc: lt,
          __wbg_new_c68d7209be747379: Ot,
          __wbg_call_7cccdd69e0791ae2: Ge,
          __wbg_instanceof_Date_e9a9be8b9cea7890: gt,
          __wbg_getTime_46267b1c24877e30: it,
          __wbg_new_31a97dac4f10fab7: Ct,
          __wbg_instanceof_Object_7f2dcef8f78644a4: ft,
          __wbg_assign_3627b8559449930a: Je,
          __wbg_defineProperty_a3ddad9901e2d29e: Qe,
          __wbg_entries_3265d4158b33e5dc: nt,
          __wbg_freeze_ef6d70cf38e8d948: st,
          __wbg_keys_5c77a08ddc2fb8a6: mt,
          __wbg_values_fcb8ba8c0aad8b58: Wt,
          __wbg_new_1ab78df5e132f715: At,
          __wbg_apply_eb9e9b97497f91e4: qe,
          __wbg_deleteProperty_96363d4a1d977c97: et,
          __wbg_ownKeys_3930041068756f1f: Dt,
          __wbg_set_bb8cecf6a62b9f46: Ft,
          __wbg_buffer_609cc3eee51ed158: Ke,
          __wbg_concat_9de968491c4340cf: Ze,
          __wbg_slice_972c243648c9fd2e: Ht,
          __wbg_for_4ff07bddd743c5e7: ot,
          __wbg_toString_66ab719c2a98bdf1: $t,
          __wbg_newwithbyteoffsetandlength_d97e637ebe145a9a: It,
          __wbg_new_a12002a7f91c75be: Et,
          __wbg_set_65595bdd868b3009: Lt,
          __wbg_length_a446193dc22c12f8: pt,
          __wbg_instanceof_Uint8Array_17156bcf118086a9: dt,
          __wbindgen_debug_string: Jt,
          __wbindgen_throw: ln,
          __wbindgen_memory: sn,
          __wbindgen_init_externref_table: Xt
        }
      }, Hn), nr = u.memory, rr = u.__wbg_syncstate_free, or = u.syncstate_sharedHeads, sr = u.syncstate_lastSentHeads, ar = u.syncstate_set_lastSentHeads, cr = u.syncstate_set_sentHashes, ir = u.syncstate_clone, _r = u.__wbg_automerge_free, ur = u.automerge_new, lr = u.automerge_clone, gr = u.automerge_fork, fr = u.automerge_pendingOps, dr = u.automerge_commit, hr = u.automerge_merge, br = u.automerge_rollback, mr = u.automerge_keys, pr = u.automerge_text, wr = u.automerge_spans, yr = u.automerge_splice, Sr = u.automerge_updateText, xr = u.automerge_updateSpans, Ar = u.automerge_push, Cr = u.automerge_pushObject, vr = u.automerge_insert, Rr = u.automerge_splitBlock, jr = u.automerge_joinBlock, Er = u.automerge_updateBlock, Or = u.automerge_getBlock, Ir = u.automerge_insertObject, Tr = u.automerge_put, Mr = u.automerge_putObject, Dr = u.automerge_increment, kr = u.automerge_get, Pr = u.automerge_getWithType, Br = u.automerge_objInfo, Lr = u.automerge_getAll, Fr = u.automerge_enableFreeze, Hr = u.automerge_registerDatatype, zr = u.automerge_applyPatches, $r = u.automerge_applyAndReturnPatches, Ur = u.automerge_diffIncremental, Nr = u.automerge_updateDiffCursor, Wr = u.automerge_resetDiffCursor, Vr = u.automerge_diff, Yr = u.automerge_isolate, qr = u.automerge_integrate, Jr = u.automerge_length, Kr = u.automerge_delete, Xr = u.automerge_save, Gr = u.automerge_saveIncremental, Zr = u.automerge_saveSince, Qr = u.automerge_saveNoCompress, eo = u.automerge_saveAndVerify, to = u.automerge_loadIncremental, no = u.automerge_applyChanges, ro = u.automerge_getChanges, oo = u.automerge_getChangesMeta, so = u.automerge_getChangeByHash, ao = u.automerge_getChangeMetaByHash, co = u.automerge_getDecodedChangeByHash, io = u.automerge_getChangesAdded, _o = u.automerge_getHeads, uo = u.automerge_getActorId, lo = u.automerge_getLastLocalChange, go = u.automerge_dump, fo = u.automerge_getMissingDeps, ho = u.automerge_receiveSyncMessage, bo = u.automerge_generateSyncMessage, mo = u.automerge_toJS, po = u.automerge_materialize, wo = u.automerge_getCursor, yo = u.automerge_getCursorPosition, So = u.automerge_emptyChange, xo = u.automerge_mark, Ao = u.automerge_unmark, Co = u.automerge_marks, vo = u.automerge_marksAt, Ro = u.automerge_hasOurChanges, jo = u.automerge_topoHistoryTraversal, Eo = u.automerge_stats, Oo = u.create, Io = u.load, To = u.encodeChange, Mo = u.decodeChange, Do = u.initSyncState, ko = u.importSyncState, Po = u.exportSyncState, Bo = u.encodeSyncMessage, Lo = u.decodeSyncMessage, Fo = u.encodeSyncState, Ho = u.decodeSyncState, zo = u.__wbindgen_malloc, $o = u.__wbindgen_realloc, Uo = u.__wbindgen_exn_store, No = u.__externref_table_alloc, Wo = u.__wbindgen_export_4, Vo = u.__wbindgen_free, Yo = u.__externref_table_dealloc, gn = u.__wbindgen_start, qo = Object.freeze(Object.defineProperty({
        __proto__: null,
        __externref_table_alloc: No,
        __externref_table_dealloc: Yo,
        __wbg_automerge_free: _r,
        __wbg_syncstate_free: rr,
        __wbindgen_exn_store: Uo,
        __wbindgen_export_4: Wo,
        __wbindgen_free: Vo,
        __wbindgen_malloc: zo,
        __wbindgen_realloc: $o,
        __wbindgen_start: gn,
        automerge_applyAndReturnPatches: $r,
        automerge_applyChanges: no,
        automerge_applyPatches: zr,
        automerge_clone: lr,
        automerge_commit: dr,
        automerge_delete: Kr,
        automerge_diff: Vr,
        automerge_diffIncremental: Ur,
        automerge_dump: go,
        automerge_emptyChange: So,
        automerge_enableFreeze: Fr,
        automerge_fork: gr,
        automerge_generateSyncMessage: bo,
        automerge_get: kr,
        automerge_getActorId: uo,
        automerge_getAll: Lr,
        automerge_getBlock: Or,
        automerge_getChangeByHash: so,
        automerge_getChangeMetaByHash: ao,
        automerge_getChanges: ro,
        automerge_getChangesAdded: io,
        automerge_getChangesMeta: oo,
        automerge_getCursor: wo,
        automerge_getCursorPosition: yo,
        automerge_getDecodedChangeByHash: co,
        automerge_getHeads: _o,
        automerge_getLastLocalChange: lo,
        automerge_getMissingDeps: fo,
        automerge_getWithType: Pr,
        automerge_hasOurChanges: Ro,
        automerge_increment: Dr,
        automerge_insert: vr,
        automerge_insertObject: Ir,
        automerge_integrate: qr,
        automerge_isolate: Yr,
        automerge_joinBlock: jr,
        automerge_keys: mr,
        automerge_length: Jr,
        automerge_loadIncremental: to,
        automerge_mark: xo,
        automerge_marks: Co,
        automerge_marksAt: vo,
        automerge_materialize: po,
        automerge_merge: hr,
        automerge_new: ur,
        automerge_objInfo: Br,
        automerge_pendingOps: fr,
        automerge_push: Ar,
        automerge_pushObject: Cr,
        automerge_put: Tr,
        automerge_putObject: Mr,
        automerge_receiveSyncMessage: ho,
        automerge_registerDatatype: Hr,
        automerge_resetDiffCursor: Wr,
        automerge_rollback: br,
        automerge_save: Xr,
        automerge_saveAndVerify: eo,
        automerge_saveIncremental: Gr,
        automerge_saveNoCompress: Qr,
        automerge_saveSince: Zr,
        automerge_spans: wr,
        automerge_splice: yr,
        automerge_splitBlock: Rr,
        automerge_stats: Eo,
        automerge_text: pr,
        automerge_toJS: mo,
        automerge_topoHistoryTraversal: jo,
        automerge_unmark: Ao,
        automerge_updateBlock: Er,
        automerge_updateDiffCursor: Nr,
        automerge_updateSpans: xr,
        automerge_updateText: Sr,
        create: Oo,
        decodeChange: Mo,
        decodeSyncMessage: Lo,
        decodeSyncState: Ho,
        encodeChange: To,
        encodeSyncMessage: Bo,
        encodeSyncState: Fo,
        exportSyncState: Po,
        importSyncState: ko,
        initSyncState: Do,
        load: Io,
        memory: nr,
        syncstate_clone: ir,
        syncstate_lastSentHeads: sr,
        syncstate_set_lastSentHeads: ar,
        syncstate_set_sentHashes: cr,
        syncstate_sharedHeads: or
      }, Symbol.toStringTag, {
        value: "Module"
      }));
      We(qo);
      gn();
      const Jo = Object.freeze(Object.defineProperty({
        __proto__: null,
        Automerge: R,
        SyncState: A,
        __wbg_String_8f0eb39a4a4c2f66: Ye,
        __wbg_apply_eb9e9b97497f91e4: qe,
        __wbg_assign_3627b8559449930a: Je,
        __wbg_buffer_609cc3eee51ed158: Ke,
        __wbg_call_672a4d21634d4a24: Xe,
        __wbg_call_7cccdd69e0791ae2: Ge,
        __wbg_concat_9de968491c4340cf: Ze,
        __wbg_defineProperty_a3ddad9901e2d29e: Qe,
        __wbg_deleteProperty_96363d4a1d977c97: et,
        __wbg_done_769e5ede4b31c67b: tt,
        __wbg_entries_3265d4158b33e5dc: nt,
        __wbg_error_7534b8e9a36f1ab4: rt,
        __wbg_for_4ff07bddd743c5e7: ot,
        __wbg_freeze_ef6d70cf38e8d948: st,
        __wbg_from_2a5d3e218e67aa85: at,
        __wbg_getRandomValues_3c9c0d586e575a16: ct,
        __wbg_getTime_46267b1c24877e30: it,
        __wbg_get_67b2ba62fc30de12: _t,
        __wbg_get_b9b93047fe3cf45b: ut,
        __wbg_instanceof_ArrayBuffer_e14585432e3737fc: lt,
        __wbg_instanceof_Date_e9a9be8b9cea7890: gt,
        __wbg_instanceof_Object_7f2dcef8f78644a4: ft,
        __wbg_instanceof_Uint8Array_17156bcf118086a9: dt,
        __wbg_isArray_a1eab7e0d067391b: ht,
        __wbg_iterator_9a24c88df860dc65: bt,
        __wbg_keys_5c77a08ddc2fb8a6: mt,
        __wbg_length_a446193dc22c12f8: pt,
        __wbg_length_d56737991078581b: wt,
        __wbg_length_e2d2a49132c1b256: yt,
        __wbg_log_1ae1e9f741096e91: St,
        __wbg_log_c222819a41e063d3: xt,
        __wbg_new_1ab78df5e132f715: At,
        __wbg_new_31a97dac4f10fab7: Ct,
        __wbg_new_405e22f390576ce2: vt,
        __wbg_new_78feb108b6472713: Rt,
        __wbg_new_8a6f238a6ece86ea: jt,
        __wbg_new_a12002a7f91c75be: Et,
        __wbg_new_c68d7209be747379: Ot,
        __wbg_newwithbyteoffsetandlength_d97e637ebe145a9a: It,
        __wbg_next_25feadfc0913fea9: Tt,
        __wbg_next_6574e1a8a62d1055: Mt,
        __wbg_ownKeys_3930041068756f1f: Dt,
        __wbg_push_737cfc8c1432c2c6: kt,
        __wbg_set_37837023f3d740e8: Pt,
        __wbg_set_3f1d0b984ed272ed: Bt,
        __wbg_set_65595bdd868b3009: Lt,
        __wbg_set_bb8cecf6a62b9f46: Ft,
        __wbg_set_wasm: We,
        __wbg_slice_972c243648c9fd2e: Ht,
        __wbg_stack_0ed75d68575b0f3c: zt,
        __wbg_toString_66ab719c2a98bdf1: $t,
        __wbg_unshift_c290010f73f04fb1: Ut,
        __wbg_value_cd1ffa7b1ab794f1: Nt,
        __wbg_values_fcb8ba8c0aad8b58: Wt,
        __wbindgen_bigint_from_i64: Vt,
        __wbindgen_bigint_from_u64: Yt,
        __wbindgen_boolean_get: qt,
        __wbindgen_debug_string: Jt,
        __wbindgen_error_new: Kt,
        __wbindgen_init_externref_table: Xt,
        __wbindgen_is_array: Gt,
        __wbindgen_is_function: Zt,
        __wbindgen_is_null: Qt,
        __wbindgen_is_object: en,
        __wbindgen_is_string: tn,
        __wbindgen_is_undefined: nn,
        __wbindgen_json_serialize: rn,
        __wbindgen_jsval_loose_eq: on,
        __wbindgen_memory: sn,
        __wbindgen_number_get: an,
        __wbindgen_number_new: cn,
        __wbindgen_string_get: _n,
        __wbindgen_string_new: un,
        __wbindgen_throw: ln,
        create: Vn,
        decodeChange: Jn,
        decodeSyncMessage: Qn,
        decodeSyncState: tr,
        encodeChange: qn,
        encodeSyncMessage: Zn,
        encodeSyncState: er,
        exportSyncState: Gn,
        importSyncState: Xn,
        initSyncState: Kn,
        load: Yn
      }, Symbol.toStringTag, {
        value: "Module"
      })), oe = Symbol.for("_am_meta"), G = Symbol.for("_am_trace"), W = Symbol.for("_am_objectId"), pe = Symbol.for("_am_isProxy"), we = Symbol.for("_am_clearCache"), Ko = Symbol.for("_am_uint"), Xo = Symbol.for("_am_int"), Go = Symbol.for("_am_f64"), fn = Symbol.for("_am_counter"), dn = Symbol.for("_am_immutableString");
      class fe {
        constructor(e) {
          this.value = e || 0, Reflect.defineProperty(this, fn, {
            value: true
          });
        }
        valueOf() {
          return this.value;
        }
        toString() {
          return this.valueOf().toString();
        }
        toJSON() {
          return this.value;
        }
        increment(e) {
          throw new Error("Counters should not be incremented outside of a change callback");
        }
        decrement(e) {
          throw new Error("Counters should not be decremented outside of a change callback");
        }
      }
      class Zo extends fe {
        constructor(e, n, r, o, s) {
          super(e), this.context = n, this.path = r, this.objectId = o, this.key = s;
        }
        increment(e) {
          return e = typeof e == "number" ? e : 1, this.context.increment(this.objectId, this.key, e), this.value += e, this.value;
        }
        decrement(e) {
          return this.increment(typeof e == "number" ? -e : -1);
        }
      }
      function Qo(t, e, n, r, o) {
        return new Zo(t, e, n, r, o);
      }
      var hn;
      class bn {
        constructor(e) {
          this[hn] = true, this.val = e;
        }
        toString() {
          return this.val;
        }
        toJSON() {
          return this.val;
        }
      }
      hn = dn;
      function I(t) {
        if (typeof t == "string" && /^[0-9]+$/.test(t) && (t = parseInt(t, 10)), typeof t != "number") return t;
        if (t < 0 || isNaN(t) || t === 1 / 0 || t === -1 / 0) throw new RangeError("A list index must be positive, but you passed " + t);
        return t;
      }
      function w(t, e) {
        const { context: n, objectId: r, path: o } = t, s = n.getWithType(r, e);
        if (s === null) return;
        const c = s[0], _ = s[1];
        switch (c) {
          case void 0:
            return;
          case "map":
            return V(n, _, [
              ...o,
              e
            ]);
          case "list":
            return ae(n, _, [
              ...o,
              e
            ]);
          case "text":
            return n.text(_);
          case "str":
            return new bn(_);
          case "uint":
            return _;
          case "int":
            return _;
          case "f64":
            return _;
          case "boolean":
            return _;
          case "null":
            return null;
          case "bytes":
            return _;
          case "timestamp":
            return _;
          case "counter":
            return Qo(_, n, o, r, e);
          default:
            throw RangeError(`datatype ${c} unimplemented`);
        }
      }
      function Z(t, e, n) {
        const r = typeof t;
        switch (r) {
          case "object":
            if (t == null) return [
              null,
              "null"
            ];
            if (t[Ko]) return [
              t.value,
              "uint"
            ];
            if (t[Xo]) return [
              t.value,
              "int"
            ];
            if (t[Go]) return [
              t.value,
              "f64"
            ];
            if (t[fn]) return [
              t.value,
              "counter"
            ];
            if (t instanceof Date) return [
              t.getTime(),
              "timestamp"
            ];
            if (mn(t)) return [
              t.toString(),
              "str"
            ];
            if (t instanceof Uint8Array) return [
              t,
              "bytes"
            ];
            if (t instanceof Array) return [
              t,
              "list"
            ];
            if (Object.prototype.toString.call(t) === "[object Object]") return [
              t,
              "map"
            ];
            throw se(t, n) ? new RangeError("Cannot create a reference to an existing document object") : new RangeError(`Cannot assign unknown object: ${t}`);
          case "boolean":
            return [
              t,
              "boolean"
            ];
          case "number":
            return Number.isInteger(t) ? [
              t,
              "int"
            ] : [
              t,
              "f64"
            ];
          case "string":
            return [
              t,
              "text"
            ];
          case "undefined":
            throw new RangeError([
              `Cannot assign undefined value at ${ke(e)}, `,
              "because `undefined` is not a valid JSON data type. ",
              "You might consider setting the property's value to `null`, ",
              "or using `delete` to remove it altogether."
            ].join(""));
          default:
            throw new RangeError([
              `Cannot assign ${r} value at ${ke(e)}. `,
              "All JSON primitive datatypes (object, array, string, number, boolean, null) ",
              `are supported in an Automerge document; ${r} values are not. `
            ].join(""));
        }
      }
      function se(t, e) {
        var n, r;
        return t instanceof Date ? false : !!(t && ((r = (n = t[oe]) === null || n === void 0 ? void 0 : n.handle) === null || r === void 0 ? void 0 : r.__wbg_ptr) === e.__wbg_ptr);
      }
      const es = {
        get(t, e) {
          const { context: n, objectId: r, cache: o } = t;
          return e === Symbol.toStringTag ? t[Symbol.toStringTag] : e === W ? r : e === pe ? true : e === G ? t.trace : e === oe ? {
            handle: n
          } : (o[e] || (o[e] = w(t, e)), o[e]);
        },
        set(t, e, n) {
          const { context: r, objectId: o, path: s } = t;
          if (t.cache = {}, se(n, r)) throw new RangeError("Cannot create a reference to an existing document object");
          if (e === G) return t.trace = n, true;
          if (e === we) return true;
          const [c, _] = Z(n, [
            ...s,
            e
          ], r);
          switch (_) {
            case "list": {
              const g = r.putObject(o, e, []), d = ae(r, g, [
                ...s,
                e
              ]);
              for (let h = 0; h < c.length; h++) d[h] = c[h];
              break;
            }
            case "text": {
              r.putObject(o, e, c);
              break;
            }
            case "map": {
              const g = r.putObject(o, e, {}), d = V(r, g, [
                ...s,
                e
              ]);
              for (const h in c) d[h] = c[h];
              break;
            }
            default:
              r.put(o, e, c, _);
          }
          return true;
        },
        deleteProperty(t, e) {
          const { context: n, objectId: r } = t;
          return t.cache = {}, n.delete(r, e), true;
        },
        has(t, e) {
          return this.get(t, e) !== void 0;
        },
        getOwnPropertyDescriptor(t, e) {
          const n = this.get(t, e);
          if (typeof n < "u") return {
            configurable: true,
            enumerable: true,
            value: n
          };
        },
        ownKeys(t) {
          const { context: e, objectId: n } = t, r = e.keys(n);
          return [
            ...new Set(r)
          ];
        }
      }, ts = {
        get(t, e) {
          const { context: n, objectId: r } = t;
          return e = I(e), e === Symbol.hasInstance ? (o) => Array.isArray(o) : e === Symbol.toStringTag ? t[Symbol.toStringTag] : e === W ? r : e === pe ? true : e === G ? t.trace : e === oe ? {
            handle: n
          } : e === "length" ? n.length(r) : typeof e == "number" ? w(t, e) : rs(t)[e];
        },
        set(t, e, n) {
          const { context: r, objectId: o, path: s } = t;
          if (e = I(e), se(n, r)) throw new RangeError("Cannot create a reference to an existing document object");
          if (e === we) return true;
          if (e === G) return t.trace = n, true;
          if (typeof e == "string") throw new RangeError("list index must be a number");
          const [c, _] = Z(n, [
            ...s,
            e
          ], r);
          switch (_) {
            case "list": {
              let g;
              e >= r.length(o) ? g = r.insertObject(o, e, []) : g = r.putObject(o, e, []), ae(r, g, [
                ...s,
                e
              ]).splice(0, 0, ...c);
              break;
            }
            case "text": {
              e >= r.length(o) ? r.insertObject(o, e, c) : r.putObject(o, e, c);
              break;
            }
            case "map": {
              let g;
              e >= r.length(o) ? g = r.insertObject(o, e, {}) : g = r.putObject(o, e, {});
              const d = V(r, g, [
                ...s,
                e
              ]);
              for (const h in c) d[h] = c[h];
              break;
            }
            default:
              e >= r.length(o) ? r.insert(o, e, c, _) : r.put(o, e, c, _);
          }
          return true;
        },
        deleteProperty(t, e) {
          const { context: n, objectId: r } = t;
          e = I(e);
          const o = n.get(r, e);
          if (o != null && o[0] == "counter") throw new TypeError("Unsupported operation: deleting a counter from a list");
          return n.delete(r, e), true;
        },
        has(t, e) {
          const { context: n, objectId: r } = t;
          return e = I(e), typeof e == "number" ? e < n.length(r) : e === "length";
        },
        getOwnPropertyDescriptor(t, e) {
          const { context: n, objectId: r } = t;
          return e === "length" ? {
            writable: true,
            value: n.length(r)
          } : e === W ? {
            configurable: false,
            enumerable: false,
            value: r
          } : (e = I(e), {
            configurable: true,
            enumerable: true,
            value: w(t, e)
          });
        },
        getPrototypeOf(t) {
          return Object.getPrototypeOf(t);
        },
        ownKeys() {
          const t = [];
          return t.push("length"), t;
        }
      };
      function V(t, e, n) {
        const r = {
          context: t,
          objectId: e,
          path: n || [],
          cache: {}
        }, o = {};
        return Object.assign(o, r), new Proxy(o, es);
      }
      function ae(t, e, n) {
        const r = {
          context: t,
          objectId: e,
          path: n || [],
          cache: {}
        }, o = [];
        return Object.assign(o, r), new Proxy(o, ts);
      }
      function ns(t) {
        return V(t, "_root", []);
      }
      function rs(t) {
        const { context: e, objectId: n, path: r } = t;
        return {
          at(s) {
            return w(t, s);
          },
          deleteAt(s, c) {
            return typeof c == "number" ? e.splice(n, s, c) : e.delete(n, s), this;
          },
          fill(s, c, _) {
            const [g, d] = Z(s, [
              ...r,
              c
            ], e), h = e.length(n);
            c = I(c || 0), _ = I(_ || h);
            for (let m = c; m < Math.min(_, h); m++) d === "list" || d === "map" || d === "text" ? e.putObject(n, m, g) : e.put(n, m, g, d);
            return this;
          },
          indexOf(s, c = 0) {
            const _ = e.length(n);
            for (let g = c; g < _; g++) {
              const d = e.getWithType(n, g);
              if (!d) continue;
              const [h, m] = d;
              if (![
                "map",
                "list",
                "text"
              ].includes(h)) {
                if (m === s) return g;
                continue;
              }
              if (h === "text" && typeof s == "string" && s === w(t, g) || s[W] === m) return g;
            }
            return -1;
          },
          insertAt(s, ...c) {
            return this.splice(s, 0, ...c), this;
          },
          pop() {
            const s = e.length(n);
            if (s == 0) return;
            const c = w(t, s - 1);
            return e.delete(n, s - 1), c;
          },
          push(...s) {
            const c = e.length(n);
            return this.splice(c, 0, ...s), e.length(n);
          },
          shift() {
            if (e.length(n) == 0) return;
            const s = w(t, 0);
            return e.delete(n, 0), s;
          },
          splice(s, c, ..._) {
            s = I(s), typeof c != "number" && (c = e.length(n) - s), c = I(c);
            for (const h of _) if (se(h, e)) throw new RangeError("Cannot create a reference to an existing document object");
            const g = [];
            for (let h = 0; h < c; h++) {
              const m = w(t, s);
              m !== void 0 && g.push(m), e.delete(n, s);
            }
            const d = _.map((h, m) => {
              try {
                return Z(h, [
                  ...r
                ], e);
              } catch (v) {
                throw v instanceof RangeError ? new RangeError(`${v.message} (at index ${m} in the input)`) : v;
              }
            });
            for (const [h, m] of d) {
              switch (m) {
                case "list": {
                  const v = e.insertObject(n, s, []);
                  ae(e, v, [
                    ...r,
                    s
                  ]).splice(0, 0, ...h);
                  break;
                }
                case "text": {
                  e.insertObject(n, s, h);
                  break;
                }
                case "map": {
                  const v = e.insertObject(n, s, {}), Ie = V(e, v, [
                    ...r,
                    s
                  ]);
                  for (const Te in h) Ie[Te] = h[Te];
                  break;
                }
                default:
                  e.insert(n, s, h, m);
              }
              s += 1;
            }
            return g;
          },
          unshift(...s) {
            return this.splice(0, 0, ...s), e.length(n);
          },
          entries() {
            let s = 0;
            return {
              next: () => {
                const _ = w(t, s);
                return _ === void 0 ? {
                  value: void 0,
                  done: true
                } : {
                  value: [
                    s++,
                    _
                  ],
                  done: false
                };
              },
              [Symbol.iterator]() {
                return this;
              }
            };
          },
          keys() {
            let s = 0;
            const c = e.length(n);
            return {
              next: () => s < c ? {
                value: s++,
                done: false
              } : {
                value: void 0,
                done: true
              },
              [Symbol.iterator]() {
                return this;
              }
            };
          },
          values() {
            let s = 0;
            return {
              next: () => {
                const _ = w(t, s++);
                return _ === void 0 ? {
                  value: void 0,
                  done: true
                } : {
                  value: _,
                  done: false
                };
              },
              [Symbol.iterator]() {
                return this;
              }
            };
          },
          toArray() {
            const s = [];
            let c;
            do
              c = w(t, s.length), c !== void 0 && s.push(c);
            while (c !== void 0);
            return s;
          },
          map(s) {
            return this.toArray().map(s);
          },
          toString() {
            return this.toArray().toString();
          },
          toLocaleString() {
            return this.toArray().toLocaleString();
          },
          forEach(s) {
            return this.toArray().forEach(s);
          },
          concat(s) {
            return this.toArray().concat(s);
          },
          every(s) {
            return this.toArray().every(s);
          },
          filter(s) {
            return this.toArray().filter(s);
          },
          find(s) {
            let c = 0;
            for (const _ of this) {
              if (s(_, c)) return _;
              c += 1;
            }
          },
          findIndex(s) {
            let c = 0;
            for (const _ of this) {
              if (s(_, c)) return c;
              c += 1;
            }
            return -1;
          },
          includes(s) {
            return this.find((c) => c === s) !== void 0;
          },
          join(s) {
            return this.toArray().join(s);
          },
          reduce(s, c) {
            return this.toArray().reduce(s, c);
          },
          reduceRight(s, c) {
            return this.toArray().reduceRight(s, c);
          },
          lastIndexOf(s, c = 1 / 0) {
            return this.toArray().lastIndexOf(s, c);
          },
          slice(s, c) {
            return this.toArray().slice(s, c);
          },
          some(s) {
            let c = 0;
            for (const _ of this) {
              if (s(_, c)) return true;
              c += 1;
            }
            return false;
          },
          [Symbol.iterator]: function* () {
            let s = 0, c = w(t, s);
            for (; c !== void 0; ) yield c, s += 1, c = w(t, s);
          }
        };
      }
      function ke(t) {
        const e = t.map((n) => {
          if (typeof n == "number") return n.toString();
          if (typeof n == "string") return n.replace(/~/g, "~0").replace(/\//g, "~1");
        });
        return t.length === 0 ? "" : "/" + e.join("/");
      }
      function mn(t) {
        return typeof t == "object" && t !== null && Object.prototype.hasOwnProperty.call(t, dn);
      }
      function O(t, e = true) {
        if (typeof t != "object") throw new RangeError("must be the document root");
        const n = Reflect.get(t, oe);
        if (n === void 0 || n == null || e && pn(t) !== "_root") throw new RangeError("must be the document root");
        return n;
      }
      function os(t) {
        Reflect.set(t, we, true);
      }
      function pn(t) {
        return typeof t != "object" || t === null ? null : Reflect.get(t, W);
      }
      function ye(t) {
        return !!Reflect.get(t, pe);
      }
      var ss = function(t, e) {
        var n = {};
        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
        if (t != null && typeof Object.getOwnPropertySymbols == "function") for (var o = 0, r = Object.getOwnPropertySymbols(t); o < r.length; o++) e.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(t, r[o]) && (n[r[o]] = t[r[o]]);
        return n;
      };
      function wn(t) {
        return typeof t == "object" ? t : {
          actor: t
        };
      }
      function as(t) {
        const e = wn(t), n = !!e.freeze, r = e.patchCallback, o = e.actor, s = me.create({
          actor: o
        });
        return s.enableFreeze(!!e.freeze), gs(s), s.materialize("/", void 0, {
          handle: s,
          heads: void 0,
          freeze: n,
          patchCallback: r
        });
      }
      function cs(t, e) {
        const n = O(t), r = n.handle;
        return n.handle.materialize("/", e, Object.assign(Object.assign({}, n), {
          handle: r,
          heads: e
        }));
      }
      function Q(t, e) {
        const n = O(t), r = n.heads, o = wn(e), s = n.handle.fork(o.actor, r);
        s.updateDiffCursor();
        const { heads: c } = n, _ = ss(n, [
          "heads"
        ]);
        return _.patchCallback = o.patchCallback, s.applyPatches(t, Object.assign(Object.assign({}, _), {
          handle: s
        }));
      }
      function L(t, e, n) {
        if (typeof e == "function") return is(t, "change", {}, e).newDoc;
        throw RangeError("Invalid args for change");
      }
      function yn(t, e, n, r) {
        if (n == null) return t;
        const o = O(t), s = Object.assign(Object.assign({}, o), {
          heads: void 0
        }), { value: c, patches: _ } = o.handle.applyAndReturnPatches(t, s);
        if (_.length > 0) {
          r == null ? void 0 : r(_, {
            before: t,
            after: c,
            source: e
          });
          const g = O(c);
          g.mostRecentPatch = {
            before: O(t).heads,
            after: g.handle.getHeads(),
            patches: _
          };
        }
        return o.heads = n, c;
      }
      function is(t, e, n, r, o) {
        if (typeof r != "function") throw new RangeError("invalid change function");
        const s = O(t);
        if (t === void 0 || s === void 0) throw new RangeError("must be the document root");
        if (s.heads) throw new RangeError("Attempting to change an outdated document.  Use Automerge.clone() if you wish to make a writable copy.");
        if (ye(t)) throw new RangeError("Calls to Automerge.change cannot be nested");
        let c = s.handle.getHeads();
        "time" in n || (n.time = Math.floor(Date.now() / 1e3));
        try {
          s.heads = c;
          const _ = ns(s.handle);
          if (r(_), s.handle.pendingOps() === 0) return s.heads = void 0, {
            newDoc: t,
            newHeads: null
          };
          {
            const g = s.handle.commit(n.message, n.time);
            return s.handle.integrate(), {
              newDoc: yn(t, e, c, n.patchCallback || s.patchCallback),
              newHeads: g != null ? [
                g
              ] : null
            };
          }
        } catch (_) {
          throw s.heads = void 0, s.handle.rollback(), _;
        }
      }
      function _s(t) {
        return O(t).handle.getLastLocalChange() || void 0;
      }
      function Pe(t, e, n) {
        const r = O(t);
        if (n || (n = {}), r.heads) throw new RangeError("Attempting to change an outdated document.  Use Automerge.clone() if you wish to make a writable copy.");
        if (ye(t)) throw new RangeError("Calls to Automerge.change cannot be nested");
        const o = r.handle.getHeads();
        return r.handle.applyChanges(e), r.heads = o, [
          yn(t, "applyChanges", o, n.patchCallback || r.patchCallback)
        ];
      }
      function us(t, e, n) {
        Be(e, "before"), Be(n, "after");
        const r = O(t);
        return r.mostRecentPatch && de(r.mostRecentPatch.before, e) && de(r.mostRecentPatch.after, n) ? r.mostRecentPatch.patches : r.handle.diff(e, n);
      }
      function Be(t, e) {
        if (!Array.isArray(t)) throw new Error(`${e} must be an array`);
      }
      function de(t, e) {
        if (!Le(t) || !Le(e)) return t === e;
        const n = Object.keys(t).sort(), r = Object.keys(e).sort();
        if (n.length !== r.length) return false;
        for (let o = 0; o < n.length; o++) if (n[o] !== r[o] || !de(t[n[o]], e[r[o]])) return false;
        return true;
      }
      function ls(t) {
        return me.decodeChange(t);
      }
      function Le(t) {
        return typeof t == "object" && t !== null;
      }
      function gs(t) {
        t.registerDatatype("counter", (e) => new fe(e), (e) => {
          if (e instanceof fe) return e.value;
        }), t.registerDatatype("str", (e) => new bn(e), (e) => {
          if (mn(e)) return e.val;
        });
      }
      function fs(t, e, n) {
        const r = ds(t, e, "updateText");
        if (!ye(t)) throw new RangeError("object cannot be modified outside of a change block");
        const o = O(t, false);
        os(t);
        try {
          return o.handle.updateText(r, n);
        } catch (s) {
          throw new RangeError(`Cannot updateText: ${s}`);
        }
      }
      function ds(t, e, n) {
        e = e.slice();
        const r = pn(t);
        if (!r) throw new RangeError(`invalid object for ${n}`);
        return e.unshift(r), e.join("/");
      }
      Fn(Jo);
      const he = Math.PI, Fe = he * 2, hs = (t, e = 0, n = 1) => Math.min(Math.max(t, e), n), be = (t = 0, e = -1, n = 1, r = false) => {
        let o = n === e ? e : (t - e) / (n - e);
        return r ? hs(o) : o;
      }, Se = (t = 0, e = -1, n = 1) => t * (n - e) + e, q = (t = 0, e = -1, n = 1, r = 0, o = 1, s = false, c = 1) => {
        n < e && ([e, n, r, o] = [
          n,
          e,
          o,
          r
        ]);
        let _ = be(t, e, n, s) ** c;
        return Se(_, r, o);
      }, Sn = (t = 0, e = 1) => Se(Math.random(), t, e), bs = (t = 0, e = 1) => Math.floor(Sn(t, e + 1)), ms = (t) => Number.EPSILON > Math.abs(t), ps = (t, e) => {
        const n = 1 / e;
        return Math.round(t * n) / n;
      };
      function ws(t) {
        const e = [
          ...t
        ];
        for (let n = e.length - 1; n > 0; n--) {
          const r = Math.floor(Math.random() * (n + 1));
          [e[n], e[r]] = [
            e[r],
            e[n]
          ];
        }
        return e;
      }
      const ys = (t, e) => t[e % t.length], xe = (t) => t[bs(0, t.length - 1)], _e = (t = 0.5) => Sn(0, 1) < t, a = (t = 0, e = 0) => ({
        x: t,
        y: e
      });
      a.of = (t) => a(t, t);
      a.clone = (t) => a(t.x, t.y);
      a.random = (t = 1) => a.Smul(t, a.complement(a.Smul(2, a(Math.random(), Math.random()))));
      a.fromA = ([t, e]) => a(t, e);
      a.toA = (t) => [
        t.x,
        t.y
      ];
      a.fromPolar = (t, e) => a(e * Math.cos(t), e * Math.sin(t));
      a.fromWindow = () => a(window.innerWidth, window.innerHeight);
      a.log = (t, e = 1) => "(" + a.toA(a.roundTo(t, e)).join(",") + ")";
      a.set = (t, e) => {
        t.x = e.x, t.y = e.y;
      };
      a.x = Object.freeze(a(1));
      a.y = Object.freeze(a(0, 1));
      a.zero = Object.freeze(a());
      a.map = (t, e) => a(t(e.x), t(e.y));
      a.map2 = (t, e, n) => a(t(e.x, n.x), t(e.y, n.y));
      a.reduce = (t, e) => t(e.x, e.y);
      a.cross = (t, e) => t.x * e.y - t.y * e.x;
      a.project = (t, e) => a.mulS(e, a.dot(t, e) / a.len2(e));
      a.reject = (t, e) => a.sub(t, a.project(t, e));
      a.scalarProjection = (t, e, n) => {
        const r = a.sub(t, e), o = a.normalize(a.sub(n, e)), s = a.mulS(o, a.dot(r, o));
        return a.add(e, s);
      };
      a.add = (t, e) => a(t.x + e.x, t.y + e.y);
      a.div = (t, e) => a(t.x / e.x, t.y / e.y);
      a.mul = (t, e) => a(t.x * e.x, t.y * e.y);
      a.sub = (t, e) => a(t.x - e.x, t.y - e.y);
      a.addS = (t, e) => a.add(t, a.of(e));
      a.divS = (t, e) => a.div(t, a.of(e));
      a.mulS = (t, e) => a.mul(t, a.of(e));
      a.subS = (t, e) => a.sub(t, a.of(e));
      a.Sadd = (t, e) => a.add(a.of(t), e);
      a.Sdiv = (t, e) => a.div(a.of(t), e);
      a.Smul = (t, e) => a.mul(a.of(t), e);
      a.Ssub = (t, e) => a.sub(a.of(t), e);
      a.dist = (t, e) => a.len(a.sub(t, e));
      a.dist2 = (t, e) => a.len2(a.sub(t, e));
      a.dot = (t, e) => t.x * e.x + t.y * e.y;
      a.equal = (t, e) => ms(a.dist2(t, e));
      a.len2 = (t) => a.dot(t, t);
      a.len = (t) => Math.sqrt(a.dot(t, t));
      a.ceil = (t) => a.map(Math.ceil, t);
      a.floor = (t) => a.map(Math.floor, t);
      a.round = (t) => a.map(Math.round, t);
      a.roundTo = (t, e) => a.map2(ps, t, a.of(e));
      a.complement = (t) => a.Ssub(1, t);
      a.half = (t) => a.divS(t, 2);
      a.normalize = (t) => a.divS(t, a.len(t));
      a.recip = (t) => a.Sdiv(1, t);
      a.renormalize = (t, e) => a.Smul(e, a.normalize(t));
      a.lengthen = (t, e) => a.renormalize(t, a.len(t) + e);
      a.avg = (t, e) => a.half(a.add(t, e));
      a.lerp = (t, e, n) => a.add(t, a.Smul(n, a.sub(e, t)));
      a.max = (t, e) => a.map2(Math.max, t, e);
      a.min = (t, e) => a.map2(Math.min, t, e);
      a.abs = (t) => a.map(Math.abs, t);
      a.invert = (t) => a(-t.x, -t.y);
      a.invertX = (t) => a(-t.x, t.y);
      a.invertY = (t) => a(t.x, -t.y);
      a.rotate90CW = (t) => a(t.y, -t.x);
      a.rotate90CCW = (t) => a(-t.y, t.x);
      a.rotate = (t, e) => a(t.x * Math.cos(e) - t.y * Math.sin(e), t.x * Math.sin(e) + t.y * Math.cos(e));
      a.rotateAround = (t, e, n) => {
        const r = a.sub(t, e), o = a.rotate(r, n);
        return a.add(o, e);
      };
      a.angle = (t) => Math.atan2(t.y, t.x);
      a.angleBetween = (t, e) => {
        const n = a.dot(t, e), r = a.len(t), o = a.len(e);
        return Math.acos(n / (r * o));
      };
      a.angleBetweenClockwise = (t, e) => {
        const n = a.dot(t, e), r = a.cross(t, e);
        return Math.atan2(r, n);
      };
      const H = 500, $ = 50, Ss = 10, Ae = document.createElement("canvas"), P = Ae.getContext("2d", {
        willReadFrequently: true
      }), y = 1;
      Ae.width = H * y;
      Ae.height = $ * y;
      P.scale(y, y);
      P.font = "500 16px / 1 'Overpass Mono'";
      function xs(t, e) {
        const n = [];
        for (let r of t.edits) if (r.type == "edit") {
          P.fillStyle = "black", P.fillRect(0, 0, H, $), P.fillStyle = "white", P.fillText(r.text, 0, 14);
          const o = P.getImageData(0, 0, H, $).data;
          for (let s = 0; s < $; s++) for (let c = 0; c < H; c++) {
            const _ = (s * H + c) * 4;
            if (o[_] > 127) {
              let g = c + (22.5 + r.charIndex * 9.8) * y;
              n.push(J(g, s, e));
            }
          }
        } else if (r.type == "clear") {
          let o = 8, s = 9, c = -6, _ = 250;
          for (let g = o; g <= s; g++) for (let d = c; d <= _; d++) n.push(J(d * y, g * y, e));
        } else if (r.type == "toggle" && r.value) {
          let o = 2, s = 15, c = 1, _ = 14;
          for (let g = o; g <= s; g++) for (let d = c; d <= _; d++) n.push(J(d * y, g * y, e));
        } else {
          let o = 1, s = 16, c = 1, _ = 15, g = 1.5;
          for (let d = o; d <= s; d++) for (let h = c; h <= _; h++) (h - c < g || _ - h < g || d - o < g || s - d < g) && n.push(J(h * y, d * y, e));
        }
        return n;
      }
      function J(t = 0, e = 0, n) {
        let r = t / y, o = e / y, s = a(r, o), c = a.add(s, n), _ = a.random(0.1), g = Ss, d = 1 - e / $;
        return {
          local: s,
          pos: c,
          vel: _,
          springPos: c,
          springVel: _,
          springK: g,
          age: d,
          isComplete: false,
          color: [
            0.166,
            0.166,
            0.166,
            1
          ]
        };
      }
      const As = 4, Cs = 0.8, vs = `#version 300 es
in vec2 a_position;
in vec2 a_offset;
in float a_alpha;
in vec3 a_color;
out float v_alpha;
out vec3 v_color;
uniform vec2 u_resolution;
void main() {
  vec2 pos = a_position + a_offset;
  gl_Position = vec4(pos / u_resolution * 2.0 - 1.0, 0, 1);
  gl_Position.y *= -1.0;
  v_alpha = a_alpha;
  v_color = a_color;
}
`, Rs = `#version 300 es
precision mediump float;
in float v_alpha;
in vec3 v_color;
out vec4 outColor;
void main() {
  outColor = vec4(v_color, v_alpha);
}
`, U = document.querySelector("#demo canvas"), ee = window.devicePixelRatio;
      let te = 0, ne = 0, X;
      const xn = () => {
        X = U.getBoundingClientRect(), te = X.width, ne = X.height, U.width = te * ee, U.height = ne * ee;
      };
      xn();
      window.onresize = xn;
      function js() {
        return X ?? (X = U.getBoundingClientRect());
      }
      function An(t, e, n) {
        const r = t.createShader(e);
        return t.shaderSource(r, n), t.compileShader(r), r;
      }
      function Es(t, e) {
        const n = [];
        for (let r = 0; r < t; r++) {
          const o = r / t * Fe + he / 4, s = (r + 1) / t * Fe + he / 4;
          n.push(0, 0, e * Math.cos(o), e * Math.sin(o), e * Math.cos(s), e * Math.sin(s));
        }
        return n;
      }
      const f = U.getContext("webgl2", {
        antialias: true
      });
      f.enable(f.BLEND);
      f.blendFunc(f.SRC_ALPHA, f.ONE_MINUS_SRC_ALPHA);
      const Os = An(f, f.VERTEX_SHADER, vs), Is = An(f, f.FRAGMENT_SHADER, Rs), M = f.createProgram();
      f.attachShader(M, Os);
      f.attachShader(M, Is);
      f.linkProgram(M);
      const Ts = f.getUniformLocation(M, "u_resolution"), Cn = f.createVertexArray();
      f.bindVertexArray(Cn);
      const vn = Es(As, Cs), Ms = vn.length / 2, Ds = f.createBuffer();
      f.bindBuffer(f.ARRAY_BUFFER, Ds);
      f.bufferData(f.ARRAY_BUFFER, new Float32Array(vn), f.STATIC_DRAW);
      const Rn = f.getAttribLocation(M, "a_position");
      f.enableVertexAttribArray(Rn);
      f.vertexAttribPointer(Rn, 2, f.FLOAT, false, 0, 0);
      const jn = f.createBuffer();
      f.bindBuffer(f.ARRAY_BUFFER, jn);
      const Ce = f.getAttribLocation(M, "a_offset");
      f.enableVertexAttribArray(Ce);
      f.vertexAttribPointer(Ce, 2, f.FLOAT, false, 0, 0);
      f.vertexAttribDivisor(Ce, 1);
      const En = f.createBuffer();
      f.bindBuffer(f.ARRAY_BUFFER, En);
      const ve = f.getAttribLocation(M, "a_alpha");
      f.enableVertexAttribArray(ve);
      f.vertexAttribPointer(ve, 1, f.FLOAT, false, 0, 0);
      f.vertexAttribDivisor(ve, 1);
      const On = f.createBuffer();
      f.bindBuffer(f.ARRAY_BUFFER, On);
      const Re = f.getAttribLocation(M, "a_color");
      f.enableVertexAttribArray(Re);
      f.vertexAttribPointer(Re, 3, f.FLOAT, false, 0, 0);
      f.vertexAttribDivisor(Re, 1);
      function ks(t) {
        f.viewport(0, 0, te * ee, ne * ee), f.clearColor(0, 0, 0, 0), f.clear(f.COLOR_BUFFER_BIT), f.useProgram(M), f.uniform2f(Ts, te, ne), f.bindVertexArray(Cn);
        const e = new Float32Array(t.length * 2), n = new Float32Array(t.length), r = new Float32Array(t.length * 3);
        for (let o = 0; o < t.length; o++) {
          e[o * 2] = t[o].x, e[o * 2 + 1] = t[o].y;
          const [s, c, _, g] = t[o].color;
          r[o * 3] = s, r[o * 3 + 1] = c, r[o * 3 + 2] = _, n[o] = g;
        }
        f.bindBuffer(f.ARRAY_BUFFER, jn), f.bufferData(f.ARRAY_BUFFER, e, f.DYNAMIC_DRAW), f.bindBuffer(f.ARRAY_BUFFER, En), f.bufferData(f.ARRAY_BUFFER, n, f.DYNAMIC_DRAW), f.bindBuffer(f.ARRAY_BUFFER, On), f.bufferData(f.ARRAY_BUFFER, r, f.DYNAMIC_DRAW), f.drawArraysInstanced(f.TRIANGLES, 0, Ms, t.length);
      }
      const _j = class _j {
        constructor(e, n, r, o) {
          __publicField(this, "dots");
          __publicField(this, "dest", {
            x: 0,
            y: 0
          });
          __publicField(this, "applyEarly", false);
          this.sourceInfo = e, this.source = n, this.target = r, this.isDelete = o, e.edits.some((c) => c.type == "add") && (this.applyEarly = true), this.dots = xs(e, He(n, e.todoIndex)), _j.all.add(this);
        }
        static update(e) {
          _j.all.forEach((n) => n.physics(e)), ks(Array.from(_j.all).flatMap((n) => n.dots.map(({ springPos: r, color: o }) => ({
            ...r,
            color: o
          }))));
        }
        static recalc() {
          let e = /* @__PURE__ */ new Map();
          for (let n of _j.all) {
            for (let r = 0; r < n.target.spec.todos.length; r++) e.set(n.target.spec.todos[r].id, r);
            n.target.speculate(n.sourceInfo);
            for (let r = 0; r < n.target.spec.todos.length; r++) e.set(n.target.spec.todos[r].id, r);
          }
          for (let n of _j.all) {
            let r = e.get(n.sourceInfo.id);
            if (r != null && r >= 0) n.dest = He(n.target, r);
            else debugger;
          }
        }
        physics(e) {
          let n = true;
          for (const r of this.dots) {
            if (r.isComplete) continue;
            let o = a.add(this.dest, r.local), s = a.len(a.sub(o, r.springPos));
            if (s < 50 && this.applyEarly && (this.applyEarly = false, this.target.applyChange(this.sourceInfo.change)), s < 0.1) {
              this.isDelete || (r.color[3] = 0.7), r.isComplete = true;
              continue;
            }
            n = false, r.age += e;
            let c = be(r.age, 0, 4, true) ** 1.5, _ = 0.02 * c, g = a.renormalize(a.sub(o, r.pos), _), d = be(s, 120, 0, true), h = Se(d, 0.99, 0.88) ** (e * 60);
            r.vel = a.add(r.vel, a.Smul(120 * e, g)), r.vel = a.mulS(r.vel, h), r.pos = a.add(r.pos, a.Smul(120 * e, r.vel));
            const m = a.sub(r.pos, r.springPos), v = a.Smul(r.springK * c, m);
            r.springVel = a.add(r.springVel, a.Smul(e, v)), r.springVel = a.mulS(r.springVel, h), r.springPos = a.add(r.springPos, a.Smul(e, r.springVel)), this.isDelete ? (r.color[0] = q(s, 500, 0, 0.133, 0.8 * 1), r.color[1] = q(s, 500, 0, 0.133, 0.8 * 0.8), r.color[2] = q(s, 500, 0, 0.133, 0.8 * 0.2)) : r.color[3] = q(r.age, 0, 3, 0, 1);
          }
          n && (_j.all.delete(this), this.target.applyChange(this.sourceInfo.change));
        }
      };
      __publicField(_j, "all", /* @__PURE__ */ new Set());
      let j = _j;
      function He(t, e) {
        let n = a.add(t.cachedListElmPos, a(10, 5.5 + e * 28));
        return a.sub(n, js());
      }
      const ue = 5;
      const _F = class _F {
        constructor(e, n) {
          __publicField(this, "spec");
          __publicField(this, "nextTodoId", 0);
          __publicField(this, "editing", null);
          __publicField(this, "listElm");
          __publicField(this, "overflowElm");
          __publicField(this, "elements", /* @__PURE__ */ new Map());
          __publicField(this, "cachedListElmPos", {
            x: 0,
            y: 0
          });
          this.name = e, this.doc = n, this.spec = Q(this.doc);
          const r = document.querySelector(`[js-client="${e}"]`), o = r.querySelector(".entry .text");
          o.onkeydown = (s) => {
            s.key == "Enter" && o.blur();
          }, o.onblur = () => {
            o.value.length <= 0 || (this.add(o.value, 0), o.value = "");
          }, this.listElm = r.querySelector(".list"), this.overflowElm = r.querySelector(".todo-overflow"), _F.all.push(this), this.render();
        }
        add(e, n) {
          const r = this.name + this.nextTodoId++;
          return this.doc = L(this.doc, (o) => o.todos.splice(n ?? o.todos.length, 0, {
            id: r,
            text: e,
            done: false
          })), this.broadcast(true), r;
        }
        edit(e, n) {
          const r = this.getIndex(e);
          if (r < 0) return console.log(`Couldn't edit todo ${e} on client ${this.name}`);
          let o = n.length < this.doc.todos[r].text.length;
          this.doc = L(this.doc, (s) => fs(s, [
            "todos",
            r,
            "text"
          ], n)), this.broadcast(false, o);
        }
        toggle(e, n) {
          const r = this.getIndex(e);
          if (r < 0) return console.log(`Couldn't toggle todo ${e} on client ${this.name}`);
          this.doc = L(this.doc, (o) => o.todos[r].done = n ?? !o.todos[r].done), this.broadcast();
        }
        clear(e) {
          const n = this.getIndex(e);
          if (n < 0) return console.log(`Couldn't clear todo ${e} on client ${this.name}`);
          this.doc = L(this.doc, (r) => r.todos.splice(n, 1)), this.broadcast(true, true);
        }
        clearAll() {
          for (; this.doc.todos.length > 0; ) this.doc = L(this.doc, (e) => e.todos.pop()), this.broadcast(true, true);
        }
        getIndex(e) {
          return this.doc.todos.findIndex((n) => n.id == e);
        }
        broadcast(e = false, n = false) {
          this.render();
          let r = _s(this.doc);
          if (!r) throw new Error("Couldn't get change?!");
          let o = Ps(this.doc, r, true);
          for (let s of _F.all) s != this && new j(o, this, s, n);
          for (let s of _F.all) s.resetSpec();
          j.recalc();
        }
        applyChange(e) {
          this.doc = Pe(this.doc, [
            e
          ])[0], this.resetSpec(), this.render();
        }
        speculate(e) {
          return this.spec = Pe(this.spec, [
            e.change
          ])[0];
        }
        resetSpec() {
          this.spec = Q(this.doc);
        }
        render() {
          const e = this.doc.todos, n = e.length > ue, r = Math.min(ue, e.length);
          this.overflowElm.textContent = `${e.length - ue} more\u2026`, this.overflowElm.classList.toggle("hidden", !n);
          const o = /* @__PURE__ */ new Map();
          for (let s = 0; s < r; s++) {
            const c = e[s];
            let _ = this.elements.get(c.id) ?? this.makeTodoElms(c.id);
            o.set(c.id, _), _.item.style.translate = `0 ${28 * s}px`, _.item.style.transition = "translate 1s", this.editing == c.id && document.activeElement != _.input && _.input.focus(), _.box.classList.toggle("hide", c.text.length <= 0), _.box.checked = c.done, (!this.editing || this.editing !== c.id) && (_.input.value = c.text);
          }
          this.elements.forEach(({ item: s }, c) => {
            if (!o.has(c)) try {
              s.remove();
            } catch {
              console.log("Calling .remove() failed \u2014 might want to investigate the DOM");
            }
          }), this.elements = o, this.resize();
        }
        resize() {
          this.cachedListElmPos = this.listElm.getBoundingClientRect();
        }
        makeTodoElms(e) {
          const n = In("div", "item", this.listElm), r = ze("checkbox", "checkbox", n);
          r.onclick = () => this.toggle(e);
          const o = ze("text", "text", n);
          o.onfocus = () => this.editing = e, o.oninput = () => this.edit(e, o.value), o.onkeydown = (c) => {
            c.key == "Enter" && o.blur();
          }, o.onblur = () => {
            if (o.value.length == 0) return this.clear(e);
            this.editing = null, this.render();
          };
          const s = {
            item: n,
            box: r,
            input: o
          };
          return this.elements.set(e, s), s;
        }
      };
      __publicField(_F, "all", []);
      let F = _F;
      function In(t, e, n) {
        const r = document.createElement(t);
        return r.className = e, n == null ? void 0 : n.appendChild(r), r;
      }
      function ze(t, e, n) {
        const r = In("input", e, n);
        return r.setAttribute("spellcheck", "false"), r.type = t, r;
      }
      function Ps(t, e, n = false) {
        const { deps: r, hash: o } = ls(e), s = us(t, r, [
          o
        ]), c = cs(t, r);
        return {
          change: e,
          ...Bs(t, c, s)
        };
      }
      function Bs(t, e, n) {
        if (n.length == 0) throw new Error("Unexpectedly empty patches");
        let r = n[0].path[1];
        if (n.some((c) => c.path[1] != r)) throw new Error("Found a change affecting multiple todos");
        let o = [];
        n.map((c) => {
          const { action: _, path: g } = c;
          if (_ == "conflict") {
            if (console.log(`conflict! ${g[2]}`), g[2] == "done") return o.push({
              type: "toggle",
              value: false
            });
            if (g[2] == "text") return o.push({
              type: "edit",
              text: "Nice! You made a conflict!",
              charIndex: 0
            });
          }
          if (_ == "insert") return o.push({
            type: "add"
          });
          if (_ == "put" && g[2] == "done") {
            let h = c.value;
            return o.push({
              type: "toggle",
              value: h
            });
          }
          if (_ == "del" && g.length == 2) return o.push({
            type: "clear"
          });
          if (_ == "splice" && g[2] == "text") {
            let { value: d } = c, h = g[3];
            return o.push({
              type: "edit",
              text: d,
              charIndex: h
            });
          }
          if (_ == "del" && g[2] == "text") {
            let d = g[3], h = c.length ?? 1, m = e.todos[r].text.slice(d, d + h);
            return o.push({
              type: "edit",
              text: m,
              charIndex: d
            });
          }
          if (g[2] != "id" && !(_ == "put" && g[2] == "text")) throw new Error("Unknown edit type");
        });
        let s = t.todos[r] ?? e.todos[r];
        if (!s) throw new Error("Unable to determine which TODO was changed");
        return {
          id: s.id,
          edits: o,
          todoIndex: r
        };
      }
      let Tn = L(as(), (t) => t.todos = []), N = new F("a", Q(Tn, {
        actor: "01"
      })), re = new F("b", Q(Tn, {
        actor: "00"
      }));
      window.desktop = N;
      window.phone = re;
      let $e = performance.now() / 1e3;
      function Mn(t) {
        let e = t / 1e3, n = Math.min(e - $e, 1 / 20);
        $e = e, j.update(n), requestAnimationFrame(Mn);
      }
      requestAnimationFrame(Mn);
      window.onresize = () => {
        N.resize(), re.resize();
      };
      let Ls = [
        [
          "Align dilithium matrix",
          "Charge AT field",
          "Lock S-foils",
          "Reticulate splines",
          "Load the jump program"
        ],
        [
          "Stabilize inertial dampers",
          "Override safety protocols",
          "Match spin rate",
          "Release handbrake",
          "Spin up FTL"
        ],
        [
          "Engage!",
          "Light the candle",
          "Flip and Burn",
          "We are go",
          "Liftoff"
        ],
        [
          "Open the pod bay doors",
          "Experience Bij"
        ]
      ], Fs = 0, ce = [], Dn = () => ce = ws(ys(Ls, Fs++));
      Dn();
      let kn = (t) => t.doc.todos.filter((e) => e.done), je = (t) => t.doc.todos.filter((e) => !e.done);
      function Ee(t, e) {
        let n = t.add("");
        Pn(t, e, n);
      }
      function Pn(t, e, n) {
        let r = Array.from(e), o = () => {
          if (r.length <= 0) return;
          let s = t.getIndex(n);
          if (s < 0) return console.log("Can't add chars to missing todo");
          let _ = t.doc.todos[s].text + r.shift();
          t.edit(n, _), setTimeout(o, 50);
        };
        o();
      }
      let Hs = (t, e, n) => {
        let r = () => {
          let o = t.getIndex(n);
          if (o < 0) return Ee(t, e);
          let s = t.doc.todos[o].text;
          if (s.length <= 0) return setTimeout(() => Pn(t, e, n), 2e3);
          let c = s.slice(0, -1);
          t.edit(n, c), setTimeout(r, 50);
        };
        r();
      }, le = (t) => Ee(t, ce.pop()), zs = (t) => {
        let e = ce.pop(), n = je(t);
        n.length == 0 ? Ee(t, e) : Hs(t, e, xe(n).id);
      }, Ue = (t) => {
        let e = je(t);
        e.length > 0 && t.toggle(xe(e).id, true);
      }, $s = (t) => {
        let e = kn(t);
        e.length > 0 && t.clear(xe(e).id);
      }, Us = (t) => t.clearAll();
      function D(t, e) {
        t(e), setTimeout(Oe, 1e3 * 9);
      }
      function Oe() {
        if (N.editing != null || re.editing != null) return setTimeout(Oe, 3e3);
        let t = _e() ? N : re, e = t.doc.todos.length, n = je(t), r = kn(t);
        if (ce.length == 0) {
          n.length > 0 ? D(Ue, t) : (D(Us, t), Dn());
          return;
        }
        if (e < 2) return D(le, N);
        if (_e(0.33) && e < 4) return D(le, t);
        if (_e(0.5)) return D(zs, t);
        if (n.length > 0) return D(Ue, t);
        if (r.length > 0) return D($s, t);
        D(le, t);
      }
      Oe();
    })();
  }
});
export default require_stdin();
