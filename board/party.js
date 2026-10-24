// Party mode: #host is the big screen Katrina streams; #play is each student's phone.
// It runs the same Council rounds and writes the same records as council.js
// (workshop_sessions/meeting-1, workshop_answers), so the Council screen, the brief and Live stay in sync.
(() => {
  const $ = (id) => document.getElementById(id);
  const ALL = window.P9_ROUNDS || [];
  const CORE = ALL.filter((r) => !r.optional).length;
  const ART = window.P9_ART || {};
  const STUDENTS = ["Leslie", "Sanjana", "Shirley", "Tvishaa"];
  const COLOR = { Leslie: "var(--c3)", Sanjana: "var(--c2)", Shirley: "var(--c1)", Tvishaa: "var(--c4)" };
  const OPT = ["var(--c1)", "var(--c2)", "var(--c3)"];
  const SESSION = "meeting-1";
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const anim = (t, v) => { if (window.gsap && !calm && t && (t.length === undefined || t.length)) window.gsap.from(t, v); };
  const face = window.P9_FACE || (() => "");
  const day = new Date(); day.setHours(0, 0, 0, 0);
  const today = day.getFullYear() + "-" + String(day.getMonth() + 1).padStart(2, "0") + "-" + String(day.getDate()).padStart(2, "0");
  // A new 4-letter room code each day, so last week's link can't join today's room by accident
  const WORDS = ["MAZE", "KEYS", "DOOR", "LAMP", "RUNE", "MOAT", "WAND", "SAGE"];
  const CODE = WORDS[Math.floor((day - new Date(day.getFullYear(), 0, 0)) / 864e5) % WORDS.length];
  const store = {
    get(k, f) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch { return f; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  const avatar = (name) => `<span class="p-av" style="background:${COLOR[name] || "var(--parch)"}">${face(4)}</span>`;
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  let mode = null, db = null, sessRef = null, ansRef = null, playRef = null, owner = false, started = false;
  let state = { round: 0, phase: "ready", deadline: 0, remaining: 60, revealed: [] };
  let answers = [], players = [], me = "", tick = null;
  const round = () => ALL[state.round] || ALL[0];
  const finished = () => state.round >= CORE;
  const secsLeft = () => state.phase === "running" ? Math.max(0, Math.ceil((state.deadline - Date.now()) / 1000)) : (state.remaining || round().seconds);
  const mmss = (s) => Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  const roundAnswers = () => answers.filter((a) => a.round === round().id && STUDENTS.includes(a.name));

  // ---------- Host ----------
  let seenAnswered = new Set(), seenJoined = new Set(), lastView = "";
  function renderHost() {
    const r = round();
    $("h-code").innerHTML = CODE.split("").map((c) => `<span>${c}</span>`).join("");
    $("h-code-mini").textContent = CODE;
    $("h-round").textContent = finished() ? "All rounds done" : `Round ${state.round + 1} of ${CORE} · ${r.label}`;
    const view = finished() ? "end" : state.phase === "revealed" ? "reveal" : state.phase === "ready" ? "lobby" : "question";
    ["lobby", "question", "reveal", "end"].forEach((v) => { $("h-" + v).hidden = v !== view; });
    if (view === "lobby") {
      const first = state.round === 0 && !answers.length;
      $("h-lobby-title").textContent = first ? "The Council is gathering" : `Up next: ${r.label}`;
      $("h-lobby-sub").textContent = first ? "Join on your phone. When everyone's here, the host starts round 1." : r.question;
      const crowd = $("h-crowd"); crowd.innerHTML = ""; const fresh = [];
      STUDENTS.forEach((n) => {
        const inn = players.includes(n);
        const el = document.createElement("div"); el.className = "p-player" + (inn ? "" : " out");
        el.innerHTML = avatar(n) + `<b>${esc(n)}</b>`; crowd.appendChild(el);
        if (inn && !seenJoined.has(n)) { seenJoined.add(n); fresh.push(el); }
      });
      anim(fresh, { scale: .6, opacity: 0, duration: .5, ease: "back.out(2.2)", stagger: .08 });
    }
    if (view === "question") {
      $("h-cat").textContent = r.category; $("h-q").textContent = r.question; $("h-prompt").textContent = r.prompt;
      const key = "q" + state.round;
      if (lastView !== key) {
        const o = $("h-opts"); o.innerHTML = "";
        if (r.free) o.innerHTML = `<div class="p-free">Everyone writes their own idea on their phone. Answers stay hidden until the reveal.</div>`;
        else r.options.forEach(([id, label, copy, art], i) => {
          const c = document.createElement("div"); c.className = "p-opt";
          c.innerHTML = `<img alt="" src="${ART[art] || ""}"><span class="p-letter" style="background:${OPT[i]}">${"ABC"[i]}</span><div class="p-opt-body"><b class="p-opt-name"></b><span class="p-opt-copy"></span></div>`;
          c.querySelector(".p-opt-name").textContent = label; c.querySelector(".p-opt-copy").textContent = copy; o.appendChild(c);
        });
        anim([$("h-cat"), $("h-q"), $("h-prompt")], { y: 16, opacity: 0, duration: .45, stagger: .07, ease: "power3.out", clearProps: "all" });
        anim(o.children, { y: 30, opacity: 0, rotate: -2, duration: .5, stagger: .09, delay: .2, ease: "back.out(1.6)", clearProps: "all" });
        seenAnswered = new Set();
      }
      const ans = $("h-answered"); ans.innerHTML = ""; const fresh = [];
      const names = roundAnswers().map((a) => a.name);
      STUDENTS.forEach((n) => {
        const done = names.includes(n);
        const el = document.createElement("div"); el.className = "p-player" + (done ? "" : " out");
        el.innerHTML = avatar(n) + `<b>${done ? "Sent!" : esc(n)}</b>`; ans.appendChild(el);
        if (done && !seenAnswered.has(n)) { seenAnswered.add(n); fresh.push(el.firstChild); }
      });
      anim(fresh, { scale: .5, duration: .45, ease: "back.out(3)" });
      paintTimer();
    }
    if (view === "reveal") {
      const key = "r" + state.round + ":" + roundAnswers().map((a) => a.name + a.pick + a.idea).join("|");
      $("h-rq").textContent = r.question;
      if (lastView !== key) {
        const list = roundAnswers();
        const bars = $("h-bars"); bars.innerHTML = "";
        if (!r.free) {
          const opts = [...r.options.map(([id, label], i) => [id, label, OPT[i]]), ["own", "Another idea", "var(--parch-2)"]];
          const counts = opts.map(([id]) => list.filter((a) => a.pick === id).length);
          const max = Math.max(1, ...counts), top = Math.max(...counts);
          opts.forEach(([id, label, color], i) => {
            if (id === "own" && !counts[i]) return;
            const who = list.filter((a) => a.pick === id).map((a) => a.name).join(", ");
            const row = document.createElement("div"); row.className = "p-bar" + (counts[i] === top && top > 0 ? " win" : "");
            row.innerHTML = `<b></b><div class="p-track"><i style="background:${color};transform:scaleX(${counts[i] / max})"></i><small></small></div><span>${counts[i]}</span>`;
            row.querySelector("b").textContent = label; row.querySelector("small").textContent = who;
            bars.appendChild(row);
          });
          if (window.gsap && !calm) window.gsap.from(bars.querySelectorAll(".p-track i"), { scaleX: 0, duration: .9, stagger: .15, ease: "power3.out" });
        }
        const ideas = $("h-ideas"); ideas.innerHTML = "";
        list.filter((a) => a.idea).forEach((a) => {
          const el = document.createElement("div"); el.className = "p-idea";
          el.innerHTML = `<b></b><span></span>`; el.querySelector("b").textContent = a.name; el.querySelector("span").textContent = a.idea;
          ideas.appendChild(el);
        });
        if (!list.length) ideas.innerHTML = `<div class="p-idea"><b>No answers yet</b><span>Use Back to reopen the round.</span></div>`;
        anim(ideas.children, { y: 20, opacity: 0, duration: .45, stagger: .12, delay: .5, ease: "back.out(1.6)", clearProps: "all" });
      }
    }
    lastView = view === "question" ? "q" + state.round : view === "reveal" ? "r" + state.round + ":" + roundAnswers().map((a) => a.name + a.pick + a.idea).join("|") : view;
    renderControls(view);
  }
  function paintTimer() {
    const s = secsLeft(), total = round().seconds || 60;
    $("h-secs").textContent = state.phase === "paused" ? "II" : state.phase === "catchup" ? "–" : mmss(s);
    $("h-ring").style.strokeDashoffset = String(327 * (1 - Math.min(1, s / total)));
    $("h-timer").classList.toggle("low", state.phase === "running" && s <= 10);
  }
  function renderControls(view) {
    const ctl = $("h-controls"); ctl.hidden = !owner;
    const main = $("h-main");
    const label = { lobby: "Start round", question: state.phase === "paused" ? "Resume" : "Reveal answers", reveal: state.round + 1 >= CORE ? "Finish" : "Next round", end: "Done" }[view];
    main.textContent = label; main.disabled = view === "end";
    $("h-plus").disabled = view !== "question"; $("h-back").disabled = state.round === 0 && view === "lobby";
  }
  async function write(patch) {
    if (!owner || !sessRef) return;
    state = { ...state, ...patch };
    renderHost();
    try { await sessRef.set(state); } catch { $("h-lobby-sub").textContent = "That didn't save. Check your connection."; }
  }
  function mainAction() {
    const view = finished() ? "end" : state.phase === "revealed" ? "reveal" : state.phase === "ready" ? "lobby" : "question";
    const r = round();
    if (view === "lobby") write({ phase: "running", deadline: Date.now() + r.seconds * 1000, remaining: r.seconds });
    else if (view === "question" && state.phase === "paused") write({ phase: "running", deadline: Date.now() + (state.remaining || r.seconds) * 1000 });
    else if (view === "question") write({ phase: "revealed", remaining: secsLeft(), deadline: 0, revealed: [...new Set([...(state.revealed || []), r.id])] });
    else if (view === "reveal") { const n = state.round + 1; write({ round: n, phase: "ready", deadline: 0, remaining: (ALL[n] || r).seconds }); }
  }
  function hostControls() {
    $("h-main").onclick = mainAction;
    $("h-plus").onclick = () => state.phase === "running" ? write({ deadline: state.deadline + 30000 }) : write({ remaining: (state.remaining || 0) + 30 });
    $("h-back").onclick = () => {
      if (state.phase === "ready" || finished()) { const n = Math.max(0, Math.min(state.round, CORE) - 1); write({ round: n, phase: "revealed", deadline: 0 }); }
      else write({ phase: "ready", deadline: 0, remaining: round().seconds });
    };
    $("h-full").onclick = () => { const el = document.documentElement; (el.requestFullscreen ? el.requestFullscreen() : Promise.reject()).catch(() => {}); };
    document.addEventListener("keydown", (e) => {
      if (mode !== "host" || !owner || e.target.closest("input,textarea")) return;
      if (e.code === "Space") { e.preventDefault(); mainAction(); }
    });
  }

  // ---------- Player ----------
  let draft = { round: "", pick: "", idea: "", due: "" };
  // After the live Council ends, a player who missed rounds answers them on her own, no host or timer.
  const missing = () => ALL.filter((r) => !r.optional && !answers.some((a) => a.round === r.id && a.name === me));
  const catchUp = () => finished() && missing().length > 0;
  const playRound = () => catchUp() ? missing()[0] : round();
  function renderPlay() {
    if (!me) return;
    $("j-form").hidden = true; $("j-phone").hidden = false;
    $("j-av").outerHTML = `<span class="p-av" id="j-av" style="background:${COLOR[me]}">${face(4)}</span>`;
    $("j-name-t").textContent = me; $("j-code-t").innerHTML = `Room <b>${CODE}</b>`;
    const r = playRound();
    const answering = catchUp() || (!finished() && (state.phase === "running" || state.phase === "catchup"));
    $("j-wait").hidden = answering; $("j-answer").hidden = !answering;
    if (!answering) {
      const t = finished() ? ["That's a wrap!", "Thanks for shaping the game. Time to build."]
        : state.phase === "revealed" ? ["Look up!", "The answers are on the big screen."]
        : state.phase === "paused" ? ["Paused", "Hang tight. The host paused the round."]
        : state.round === 0 && !answers.length ? ["You're in!", "Look at the big screen. The host will start soon."]
        : [`Up next: ${r.label}`, "Get ready. The host starts the round."];
      $("j-wait-t").textContent = t[0]; $("j-wait-s").textContent = t[1];
      return;
    }
    if (draft.round !== r.id) {
      const mine = answers.find((a) => a.round === r.id && a.name === me);
      draft = { round: r.id, pick: mine ? mine.pick : "", idea: mine ? mine.idea || "" : "", due: mine ? mine.due || "" : "" };
      $("j-cat").textContent = r.label; $("j-q").textContent = r.question;
      const picks = $("j-picks"); picks.innerHTML = "";
      if (!r.free) {
        [...r.options, ["own", "I have another idea", "Write it below"]].forEach(([id, label, copy], i) => {
          const b = document.createElement("button"); b.type = "button"; b.setAttribute("role", "radio"); b.className = "p-pick" + (id === "own" ? " own" : ""); b.dataset.id = id;
          b.innerHTML = `<span class="p-letter" style="background:${OPT[i] || "var(--parch-2)"}">${id === "own" ? "+" : "ABC"[i]}</span><span><b></b><small></small></span>`;
          b.querySelector("b").textContent = label; b.querySelector("small").textContent = copy;
          b.onclick = () => { draft.pick = id; syncPicks(); if (window.gsap && !calm) window.gsap.fromTo(b, { scale: .96 }, { scale: 1, duration: .3, ease: "back.out(3)" }); };
          picks.appendChild(b);
        });
      }
      $("j-idea").value = draft.idea; $("j-due").value = draft.due; $("j-due").hidden = !r.due;
      $("j-idea-l").textContent = r.free ? "Your idea" : "Add your own spin (optional)";
      $("j-msg").textContent = "";
      anim($("j-answer").children, { y: 12, opacity: 0, duration: .35, stagger: .04, ease: "power3.out", clearProps: "all" });
    }
    syncPicks(); paintPlayTimer();
  }
  function syncPicks() { [...$("j-picks").children].forEach((b) => b.setAttribute("aria-checked", String(b.dataset.id === draft.pick))); }
  function paintPlayTimer() {
    if (mode !== "play" || $("j-answer").hidden) return;
    if (catchUp()) { const left = missing().length; $("j-time").textContent = `Catch-up · ${left} question${left === 1 ? "" : "s"} left · no timer`; $("j-send").disabled = !ansRef; return; }
    const s = secsLeft(), closed = state.phase === "running" && s <= 0;
    $("j-time").textContent = state.phase === "catchup" ? "Catch-up: no timer" : closed ? "Time's up" : `${mmss(s)} left`;
    $("j-send").disabled = closed || !ansRef;
  }
  function playControls() {
    const saved = store.get("p9-party", null);
    $("j-name").value = (saved && saved.name) || store.get("p9-me", "") || "";
    const verified = store.get("p9-verified", "");
    if (STUDENTS.includes(verified)) { $("j-name").value = verified; $("j-pin-row").hidden = true; }
    if (saved && saved.date === today && saved.code === CODE && STUDENTS.includes(saved.name) && saved.name === verified) { me = saved.name; join(false); }
    $("j-name").addEventListener("input", () => { $("j-pin-row").hidden = $("j-name").value.trim().toLowerCase() === verified.toLowerCase() && !!verified; });
    $("j-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const code = $("j-code").value.trim().toUpperCase();
      const typed = $("j-name").value.trim().toLowerCase();
      const name = STUDENTS.find((n) => n.toLowerCase() === typed);
      if (code !== CODE) { $("j-err").textContent = "That room code doesn't match. Check the big screen."; return; }
      if (typed === "katrina") { $("j-err").textContent = "Katrina, you're the host. Open the host screen instead."; return; }
      if (!name) { $("j-err").textContent = "Type your first name as it is on the team list."; return; }
      if (store.get("p9-verified", "") !== name) {
        const pin = $("j-pin").value.trim();
        const ok = window.P9_PINS && window.P9_PIN_HASH && /^\d{4}$/.test(pin) && await window.P9_PIN_HASH(name, pin) === window.P9_PINS[name];
        if (!ok) { $("j-err").textContent = "That PIN doesn't match. Ask Katrina if you forgot it."; $("j-pin").value = ""; return; }
        store.set("p9-verified", name);
      }
      me = name; store.set("p9-party", { code, name, date: today }); store.set("p9-me", name); store.set("p9-council-person", name);
      join(true);
    });
    $("j-idea").addEventListener("input", () => { draft.idea = $("j-idea").value; });
    $("j-due").addEventListener("input", () => { draft.due = $("j-due").value; });
    $("j-answer").addEventListener("submit", async (e) => {
      e.preventDefault();
      const r = playRound();
      if (!r.free && !draft.pick) { $("j-msg").textContent = "Pick one first, or choose \"I have another idea.\""; return; }
      if ((r.free || draft.pick === "own") && !draft.idea.trim()) { $("j-msg").textContent = "Write your idea before sending."; return; }
      if (r.due && !draft.due) { $("j-msg").textContent = "Choose a date you can show it."; return; }
      const answer = { session: SESSION, round: r.id, name: me, pick: r.free ? "free" : draft.pick, idea: draft.idea.trim(), due: r.due ? draft.due : "", updatedAt: Date.now() };
      try { await ansRef.doc(`${SESSION}_${r.id}_${me}`).set(answer); $("j-msg").textContent = "Sent! You can change it until time's up."; }
      catch { $("j-msg").textContent = "That didn't send. Check your connection and try again."; }
    });
  }
  function join(fresh) {
    renderPlay();
    if (playRef) playRef.doc(`${today}_${me}`).set({ name: me, date: today, joinedAt: Date.now() }).catch(() => {});
    if (fresh) anim($("j-phone").children, { y: 14, opacity: 0, duration: .4, stagger: .06, ease: "power3.out", clearProps: "all" });
  }

  // ---------- Start ----------
  function render() { if (mode === "host") renderHost(); else renderPlay(); }
  function start(m) {
    mode = m;
    document.body.classList.add("party-mode");
    $("party").hidden = false; $("p-host").hidden = m !== "host"; $("p-play").hidden = m !== "play";
    if (started) { render(); return; }
    started = true;
    if (m === "host") hostControls(); else playControls();
    render();
    tick = setInterval(() => { if (mode === "host" && !$("h-question").hidden) paintTimer(); if (mode === "play") paintPlayTimer(); }, 250);
    if (!(window.claude && window.claude.use)) { if (m === "host") $("h-lobby-sub").textContent = "Open this on claude.ai to host."; return; }
    Promise.resolve().then(() => window.claude.use("user")).then(async (u) => {
      try { owner = !!(u && typeof u.isOwner === "function" && await u.isOwner()); } catch { owner = false; }
      if (m === "host" && !owner) $("h-lobby-sub").textContent = "Only the board's owner can run the rounds. You can watch.";
      render();
    }).catch(() => {});
    window.claude.use("db").then((d) => {
      if (!d) return;
      db = d; sessRef = db.doc("workshop_sessions/" + SESSION); ansRef = db.collection("workshop_answers"); playRef = db.collection("party_players");
      sessRef.onSnapshot((s) => { if (s.exists) state = { ...state, ...s.data() }; render(); }, () => {});
      ansRef.onSnapshot((s) => { answers = s.docs.map((x) => x.data()).filter((a) => a.session === SESSION); render(); }, () => {});
      playRef.onSnapshot((s) => { players = s.docs.map((x) => x.data()).filter((p) => p.date === today).map((p) => p.name); render(); }, () => {});
      if (m === "play" && me) join(false);
      render();
    });
  }
  window.P9_PARTY = (m) => { try { history.replaceState(null, "", "#" + m); } catch {} start(m); };
  const h = (location.hash || "").slice(1).toLowerCase();
  if (h === "host" || h === "play") start(h);
  else if (window.P9_PARTY_DEFAULT) start(window.P9_PARTY_DEFAULT); // the /party/ page on the public site
})();
