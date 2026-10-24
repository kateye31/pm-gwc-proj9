// Runs the board outside claude.ai. The board talks to `window.claude.use(name)`;
// this file answers those calls with Firebase (shared, no sign-in) or a demo store (one computer).
(() => {
  const firebaseConfig = window.P9_FIREBASE;
  const FB = "https://www.gstatic.com/firebasejs/10.12.2/";
  const load = (src) => new Promise((ok, fail) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = fail; document.head.appendChild(s); });

  // ---------- Mentor unlock: ?key=... once on Katrina's device ----------
  const sha256 = async (text) => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)))].map((b) => b.toString(16).padStart(2, "0")).join("");
  const mentor = (async () => {
    try {
      const key = new URLSearchParams(location.search).get("key");
      if (key && window.P9_MENTOR_KEY_HASH && await sha256(key) === window.P9_MENTOR_KEY_HASH) {
        localStorage.setItem("p9-mentor", window.P9_MENTOR_KEY_HASH);
        history.replaceState(null, "", location.pathname + location.hash);
      }
      return localStorage.getItem("p9-mentor") === window.P9_MENTOR_KEY_HASH;
    } catch { return false; }
  })();

  // ---------- Demo store: localStorage, shared across tabs on one computer ----------
  function localDb() {
    const KEY = "p9-demo-db";
    const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
    const write = (r) => { localStorage.setItem(KEY, JSON.stringify(r)); notify(); };
    const subs = new Set();
    const notify = () => subs.forEach((f) => f());
    addEventListener("storage", (e) => { if (e.key === KEY) notify(); });
    const docRef = (path) => ({
      id: path.split("/").pop(), path,
      async get() { const v = read()[path]; return { id: path.split("/").pop(), exists: !!v, data: () => v }; },
      onSnapshot(next) { const f = () => { const v = read()[path]; next({ id: path.split("/").pop(), exists: !!v, data: () => v }); }; subs.add(f); setTimeout(f); return () => subs.delete(f); },
      async set(v) { const r = read(); r[path] = JSON.parse(JSON.stringify(v)); write(r); },
      async update(v) { const r = read(); if (!r[path]) throw Object.assign(Error("missing"), { code: "invalid_argument" }); r[path] = { ...r[path], ...v }; write(r); },
      async delete() { const r = read(); delete r[path]; write(r); },
    });
    const colRef = (name) => ({
      path: name,
      doc: (id) => docRef(name + "/" + (id || Math.random().toString(36).slice(2, 12))),
      async add(v) { const d = docRef(name + "/" + Math.random().toString(36).slice(2, 12)); await d.set(v); return d; },
      onSnapshot(next) {
        const f = () => { const docs = Object.entries(read()).filter(([k]) => k.startsWith(name + "/") && k.split("/").length === name.split("/").length + 1).map(([k, v]) => ({ id: k.split("/").pop(), exists: true, data: () => v })); next({ docs, size: docs.length, empty: !docs.length }); };
        subs.add(f); setTimeout(f); return () => subs.delete(f);
      },
    });
    return { doc: docRef, collection: colRef };
  }

  // ---------- Firebase: same calls, shared by everyone with the link ----------
  const dbPromise = (async () => {
    if (!firebaseConfig) return localDb();
    try {
      await load(FB + "firebase-app-compat.js"); await load(FB + "firebase-firestore-compat.js");
      window.firebase.initializeApp(firebaseConfig);
      return window.firebase.firestore();
    } catch (e) { console.error("Firebase failed to load; using demo mode", e); return localDb(); }
  })();

  const downloads = {
    async save({ filename, data }) {
      const blob = data instanceof Blob ? data : new Blob([data], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob); const a = document.createElement("a");
      a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000); return "saved";
    },
  };

  window.claude = {
    use: async (name) => {
      if (name === "db") return dbPromise;
      if (name === "downloads") return downloads;
      if (name === "user") { const isMentor = await mentor; return { isOwner: async () => isMentor, canEdit: async () => isMentor, can: async () => true }; }
      return null;
    },
  };
  // The board's own links point here, not at claude.ai
  window.P9_BASE = location.origin + location.pathname.replace(/party\/?(index\.html)?$/, "");

  if (!firebaseConfig) addEventListener("DOMContentLoaded", () => {
    const tag = document.createElement("div");
    tag.textContent = "Demo mode: saved on this computer only";
    tag.style.cssText = "position:fixed;left:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:99;font:600 12px/1 system-ui,sans-serif;padding:7px 10px;border-radius:999px;background:#f08a4b;color:#2d1200;pointer-events:none";
    document.body.appendChild(tag);
  });
})();
