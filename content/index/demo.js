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
      let wasm$2;
      const cachedTextEncoder$1 = typeof TextEncoder !== "undefined" ? new TextEncoder("utf-8") : {
        encode: () => {
          throw Error("TextEncoder not available");
        }
      };
      typeof cachedTextEncoder$1.encodeInto === "function" ? function(arg, view) {
        return cachedTextEncoder$1.encodeInto(arg, view);
      } : function(arg, view) {
        const buf = cachedTextEncoder$1.encode(arg);
        view.set(buf);
        return {
          read: arg.length,
          written: buf.length
        };
      };
      const cachedTextDecoder$1 = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-8", {
        ignoreBOM: true,
        fatal: true
      }) : {
        decode: () => {
          throw Error("TextDecoder not available");
        }
      };
      if (typeof TextDecoder !== "undefined") {
        cachedTextDecoder$1.decode();
      }
      typeof FinalizationRegistry === "undefined" ? {} : new FinalizationRegistry((ptr) => wasm$2.__wbg_automerge_free(ptr >>> 0, 1));
      typeof FinalizationRegistry === "undefined" ? {} : new FinalizationRegistry((ptr) => wasm$2.__wbg_syncstate_free(ptr >>> 0, 1));
      let _initializeListeners = [];
      function UseApi(api2) {
        for (const k in api2) {
          ApiHandler[k] = api2[k];
        }
        for (const listener of _initializeListeners) {
          listener();
        }
      }
      const ApiHandler = {
        create(options) {
          throw new RangeError("Automerge.use() not called");
        },
        load(data, options) {
          throw new RangeError("Automerge.use() not called (load)");
        },
        encodeChange(change2) {
          throw new RangeError("Automerge.use() not called (encodeChange)");
        },
        decodeChange(change2) {
          throw new RangeError("Automerge.use() not called (decodeChange)");
        },
        initSyncState() {
          throw new RangeError("Automerge.use() not called (initSyncState)");
        },
        encodeSyncMessage(message) {
          throw new RangeError("Automerge.use() not called (encodeSyncMessage)");
        },
        decodeSyncMessage(msg) {
          throw new RangeError("Automerge.use() not called (decodeSyncMessage)");
        },
        encodeSyncState(state) {
          throw new RangeError("Automerge.use() not called (encodeSyncState)");
        },
        decodeSyncState(data) {
          throw new RangeError("Automerge.use() not called (decodeSyncState)");
        },
        exportSyncState(state) {
          throw new RangeError("Automerge.use() not called (exportSyncState)");
        },
        importSyncState(state) {
          throw new RangeError("Automerge.use() not called (importSyncState)");
        }
      };
      const __vite__wasmUrl = "/index/automerge_wasm_bg.wasm";
      const __vite__initWasm = async (opts = {}, url) => {
        let result;
        if (url.startsWith("data:")) {
          const urlContent = url.replace(/^data:.*?base64,/, "");
          let bytes;
          if (typeof Buffer === "function" && typeof Buffer.from === "function") {
            bytes = Buffer.from(urlContent, "base64");
          } else if (typeof atob === "function") {
            const binaryString = atob(urlContent);
            bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
          } else {
            throw new Error("Cannot decode base64-encoded data URL");
          }
          result = await WebAssembly.instantiate(bytes, opts);
        } else {
          const response = await fetch(url);
          const contentType = response.headers.get("Content-Type") || "";
          if ("instantiateStreaming" in WebAssembly && contentType.startsWith("application/wasm")) {
            result = await WebAssembly.instantiateStreaming(response, opts);
          } else {
            const buffer = await response.arrayBuffer();
            result = await WebAssembly.instantiate(buffer, opts);
          }
        }
        return result.instance.exports;
      };
      let wasm$1;
      function __wbg_set_wasm(val) {
        wasm$1 = val;
      }
      let WASM_VECTOR_LEN = 0;
      let cachedUint8ArrayMemory0 = null;
      function getUint8ArrayMemory0() {
        if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
          cachedUint8ArrayMemory0 = new Uint8Array(wasm$1.memory.buffer);
        }
        return cachedUint8ArrayMemory0;
      }
      const lTextEncoder = typeof TextEncoder === "undefined" ? (0, module.require)("util").TextEncoder : TextEncoder;
      let cachedTextEncoder = new lTextEncoder("utf-8");
      const encodeString = typeof cachedTextEncoder.encodeInto === "function" ? function(arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
      } : function(arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
          read: arg.length,
          written: buf.length
        };
      };
      function passStringToWasm0(arg, malloc, realloc) {
        if (realloc === void 0) {
          const buf = cachedTextEncoder.encode(arg);
          const ptr2 = malloc(buf.length, 1) >>> 0;
          getUint8ArrayMemory0().subarray(ptr2, ptr2 + buf.length).set(buf);
          WASM_VECTOR_LEN = buf.length;
          return ptr2;
        }
        let len = arg.length;
        let ptr = malloc(len, 1) >>> 0;
        const mem = getUint8ArrayMemory0();
        let offset = 0;
        for (; offset < len; offset++) {
          const code = arg.charCodeAt(offset);
          if (code > 127) break;
          mem[ptr + offset] = code;
        }
        if (offset !== len) {
          if (offset !== 0) {
            arg = arg.slice(offset);
          }
          ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
          const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
          const ret = encodeString(arg, view);
          offset += ret.written;
          ptr = realloc(ptr, len, offset, 1) >>> 0;
        }
        WASM_VECTOR_LEN = offset;
        return ptr;
      }
      let cachedDataViewMemory0 = null;
      function getDataViewMemory0() {
        if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === void 0 && cachedDataViewMemory0.buffer !== wasm$1.memory.buffer) {
          cachedDataViewMemory0 = new DataView(wasm$1.memory.buffer);
        }
        return cachedDataViewMemory0;
      }
      function addToExternrefTable0(obj) {
        const idx = wasm$1.__externref_table_alloc();
        wasm$1.__wbindgen_export_4.set(idx, obj);
        return idx;
      }
      function handleError(f, args) {
        try {
          return f.apply(this, args);
        } catch (e) {
          const idx = addToExternrefTable0(e);
          wasm$1.__wbindgen_exn_store(idx);
        }
      }
      const lTextDecoder = typeof TextDecoder === "undefined" ? (0, module.require)("util").TextDecoder : TextDecoder;
      let cachedTextDecoder = new lTextDecoder("utf-8", {
        ignoreBOM: true,
        fatal: true
      });
      cachedTextDecoder.decode();
      function getStringFromWasm0(ptr, len) {
        ptr = ptr >>> 0;
        return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
      }
      function getArrayU8FromWasm0(ptr, len) {
        ptr = ptr >>> 0;
        return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
      }
      function debugString(val) {
        const type = typeof val;
        if (type == "number" || type == "boolean" || val == null) {
          return `${val}`;
        }
        if (type == "string") {
          return `"${val}"`;
        }
        if (type == "symbol") {
          const description = val.description;
          if (description == null) {
            return "Symbol";
          } else {
            return `Symbol(${description})`;
          }
        }
        if (type == "function") {
          const name = val.name;
          if (typeof name == "string" && name.length > 0) {
            return `Function(${name})`;
          } else {
            return "Function";
          }
        }
        if (Array.isArray(val)) {
          const length = val.length;
          let debug = "[";
          if (length > 0) {
            debug += debugString(val[0]);
          }
          for (let i = 1; i < length; i++) {
            debug += ", " + debugString(val[i]);
          }
          debug += "]";
          return debug;
        }
        const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
        let className;
        if (builtInMatches && builtInMatches.length > 1) {
          className = builtInMatches[1];
        } else {
          return toString.call(val);
        }
        if (className == "Object") {
          try {
            return "Object(" + JSON.stringify(val) + ")";
          } catch (_) {
            return "Object";
          }
        }
        if (val instanceof Error) {
          return `${val.name}: ${val.message}
${val.stack}`;
        }
        return className;
      }
      function isLikeNone(x) {
        return x === void 0 || x === null;
      }
      function takeFromExternrefTable0(idx) {
        const value = wasm$1.__wbindgen_export_4.get(idx);
        wasm$1.__externref_table_dealloc(idx);
        return value;
      }
      function _assertClass(instance, klass) {
        if (!(instance instanceof klass)) {
          throw new Error(`expected instance of ${klass.name}`);
        }
      }
      function create$1(options) {
        const ret = wasm$1.create(options);
        if (ret[2]) {
          throw takeFromExternrefTable0(ret[1]);
        }
        return Automerge.__wrap(ret[0]);
      }
      function load$1(data, options) {
        const ret = wasm$1.load(data, options);
        if (ret[2]) {
          throw takeFromExternrefTable0(ret[1]);
        }
        return Automerge.__wrap(ret[0]);
      }
      function encodeChange$1(change2) {
        const ret = wasm$1.encodeChange(change2);
        if (ret[2]) {
          throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
      }
      function decodeChange$2(change2) {
        const ret = wasm$1.decodeChange(change2);
        if (ret[2]) {
          throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
      }
      function initSyncState$1() {
        const ret = wasm$1.initSyncState();
        return SyncState.__wrap(ret);
      }
      function importSyncState$1(state) {
        const ret = wasm$1.importSyncState(state);
        if (ret[2]) {
          throw takeFromExternrefTable0(ret[1]);
        }
        return SyncState.__wrap(ret[0]);
      }
      function exportSyncState$1(state) {
        _assertClass(state, SyncState);
        const ret = wasm$1.exportSyncState(state.__wbg_ptr);
        return ret;
      }
      function encodeSyncMessage$1(message) {
        const ret = wasm$1.encodeSyncMessage(message);
        if (ret[2]) {
          throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
      }
      function decodeSyncMessage$1(msg) {
        const ret = wasm$1.decodeSyncMessage(msg);
        if (ret[2]) {
          throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
      }
      function encodeSyncState$1(state) {
        _assertClass(state, SyncState);
        const ret = wasm$1.encodeSyncState(state.__wbg_ptr);
        return ret;
      }
      function decodeSyncState$1(data) {
        const ret = wasm$1.decodeSyncState(data);
        if (ret[2]) {
          throw takeFromExternrefTable0(ret[1]);
        }
        return SyncState.__wrap(ret[0]);
      }
      const AutomergeFinalization = typeof FinalizationRegistry === "undefined" ? {
        register: () => {
        },
        unregister: () => {
        }
      } : new FinalizationRegistry((ptr) => wasm$1.__wbg_automerge_free(ptr >>> 0, 1));
      class Automerge {
        static __wrap(ptr) {
          ptr = ptr >>> 0;
          const obj = Object.create(Automerge.prototype);
          obj.__wbg_ptr = ptr;
          AutomergeFinalization.register(obj, obj.__wbg_ptr, obj);
          return obj;
        }
        __destroy_into_raw() {
          const ptr = this.__wbg_ptr;
          this.__wbg_ptr = 0;
          AutomergeFinalization.unregister(this);
          return ptr;
        }
        free() {
          const ptr = this.__destroy_into_raw();
          wasm$1.__wbg_automerge_free(ptr, 0);
        }
        static new(actor) {
          var ptr0 = isLikeNone(actor) ? 0 : passStringToWasm0(actor, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
          var len0 = WASM_VECTOR_LEN;
          const ret = wasm$1.automerge_new(ptr0, len0);
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return Automerge.__wrap(ret[0]);
        }
        clone(actor) {
          var ptr0 = isLikeNone(actor) ? 0 : passStringToWasm0(actor, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
          var len0 = WASM_VECTOR_LEN;
          const ret = wasm$1.automerge_clone(this.__wbg_ptr, ptr0, len0);
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return Automerge.__wrap(ret[0]);
        }
        fork(actor, heads) {
          var ptr0 = isLikeNone(actor) ? 0 : passStringToWasm0(actor, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
          var len0 = WASM_VECTOR_LEN;
          const ret = wasm$1.automerge_fork(this.__wbg_ptr, ptr0, len0, heads);
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return Automerge.__wrap(ret[0]);
        }
        pendingOps() {
          const ret = wasm$1.automerge_pendingOps(this.__wbg_ptr);
          return ret;
        }
        commit(message, time) {
          var ptr0 = isLikeNone(message) ? 0 : passStringToWasm0(message, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
          var len0 = WASM_VECTOR_LEN;
          const ret = wasm$1.automerge_commit(this.__wbg_ptr, ptr0, len0, !isLikeNone(time), isLikeNone(time) ? 0 : time);
          return ret;
        }
        merge(other) {
          _assertClass(other, Automerge);
          const ret = wasm$1.automerge_merge(this.__wbg_ptr, other.__wbg_ptr);
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return takeFromExternrefTable0(ret[0]);
        }
        rollback() {
          const ret = wasm$1.automerge_rollback(this.__wbg_ptr);
          return ret;
        }
        keys(obj, heads) {
          const ret = wasm$1.automerge_keys(this.__wbg_ptr, obj, isLikeNone(heads) ? 0 : addToExternrefTable0(heads));
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return takeFromExternrefTable0(ret[0]);
        }
        text(obj, heads) {
          let deferred2_0;
          let deferred2_1;
          try {
            const ret = wasm$1.automerge_text(this.__wbg_ptr, obj, isLikeNone(heads) ? 0 : addToExternrefTable0(heads));
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
              ptr1 = 0;
              len1 = 0;
              throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
          } finally {
            wasm$1.__wbindgen_free(deferred2_0, deferred2_1, 1);
          }
        }
        spans(obj, heads) {
          const ret = wasm$1.automerge_spans(this.__wbg_ptr, obj, isLikeNone(heads) ? 0 : addToExternrefTable0(heads));
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return takeFromExternrefTable0(ret[0]);
        }
        splice(obj, start, delete_count, text) {
          const ret = wasm$1.automerge_splice(this.__wbg_ptr, obj, start, delete_count, text);
          if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
          }
        }
        updateText(obj, new_text) {
          const ret = wasm$1.automerge_updateText(this.__wbg_ptr, obj, new_text);
          if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
          }
        }
        updateSpans(obj, args, config) {
          const ret = wasm$1.automerge_updateSpans(this.__wbg_ptr, obj, args, config);
          if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
          }
        }
        push(obj, value, datatype) {
          const ret = wasm$1.automerge_push(this.__wbg_ptr, obj, value, datatype);
          if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
          }
        }
        pushObject(obj, value) {
          let deferred2_0;
          let deferred2_1;
          try {
            const ret = wasm$1.automerge_pushObject(this.__wbg_ptr, obj, value);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
              ptr1 = 0;
              len1 = 0;
              throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
          } finally {
            wasm$1.__wbindgen_free(deferred2_0, deferred2_1, 1);
          }
        }
        insert(obj, index, value, datatype) {
          const ret = wasm$1.automerge_insert(this.__wbg_ptr, obj, index, value, datatype);
          if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
          }
        }
        splitBlock(obj, index, block) {
          const ret = wasm$1.automerge_splitBlock(this.__wbg_ptr, obj, index, block);
          if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
          }
        }
        joinBlock(obj, index) {
          const ret = wasm$1.automerge_joinBlock(this.__wbg_ptr, obj, index);
          if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
          }
        }
        updateBlock(obj, index, block) {
          const ret = wasm$1.automerge_updateBlock(this.__wbg_ptr, obj, index, block);
          if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
          }
        }
        getBlock(text, index, heads) {
          const ret = wasm$1.automerge_getBlock(this.__wbg_ptr, text, index, isLikeNone(heads) ? 0 : addToExternrefTable0(heads));
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return takeFromExternrefTable0(ret[0]);
        }
        insertObject(obj, index, value) {
          let deferred2_0;
          let deferred2_1;
          try {
            const ret = wasm$1.automerge_insertObject(this.__wbg_ptr, obj, index, value);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
              ptr1 = 0;
              len1 = 0;
              throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
          } finally {
            wasm$1.__wbindgen_free(deferred2_0, deferred2_1, 1);
          }
        }
        put(obj, prop, value, datatype) {
          const ret = wasm$1.automerge_put(this.__wbg_ptr, obj, prop, value, datatype);
          if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
          }
        }
        putObject(obj, prop, value) {
          const ret = wasm$1.automerge_putObject(this.__wbg_ptr, obj, prop, value);
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return takeFromExternrefTable0(ret[0]);
        }
        increment(obj, prop, value) {
          const ret = wasm$1.automerge_increment(this.__wbg_ptr, obj, prop, value);
          if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
          }
        }
        get(obj, prop, heads) {
          const ret = wasm$1.automerge_get(this.__wbg_ptr, obj, prop, isLikeNone(heads) ? 0 : addToExternrefTable0(heads));
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return takeFromExternrefTable0(ret[0]);
        }
        getWithType(obj, prop, heads) {
          const ret = wasm$1.automerge_getWithType(this.__wbg_ptr, obj, prop, isLikeNone(heads) ? 0 : addToExternrefTable0(heads));
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return takeFromExternrefTable0(ret[0]);
        }
        objInfo(obj, heads) {
          const ret = wasm$1.automerge_objInfo(this.__wbg_ptr, obj, isLikeNone(heads) ? 0 : addToExternrefTable0(heads));
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return takeFromExternrefTable0(ret[0]);
        }
        getAll(obj, arg, heads) {
          const ret = wasm$1.automerge_getAll(this.__wbg_ptr, obj, arg, isLikeNone(heads) ? 0 : addToExternrefTable0(heads));
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return takeFromExternrefTable0(ret[0]);
        }
        enableFreeze(enable) {
          const ret = wasm$1.automerge_enableFreeze(this.__wbg_ptr, enable);
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return ret[0] !== 0;
        }
        registerDatatype(datatype, construct, deconstruct) {
          const ret = wasm$1.automerge_registerDatatype(this.__wbg_ptr, datatype, construct, deconstruct);
          if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
          }
        }
        applyPatches(object, meta) {
          const ret = wasm$1.automerge_applyPatches(this.__wbg_ptr, object, meta);
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return takeFromExternrefTable0(ret[0]);
        }
        applyAndReturnPatches(object, meta) {
          const ret = wasm$1.automerge_applyAndReturnPatches(this.__wbg_ptr, object, meta);
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return takeFromExternrefTable0(ret[0]);
        }
        diffIncremental() {
          const ret = wasm$1.automerge_diffIncremental(this.__wbg_ptr);
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return takeFromExternrefTable0(ret[0]);
        }
        updateDiffCursor() {
          wasm$1.automerge_updateDiffCursor(this.__wbg_ptr);
        }
        resetDiffCursor() {
          wasm$1.automerge_resetDiffCursor(this.__wbg_ptr);
        }
        diff(before, after) {
          const ret = wasm$1.automerge_diff(this.__wbg_ptr, before, after);
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return takeFromExternrefTable0(ret[0]);
        }
        isolate(heads) {
          const ret = wasm$1.automerge_isolate(this.__wbg_ptr, heads);
          if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
          }
        }
        integrate() {
          wasm$1.automerge_integrate(this.__wbg_ptr);
        }
        length(obj, heads) {
          const ret = wasm$1.automerge_length(this.__wbg_ptr, obj, isLikeNone(heads) ? 0 : addToExternrefTable0(heads));
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return ret[0];
        }
        delete(obj, prop) {
          const ret = wasm$1.automerge_delete(this.__wbg_ptr, obj, prop);
          if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
          }
        }
        save() {
          const ret = wasm$1.automerge_save(this.__wbg_ptr);
          return ret;
        }
        saveIncremental() {
          const ret = wasm$1.automerge_saveIncremental(this.__wbg_ptr);
          return ret;
        }
        saveSince(heads) {
          const ret = wasm$1.automerge_saveSince(this.__wbg_ptr, heads);
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return takeFromExternrefTable0(ret[0]);
        }
        saveNoCompress() {
          const ret = wasm$1.automerge_saveNoCompress(this.__wbg_ptr);
          return ret;
        }
        saveAndVerify() {
          const ret = wasm$1.automerge_saveAndVerify(this.__wbg_ptr);
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return takeFromExternrefTable0(ret[0]);
        }
        loadIncremental(data) {
          const ret = wasm$1.automerge_loadIncremental(this.__wbg_ptr, data);
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return ret[0];
        }
        applyChanges(changes) {
          const ret = wasm$1.automerge_applyChanges(this.__wbg_ptr, changes);
          if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
          }
        }
        getChanges(have_deps) {
          const ret = wasm$1.automerge_getChanges(this.__wbg_ptr, have_deps);
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return takeFromExternrefTable0(ret[0]);
        }
        getChangesMeta(have_deps) {
          const ret = wasm$1.automerge_getChangesMeta(this.__wbg_ptr, have_deps);
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return takeFromExternrefTable0(ret[0]);
        }
        getChangeByHash(hash) {
          const ret = wasm$1.automerge_getChangeByHash(this.__wbg_ptr, hash);
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return takeFromExternrefTable0(ret[0]);
        }
        getChangeMetaByHash(hash) {
          const ret = wasm$1.automerge_getChangeMetaByHash(this.__wbg_ptr, hash);
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return takeFromExternrefTable0(ret[0]);
        }
        getDecodedChangeByHash(hash) {
          const ret = wasm$1.automerge_getDecodedChangeByHash(this.__wbg_ptr, hash);
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return takeFromExternrefTable0(ret[0]);
        }
        getChangesAdded(other) {
          _assertClass(other, Automerge);
          const ret = wasm$1.automerge_getChangesAdded(this.__wbg_ptr, other.__wbg_ptr);
          return ret;
        }
        getHeads() {
          const ret = wasm$1.automerge_getHeads(this.__wbg_ptr);
          return ret;
        }
        getActorId() {
          let deferred1_0;
          let deferred1_1;
          try {
            const ret = wasm$1.automerge_getActorId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
          } finally {
            wasm$1.__wbindgen_free(deferred1_0, deferred1_1, 1);
          }
        }
        getLastLocalChange() {
          const ret = wasm$1.automerge_getLastLocalChange(this.__wbg_ptr);
          return ret;
        }
        dump() {
          wasm$1.automerge_dump(this.__wbg_ptr);
        }
        getMissingDeps(heads) {
          const ret = wasm$1.automerge_getMissingDeps(this.__wbg_ptr, isLikeNone(heads) ? 0 : addToExternrefTable0(heads));
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return takeFromExternrefTable0(ret[0]);
        }
        receiveSyncMessage(state, message) {
          _assertClass(state, SyncState);
          const ret = wasm$1.automerge_receiveSyncMessage(this.__wbg_ptr, state.__wbg_ptr, message);
          if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
          }
        }
        generateSyncMessage(state) {
          _assertClass(state, SyncState);
          const ret = wasm$1.automerge_generateSyncMessage(this.__wbg_ptr, state.__wbg_ptr);
          return ret;
        }
        toJS(meta) {
          const ret = wasm$1.automerge_toJS(this.__wbg_ptr, meta);
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return takeFromExternrefTable0(ret[0]);
        }
        materialize(obj, heads, meta) {
          const ret = wasm$1.automerge_materialize(this.__wbg_ptr, obj, isLikeNone(heads) ? 0 : addToExternrefTable0(heads), meta);
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return takeFromExternrefTable0(ret[0]);
        }
        getCursor(obj, position, heads, move_cursor) {
          let deferred2_0;
          let deferred2_1;
          try {
            const ret = wasm$1.automerge_getCursor(this.__wbg_ptr, obj, position, isLikeNone(heads) ? 0 : addToExternrefTable0(heads), move_cursor);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
              ptr1 = 0;
              len1 = 0;
              throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
          } finally {
            wasm$1.__wbindgen_free(deferred2_0, deferred2_1, 1);
          }
        }
        getCursorPosition(obj, cursor, heads) {
          const ret = wasm$1.automerge_getCursorPosition(this.__wbg_ptr, obj, cursor, isLikeNone(heads) ? 0 : addToExternrefTable0(heads));
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return ret[0];
        }
        emptyChange(message, time) {
          var ptr0 = isLikeNone(message) ? 0 : passStringToWasm0(message, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
          var len0 = WASM_VECTOR_LEN;
          const ret = wasm$1.automerge_emptyChange(this.__wbg_ptr, ptr0, len0, !isLikeNone(time), isLikeNone(time) ? 0 : time);
          return ret;
        }
        mark(obj, range, name, value, datatype) {
          const ret = wasm$1.automerge_mark(this.__wbg_ptr, obj, range, name, value, datatype);
          if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
          }
        }
        unmark(obj, range, name) {
          const ret = wasm$1.automerge_unmark(this.__wbg_ptr, obj, range, name);
          if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
          }
        }
        marks(obj, heads) {
          const ret = wasm$1.automerge_marks(this.__wbg_ptr, obj, isLikeNone(heads) ? 0 : addToExternrefTable0(heads));
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return takeFromExternrefTable0(ret[0]);
        }
        marksAt(obj, index, heads) {
          const ret = wasm$1.automerge_marksAt(this.__wbg_ptr, obj, index, isLikeNone(heads) ? 0 : addToExternrefTable0(heads));
          if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
          }
          return takeFromExternrefTable0(ret[0]);
        }
        hasOurChanges(state) {
          _assertClass(state, SyncState);
          const ret = wasm$1.automerge_hasOurChanges(this.__wbg_ptr, state.__wbg_ptr);
          return ret !== 0;
        }
        topoHistoryTraversal() {
          const ret = wasm$1.automerge_topoHistoryTraversal(this.__wbg_ptr);
          return ret;
        }
        stats() {
          const ret = wasm$1.automerge_stats(this.__wbg_ptr);
          return ret;
        }
      }
      const SyncStateFinalization = typeof FinalizationRegistry === "undefined" ? {
        register: () => {
        },
        unregister: () => {
        }
      } : new FinalizationRegistry((ptr) => wasm$1.__wbg_syncstate_free(ptr >>> 0, 1));
      class SyncState {
        static __wrap(ptr) {
          ptr = ptr >>> 0;
          const obj = Object.create(SyncState.prototype);
          obj.__wbg_ptr = ptr;
          SyncStateFinalization.register(obj, obj.__wbg_ptr, obj);
          return obj;
        }
        __destroy_into_raw() {
          const ptr = this.__wbg_ptr;
          this.__wbg_ptr = 0;
          SyncStateFinalization.unregister(this);
          return ptr;
        }
        free() {
          const ptr = this.__destroy_into_raw();
          wasm$1.__wbg_syncstate_free(ptr, 0);
        }
        get sharedHeads() {
          const ret = wasm$1.syncstate_sharedHeads(this.__wbg_ptr);
          return ret;
        }
        get lastSentHeads() {
          const ret = wasm$1.syncstate_lastSentHeads(this.__wbg_ptr);
          return ret;
        }
        set lastSentHeads(heads) {
          const ret = wasm$1.syncstate_set_lastSentHeads(this.__wbg_ptr, heads);
          if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
          }
        }
        set sentHashes(hashes) {
          const ret = wasm$1.syncstate_set_sentHashes(this.__wbg_ptr, hashes);
          if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
          }
        }
        clone() {
          const ret = wasm$1.syncstate_clone(this.__wbg_ptr);
          return SyncState.__wrap(ret);
        }
      }
      function __wbg_String_8f0eb39a4a4c2f66(arg0, arg1) {
        const ret = String(arg1);
        const ptr1 = passStringToWasm0(ret, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
      }
      function __wbg_apply_eb9e9b97497f91e4() {
        return handleError(function(arg0, arg1, arg2) {
          const ret = Reflect.apply(arg0, arg1, arg2);
          return ret;
        }, arguments);
      }
      function __wbg_assign_3627b8559449930a(arg0, arg1) {
        const ret = Object.assign(arg0, arg1);
        return ret;
      }
      function __wbg_buffer_609cc3eee51ed158(arg0) {
        const ret = arg0.buffer;
        return ret;
      }
      function __wbg_call_672a4d21634d4a24() {
        return handleError(function(arg0, arg1) {
          const ret = arg0.call(arg1);
          return ret;
        }, arguments);
      }
      function __wbg_call_7cccdd69e0791ae2() {
        return handleError(function(arg0, arg1, arg2) {
          const ret = arg0.call(arg1, arg2);
          return ret;
        }, arguments);
      }
      function __wbg_concat_9de968491c4340cf(arg0, arg1) {
        const ret = arg0.concat(arg1);
        return ret;
      }
      function __wbg_defineProperty_a3ddad9901e2d29e(arg0, arg1, arg2) {
        const ret = Object.defineProperty(arg0, arg1, arg2);
        return ret;
      }
      function __wbg_deleteProperty_96363d4a1d977c97() {
        return handleError(function(arg0, arg1) {
          const ret = Reflect.deleteProperty(arg0, arg1);
          return ret;
        }, arguments);
      }
      function __wbg_done_769e5ede4b31c67b(arg0) {
        const ret = arg0.done;
        return ret;
      }
      function __wbg_entries_3265d4158b33e5dc(arg0) {
        const ret = Object.entries(arg0);
        return ret;
      }
      function __wbg_error_7534b8e9a36f1ab4(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
          deferred0_0 = arg0;
          deferred0_1 = arg1;
          console.error(getStringFromWasm0(arg0, arg1));
        } finally {
          wasm$1.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
      }
      function __wbg_for_4ff07bddd743c5e7(arg0, arg1) {
        const ret = Symbol.for(getStringFromWasm0(arg0, arg1));
        return ret;
      }
      function __wbg_freeze_ef6d70cf38e8d948(arg0) {
        const ret = Object.freeze(arg0);
        return ret;
      }
      function __wbg_from_2a5d3e218e67aa85(arg0) {
        const ret = Array.from(arg0);
        return ret;
      }
      function __wbg_getRandomValues_3c9c0d586e575a16() {
        return handleError(function(arg0, arg1) {
          globalThis.crypto.getRandomValues(getArrayU8FromWasm0(arg0, arg1));
        }, arguments);
      }
      function __wbg_getTime_46267b1c24877e30(arg0) {
        const ret = arg0.getTime();
        return ret;
      }
      function __wbg_get_67b2ba62fc30de12() {
        return handleError(function(arg0, arg1) {
          const ret = Reflect.get(arg0, arg1);
          return ret;
        }, arguments);
      }
      function __wbg_get_b9b93047fe3cf45b(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return ret;
      }
      function __wbg_instanceof_ArrayBuffer_e14585432e3737fc(arg0) {
        let result;
        try {
          result = arg0 instanceof ArrayBuffer;
        } catch (_) {
          result = false;
        }
        const ret = result;
        return ret;
      }
      function __wbg_instanceof_Date_e9a9be8b9cea7890(arg0) {
        let result;
        try {
          result = arg0 instanceof Date;
        } catch (_) {
          result = false;
        }
        const ret = result;
        return ret;
      }
      function __wbg_instanceof_Object_7f2dcef8f78644a4(arg0) {
        let result;
        try {
          result = arg0 instanceof Object;
        } catch (_) {
          result = false;
        }
        const ret = result;
        return ret;
      }
      function __wbg_instanceof_Uint8Array_17156bcf118086a9(arg0) {
        let result;
        try {
          result = arg0 instanceof Uint8Array;
        } catch (_) {
          result = false;
        }
        const ret = result;
        return ret;
      }
      function __wbg_isArray_a1eab7e0d067391b(arg0) {
        const ret = Array.isArray(arg0);
        return ret;
      }
      function __wbg_iterator_9a24c88df860dc65() {
        const ret = Symbol.iterator;
        return ret;
      }
      function __wbg_keys_5c77a08ddc2fb8a6(arg0) {
        const ret = Object.keys(arg0);
        return ret;
      }
      function __wbg_length_a446193dc22c12f8(arg0) {
        const ret = arg0.length;
        return ret;
      }
      function __wbg_length_d56737991078581b(arg0) {
        const ret = arg0.length;
        return ret;
      }
      function __wbg_length_e2d2a49132c1b256(arg0) {
        const ret = arg0.length;
        return ret;
      }
      function __wbg_log_1ae1e9f741096e91(arg0, arg1) {
        console.log(arg0, arg1);
      }
      function __wbg_log_c222819a41e063d3(arg0) {
        console.log(arg0);
      }
      function __wbg_new_1ab78df5e132f715(arg0, arg1) {
        const ret = new RangeError(getStringFromWasm0(arg0, arg1));
        return ret;
      }
      function __wbg_new_31a97dac4f10fab7(arg0) {
        const ret = new Date(arg0);
        return ret;
      }
      function __wbg_new_405e22f390576ce2() {
        const ret = new Object();
        return ret;
      }
      function __wbg_new_78feb108b6472713() {
        const ret = new Array();
        return ret;
      }
      function __wbg_new_8a6f238a6ece86ea() {
        const ret = new Error();
        return ret;
      }
      function __wbg_new_a12002a7f91c75be(arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
      }
      function __wbg_new_c68d7209be747379(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
      }
      function __wbg_newwithbyteoffsetandlength_d97e637ebe145a9a(arg0, arg1, arg2) {
        const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
      }
      function __wbg_next_25feadfc0913fea9(arg0) {
        const ret = arg0.next;
        return ret;
      }
      function __wbg_next_6574e1a8a62d1055() {
        return handleError(function(arg0) {
          const ret = arg0.next();
          return ret;
        }, arguments);
      }
      function __wbg_ownKeys_3930041068756f1f() {
        return handleError(function(arg0) {
          const ret = Reflect.ownKeys(arg0);
          return ret;
        }, arguments);
      }
      function __wbg_push_737cfc8c1432c2c6(arg0, arg1) {
        const ret = arg0.push(arg1);
        return ret;
      }
      function __wbg_set_37837023f3d740e8(arg0, arg1, arg2) {
        arg0[arg1 >>> 0] = arg2;
      }
      function __wbg_set_3f1d0b984ed272ed(arg0, arg1, arg2) {
        arg0[arg1] = arg2;
      }
      function __wbg_set_65595bdd868b3009(arg0, arg1, arg2) {
        arg0.set(arg1, arg2 >>> 0);
      }
      function __wbg_set_bb8cecf6a62b9f46() {
        return handleError(function(arg0, arg1, arg2) {
          const ret = Reflect.set(arg0, arg1, arg2);
          return ret;
        }, arguments);
      }
      function __wbg_slice_972c243648c9fd2e(arg0, arg1, arg2) {
        const ret = arg0.slice(arg1 >>> 0, arg2 >>> 0);
        return ret;
      }
      function __wbg_stack_0ed75d68575b0f3c(arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
      }
      function __wbg_toString_66ab719c2a98bdf1(arg0) {
        const ret = arg0.toString();
        return ret;
      }
      function __wbg_unshift_c290010f73f04fb1(arg0, arg1) {
        const ret = arg0.unshift(arg1);
        return ret;
      }
      function __wbg_value_cd1ffa7b1ab794f1(arg0) {
        const ret = arg0.value;
        return ret;
      }
      function __wbg_values_fcb8ba8c0aad8b58(arg0) {
        const ret = Object.values(arg0);
        return ret;
      }
      function __wbindgen_bigint_from_i64(arg0) {
        const ret = arg0;
        return ret;
      }
      function __wbindgen_bigint_from_u64(arg0) {
        const ret = BigInt.asUintN(64, arg0);
        return ret;
      }
      function __wbindgen_boolean_get(arg0) {
        const v = arg0;
        const ret = typeof v === "boolean" ? v ? 1 : 0 : 2;
        return ret;
      }
      function __wbindgen_debug_string(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr1 = passStringToWasm0(ret, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
      }
      function __wbindgen_error_new(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
      }
      function __wbindgen_init_externref_table() {
        const table = wasm$1.__wbindgen_export_4;
        const offset = table.grow(4);
        table.set(0, void 0);
        table.set(offset + 0, void 0);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
      }
      function __wbindgen_is_array(arg0) {
        const ret = Array.isArray(arg0);
        return ret;
      }
      function __wbindgen_is_function(arg0) {
        const ret = typeof arg0 === "function";
        return ret;
      }
      function __wbindgen_is_null(arg0) {
        const ret = arg0 === null;
        return ret;
      }
      function __wbindgen_is_object(arg0) {
        const val = arg0;
        const ret = typeof val === "object" && val !== null;
        return ret;
      }
      function __wbindgen_is_string(arg0) {
        const ret = typeof arg0 === "string";
        return ret;
      }
      function __wbindgen_is_undefined(arg0) {
        const ret = arg0 === void 0;
        return ret;
      }
      function __wbindgen_json_serialize(arg0, arg1) {
        const obj = arg1;
        const ret = JSON.stringify(obj === void 0 ? null : obj);
        const ptr1 = passStringToWasm0(ret, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
      }
      function __wbindgen_jsval_loose_eq(arg0, arg1) {
        const ret = arg0 == arg1;
        return ret;
      }
      function __wbindgen_memory() {
        const ret = wasm$1.memory;
        return ret;
      }
      function __wbindgen_number_get(arg0, arg1) {
        const obj = arg1;
        const ret = typeof obj === "number" ? obj : void 0;
        getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
      }
      function __wbindgen_number_new(arg0) {
        const ret = arg0;
        return ret;
      }
      function __wbindgen_string_get(arg0, arg1) {
        const obj = arg1;
        const ret = typeof obj === "string" ? obj : void 0;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
      }
      function __wbindgen_string_new(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
      }
      function __wbindgen_throw(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
      }
      URL = globalThis.URL;
      const __vite__wasmModule = await __vite__initWasm({
        "./automerge_wasm_bg.js": {
          "__wbindgen_string_get": __wbindgen_string_get,
          "__wbindgen_error_new": __wbindgen_error_new,
          "__wbindgen_string_new": __wbindgen_string_new,
          "__wbindgen_number_new": __wbindgen_number_new,
          "__wbindgen_number_get": __wbindgen_number_get,
          "__wbindgen_is_undefined": __wbindgen_is_undefined,
          "__wbindgen_boolean_get": __wbindgen_boolean_get,
          "__wbindgen_is_null": __wbindgen_is_null,
          "__wbindgen_is_string": __wbindgen_is_string,
          "__wbindgen_is_function": __wbindgen_is_function,
          "__wbindgen_is_object": __wbindgen_is_object,
          "__wbindgen_is_array": __wbindgen_is_array,
          "__wbindgen_json_serialize": __wbindgen_json_serialize,
          "__wbg_new_8a6f238a6ece86ea": __wbg_new_8a6f238a6ece86ea,
          "__wbg_stack_0ed75d68575b0f3c": __wbg_stack_0ed75d68575b0f3c,
          "__wbg_error_7534b8e9a36f1ab4": __wbg_error_7534b8e9a36f1ab4,
          "__wbindgen_jsval_loose_eq": __wbindgen_jsval_loose_eq,
          "__wbg_String_8f0eb39a4a4c2f66": __wbg_String_8f0eb39a4a4c2f66,
          "__wbindgen_bigint_from_i64": __wbindgen_bigint_from_i64,
          "__wbindgen_bigint_from_u64": __wbindgen_bigint_from_u64,
          "__wbg_set_3f1d0b984ed272ed": __wbg_set_3f1d0b984ed272ed,
          "__wbg_getRandomValues_3c9c0d586e575a16": __wbg_getRandomValues_3c9c0d586e575a16,
          "__wbg_log_c222819a41e063d3": __wbg_log_c222819a41e063d3,
          "__wbg_log_1ae1e9f741096e91": __wbg_log_1ae1e9f741096e91,
          "__wbg_get_b9b93047fe3cf45b": __wbg_get_b9b93047fe3cf45b,
          "__wbg_length_e2d2a49132c1b256": __wbg_length_e2d2a49132c1b256,
          "__wbg_new_78feb108b6472713": __wbg_new_78feb108b6472713,
          "__wbg_next_25feadfc0913fea9": __wbg_next_25feadfc0913fea9,
          "__wbg_next_6574e1a8a62d1055": __wbg_next_6574e1a8a62d1055,
          "__wbg_done_769e5ede4b31c67b": __wbg_done_769e5ede4b31c67b,
          "__wbg_value_cd1ffa7b1ab794f1": __wbg_value_cd1ffa7b1ab794f1,
          "__wbg_iterator_9a24c88df860dc65": __wbg_iterator_9a24c88df860dc65,
          "__wbg_get_67b2ba62fc30de12": __wbg_get_67b2ba62fc30de12,
          "__wbg_call_672a4d21634d4a24": __wbg_call_672a4d21634d4a24,
          "__wbg_new_405e22f390576ce2": __wbg_new_405e22f390576ce2,
          "__wbg_length_d56737991078581b": __wbg_length_d56737991078581b,
          "__wbg_set_37837023f3d740e8": __wbg_set_37837023f3d740e8,
          "__wbg_from_2a5d3e218e67aa85": __wbg_from_2a5d3e218e67aa85,
          "__wbg_isArray_a1eab7e0d067391b": __wbg_isArray_a1eab7e0d067391b,
          "__wbg_push_737cfc8c1432c2c6": __wbg_push_737cfc8c1432c2c6,
          "__wbg_unshift_c290010f73f04fb1": __wbg_unshift_c290010f73f04fb1,
          "__wbg_instanceof_ArrayBuffer_e14585432e3737fc": __wbg_instanceof_ArrayBuffer_e14585432e3737fc,
          "__wbg_new_c68d7209be747379": __wbg_new_c68d7209be747379,
          "__wbg_call_7cccdd69e0791ae2": __wbg_call_7cccdd69e0791ae2,
          "__wbg_instanceof_Date_e9a9be8b9cea7890": __wbg_instanceof_Date_e9a9be8b9cea7890,
          "__wbg_getTime_46267b1c24877e30": __wbg_getTime_46267b1c24877e30,
          "__wbg_new_31a97dac4f10fab7": __wbg_new_31a97dac4f10fab7,
          "__wbg_instanceof_Object_7f2dcef8f78644a4": __wbg_instanceof_Object_7f2dcef8f78644a4,
          "__wbg_assign_3627b8559449930a": __wbg_assign_3627b8559449930a,
          "__wbg_defineProperty_a3ddad9901e2d29e": __wbg_defineProperty_a3ddad9901e2d29e,
          "__wbg_entries_3265d4158b33e5dc": __wbg_entries_3265d4158b33e5dc,
          "__wbg_freeze_ef6d70cf38e8d948": __wbg_freeze_ef6d70cf38e8d948,
          "__wbg_keys_5c77a08ddc2fb8a6": __wbg_keys_5c77a08ddc2fb8a6,
          "__wbg_values_fcb8ba8c0aad8b58": __wbg_values_fcb8ba8c0aad8b58,
          "__wbg_new_1ab78df5e132f715": __wbg_new_1ab78df5e132f715,
          "__wbg_apply_eb9e9b97497f91e4": __wbg_apply_eb9e9b97497f91e4,
          "__wbg_deleteProperty_96363d4a1d977c97": __wbg_deleteProperty_96363d4a1d977c97,
          "__wbg_ownKeys_3930041068756f1f": __wbg_ownKeys_3930041068756f1f,
          "__wbg_set_bb8cecf6a62b9f46": __wbg_set_bb8cecf6a62b9f46,
          "__wbg_buffer_609cc3eee51ed158": __wbg_buffer_609cc3eee51ed158,
          "__wbg_concat_9de968491c4340cf": __wbg_concat_9de968491c4340cf,
          "__wbg_slice_972c243648c9fd2e": __wbg_slice_972c243648c9fd2e,
          "__wbg_for_4ff07bddd743c5e7": __wbg_for_4ff07bddd743c5e7,
          "__wbg_toString_66ab719c2a98bdf1": __wbg_toString_66ab719c2a98bdf1,
          "__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a": __wbg_newwithbyteoffsetandlength_d97e637ebe145a9a,
          "__wbg_new_a12002a7f91c75be": __wbg_new_a12002a7f91c75be,
          "__wbg_set_65595bdd868b3009": __wbg_set_65595bdd868b3009,
          "__wbg_length_a446193dc22c12f8": __wbg_length_a446193dc22c12f8,
          "__wbg_instanceof_Uint8Array_17156bcf118086a9": __wbg_instanceof_Uint8Array_17156bcf118086a9,
          "__wbindgen_debug_string": __wbindgen_debug_string,
          "__wbindgen_throw": __wbindgen_throw,
          "__wbindgen_memory": __wbindgen_memory,
          "__wbindgen_init_externref_table": __wbindgen_init_externref_table
        }
      }, __vite__wasmUrl);
      const memory = __vite__wasmModule.memory;
      const __wbg_syncstate_free = __vite__wasmModule.__wbg_syncstate_free;
      const syncstate_sharedHeads = __vite__wasmModule.syncstate_sharedHeads;
      const syncstate_lastSentHeads = __vite__wasmModule.syncstate_lastSentHeads;
      const syncstate_set_lastSentHeads = __vite__wasmModule.syncstate_set_lastSentHeads;
      const syncstate_set_sentHashes = __vite__wasmModule.syncstate_set_sentHashes;
      const syncstate_clone = __vite__wasmModule.syncstate_clone;
      const __wbg_automerge_free = __vite__wasmModule.__wbg_automerge_free;
      const automerge_new = __vite__wasmModule.automerge_new;
      const automerge_clone = __vite__wasmModule.automerge_clone;
      const automerge_fork = __vite__wasmModule.automerge_fork;
      const automerge_pendingOps = __vite__wasmModule.automerge_pendingOps;
      const automerge_commit = __vite__wasmModule.automerge_commit;
      const automerge_merge = __vite__wasmModule.automerge_merge;
      const automerge_rollback = __vite__wasmModule.automerge_rollback;
      const automerge_keys = __vite__wasmModule.automerge_keys;
      const automerge_text = __vite__wasmModule.automerge_text;
      const automerge_spans = __vite__wasmModule.automerge_spans;
      const automerge_splice = __vite__wasmModule.automerge_splice;
      const automerge_updateText = __vite__wasmModule.automerge_updateText;
      const automerge_updateSpans = __vite__wasmModule.automerge_updateSpans;
      const automerge_push = __vite__wasmModule.automerge_push;
      const automerge_pushObject = __vite__wasmModule.automerge_pushObject;
      const automerge_insert = __vite__wasmModule.automerge_insert;
      const automerge_splitBlock = __vite__wasmModule.automerge_splitBlock;
      const automerge_joinBlock = __vite__wasmModule.automerge_joinBlock;
      const automerge_updateBlock = __vite__wasmModule.automerge_updateBlock;
      const automerge_getBlock = __vite__wasmModule.automerge_getBlock;
      const automerge_insertObject = __vite__wasmModule.automerge_insertObject;
      const automerge_put = __vite__wasmModule.automerge_put;
      const automerge_putObject = __vite__wasmModule.automerge_putObject;
      const automerge_increment = __vite__wasmModule.automerge_increment;
      const automerge_get = __vite__wasmModule.automerge_get;
      const automerge_getWithType = __vite__wasmModule.automerge_getWithType;
      const automerge_objInfo = __vite__wasmModule.automerge_objInfo;
      const automerge_getAll = __vite__wasmModule.automerge_getAll;
      const automerge_enableFreeze = __vite__wasmModule.automerge_enableFreeze;
      const automerge_registerDatatype = __vite__wasmModule.automerge_registerDatatype;
      const automerge_applyPatches = __vite__wasmModule.automerge_applyPatches;
      const automerge_applyAndReturnPatches = __vite__wasmModule.automerge_applyAndReturnPatches;
      const automerge_diffIncremental = __vite__wasmModule.automerge_diffIncremental;
      const automerge_updateDiffCursor = __vite__wasmModule.automerge_updateDiffCursor;
      const automerge_resetDiffCursor = __vite__wasmModule.automerge_resetDiffCursor;
      const automerge_diff = __vite__wasmModule.automerge_diff;
      const automerge_isolate = __vite__wasmModule.automerge_isolate;
      const automerge_integrate = __vite__wasmModule.automerge_integrate;
      const automerge_length = __vite__wasmModule.automerge_length;
      const automerge_delete = __vite__wasmModule.automerge_delete;
      const automerge_save = __vite__wasmModule.automerge_save;
      const automerge_saveIncremental = __vite__wasmModule.automerge_saveIncremental;
      const automerge_saveSince = __vite__wasmModule.automerge_saveSince;
      const automerge_saveNoCompress = __vite__wasmModule.automerge_saveNoCompress;
      const automerge_saveAndVerify = __vite__wasmModule.automerge_saveAndVerify;
      const automerge_loadIncremental = __vite__wasmModule.automerge_loadIncremental;
      const automerge_applyChanges = __vite__wasmModule.automerge_applyChanges;
      const automerge_getChanges = __vite__wasmModule.automerge_getChanges;
      const automerge_getChangesMeta = __vite__wasmModule.automerge_getChangesMeta;
      const automerge_getChangeByHash = __vite__wasmModule.automerge_getChangeByHash;
      const automerge_getChangeMetaByHash = __vite__wasmModule.automerge_getChangeMetaByHash;
      const automerge_getDecodedChangeByHash = __vite__wasmModule.automerge_getDecodedChangeByHash;
      const automerge_getChangesAdded = __vite__wasmModule.automerge_getChangesAdded;
      const automerge_getHeads = __vite__wasmModule.automerge_getHeads;
      const automerge_getActorId = __vite__wasmModule.automerge_getActorId;
      const automerge_getLastLocalChange = __vite__wasmModule.automerge_getLastLocalChange;
      const automerge_dump = __vite__wasmModule.automerge_dump;
      const automerge_getMissingDeps = __vite__wasmModule.automerge_getMissingDeps;
      const automerge_receiveSyncMessage = __vite__wasmModule.automerge_receiveSyncMessage;
      const automerge_generateSyncMessage = __vite__wasmModule.automerge_generateSyncMessage;
      const automerge_toJS = __vite__wasmModule.automerge_toJS;
      const automerge_materialize = __vite__wasmModule.automerge_materialize;
      const automerge_getCursor = __vite__wasmModule.automerge_getCursor;
      const automerge_getCursorPosition = __vite__wasmModule.automerge_getCursorPosition;
      const automerge_emptyChange = __vite__wasmModule.automerge_emptyChange;
      const automerge_mark = __vite__wasmModule.automerge_mark;
      const automerge_unmark = __vite__wasmModule.automerge_unmark;
      const automerge_marks = __vite__wasmModule.automerge_marks;
      const automerge_marksAt = __vite__wasmModule.automerge_marksAt;
      const automerge_hasOurChanges = __vite__wasmModule.automerge_hasOurChanges;
      const automerge_topoHistoryTraversal = __vite__wasmModule.automerge_topoHistoryTraversal;
      const automerge_stats = __vite__wasmModule.automerge_stats;
      const create = __vite__wasmModule.create;
      const load = __vite__wasmModule.load;
      const encodeChange = __vite__wasmModule.encodeChange;
      const decodeChange$1 = __vite__wasmModule.decodeChange;
      const initSyncState = __vite__wasmModule.initSyncState;
      const importSyncState = __vite__wasmModule.importSyncState;
      const exportSyncState = __vite__wasmModule.exportSyncState;
      const encodeSyncMessage = __vite__wasmModule.encodeSyncMessage;
      const decodeSyncMessage = __vite__wasmModule.decodeSyncMessage;
      const encodeSyncState = __vite__wasmModule.encodeSyncState;
      const decodeSyncState = __vite__wasmModule.decodeSyncState;
      const __wbindgen_malloc = __vite__wasmModule.__wbindgen_malloc;
      const __wbindgen_realloc = __vite__wasmModule.__wbindgen_realloc;
      const __wbindgen_exn_store = __vite__wasmModule.__wbindgen_exn_store;
      const __externref_table_alloc = __vite__wasmModule.__externref_table_alloc;
      const __wbindgen_export_4 = __vite__wasmModule.__wbindgen_export_4;
      const __wbindgen_free = __vite__wasmModule.__wbindgen_free;
      const __externref_table_dealloc = __vite__wasmModule.__externref_table_dealloc;
      const __wbindgen_start = __vite__wasmModule.__wbindgen_start;
      const wasm = Object.freeze(Object.defineProperty({
        __proto__: null,
        __externref_table_alloc,
        __externref_table_dealloc,
        __wbg_automerge_free,
        __wbg_syncstate_free,
        __wbindgen_exn_store,
        __wbindgen_export_4,
        __wbindgen_free,
        __wbindgen_malloc,
        __wbindgen_realloc,
        __wbindgen_start,
        automerge_applyAndReturnPatches,
        automerge_applyChanges,
        automerge_applyPatches,
        automerge_clone,
        automerge_commit,
        automerge_delete,
        automerge_diff,
        automerge_diffIncremental,
        automerge_dump,
        automerge_emptyChange,
        automerge_enableFreeze,
        automerge_fork,
        automerge_generateSyncMessage,
        automerge_get,
        automerge_getActorId,
        automerge_getAll,
        automerge_getBlock,
        automerge_getChangeByHash,
        automerge_getChangeMetaByHash,
        automerge_getChanges,
        automerge_getChangesAdded,
        automerge_getChangesMeta,
        automerge_getCursor,
        automerge_getCursorPosition,
        automerge_getDecodedChangeByHash,
        automerge_getHeads,
        automerge_getLastLocalChange,
        automerge_getMissingDeps,
        automerge_getWithType,
        automerge_hasOurChanges,
        automerge_increment,
        automerge_insert,
        automerge_insertObject,
        automerge_integrate,
        automerge_isolate,
        automerge_joinBlock,
        automerge_keys,
        automerge_length,
        automerge_loadIncremental,
        automerge_mark,
        automerge_marks,
        automerge_marksAt,
        automerge_materialize,
        automerge_merge,
        automerge_new,
        automerge_objInfo,
        automerge_pendingOps,
        automerge_push,
        automerge_pushObject,
        automerge_put,
        automerge_putObject,
        automerge_receiveSyncMessage,
        automerge_registerDatatype,
        automerge_resetDiffCursor,
        automerge_rollback,
        automerge_save,
        automerge_saveAndVerify,
        automerge_saveIncremental,
        automerge_saveNoCompress,
        automerge_saveSince,
        automerge_spans,
        automerge_splice,
        automerge_splitBlock,
        automerge_stats,
        automerge_text,
        automerge_toJS,
        automerge_topoHistoryTraversal,
        automerge_unmark,
        automerge_updateBlock,
        automerge_updateDiffCursor,
        automerge_updateSpans,
        automerge_updateText,
        create,
        decodeChange: decodeChange$1,
        decodeSyncMessage,
        decodeSyncState,
        encodeChange,
        encodeSyncMessage,
        encodeSyncState,
        exportSyncState,
        importSyncState,
        initSyncState,
        load,
        memory,
        syncstate_clone,
        syncstate_lastSentHeads,
        syncstate_set_lastSentHeads,
        syncstate_set_sentHashes,
        syncstate_sharedHeads
      }, Symbol.toStringTag, {
        value: "Module"
      }));
      __wbg_set_wasm(wasm);
      __wbindgen_start();
      const api = Object.freeze(Object.defineProperty({
        __proto__: null,
        Automerge,
        SyncState,
        __wbg_String_8f0eb39a4a4c2f66,
        __wbg_apply_eb9e9b97497f91e4,
        __wbg_assign_3627b8559449930a,
        __wbg_buffer_609cc3eee51ed158,
        __wbg_call_672a4d21634d4a24,
        __wbg_call_7cccdd69e0791ae2,
        __wbg_concat_9de968491c4340cf,
        __wbg_defineProperty_a3ddad9901e2d29e,
        __wbg_deleteProperty_96363d4a1d977c97,
        __wbg_done_769e5ede4b31c67b,
        __wbg_entries_3265d4158b33e5dc,
        __wbg_error_7534b8e9a36f1ab4,
        __wbg_for_4ff07bddd743c5e7,
        __wbg_freeze_ef6d70cf38e8d948,
        __wbg_from_2a5d3e218e67aa85,
        __wbg_getRandomValues_3c9c0d586e575a16,
        __wbg_getTime_46267b1c24877e30,
        __wbg_get_67b2ba62fc30de12,
        __wbg_get_b9b93047fe3cf45b,
        __wbg_instanceof_ArrayBuffer_e14585432e3737fc,
        __wbg_instanceof_Date_e9a9be8b9cea7890,
        __wbg_instanceof_Object_7f2dcef8f78644a4,
        __wbg_instanceof_Uint8Array_17156bcf118086a9,
        __wbg_isArray_a1eab7e0d067391b,
        __wbg_iterator_9a24c88df860dc65,
        __wbg_keys_5c77a08ddc2fb8a6,
        __wbg_length_a446193dc22c12f8,
        __wbg_length_d56737991078581b,
        __wbg_length_e2d2a49132c1b256,
        __wbg_log_1ae1e9f741096e91,
        __wbg_log_c222819a41e063d3,
        __wbg_new_1ab78df5e132f715,
        __wbg_new_31a97dac4f10fab7,
        __wbg_new_405e22f390576ce2,
        __wbg_new_78feb108b6472713,
        __wbg_new_8a6f238a6ece86ea,
        __wbg_new_a12002a7f91c75be,
        __wbg_new_c68d7209be747379,
        __wbg_newwithbyteoffsetandlength_d97e637ebe145a9a,
        __wbg_next_25feadfc0913fea9,
        __wbg_next_6574e1a8a62d1055,
        __wbg_ownKeys_3930041068756f1f,
        __wbg_push_737cfc8c1432c2c6,
        __wbg_set_37837023f3d740e8,
        __wbg_set_3f1d0b984ed272ed,
        __wbg_set_65595bdd868b3009,
        __wbg_set_bb8cecf6a62b9f46,
        __wbg_set_wasm,
        __wbg_slice_972c243648c9fd2e,
        __wbg_stack_0ed75d68575b0f3c,
        __wbg_toString_66ab719c2a98bdf1,
        __wbg_unshift_c290010f73f04fb1,
        __wbg_value_cd1ffa7b1ab794f1,
        __wbg_values_fcb8ba8c0aad8b58,
        __wbindgen_bigint_from_i64,
        __wbindgen_bigint_from_u64,
        __wbindgen_boolean_get,
        __wbindgen_debug_string,
        __wbindgen_error_new,
        __wbindgen_init_externref_table,
        __wbindgen_is_array,
        __wbindgen_is_function,
        __wbindgen_is_null,
        __wbindgen_is_object,
        __wbindgen_is_string,
        __wbindgen_is_undefined,
        __wbindgen_json_serialize,
        __wbindgen_jsval_loose_eq,
        __wbindgen_memory,
        __wbindgen_number_get,
        __wbindgen_number_new,
        __wbindgen_string_get,
        __wbindgen_string_new,
        __wbindgen_throw,
        create: create$1,
        decodeChange: decodeChange$2,
        decodeSyncMessage: decodeSyncMessage$1,
        decodeSyncState: decodeSyncState$1,
        encodeChange: encodeChange$1,
        encodeSyncMessage: encodeSyncMessage$1,
        encodeSyncState: encodeSyncState$1,
        exportSyncState: exportSyncState$1,
        importSyncState: importSyncState$1,
        initSyncState: initSyncState$1,
        load: load$1
      }, Symbol.toStringTag, {
        value: "Module"
      }));
      const STATE = Symbol.for("_am_meta");
      const TRACE = Symbol.for("_am_trace");
      const OBJECT_ID = Symbol.for("_am_objectId");
      const IS_PROXY = Symbol.for("_am_isProxy");
      const CLEAR_CACHE = Symbol.for("_am_clearCache");
      const UINT = Symbol.for("_am_uint");
      const INT = Symbol.for("_am_int");
      const F64 = Symbol.for("_am_f64");
      const COUNTER = Symbol.for("_am_counter");
      const IMMUTABLE_STRING = Symbol.for("_am_immutableString");
      class Counter {
        constructor(value) {
          this.value = value || 0;
          Reflect.defineProperty(this, COUNTER, {
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
        increment(_delta) {
          throw new Error("Counters should not be incremented outside of a change callback");
        }
        decrement(_delta) {
          throw new Error("Counters should not be decremented outside of a change callback");
        }
      }
      class WriteableCounter extends Counter {
        constructor(value, context, path, objectId, key) {
          super(value);
          this.context = context;
          this.path = path;
          this.objectId = objectId;
          this.key = key;
        }
        increment(delta) {
          delta = typeof delta === "number" ? delta : 1;
          this.context.increment(this.objectId, this.key, delta);
          this.value += delta;
          return this.value;
        }
        decrement(delta) {
          return this.increment(typeof delta === "number" ? -delta : -1);
        }
      }
      function getWriteableCounter(value, context, path, objectId, key) {
        return new WriteableCounter(value, context, path, objectId, key);
      }
      var _a;
      class ImmutableString {
        constructor(val) {
          this[_a] = true;
          this.val = val;
        }
        toString() {
          return this.val;
        }
        toJSON() {
          return this.val;
        }
      }
      _a = IMMUTABLE_STRING;
      function parseListIndex(key) {
        if (typeof key === "string" && /^[0-9]+$/.test(key)) key = parseInt(key, 10);
        if (typeof key !== "number") {
          return key;
        }
        if (key < 0 || isNaN(key) || key === Infinity || key === -Infinity) {
          throw new RangeError("A list index must be positive, but you passed " + key);
        }
        return key;
      }
      function valueAt(target, prop) {
        const { context, objectId, path } = target;
        const value = context.getWithType(objectId, prop);
        if (value === null) {
          return;
        }
        const datatype = value[0];
        const val = value[1];
        switch (datatype) {
          case void 0:
            return;
          case "map":
            return mapProxy(context, val, [
              ...path,
              prop
            ]);
          case "list":
            return listProxy(context, val, [
              ...path,
              prop
            ]);
          case "text":
            return context.text(val);
          case "str":
            return new ImmutableString(val);
          case "uint":
            return val;
          case "int":
            return val;
          case "f64":
            return val;
          case "boolean":
            return val;
          case "null":
            return null;
          case "bytes":
            return val;
          case "timestamp":
            return val;
          case "counter": {
            const counter = getWriteableCounter(val, context, path, objectId, prop);
            return counter;
          }
          default:
            throw RangeError(`datatype ${datatype} unimplemented`);
        }
      }
      function import_value(value, path, context) {
        const type = typeof value;
        switch (type) {
          case "object":
            if (value == null) {
              return [
                null,
                "null"
              ];
            } else if (value[UINT]) {
              return [
                value.value,
                "uint"
              ];
            } else if (value[INT]) {
              return [
                value.value,
                "int"
              ];
            } else if (value[F64]) {
              return [
                value.value,
                "f64"
              ];
            } else if (value[COUNTER]) {
              return [
                value.value,
                "counter"
              ];
            } else if (value instanceof Date) {
              return [
                value.getTime(),
                "timestamp"
              ];
            } else if (isImmutableString(value)) {
              return [
                value.toString(),
                "str"
              ];
            } else if (value instanceof Uint8Array) {
              return [
                value,
                "bytes"
              ];
            } else if (value instanceof Array) {
              return [
                value,
                "list"
              ];
            } else if (Object.prototype.toString.call(value) === "[object Object]") {
              return [
                value,
                "map"
              ];
            } else if (isSameDocument(value, context)) {
              throw new RangeError("Cannot create a reference to an existing document object");
            } else {
              throw new RangeError(`Cannot assign unknown object: ${value}`);
            }
          case "boolean":
            return [
              value,
              "boolean"
            ];
          case "number":
            if (Number.isInteger(value)) {
              return [
                value,
                "int"
              ];
            } else {
              return [
                value,
                "f64"
              ];
            }
          case "string":
            return [
              value,
              "text"
            ];
          case "undefined":
            throw new RangeError([
              `Cannot assign undefined value at ${printPath(path)}, `,
              "because `undefined` is not a valid JSON data type. ",
              "You might consider setting the property's value to `null`, ",
              "or using `delete` to remove it altogether."
            ].join(""));
          default:
            throw new RangeError([
              `Cannot assign ${type} value at ${printPath(path)}. `,
              `All JSON primitive datatypes (object, array, string, number, boolean, null) `,
              `are supported in an Automerge document; ${type} values are not. `
            ].join(""));
        }
      }
      function isSameDocument(val, context) {
        var _b, _c;
        if (val instanceof Date) {
          return false;
        }
        if (val && ((_c = (_b = val[STATE]) === null || _b === void 0 ? void 0 : _b.handle) === null || _c === void 0 ? void 0 : _c.__wbg_ptr) === context.__wbg_ptr) {
          return true;
        }
        return false;
      }
      const MapHandler = {
        get(target, key) {
          const { context, objectId, cache } = target;
          if (key === Symbol.toStringTag) {
            return target[Symbol.toStringTag];
          }
          if (key === OBJECT_ID) return objectId;
          if (key === IS_PROXY) return true;
          if (key === TRACE) return target.trace;
          if (key === STATE) return {
            handle: context
          };
          if (!cache[key]) {
            cache[key] = valueAt(target, key);
          }
          return cache[key];
        },
        set(target, key, val) {
          const { context, objectId, path } = target;
          target.cache = {};
          if (isSameDocument(val, context)) {
            throw new RangeError("Cannot create a reference to an existing document object");
          }
          if (key === TRACE) {
            target.trace = val;
            return true;
          }
          if (key === CLEAR_CACHE) {
            return true;
          }
          const [value, datatype] = import_value(val, [
            ...path,
            key
          ], context);
          switch (datatype) {
            case "list": {
              const list = context.putObject(objectId, key, []);
              const proxyList = listProxy(context, list, [
                ...path,
                key
              ]);
              for (let i = 0; i < value.length; i++) {
                proxyList[i] = value[i];
              }
              break;
            }
            case "text": {
              context.putObject(objectId, key, value);
              break;
            }
            case "map": {
              const map = context.putObject(objectId, key, {});
              const proxyMap = mapProxy(context, map, [
                ...path,
                key
              ]);
              for (const key2 in value) {
                proxyMap[key2] = value[key2];
              }
              break;
            }
            default:
              context.put(objectId, key, value, datatype);
          }
          return true;
        },
        deleteProperty(target, key) {
          const { context, objectId } = target;
          target.cache = {};
          context.delete(objectId, key);
          return true;
        },
        has(target, key) {
          const value = this.get(target, key);
          return value !== void 0;
        },
        getOwnPropertyDescriptor(target, key) {
          const value = this.get(target, key);
          if (typeof value !== "undefined") {
            return {
              configurable: true,
              enumerable: true,
              value
            };
          }
        },
        ownKeys(target) {
          const { context, objectId } = target;
          const keys = context.keys(objectId);
          return [
            ...new Set(keys)
          ];
        }
      };
      const ListHandler = {
        get(target, index) {
          const { context, objectId } = target;
          index = parseListIndex(index);
          if (index === Symbol.hasInstance) {
            return (instance) => {
              return Array.isArray(instance);
            };
          }
          if (index === Symbol.toStringTag) {
            return target[Symbol.toStringTag];
          }
          if (index === OBJECT_ID) return objectId;
          if (index === IS_PROXY) return true;
          if (index === TRACE) return target.trace;
          if (index === STATE) return {
            handle: context
          };
          if (index === "length") return context.length(objectId);
          if (typeof index === "number") {
            return valueAt(target, index);
          } else {
            return listMethods(target)[index];
          }
        },
        set(target, index, val) {
          const { context, objectId, path } = target;
          index = parseListIndex(index);
          if (isSameDocument(val, context)) {
            throw new RangeError("Cannot create a reference to an existing document object");
          }
          if (index === CLEAR_CACHE) {
            return true;
          }
          if (index === TRACE) {
            target.trace = val;
            return true;
          }
          if (typeof index == "string") {
            throw new RangeError("list index must be a number");
          }
          const [value, datatype] = import_value(val, [
            ...path,
            index
          ], context);
          switch (datatype) {
            case "list": {
              let list;
              if (index >= context.length(objectId)) {
                list = context.insertObject(objectId, index, []);
              } else {
                list = context.putObject(objectId, index, []);
              }
              const proxyList = listProxy(context, list, [
                ...path,
                index
              ]);
              proxyList.splice(0, 0, ...value);
              break;
            }
            case "text": {
              if (index >= context.length(objectId)) {
                context.insertObject(objectId, index, value);
              } else {
                context.putObject(objectId, index, value);
              }
              break;
            }
            case "map": {
              let map;
              if (index >= context.length(objectId)) {
                map = context.insertObject(objectId, index, {});
              } else {
                map = context.putObject(objectId, index, {});
              }
              const proxyMap = mapProxy(context, map, [
                ...path,
                index
              ]);
              for (const key in value) {
                proxyMap[key] = value[key];
              }
              break;
            }
            default:
              if (index >= context.length(objectId)) {
                context.insert(objectId, index, value, datatype);
              } else {
                context.put(objectId, index, value, datatype);
              }
          }
          return true;
        },
        deleteProperty(target, index) {
          const { context, objectId } = target;
          index = parseListIndex(index);
          const elem = context.get(objectId, index);
          if (elem != null && elem[0] == "counter") {
            throw new TypeError("Unsupported operation: deleting a counter from a list");
          }
          context.delete(objectId, index);
          return true;
        },
        has(target, index) {
          const { context, objectId } = target;
          index = parseListIndex(index);
          if (typeof index === "number") {
            return index < context.length(objectId);
          }
          return index === "length";
        },
        getOwnPropertyDescriptor(target, index) {
          const { context, objectId } = target;
          if (index === "length") return {
            writable: true,
            value: context.length(objectId)
          };
          if (index === OBJECT_ID) return {
            configurable: false,
            enumerable: false,
            value: objectId
          };
          index = parseListIndex(index);
          const value = valueAt(target, index);
          return {
            configurable: true,
            enumerable: true,
            value
          };
        },
        getPrototypeOf(target) {
          return Object.getPrototypeOf(target);
        },
        ownKeys() {
          const keys = [];
          keys.push("length");
          return keys;
        }
      };
      function mapProxy(context, objectId, path) {
        const target = {
          context,
          objectId,
          path: path || [],
          cache: {}
        };
        const proxied = {};
        Object.assign(proxied, target);
        const result = new Proxy(proxied, MapHandler);
        return result;
      }
      function listProxy(context, objectId, path) {
        const target = {
          context,
          objectId,
          path: path || [],
          cache: {}
        };
        const proxied = [];
        Object.assign(proxied, target);
        return new Proxy(proxied, ListHandler);
      }
      function rootProxy(context) {
        return mapProxy(context, "_root", []);
      }
      function listMethods(target) {
        const { context, objectId, path } = target;
        const methods = {
          at(index) {
            return valueAt(target, index);
          },
          deleteAt(index, numDelete) {
            if (typeof numDelete === "number") {
              context.splice(objectId, index, numDelete);
            } else {
              context.delete(objectId, index);
            }
            return this;
          },
          fill(val, start, end) {
            const [value, datatype] = import_value(val, [
              ...path,
              start
            ], context);
            const length = context.length(objectId);
            start = parseListIndex(start || 0);
            end = parseListIndex(end || length);
            for (let i = start; i < Math.min(end, length); i++) {
              if (datatype === "list" || datatype === "map") {
                context.putObject(objectId, i, value);
              } else if (datatype === "text") {
                context.putObject(objectId, i, value);
              } else {
                context.put(objectId, i, value, datatype);
              }
            }
            return this;
          },
          indexOf(searchElement, start = 0) {
            const length = context.length(objectId);
            for (let i = start; i < length; i++) {
              const valueWithType = context.getWithType(objectId, i);
              if (!valueWithType) {
                continue;
              }
              const [valType, value] = valueWithType;
              const isObject2 = [
                "map",
                "list",
                "text"
              ].includes(valType);
              if (!isObject2) {
                if (value === searchElement) {
                  return i;
                } else {
                  continue;
                }
              }
              if (valType === "text" && typeof searchElement === "string") {
                if (searchElement === valueAt(target, i)) {
                  return i;
                }
              }
              if (searchElement[OBJECT_ID] === value) {
                return i;
              }
            }
            return -1;
          },
          insertAt(index, ...values) {
            this.splice(index, 0, ...values);
            return this;
          },
          pop() {
            const length = context.length(objectId);
            if (length == 0) {
              return void 0;
            }
            const last = valueAt(target, length - 1);
            context.delete(objectId, length - 1);
            return last;
          },
          push(...values) {
            const len = context.length(objectId);
            this.splice(len, 0, ...values);
            return context.length(objectId);
          },
          shift() {
            if (context.length(objectId) == 0) return;
            const first = valueAt(target, 0);
            context.delete(objectId, 0);
            return first;
          },
          splice(index, del, ...vals) {
            index = parseListIndex(index);
            if (typeof del !== "number") {
              del = context.length(objectId) - index;
            }
            del = parseListIndex(del);
            for (const val of vals) {
              if (isSameDocument(val, context)) {
                throw new RangeError("Cannot create a reference to an existing document object");
              }
            }
            const result = [];
            for (let i = 0; i < del; i++) {
              const value = valueAt(target, index);
              if (value !== void 0) {
                result.push(value);
              }
              context.delete(objectId, index);
            }
            const values = vals.map((val, index2) => {
              try {
                return import_value(val, [
                  ...path
                ], context);
              } catch (e) {
                if (e instanceof RangeError) {
                  throw new RangeError(`${e.message} (at index ${index2} in the input)`);
                } else {
                  throw e;
                }
              }
            });
            for (const [value, datatype] of values) {
              switch (datatype) {
                case "list": {
                  const list = context.insertObject(objectId, index, []);
                  const proxyList = listProxy(context, list, [
                    ...path,
                    index
                  ]);
                  proxyList.splice(0, 0, ...value);
                  break;
                }
                case "text": {
                  context.insertObject(objectId, index, value);
                  break;
                }
                case "map": {
                  const map = context.insertObject(objectId, index, {});
                  const proxyMap = mapProxy(context, map, [
                    ...path,
                    index
                  ]);
                  for (const key in value) {
                    proxyMap[key] = value[key];
                  }
                  break;
                }
                default:
                  context.insert(objectId, index, value, datatype);
              }
              index += 1;
            }
            return result;
          },
          unshift(...values) {
            this.splice(0, 0, ...values);
            return context.length(objectId);
          },
          entries() {
            let i = 0;
            const iterator = {
              next: () => {
                const value = valueAt(target, i);
                if (value === void 0) {
                  return {
                    value: void 0,
                    done: true
                  };
                } else {
                  return {
                    value: [
                      i++,
                      value
                    ],
                    done: false
                  };
                }
              },
              [Symbol.iterator]() {
                return this;
              }
            };
            return iterator;
          },
          keys() {
            let i = 0;
            const len = context.length(objectId);
            const iterator = {
              next: () => {
                if (i < len) {
                  return {
                    value: i++,
                    done: false
                  };
                }
                return {
                  value: void 0,
                  done: true
                };
              },
              [Symbol.iterator]() {
                return this;
              }
            };
            return iterator;
          },
          values() {
            let i = 0;
            const iterator = {
              next: () => {
                const value = valueAt(target, i++);
                if (value === void 0) {
                  return {
                    value: void 0,
                    done: true
                  };
                } else {
                  return {
                    value,
                    done: false
                  };
                }
              },
              [Symbol.iterator]() {
                return this;
              }
            };
            return iterator;
          },
          toArray() {
            const list = [];
            let value;
            do {
              value = valueAt(target, list.length);
              if (value !== void 0) {
                list.push(value);
              }
            } while (value !== void 0);
            return list;
          },
          map(f) {
            return this.toArray().map(f);
          },
          toString() {
            return this.toArray().toString();
          },
          toLocaleString() {
            return this.toArray().toLocaleString();
          },
          forEach(f) {
            return this.toArray().forEach(f);
          },
          concat(other) {
            return this.toArray().concat(other);
          },
          every(f) {
            return this.toArray().every(f);
          },
          filter(f) {
            return this.toArray().filter(f);
          },
          find(f) {
            let index = 0;
            for (const v of this) {
              if (f(v, index)) {
                return v;
              }
              index += 1;
            }
          },
          findIndex(f) {
            let index = 0;
            for (const v of this) {
              if (f(v, index)) {
                return index;
              }
              index += 1;
            }
            return -1;
          },
          includes(elem) {
            return this.find((e) => e === elem) !== void 0;
          },
          join(sep) {
            return this.toArray().join(sep);
          },
          reduce(f, initialValue) {
            return this.toArray().reduce(f, initialValue);
          },
          reduceRight(f, initialValue) {
            return this.toArray().reduceRight(f, initialValue);
          },
          lastIndexOf(search, fromIndex = Infinity) {
            return this.toArray().lastIndexOf(search, fromIndex);
          },
          slice(index, num) {
            return this.toArray().slice(index, num);
          },
          some(f) {
            let index = 0;
            for (const v of this) {
              if (f(v, index)) {
                return true;
              }
              index += 1;
            }
            return false;
          },
          [Symbol.iterator]: function* () {
            let i = 0;
            let value = valueAt(target, i);
            while (value !== void 0) {
              yield value;
              i += 1;
              value = valueAt(target, i);
            }
          }
        };
        return methods;
      }
      function printPath(path) {
        const jsonPointerComponents = path.map((component) => {
          if (typeof component === "number") {
            return component.toString();
          } else if (typeof component === "string") {
            return component.replace(/~/g, "~0").replace(/\//g, "~1");
          }
        });
        if (path.length === 0) {
          return "";
        } else {
          return "/" + jsonPointerComponents.join("/");
        }
      }
      function isImmutableString(obj) {
        return typeof obj === "object" && obj !== null && Object.prototype.hasOwnProperty.call(obj, IMMUTABLE_STRING);
      }
      function _state(doc, checkroot = true) {
        if (typeof doc !== "object") {
          throw new RangeError("must be the document root");
        }
        const state = Reflect.get(doc, STATE);
        if (state === void 0 || state == null || checkroot && _obj(doc) !== "_root") {
          throw new RangeError("must be the document root");
        }
        return state;
      }
      function _clear_cache(doc) {
        Reflect.set(doc, CLEAR_CACHE, true);
      }
      function _obj(doc) {
        if (!(typeof doc === "object") || doc === null) {
          return null;
        }
        return Reflect.get(doc, OBJECT_ID);
      }
      function _is_proxy(doc) {
        return !!Reflect.get(doc, IS_PROXY);
      }
      var __rest = function(s2, e) {
        var t = {};
        for (var p in s2) if (Object.prototype.hasOwnProperty.call(s2, p) && e.indexOf(p) < 0) t[p] = s2[p];
        if (s2 != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s2); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p[i])) t[p[i]] = s2[p[i]];
        }
        return t;
      };
      function importOpts(_actor) {
        if (typeof _actor === "object") {
          return _actor;
        } else {
          return {
            actor: _actor
          };
        }
      }
      function init(_opts) {
        const opts = importOpts(_opts);
        const freeze = !!opts.freeze;
        const patchCallback = opts.patchCallback;
        const actor = opts.actor;
        const handle = ApiHandler.create({
          actor
        });
        handle.enableFreeze(!!opts.freeze);
        registerDatatypes(handle);
        const doc = handle.materialize("/", void 0, {
          handle,
          heads: void 0,
          freeze,
          patchCallback
        });
        return doc;
      }
      function clone(doc, _opts) {
        const state = _state(doc);
        const heads = state.heads;
        const opts = importOpts(_opts);
        const handle = state.handle.fork(opts.actor, heads);
        handle.updateDiffCursor();
        const { heads: _oldHeads } = state, stateSansHeads = __rest(state, [
          "heads"
        ]);
        stateSansHeads.patchCallback = opts.patchCallback;
        return handle.applyPatches(doc, Object.assign(Object.assign({}, stateSansHeads), {
          handle
        }));
      }
      function change(doc, options, callback) {
        if (typeof options === "function") {
          return _change(doc, "change", {}, options).newDoc;
        } else {
          throw RangeError("Invalid args for change");
        }
      }
      function progressDocument(doc, source, heads, callback) {
        if (heads == null) {
          return doc;
        }
        const state = _state(doc);
        const nextState = Object.assign(Object.assign({}, state), {
          heads: void 0
        });
        const { value: nextDoc, patches } = state.handle.applyAndReturnPatches(doc, nextState);
        if (patches.length > 0) {
          if (callback != null) {
            callback(patches, {
              before: doc,
              after: nextDoc,
              source
            });
          }
          const newState = _state(nextDoc);
          newState.mostRecentPatch = {
            before: _state(doc).heads,
            after: newState.handle.getHeads(),
            patches
          };
        }
        state.heads = heads;
        return nextDoc;
      }
      function _change(doc, source, options, callback, scope) {
        if (typeof callback !== "function") {
          throw new RangeError("invalid change function");
        }
        const state = _state(doc);
        if (doc === void 0 || state === void 0) {
          throw new RangeError("must be the document root");
        }
        if (state.heads) {
          throw new RangeError("Attempting to change an outdated document.  Use Automerge.clone() if you wish to make a writable copy.");
        }
        if (_is_proxy(doc)) {
          throw new RangeError("Calls to Automerge.change cannot be nested");
        }
        let heads = state.handle.getHeads();
        if (!("time" in options)) {
          options.time = Math.floor(Date.now() / 1e3);
        }
        try {
          state.heads = heads;
          const root = rootProxy(state.handle);
          callback(root);
          if (state.handle.pendingOps() === 0) {
            state.heads = void 0;
            if (scope) ;
            return {
              newDoc: doc,
              newHeads: null
            };
          } else {
            const newHead = state.handle.commit(options.message, options.time);
            state.handle.integrate();
            return {
              newDoc: progressDocument(doc, source, heads, options.patchCallback || state.patchCallback),
              newHeads: newHead != null ? [
                newHead
              ] : null
            };
          }
        } catch (e) {
          state.heads = void 0;
          state.handle.rollback();
          throw e;
        }
      }
      function getLastLocalChange(doc) {
        const state = _state(doc);
        return state.handle.getLastLocalChange() || void 0;
      }
      function applyChanges(doc, changes, opts) {
        const state = _state(doc);
        if (!opts) {
          opts = {};
        }
        if (state.heads) {
          throw new RangeError("Attempting to change an outdated document.  Use Automerge.clone() if you wish to make a writable copy.");
        }
        if (_is_proxy(doc)) {
          throw new RangeError("Calls to Automerge.change cannot be nested");
        }
        const heads = state.handle.getHeads();
        state.handle.applyChanges(changes);
        state.heads = heads;
        return [
          progressDocument(doc, "applyChanges", heads, opts.patchCallback || state.patchCallback)
        ];
      }
      function diff(doc, before, after) {
        checkHeads(before, "before");
        checkHeads(after, "after");
        const state = _state(doc);
        if (state.mostRecentPatch && equals(state.mostRecentPatch.before, before) && equals(state.mostRecentPatch.after, after)) {
          return state.mostRecentPatch.patches;
        }
        return state.handle.diff(before, after);
      }
      function checkHeads(heads, fieldname) {
        if (!Array.isArray(heads)) {
          throw new Error(`${fieldname} must be an array`);
        }
      }
      function equals(val1, val2) {
        if (!isObject(val1) || !isObject(val2)) return val1 === val2;
        const keys1 = Object.keys(val1).sort(), keys2 = Object.keys(val2).sort();
        if (keys1.length !== keys2.length) return false;
        for (let i = 0; i < keys1.length; i++) {
          if (keys1[i] !== keys2[i]) return false;
          if (!equals(val1[keys1[i]], val2[keys2[i]])) return false;
        }
        return true;
      }
      function decodeChange(data) {
        return ApiHandler.decodeChange(data);
      }
      function isObject(obj) {
        return typeof obj === "object" && obj !== null;
      }
      function registerDatatypes(handle) {
        handle.registerDatatype("counter", (n) => new Counter(n), (n) => {
          if (n instanceof Counter) {
            return n.value;
          }
        });
        handle.registerDatatype("str", (n) => {
          return new ImmutableString(n);
        }, (s2) => {
          if (isImmutableString(s2)) {
            return s2.val;
          }
        });
      }
      function updateText(doc, path, newText) {
        const objPath = absoluteObjPath(doc, path, "updateText");
        if (!_is_proxy(doc)) {
          throw new RangeError("object cannot be modified outside of a change block");
        }
        const state = _state(doc, false);
        _clear_cache(doc);
        try {
          return state.handle.updateText(objPath, newText);
        } catch (e) {
          throw new RangeError(`Cannot updateText: ${e}`);
        }
      }
      function getCursor(doc, path, position, move) {
        const objPath = absoluteObjPath(doc, path, "getCursor");
        const state = _state(doc, false);
        try {
          return state.handle.getCursor(objPath, position, state.heads, move);
        } catch (e) {
          throw new RangeError(`Cannot getCursor: ${e}`);
        }
      }
      function getCursorPosition(doc, path, cursor) {
        const objPath = absoluteObjPath(doc, path, "getCursorPosition");
        const state = _state(doc, false);
        try {
          return state.handle.getCursorPosition(objPath, cursor, state.heads);
        } catch (e) {
          throw new RangeError(`Cannot getCursorPosition: ${e}`);
        }
      }
      function absoluteObjPath(doc, path, functionName) {
        path = path.slice();
        const objectId = _obj(doc);
        if (!objectId) {
          throw new RangeError(`invalid object for ${functionName}`);
        }
        path.unshift(objectId);
        return path.join("/");
      }
      UseApi(api);
      const PI = Math.PI;
      const TAU = PI * 2;
      const clip = (i, min2 = 0, max2 = 1) => Math.min(Math.max(i, min2), max2);
      const no = (i = 0, min2 = -1, max2 = 1, doClip = false) => {
        let n = max2 === min2 ? min2 : (i - min2) / (max2 - min2);
        return doClip ? clip(n) : n;
      };
      const de = (i = 0, min2 = -1, max2 = 1) => i * (max2 - min2) + min2;
      const rand = (min2 = 0, max2 = 1) => de(Math.random(), min2, max2);
      const randInt = (min2 = 0, max2 = 1) => Math.floor(rand(min2, max2 + 1));
      const isZero = (v) => Number.EPSILON > Math.abs(v);
      const roundTo = (input, precision) => {
        const p = 1 / precision;
        return Math.round(input * p) / p;
      };
      function shuffleArray(array) {
        const shuffled = [
          ...array
        ];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [
            shuffled[j],
            shuffled[i]
          ];
        }
        return shuffled;
      }
      const arrMod = (arr, i) => arr[i % arr.length];
      const arrRnd = (arr) => arr[randInt(0, arr.length - 1)];
      const chance = (v = 0.5) => rand(0, 1) < v;
      const ss = (v = 0) => v * v * (3 - 2 * v);
      const Vec = (x = 0, y = 0) => ({
        x,
        y
      });
      Vec.of = (s2) => Vec(s2, s2);
      Vec.clone = (v) => Vec(v.x, v.y);
      Vec.random = (scale = 1) => Vec.Smul(scale, Vec.complement(Vec.Smul(2, Vec(Math.random(), Math.random()))));
      Vec.fromA = ([x, y]) => Vec(x, y);
      Vec.toA = (v) => [
        v.x,
        v.y
      ];
      Vec.fromPolar = (angle, length) => Vec(length * Math.cos(angle), length * Math.sin(angle));
      Vec.fromWindow = () => Vec(window.innerWidth, window.innerHeight);
      Vec.log = (v, places = 1) => "(" + Vec.toA(Vec.roundTo(v, places)).join(",") + ")";
      Vec.set = (dest, src) => {
        dest.x = src.x;
        dest.y = src.y;
      };
      Vec.x = Object.freeze(Vec(1));
      Vec.y = Object.freeze(Vec(0, 1));
      Vec.zero = Object.freeze(Vec());
      Vec.map = (f, v) => Vec(f(v.x), f(v.y));
      Vec.map2 = (f, a, b) => Vec(f(a.x, b.x), f(a.y, b.y));
      Vec.reduce = (f, v) => f(v.x, v.y);
      Vec.cross = (a, b) => a.x * b.y - a.y * b.x;
      Vec.project = (a, b) => Vec.mulS(b, Vec.dot(a, b) / Vec.len2(b));
      Vec.reject = (a, b) => Vec.sub(a, Vec.project(a, b));
      Vec.scalarProjection = (p, a, b) => {
        const ap = Vec.sub(p, a);
        const ab = Vec.normalize(Vec.sub(b, a));
        const f = Vec.mulS(ab, Vec.dot(ap, ab));
        return Vec.add(a, f);
      };
      Vec.add = (a, b) => Vec(a.x + b.x, a.y + b.y);
      Vec.div = (a, b) => Vec(a.x / b.x, a.y / b.y);
      Vec.mul = (a, b) => Vec(a.x * b.x, a.y * b.y);
      Vec.sub = (a, b) => Vec(a.x - b.x, a.y - b.y);
      Vec.addS = (v, s2) => Vec.add(v, Vec.of(s2));
      Vec.divS = (v, s2) => Vec.div(v, Vec.of(s2));
      Vec.mulS = (v, s2) => Vec.mul(v, Vec.of(s2));
      Vec.subS = (v, s2) => Vec.sub(v, Vec.of(s2));
      Vec.Sadd = (s2, v) => Vec.add(Vec.of(s2), v);
      Vec.Sdiv = (s2, v) => Vec.div(Vec.of(s2), v);
      Vec.Smul = (s2, v) => Vec.mul(Vec.of(s2), v);
      Vec.Ssub = (s2, v) => Vec.sub(Vec.of(s2), v);
      Vec.dist = (a, b) => Vec.len(Vec.sub(a, b));
      Vec.dist2 = (a, b) => Vec.len2(Vec.sub(a, b));
      Vec.dot = (a, b) => a.x * b.x + a.y * b.y;
      Vec.equal = (a, b) => isZero(Vec.dist2(a, b));
      Vec.len2 = (v) => Vec.dot(v, v);
      Vec.len = (v) => Math.sqrt(Vec.dot(v, v));
      Vec.ceil = (v) => Vec.map(Math.ceil, v);
      Vec.floor = (v) => Vec.map(Math.floor, v);
      Vec.round = (v) => Vec.map(Math.round, v);
      Vec.roundTo = (v, s2) => Vec.map2(roundTo, v, Vec.of(s2));
      Vec.complement = (v) => Vec.Ssub(1, v);
      Vec.half = (v) => Vec.divS(v, 2);
      Vec.normalize = (v) => Vec.divS(v, Vec.len(v));
      Vec.recip = (v) => Vec.Sdiv(1, v);
      Vec.renormalize = (v, length) => Vec.Smul(length, Vec.normalize(v));
      Vec.lengthen = (v, amt) => Vec.renormalize(v, Vec.len(v) + amt);
      Vec.avg = (a, b) => Vec.half(Vec.add(a, b));
      Vec.lerp = (a, b, t) => Vec.add(a, Vec.Smul(t, Vec.sub(b, a)));
      Vec.max = (a, b) => Vec.map2(Math.max, a, b);
      Vec.min = (a, b) => Vec.map2(Math.min, a, b);
      Vec.abs = (v) => Vec.map(Math.abs, v);
      Vec.invert = (v) => Vec(-v.x, -v.y);
      Vec.invertX = (v) => Vec(-v.x, v.y);
      Vec.invertY = (v) => Vec(v.x, -v.y);
      Vec.rotate90CW = (v) => Vec(v.y, -v.x);
      Vec.rotate90CCW = (v) => Vec(-v.y, v.x);
      Vec.rotate = (v, angle) => Vec(v.x * Math.cos(angle) - v.y * Math.sin(angle), v.x * Math.sin(angle) + v.y * Math.cos(angle));
      Vec.rotateAround = (pointToRotate, rotateAround, angle) => {
        const translatedPoint = Vec.sub(pointToRotate, rotateAround);
        const rotatedPoint = Vec.rotate(translatedPoint, angle);
        return Vec.add(rotatedPoint, rotateAround);
      };
      Vec.angle = (v) => Math.atan2(v.y, v.x);
      Vec.angleBetween = (a, b) => {
        const dotProduct = Vec.dot(a, b);
        const magnitudeA = Vec.len(a);
        const magnitudeB = Vec.len(b);
        const angleInRadians = Math.acos(dotProduct / (magnitudeA * magnitudeB));
        return angleInRadians;
      };
      Vec.angleBetweenClockwise = (a, b) => {
        const dP = Vec.dot(a, b);
        const cP = Vec.cross(a, b);
        const angleInRadians = Math.atan2(cP, dP);
        return angleInRadians;
      };
      let colorA = [
        0.22,
        0.21,
        0.2
      ];
      let colorB = [
        0.7 * 1,
        0.7 * 0.8,
        0.7 * 0.2
      ];
      function setTheme(theme) {
        if (theme == "dark") {
          colorA = [
            1,
            0.8,
            0.2
          ];
          colorB = [
            0.35,
            0.35,
            0.35
          ];
        } else {
          colorA = [
            0.22,
            0.21,
            0.2
          ];
          colorB = [
            0.7 * 1,
            0.7 * 0.8,
            0.7 * 0.2
          ];
        }
      }
      window.addEventListener("set-theme", (e) => setTheme(e.detail));
      setTheme(document.documentElement.getAttribute("theme"));
      const step = 2;
      const width$1 = 330;
      const height$1 = 30;
      const cvs = document.createElement("canvas");
      const ctx = cvs.getContext("2d", {
        willReadFrequently: true
      });
      cvs.width = width$1;
      cvs.height = height$1;
      ctx.font = "500 16px / 1 'Overpass Mono'";
      function makeDots(info, worldPos, isDelete) {
        const dots = [];
        for (let edit of info.edits) {
          if (edit.type == "edit") {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, width$1, height$1);
            ctx.fillStyle = "white";
            ctx.fillText(edit.text, 0, 14.5);
            const data = ctx.getImageData(0, 0, width$1, height$1).data;
            for (let y = 0; y < height$1; y += step) {
              for (let x = 0; x < width$1; x += step) {
                const byte = (y * width$1 + x) * 4;
                if (data[byte] > 127) {
                  let X = x + (30 + edit.charIndex * 9.8);
                  dots.push(makeDot(X, y, worldPos, isDelete));
                }
              }
            }
            if (dots.length == 0) dots.push(makeDot(35 + edit.charIndex * 9.8, 10, worldPos, isDelete));
          } else if (edit.type == "clear") {
            let y1 = 8;
            let y2 = 9;
            let x1 = -6;
            let x2 = 250;
            for (let y = y1; y <= y2; y += step) {
              for (let x = x1; x <= x2; x += step) {
                dots.push(makeDot(x, y, worldPos, isDelete));
              }
            }
          } else if (edit.type == "toggle" && edit.value) {
            let y1 = 5;
            let y2 = 11;
            let x1 = 6;
            let x2 = 11;
            for (let y = y1; y <= y2; y += step) {
              for (let x = x1; x <= x2; x += step) {
                dots.push(makeDot(x, y, worldPos, isDelete, 1));
              }
            }
          } else {
            let y1 = 0;
            let y2 = 18;
            let x1 = 0;
            let x2 = 18;
            let r = 2;
            for (let y = y1; y <= y2; y += step) {
              for (let x = x1; x <= x2; x += step) {
                if (x - x1 < r || x2 - x < r || y - y1 < r || y2 - y < r) {
                  dots.push(makeDot(x, y, worldPos, isDelete, info.edits[0].type == "add" ? 0 : 1));
                }
              }
            }
          }
        }
        return dots;
      }
      function makeDot(x, y, worldPos, isDelete, hurry = 0) {
        let X = x;
        let Y = y;
        let local = Vec(X, Y);
        let start = Vec.add(local, worldPos);
        let dest = Vec();
        let pos = start;
        let vel = Vec();
        let accel = Vec.random(0.02);
        let age = isDelete ? 1 : hurry - rand(0, 0.1) * y / height$1 - rand(0, 0.5) * x / width$1;
        let size = 0;
        let color = isDelete ? colorB : colorA;
        let complete = false;
        return {
          local,
          start,
          dest,
          pos,
          vel,
          accel,
          age,
          size,
          color,
          complete
        };
      }
      const sides = 8;
      const radius = 1.5;
      let width = 0;
      let height = 0;
      let bounds;
      const canvas = document.querySelector("#demo canvas");
      const dpr = window.devicePixelRatio;
      const gl = canvas.getContext("webgl2", {
        antialias: false
      });
      const vertexShaderSource = `#version 300 es
in vec2 a_position;
in vec3 a_offset;
in vec3 a_color;
out vec3 v_color;
uniform vec2 u_resolution;
void main() {
  vec2 pos = a_position * a_offset.z + a_offset.xy;
  gl_Position = vec4(pos / u_resolution * 2.0 - 1.0, 0, 1);
  gl_Position.y *= -1.0;
  v_color = a_color;
}
`;
      const fragmentShaderSource = `#version 300 es
precision mediump float;
in vec3 v_color;
out vec4 outColor;
void main() { outColor = vec4(v_color, 1.0); }
`;
      const resize = () => {
        bounds = null;
        bounds = getCanvasRect();
        width = bounds.width;
        height = bounds.height;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      };
      resize();
      window.addEventListener("resize", resize);
      function getCanvasRect() {
        if (bounds) return bounds;
        bounds = canvas.getBoundingClientRect();
        let body = document.body.getBoundingClientRect();
        bounds.x -= body.x;
        bounds.y -= body.y;
        return bounds;
      }
      function compileShader(gl2, type, source) {
        const shader = gl2.createShader(type);
        gl2.shaderSource(shader, source);
        gl2.compileShader(shader);
        return shader;
      }
      function makePolygon(sides2, radius2) {
        const vertices = [];
        for (let i = 0; i < sides2; i++) {
          const a1 = i / sides2 * TAU + PI / 4;
          const a2 = (i + 1) / sides2 * TAU + PI / 4;
          vertices.push(0, 0, radius2 * Math.cos(a1), radius2 * Math.sin(a1), radius2 * Math.cos(a2), radius2 * Math.sin(a2));
        }
        return vertices;
      }
      const vertShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
      const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
      const program = gl.createProgram();
      gl.attachShader(program, vertShader);
      gl.attachShader(program, fragShader);
      gl.linkProgram(program);
      const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
      const vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      const shapeVertices = makePolygon(sides, radius);
      const vertexCount = shapeVertices.length / 2;
      const shapeBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, shapeBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shapeVertices), gl.STATIC_DRAW);
      const positionLoc = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
      const instanceBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
      const offsetLoc = gl.getAttribLocation(program, "a_offset");
      gl.enableVertexAttribArray(offsetLoc);
      gl.vertexAttribPointer(offsetLoc, 3, gl.FLOAT, false, 0, 0);
      gl.vertexAttribDivisor(offsetLoc, 1);
      const colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      const colorLoc = gl.getAttribLocation(program, "a_color");
      gl.enableVertexAttribArray(colorLoc);
      gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);
      gl.vertexAttribDivisor(colorLoc, 1);
      function render(particles) {
        gl.viewport(0, 0, width * dpr, height * dpr);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
        gl.uniform2f(resolutionLoc, width, height);
        gl.bindVertexArray(vao);
        let count = 0;
        for (let particle of particles) count += particle.dots.length;
        const offsets = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        let i = 0;
        for (let particle of particles) {
          for (let dot of particle.dots) {
            offsets[i * 3 + 0] = dot.pos.x;
            offsets[i * 3 + 1] = dot.pos.y;
            offsets[i * 3 + 2] = dot.size;
            colors[i * 3 + 0] = dot.color[0];
            colors[i * 3 + 1] = dot.color[1];
            colors[i * 3 + 2] = dot.color[2];
            i++;
          }
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, offsets, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);
        gl.drawArraysInstanced(gl.TRIANGLES, 0, vertexCount, count);
      }
      let reduceMotion = matchMedia("(prefers-reduced-motion)").matches;
      const _Particle = class _Particle {
        constructor(sourceInfo, source, target, isDelete) {
          __publicField(this, "dots");
          __publicField(this, "dest", {
            x: 0,
            y: 0
          });
          __publicField(this, "applyEarly", false);
          __publicField(this, "skipStart", false);
          __publicField(this, "skipEnd", false);
          this.sourceInfo = sourceInfo;
          this.source = source;
          this.target = target;
          let isAdd = sourceInfo.edits.some((e) => e.type == "add");
          if (isAdd) this.applyEarly = true;
          this.dots = makeDots(sourceInfo, getPos(source, sourceInfo.todoIndex), isDelete);
          this.skipStart = sourceInfo.todoIndex >= limit;
          _Particle.all.add(this);
        }
        static update(dt) {
          _Particle.all.forEach((p) => p.physics(dt));
          render(_Particle.all);
        }
        static recalc() {
          let map = /* @__PURE__ */ new Map();
          for (let particle of _Particle.all) {
            for (let i = 0; i < particle.target.spec.todos.length; i++) map.set(particle.target.spec.todos[i].id, i);
            particle.target.speculate(particle.sourceInfo);
            for (let i = 0; i < particle.target.spec.todos.length; i++) map.set(particle.target.spec.todos[i].id, i);
          }
          for (let particle of _Particle.all) {
            let idx = map.get(particle.sourceInfo.id);
            if (idx != null && idx >= 0) {
              particle.dest = getPos(particle.target, idx);
              particle.skipEnd = idx >= limit;
            } else particle.dest ?? (particle.dest = getPos(particle.target, 0));
          }
        }
        physics(dt) {
          let allComplete = true;
          for (const dot of this.dots) {
            dot.age += dt;
            let dest = Vec.add(this.dest, dot.local);
            if (reduceMotion) {
              if (dot.age > 2) dot.pos = dest;
            } else {
              let accel = Vec.mulS(dot.accel, no(dot.age, 0.8, 2, true));
              dot.vel = Vec.add(dot.vel, Vec.mulS(accel, 120 * dt));
              dot.pos = Vec.add(dot.pos, Vec.mulS(dot.vel, 120 * dt));
              let goalT = ss(no(dot.age, 1.3, 3, true));
              let goal = Vec.lerp(dot.start, dest, goalT);
              let blendT = ss(no(dot.age, 1.3, 3, true));
              dot.pos = Vec.lerp(dot.pos, goal, blendT);
              if (dot.age > 2.5 && this.applyEarly) {
                this.applyEarly = false;
                this.target.applyChange(this.sourceInfo.change);
              }
            }
            dot.size = clip(dot.age - 1);
            dot.size *= no(dot.age, 4, 2.5, true);
            if (this.skipStart) dot.size *= no(dot.age, 0, 3, true);
            if (this.skipEnd) dot.size *= no(dot.age, 3, 0, true);
            dot.complete = dot.age > 3.2;
            allComplete && (allComplete = dot.complete);
          }
          if (allComplete) {
            _Particle.all.delete(this);
            this.target.applyChange(this.sourceInfo.change);
          }
        }
      };
      __publicField(_Particle, "all", /* @__PURE__ */ new Set());
      let Particle = _Particle;
      function getPos(client, todoIndex) {
        let p = Vec.add(client.cachedListElmPos, Vec(20.5, 12.5 + todoIndex * 42));
        return Vec.sub(p, getCanvasRect());
      }
      const limit = 5;
      const _Client = class _Client {
        constructor(name, doc) {
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
          this.name = name;
          this.doc = doc;
          this.spec = clone(this.doc);
          const elm = document.querySelector(`[js-client="${name}"]`);
          const taskEntry = elm.querySelector(".entry .text");
          taskEntry.onkeydown = (e) => {
            if (e.key == "Enter") taskEntry.blur();
          };
          taskEntry.onblur = () => {
            if (taskEntry.value.length <= 0) return;
            animatedAddTodo(this, taskEntry.value, 0);
            taskEntry.value = "";
          };
          this.listElm = elm.querySelector(".list");
          this.overflowElm = elm.querySelector(".todo-overflow");
          _Client.all.push(this);
          this.render();
        }
        add(text, index) {
          const id = this.name + this.nextTodoId++;
          const before = this.doc;
          index ?? (index = Math.min(this.doc.todos.length, limit - 1));
          this.doc = change(this.doc, (doc) => doc.todos.splice(index, 0, {
            id,
            text,
            done: false
          }));
          this.broadcast(before);
          return id;
        }
        edit(id, text) {
          const idx = this.getIndex(id);
          if (idx < 0) return console.log(`Couldn't edit todo ${id} on client ${this.name}`);
          const isDelete = text.length < this.doc.todos[idx].text.length;
          const before = this.doc;
          this.doc = change(this.doc, (doc) => updateText(doc, [
            "todos",
            idx,
            "text"
          ], text));
          this.broadcast(before, isDelete);
        }
        toggle(id, done) {
          const idx = this.getIndex(id);
          if (idx < 0) return console.log(`Couldn't toggle todo ${id} on client ${this.name}`);
          const before = this.doc;
          this.doc = change(this.doc, (doc) => doc.todos[idx].done = done ?? !doc.todos[idx].done);
          this.broadcast(before);
        }
        clear(id) {
          const idx = this.getIndex(id);
          if (idx < 0) return console.log(`Couldn't clear todo ${id} on client ${this.name}`);
          const before = this.doc;
          this.doc = change(this.doc, (doc) => doc.todos.splice(idx, 1));
          this.broadcast(before, true);
        }
        getIndex(id) {
          return this.doc.todos.findIndex((todo) => todo.id == id);
        }
        broadcast(before, isDelete = false) {
          this.render();
          let change2 = getLastLocalChange(this.doc);
          if (!change2) throw new Error("Couldn't get change?!");
          let changeInfo = getChangeInfo(this.doc, before, change2);
          for (let target of _Client.all) if (target != this) new Particle(changeInfo, this, target, isDelete);
          for (let client of _Client.all) client.resetSpec();
          Particle.recalc();
        }
        applyChange(change2) {
          this.doc = applyChanges(this.doc, [
            change2
          ])[0];
          this.resetSpec();
          this.render();
        }
        speculate(info) {
          return this.spec = applyChanges(this.spec, [
            info.change
          ])[0];
        }
        resetSpec() {
          this.spec = clone(this.doc);
        }
        isEditing() {
          if (this.editing && this.getIndex(this.editing) < 0) {
            console.log("Confirmed this has happened!");
            this.editing = null;
          }
          return this.editing != null;
        }
        render() {
          const todos = this.doc.todos;
          const overflow = todos.length > limit;
          const visibleCount = Math.min(limit, todos.length);
          this.overflowElm.textContent = `${todos.length - limit} more\u2026`;
          this.overflowElm.classList.toggle("hidden", !overflow);
          const keepElms = /* @__PURE__ */ new Map();
          for (let i = 0; i < visibleCount; i++) {
            const todo = todos[i];
            let elms = this.elements.get(todo.id) ?? this.makeTodoElms(todo.id);
            keepElms.set(todo.id, elms);
            elms.item.style.translate = `0 ${42 * i}px`;
            if (this.editing == todo.id && document.activeElement != elms.input) {
              elms.input.focus();
            }
            if (todo.text.length > 0) elms.item.setAttribute("had-text", "");
            elms.box.classList.toggle("hide", elms.item.getAttribute("had-text") == null);
            elms.box.checked = todo.done;
            let start = null;
            let end = null;
            let path = [
              "todos",
              i,
              "text"
            ];
            if (this.editing == todo.id) {
              let selStart = idxToCursorPosition(elms.input.selectionStart, elms.input);
              let selEnd = idxToCursorPosition(elms.input.selectionEnd, elms.input);
              start = getCursor(this.doc, path, selStart);
              end = getCursor(this.doc, path, selEnd);
            }
            elms.input.value = todo.text;
            if (start != null) {
              end ?? (end = start);
              let startPos = getCursorPosition(this.doc, path, start);
              let endPos = getCursorPosition(this.doc, path, end);
              elms.input.setSelectionRange(startPos, endPos);
            }
            elms.item;
          }
          this.elements.forEach(({ item: div }, id) => {
            if (!keepElms.has(id)) {
              if (this.editing == id) this.editing = null;
              try {
                div.remove();
              } catch {
                console.log("Calling .remove() failed \u2014 might want to investigate the DOM");
              }
            }
          });
          this.elements = keepElms;
          this.resize();
        }
        resize() {
          this.cachedListElmPos = Vec.sub(this.listElm.getBoundingClientRect(), document.body.getBoundingClientRect());
        }
        makeTodoElms(id) {
          const item = createElement("div", "item", this.listElm);
          const box = createInputElement("checkbox", "checkbox", item);
          box.onclick = () => this.toggle(id);
          const input = createInputElement("text", "text", item);
          input.onfocus = () => this.editing = id;
          input.oninput = () => this.edit(id, input.value);
          input.onkeydown = (e) => {
            if (e.key == "Enter") input.blur();
          };
          input.onblur = () => {
            if (input.value.length == 0) return this.clear(id);
            this.editing = null;
            this.render();
          };
          const elms = {
            item,
            box,
            input
          };
          this.elements.set(id, elms);
          return elms;
        }
      };
      __publicField(_Client, "all", []);
      let Client = _Client;
      function createElement(type, className, parent) {
        const elm = document.createElement(type);
        elm.className = className;
        parent == null ? void 0 : parent.appendChild(elm);
        return elm;
      }
      function createInputElement(type, className, parent) {
        const input = createElement("input", className, parent);
        input.setAttribute("spellcheck", "false");
        input.type = type;
        input.maxLength = 64;
        return input;
      }
      function getChangeInfo(doc, before, change2) {
        const { deps, hash } = decodeChange(change2);
        const patches = diff(doc, deps, [
          hash
        ]);
        return {
          change: change2,
          ...parsePatches(doc, before, patches)
        };
      }
      function parsePatches(doc, before, patches) {
        if (patches.length == 0) throw new Error("Unexpectedly empty patches");
        let todoIndex = patches[0].path[1];
        if (patches.some((p) => p.path[1] != todoIndex)) throw new Error("Found a change affecting multiple todos");
        let edits = [];
        patches.map((patch) => {
          const { action, path } = patch;
          if (action == "conflict") {
            console.log(`conflict! ${path[2]}`);
            if (path[2] == "done") return edits.push({
              type: "toggle",
              value: false
            });
            if (path[2] == "text") return edits.push({
              type: "edit",
              text: "Nice! You made a conflict!",
              charIndex: 0
            });
          }
          if (action == "insert") return edits.push({
            type: "add"
          });
          if (action == "put" && path[2] == "done") {
            let putPatch = patch;
            let value = putPatch.value;
            return edits.push({
              type: "toggle",
              value
            });
          }
          if (action == "del" && path.length == 2) {
            return edits.push({
              type: "clear"
            });
          }
          if (action == "splice" && path[2] == "text") {
            let { value } = patch;
            let charIndex = path[3];
            return edits.push({
              type: "edit",
              text: value,
              charIndex
            });
          }
          if (action == "del" && path[2] == "text") {
            let charIndex = path[3];
            let length = patch.length ?? 1;
            let text = before.todos[todoIndex].text.slice(charIndex, charIndex + length);
            return edits.push({
              type: "edit",
              text,
              charIndex
            });
          }
          if (path[2] == "id") return;
          if (action == "put" && path[2] == "text") return;
          throw new Error("Unknown edit type");
        });
        let todo = doc.todos[todoIndex] ?? before.todos[todoIndex];
        if (!todo) throw new Error("Unable to determine which TODO was changed");
        return {
          id: todo.id,
          edits,
          todoIndex
        };
      }
      const idxToCursorPosition = (n, elm) => {
        if (!n || n <= 0) return "start";
        if (n >= elm.value.length - 1) return "end";
        return n;
      };
      let rootDoc = change(init(), (doc) => doc.todos = []);
      let desktop = new Client("a", clone(rootDoc, {
        actor: "01"
      }));
      let phone = new Client("b", clone(rootDoc, {
        actor: "00"
      }));
      window.desktop = desktop;
      window.phone = phone;
      let queuedActions = /* @__PURE__ */ new Set();
      let enqueue = (action, delay) => queuedActions.add({
        action,
        time: (performance.now() + delay) / 1e3
      });
      let timeBetweenActions = 5;
      let timeUntilNextAction = timeBetweenActions;
      let s = performance.now() / 1e3;
      function update(ms) {
        let t = ms / 1e3;
        let dt = Math.min(t - s, 1 / 20);
        s = t;
        requestAnimationFrame(update);
        if (!running || document.hidden) return;
        if (queuedActions.size == 0) {
          timeUntilNextAction -= dt;
          if (timeUntilNextAction <= 0) {
            timeUntilNextAction = timeBetweenActions;
            nextAction();
          }
        } else {
          for (let qa of queuedActions) {
            if (qa.time < t) {
              queuedActions.delete(qa);
              qa.action();
            }
          }
        }
        Particle.update(dt);
      }
      requestAnimationFrame(update);
      let running = false;
      let observer = new IntersectionObserver(([entry]) => running = entry.isIntersecting);
      observer.observe(document.querySelector("#demo"));
      window.addEventListener("resize", () => {
        desktop.resize();
        phone.resize();
        Particle.recalc();
      });
      let sets = [
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
      ];
      let setIndex = 0;
      let currentSet = [];
      let nextSet = () => currentSet = shuffleArray(arrMod(sets, setIndex++));
      nextSet();
      let getIsDone = (client) => client.doc.todos.filter((t) => t.done);
      let getNotDone = (client) => client.doc.todos.filter((t) => !t.done);
      let getVisibleIsDone = (client) => client.doc.todos.filter((t) => t.done).slice(0, limit);
      let getVisibleNotDone = (client) => client.doc.todos.filter((t) => !t.done).slice(0, limit);
      function animatedAddTodo(client, text, index) {
        let id = client.add("", index);
        animatedPopulateTodo(client, text, id);
      }
      function animatedPopulateTodo(client, text, id) {
        let charsToAdd = Array.from(text);
        let addNextChar = () => {
          if (charsToAdd.length <= 0) return;
          let idx = client.getIndex(id);
          if (idx < 0) return console.log("Can't add chars to missing todo");
          let oldText = client.doc.todos[idx].text;
          let newText = oldText + charsToAdd.shift();
          client.edit(id, newText);
          enqueue(addNextChar, randInt(20, 60));
        };
        addNextChar();
      }
      let animatedEditTodo = (client, text, id) => {
        let removeNextChar = () => {
          let idx = client.getIndex(id);
          if (idx < 0) return animatedAddTodo(client, text);
          let oldText = client.doc.todos[idx].text;
          if (oldText.length <= 0) return enqueue(() => animatedPopulateTodo(client, text, id), 1500);
          let newText = oldText.slice(0, -1);
          client.edit(id, newText);
          enqueue(removeNextChar, randInt(20, 30));
        };
        removeNextChar();
      };
      let animatedClearAllDone = (client) => {
        let clearNextTodo = () => {
          let todo = getIsDone(client).at(-1);
          if (!todo) return;
          client.clear(todo.id);
          enqueue(clearNextTodo, 200);
        };
        clearNextTodo();
      };
      let animatedCompleteAllNotDone = (client) => {
        let completeNextTodo = () => {
          let todo = getNotDone(client).at(-1);
          if (!todo) return;
          client.toggle(todo.id, true);
          enqueue(completeNextTodo, 300);
        };
        completeNextTodo();
      };
      let doAddNextTodo = (client) => animatedAddTodo(client, currentSet.pop());
      let doEditRandomVisible = (client) => {
        let text = currentSet.pop();
        let visibleNotDone = getVisibleNotDone(client);
        if (visibleNotDone.length == 0) animatedAddTodo(client, text);
        else animatedEditTodo(client, text, arrRnd(visibleNotDone).id);
      };
      let doCompleteRandomVisible = (client) => {
        let visibleNotDone = getVisibleNotDone(client);
        if (visibleNotDone.length > 0) client.toggle(arrRnd(visibleNotDone).id, true);
      };
      let doClearRandomVisible = (client) => {
        let visibleIsDone = getVisibleIsDone(client);
        if (visibleIsDone.length > 0) client.clear(arrRnd(visibleIsDone).id);
      };
      function nextAction(client) {
        if (desktop.isEditing() || phone.isEditing()) return;
        client ?? (client = chance() ? desktop : phone);
        let todoCount = client.doc.todos.length;
        let isDone = getIsDone(client);
        let notDone = getNotDone(client);
        let visibleNotDone = getVisibleNotDone(client);
        let visibleIsDone = getVisibleIsDone(client);
        if (currentSet.length == 0) {
          if (visibleNotDone.length > 0) doCompleteRandomVisible(client);
          else {
            animatedClearAllDone(client);
            nextSet();
          }
          return;
        }
        if (todoCount < 2) return doAddNextTodo(client);
        if (isDone.length > 4) return animatedClearAllDone(client);
        if (notDone.length > 10) return animatedCompleteAllNotDone(client);
        if (chance(0.33) && todoCount < 4) return doAddNextTodo(client);
        if (chance(0.5)) return doEditRandomVisible(client);
        if (visibleNotDone.length > 0) return doCompleteRandomVisible(client);
        if (visibleIsDone.length > 0) return doClearRandomVisible(client);
        doAddNextTodo(client);
      }
      nextAction(desktop);
    })();
  }
});
export default require_stdin();
