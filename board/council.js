// Meeting 1. Prompts are content; answers and decisions come from the shared DB.
// Rehearsal is opt-in, in-memory only, and never writes to the shared board.
(() => {
  const $ = (id) => document.getElementById(id);
  const STUDENTS = ['Leslie', 'Sanjana', 'Shirley', 'Tvishaa'];
  const PEOPLE = [...STUDENTS, 'Katrina'];
  const SESSION = 'meeting-final';
  const ART = { gawain: '@ART:gawain@', odyssey: '@ART:odyssey@', beowulf: '@ART:beowulf@',
    // The team's own work: Tvishaa's drawings and a screenshot of Shirley's game
    lab: '@ART:tvishaa-lab@', door: '@ART:tvishaa-door@', maze: '@ART:tvishaa-maze@', fall: '@ART:shirley-fall@' };
  // Final meeting (Sat Nov 14): wrap-up decisions for the showcase and the Devpost.
  // Earlier rounds live in council.v1.js; their answers stay in the DB under session 'meeting-1'.
  const ROUNDS = [
    { id: 'colors', label: 'Our colors', category: 'Make the art and the game match', seconds: 60,
      question: 'Which look should our game have?',
      prompt: 'Compare Tvishaa\u2019s chamber drawings with the light fall look in the game now. Shirley\u2019s page animations stay either way: this is only about colors.',
      impact: 'The :root colors in style.css and the chamber scenes. Whoever owns it pushes by tonight, before Katrina merges.',
      coach: 'Praise both first: the drawings are beautiful, and the animations are some of the best work in the game.',
      options: [
        ['dark', 'Tvishaa\u2019s drawings', 'Dark bricks, wood and moss, with her drawings as the chamber scenes. Art by Tvishaa.', 'lab'],
        ['light', 'Keep the light fall look', 'The soft fall colors the game has now. Screenshot of Shirley\u2019s screen.', 'fall'] ] },
    { id: 'name', label: 'Our name', category: 'Devpost \u00b7 project name', seconds: 60,
      question: 'What do we call our game?',
      prompt: 'Devpost needs a project name, 60 characters max. Pick one or write your own.',
      impact: 'The project name on Devpost, the title screen and the video.',
      coach: 'If it\u2019s a tie, read the top two out loud and revote fast.',
      options: [
        ['escape', 'Knight\u2019s Escape', 'Short and simple.', 'gawain'],
        ['castle', 'Escape the Warlock\u2019s Castle', 'Says the story right away.', 'odyssey'],
        ['quest', 'Knight\u2019s Escape: An OOP Quest', 'Says what you learn too.', 'beowulf'] ] },
    { id: 'pitch', label: 'Our pitch', category: 'Devpost \u00b7 elevator pitch', seconds: 90,
      question: 'Which tagline sounds most like us?',
      prompt: 'One short line that tells a stranger what our game is. Pick one, then change any words you want.',
      impact: 'The elevator pitch on Devpost, and the first thing we say at the showcase.',
      coach: 'Read each one out loud. Ask: would you say this to a friend? Swap in their words.',
      options: [
        ['objects', 'Think in objects', '\u201cTrapped in a warlock\u2019s castle, the only way out is to think in objects. An escape room that makes OOP click.\u201d', 'gawain'],
        ['doors', 'Every door is a concept', '\u201cA browser escape room where every locked door is an OOP concept. Learn classes, objects and encapsulation by escaping.\u201d', 'odyssey'],
        ['ucf', 'By UCF Knights', '\u201cMade by UCF Knights for anyone who finds OOP confusing: solve the warlock\u2019s puzzles and escape the castle.\u201d', 'beowulf'] ] },
    { id: 'about', label: 'Our story', category: 'Devpost \u00b7 About', seconds: 120,
      question: 'Which part of the About will you write, and what are you proud of?',
      prompt: 'Name one section: Inspiration, What it does, How we built it, Challenges, What we learned. Then finish: \u201cI built ___ and I\u2019m proud of it because ___.\u201d',
      impact: 'The Devpost About. Everyone\u2019s proud line goes in Accomplishments.',
      coach: 'Two people on one section is fine. The proud lines are the real material if Katrina submits.',
      free: true },
    { id: 'video', label: 'Our video', category: 'Devpost \u00b7 the video', seconds: 60,
      question: 'How do we film our video?',
      prompt: 'Short intro (\u201cOOP is so confusing\u2026 what if we made a game?\u201d), then zoom into the game. Where do we film it?',
      impact: 'When and where we record, and who says which line.',
      coach: 'Film horizontally. Gameplay is a screen recording, so it can be done at home either way.',
      options: [
        ['home', 'Everyone at home', 'Each of us films our line on a phone. One person puts it together.', 'gawain'],
        ['person', 'Together, in person', 'One laptop, one camera. Easiest for the zoom into the screen.', 'odyssey'],
        ['both', 'Some of each', 'Intro lines at home, the zoom shot and gameplay together.', 'beowulf'] ] },
    { id: 'thumbstar', label: 'Thumbnail: the star', category: 'Devpost \u00b7 the cover image', seconds: 45,
      question: 'What should be the star of our thumbnail?',
      prompt: 'The thumbnail is the first thing people see on Devpost. Pick the one big picture in the middle.',
      impact: 'What the thumbnail designer puts front and center.',
      coach: 'Our own art beats stock pictures. One big picture plus the name is plenty.',
      options: [
        ['door', 'The castle door', 'Tvishaa\u2019s door, with our name over it. Art by Tvishaa.', 'door'],
        ['maze', 'The maze from above', 'Tvishaa\u2019s maze map, start to end. Art by Tvishaa.', 'maze'],
        ['knight', 'A knight vs. the warlock', 'A new drawing: a knight facing the warlock and his staff.', 'gawain'] ] },
    { id: 'thumblogo', label: 'Thumbnail: logos', category: 'Devpost \u00b7 the cover image', seconds: 30,
      question: 'Should the thumbnail show logos?',
      prompt: 'We\u2019re UCF Knights in Girls Who Code. Do we show that on the cover?',
      impact: 'Whether the designer adds logos, or keeps it to our art and name.',
      coach: 'Logos belong to UCF and GWC, so check the showcase rules before using them.',
      options: [
        ['both', 'UCF + GWC logos', 'Small, in a corner. Shows who made it.'],
        ['gwc', 'Just the GWC logo', 'Our club, nothing else.'],
        ['none', 'No logos', 'Just our art and our name. Cleaner.'] ] },
    { id: 'thumbnail', label: 'Our thumbnail', category: 'Devpost \u00b7 the cover image', seconds: 30,
      question: 'Who wants to design the thumbnail?',
      prompt: 'The thumbnail is the picture people see first on Devpost. It should be our own art.',
      impact: 'Who makes the Devpost cover image, and who helps.',
      coach: 'More than one yes? Pair them up.',
      options: [
        ['me', 'I\u2019ll design it', 'I want to make the thumbnail.', 'gawain'],
        ['help', 'I\u2019ll help', 'I can give ideas or draw a piece of it.', 'odyssey'],
        ['pass', 'Not me this time', 'I\u2019ll help somewhere else.', 'beowulf'] ] },
    { id: 'script', label: 'My video line', category: 'Bonus \u00b7 the video intro', seconds: 90, optional: true,
      question: 'Write one line for the video intro.',
      prompt: 'Something real you felt about learning OOP, like \u201cI don\u2019t even know where to start.\u201d Say it how you\u2019d actually say it.',
      impact: 'The 5\u201315 second intro before we zoom into the game.',
      coach: 'Read them all out loud. The funniest, most honest ones win.',
      free: true },
    { id: 'learned', label: 'What I learned', category: 'Bonus \u00b7 Devpost What we learned', seconds: 60, optional: true,
      question: 'What\u2019s one OOP idea you understand now?',
      prompt: 'One sentence, in your own words. Like: \u201cprivate means only the object can change it.\u201d',
      impact: 'The \u201cWhat we learned\u201d section on Devpost.',
      coach: 'Any answer counts. This is also what judges ask at the showcase.',
      free: true }
  ];
  // Shared with the party screen (party.js), which runs the same rounds on a big screen + phones.
  window.P9_ROUNDS = ROUNDS; window.P9_ART = ART; window.P9_SESSION = SESSION;
  // Can't come to the meeting? These students can answer every round early, on that day only.
  // Their answers stay hidden until Katrina reveals each round.
  window.P9_EARLY = { date: '2026-11-14', names: ['Tvishaa', 'Shirley'] };

  let person = '';
  try { person = JSON.parse(localStorage.getItem('p9-council-person')) || ''; } catch {}
  if (!PEOPLE.includes(person)) person = '';
  let state = { round: 0, phase: 'ready', deadline: 0, remaining: 60, revealed: [] };
  let answers = [], decisions = [], drafts = {};
  let db = null, stateRef = null, answerRef = null, decisionRef = null;
  let stateReady = false, answersReady = false, decisionsReady = false;
  let rehearsal = false, busy = false, drawnKey = '', decisionKey = '';
  const round = () => ROUNDS[state.round];
  const host = () => person === 'Katrina';
  const connected = () => rehearsal || (stateReady && answersReady && decisionsReady);
  const revealed = (id) => state.revealed.includes(id);
  const secondsLeft = () => state.phase === 'running' ? Math.max(0, Math.ceil((state.deadline - Date.now()) / 1000)) : state.remaining;
  const canAnswer = () => connected() && STUDENTS.includes(person) && !busy && (state.phase === 'catchup' || (state.phase === 'running' && secondsLeft() > 0));
  const roundAnswers = (r) => answers.filter((a) => a.round === r.id);
  const savedAnswer = () => answers.find((a) => a.round === round().id && a.name === person);
  const draftKey = () => round().id + '_' + person;

  function text(tag, value, className) {
    const el = document.createElement(tag); el.textContent = value;
    if (className) el.className = className;
    return el;
  }
  function connection(message) { $('council-connection').textContent = message; }
  function error(message) { $('council-answer-status').textContent = message; }
  function cleanState(data) {
    const index = Number.isInteger(data.round) && ROUNDS[data.round] ? data.round : 0;
    return {
      round: index,
      phase: ['ready', 'running', 'paused', 'revealed', 'catchup'].includes(data.phase) ? data.phase : 'ready',
      deadline: Number.isFinite(data.deadline) ? data.deadline : 0,
      remaining: Number.isFinite(data.remaining) ? Math.max(0, data.remaining) : ROUNDS[index].seconds,
      revealed: Array.isArray(data.revealed) ? data.revealed.filter((id) => ROUNDS.some((r) => r.id === id)) : []
    };
  }
  async function writeState(patch) {
    if (!host() || !connected() || busy) return;
    busy = true; renderControls();
    const next = { ...state, ...patch };
    try {
      if (rehearsal) state = next;
      else await stateRef.set(next);
    } catch { error('Host change did not save. Check Contributor access and your connection, then retry.'); }
    finally { busy = false; render(); }
  }
  function chooseRound(index) {
    if (index === state.round) return;
    rememberDraft();
    writeState({ round: index, phase: revealed(ROUNDS[index].id) ? 'revealed' : 'ready', remaining: ROUNDS[index].seconds, deadline: 0 });
  }
  function rememberDraft() {
    if (!drawnKey) return;
    drafts[drawnKey] = {
      pick: $('council-answer').querySelector('input[name="council-pick"]:checked')?.value || '',
      idea: $('council-idea').value, due: $('council-due').value
    };
  }
  function buildSeats() {
    const seats = $('council-seats'); seats.replaceChildren();
    PEOPLE.forEach((name) => {
      const b = text('button', name, 'council-seat press'); b.type = 'button';
      b.dataset.person = name; b.setAttribute('aria-pressed', String(name === person));
      if (name === 'Katrina') b.appendChild(text('small', 'host'));
      b.onclick = () => {
        rememberDraft(); person = name;
        try { localStorage.setItem('p9-council-person', JSON.stringify(name)); } catch {}
        drawnKey = ''; decisionKey = ''; error(''); render();
      };
      seats.appendChild(b);
    });
  }
  function buildRoundList() {
    $('council-rounds').replaceChildren(); $('council-bonus').replaceChildren();
    ROUNDS.forEach((r, i) => {
      const li = document.createElement('li'); const b = document.createElement('button'); b.type = 'button';
      b.dataset.round = i; b.disabled = !host() || !connected() || busy;
      b.setAttribute('aria-current', state.round === i ? 'step' : 'false');
      b.appendChild(text('b', String(i + 1).padStart(2, '0')));
      const label = text('span', r.label); label.appendChild(text('small', `${r.seconds}s${revealed(r.id) ? ' · revealed' : ''}`)); b.appendChild(label);
      b.onclick = () => chooseRound(i); li.appendChild(b);
      $(r.optional ? 'council-bonus' : 'council-rounds').appendChild(li);
    });
  }
  function buildQuestion() {
    const r = round();
    $('council-category').textContent = r.category;
    $('council-number').textContent = r.optional ? 'Optional round · protect the build time' : `Round ${state.round + 1} of ${ROUNDS.filter((x) => !x.optional).length}`;
    $('council-question').textContent = r.question;
    $('council-prompt').textContent = r.prompt;
    $('council-impact').textContent = r.impact;
    $('council-coach').textContent = r.coach;
    const key = draftKey();
    if (key === drawnKey) return;
    drawnKey = key;
    const draft = drafts[key] || savedAnswer() || {};
    const choices = $('council-choices'); choices.replaceChildren();
    $('council-options').hidden = !!r.free;
    const options = r.free ? [] : [...r.options, ['own', 'I have another idea', 'Describe your own direction below.']];
    options.forEach(([value, title, description, art]) => {
      const label = document.createElement('label'); label.className = 'council-choice' + (value === 'own' ? ' own' : '');
      const radio = document.createElement('input'); radio.type = 'radio'; radio.name = 'council-pick'; radio.value = value; radio.checked = draft.pick === value;
      radio.onchange = () => { rememberDraft(); updateIdeaLabel(); };
      label.appendChild(radio);
      if (art) { const img = document.createElement('img'); img.src = ART[art]; img.alt = ''; label.appendChild(img); }
      const body = document.createElement('span'); body.className = 'choice-body'; body.append(text('b', title), text('span', description, 'choice-copy'));
      label.appendChild(body); choices.appendChild(label);
    });
    $('council-idea').value = draft.idea || ''; $('council-due').value = draft.due || '';
    $('council-due-wrap').hidden = !r.due;
    $('council-due').required = !!r.due;
    error(savedAnswer() ? 'Your saved answer is loaded. You can revise it while the round is open.' : '');
    updateIdeaLabel();
  }
  function updateIdeaLabel() {
    const own = $('council-answer').querySelector('input[name="council-pick"]:checked')?.value === 'own';
    $('council-idea').required = !!round().free || own;
    $('council-idea-label').textContent = round().free ? (round().due ? 'My result, and any help I need' : 'My tiny creative twist') : own ? 'Describe your own direction (required)' : 'Your creative spin or reason (optional)';
  }
  function renderControls() {
    const left = secondsLeft(); const running = state.phase === 'running';
    $('council-clock').textContent = state.phase === 'catchup' ? 'OPEN' : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
    const phases = { ready: 'Waiting for host', running: left > 0 ? 'Think · choose · send' : 'Time is up · drafts kept', paused: 'Paused · take a breath', revealed: 'Discuss your ideas', catchup: 'Catch-up · no timer' };
    $('council-phase').textContent = phases[state.phase];
    $('council-host').hidden = !host();
    const hostDisabled = !host() || !connected() || busy;
    $('council-host').querySelectorAll('button').forEach((b) => { b.disabled = hostDisabled; });
    $('council-start').disabled = hostDisabled || running || state.phase === 'catchup';
    $('council-start').textContent = state.phase === 'paused' ? 'Resume round' : state.phase === 'revealed' ? 'Reopen timed round' : 'Start round';
    $('council-pause').disabled = hostDisabled || !running;
    $('council-extend').disabled = hostDisabled || !['running', 'paused'].includes(state.phase);
    $('council-next').textContent = state.round === ROUNDS.filter((x) => !x.optional).length - 1 ? 'Finish core rounds ↓' : state.round === ROUNDS.length - 1 ? 'View our brief ↓' : 'Next round →';
    $('council-submit').disabled = !canAnswer();
    $('council-submit').textContent = busy ? 'Saving…' : !person ? 'Pick your name first' : host() ? 'Host listens · students answer' : !connected() ? 'Waiting for shared connection' : canAnswer() ? savedAnswer() ? 'Update my answer' : 'Lock in my answer' : state.phase === 'paused' ? 'Round paused · draft kept' : 'Wait for the host to open';
    // Writing a draft is allowed while paused or closed. Only submission is gated.
    $('council-answer').querySelectorAll('input, textarea').forEach((el) => { el.disabled = !STUDENTS.includes(person) || busy; });
    $('council-decision').querySelectorAll('button, textarea').forEach((el) => { el.disabled = hostDisabled; });
  }
  function answerLabel(r, a) {
    return r.free || a.pick === 'own' ? a.idea : (r.options.find((o) => o[0] === a.pick)?.[1] || 'Unknown choice');
  }
  function voteSummary(r) {
    const list = roundAnswers(r);
    if (!list.length) return 'No responses yet.';
    if (r.free) return list.map((a) => `${a.name}: ${a.idea}${a.due ? ' · Can show: ' + a.due : ''}`).join('\n');
    const counts = r.options.map((o) => ({ label: o[1], n: list.filter((a) => a.pick === o[0]).length }));
    const top = Math.max(0, ...counts.map((c) => c.n));
    const leaders = counts.filter((c) => c.n === top && top > 0);
    const own = list.filter((a) => a.pick === 'own').length;
    return (leaders.length > 1 ? 'Tied suggestions: ' : 'Leading suggestion: ') + (leaders.length ? leaders.map((c) => `${c.label} (${c.n})`).join(', ') : 'No preset selected') + (own ? `. ${own} original idea(s) to discuss.` : '.');
  }
  function renderResults() {
    const r = round(), list = roundAnswers(r), show = revealed(r.id);
    const arrivals = $('council-arrivals'); arrivals.replaceChildren();
    STUDENTS.forEach((name) => {
      const arrived = list.some((a) => a.name === name);
      arrivals.appendChild(text('span', `${name} · ${arrived ? 'sent' : 'not yet'}`, arrived ? 'arrived' : ''));
    });
    $('council-results').hidden = !show;
    $('council-decision').hidden = !show || !host();
    if (!show) return;
    $('council-result-count').textContent = `${list.length}/4 voices`;
    const missing = STUDENTS.filter((name) => !list.some((a) => a.name === name));
    $('council-result-note').textContent = voteSummary(r) + (missing.length ? ` Missing: ${missing.join(', ')}. Keep decisions provisional.` : ' All four have responded. Discuss before choosing.');
    const rows = $('council-result-rows'); rows.replaceChildren();
    if (!r.free) r.options.forEach((option) => {
      const voters = list.filter((a) => a.pick === option[0]);
      const row = document.createElement('div'); row.className = 'council-result';
      const line = document.createElement('div'); line.className = 'result-line'; line.append(text('b', option[1]), text('strong', String(voters.length)));
      const meter = document.createElement('div'); meter.className = 'council-meter';
      const fill = document.createElement('i'); fill.style.transform = `scaleX(${voters.length / 4})`; meter.appendChild(fill);
      row.append(line, meter, text('p', voters.length ? voters.map((a) => a.name).join(', ') : 'No votes'));
      rows.appendChild(row);
    });
    list.forEach((a) => {
      if (!a.idea && !r.free) return;
      const row = document.createElement('div'); row.className = 'council-result';
      row.append(text('b', `${a.name}${a.pick === 'own' ? ' · original direction' : ' · creative spin'}`), text('p', a.idea + (a.due ? '\nCan show: ' + a.due : '')));
      rows.appendChild(row);
    });
    if (decisionKey !== r.id) {
      $('council-agreement').value = decisions.find((d) => d.round === r.id)?.text || '';
      decisionKey = r.id;
    }
  }
  function briefEntry(r) {
    const decision = decisions.find((d) => d.round === r.id);
    const list = roundAnswers(r);
    const visible = revealed(r.id);
    const missing = STUDENTS.filter((name) => !list.some((a) => a.name === name));
    return {
      heading: r.label,
      body: decision ? `Working decision: ${decision.text}` : visible ? voteSummary(r) : 'Not revealed yet. No decision recorded.',
      detail: visible ? `${list.length}/4 responses${missing.length ? ' · Still need: ' + missing.join(', ') : ' · All four responded'}. ${decision ? 'Working decision; revisit if new ideas arrive.' : 'Discuss before treating this as agreed.'}` : 'Answers stay off the shared screen until reveal.'
    };
  }
  function renderBrief() {
    const wrap = $('council-brief'); wrap.replaceChildren();
    ROUNDS.filter((r) => !r.optional || revealed(r.id)).forEach((r) => {
      const entry = briefEntry(r); const card = document.createElement('article'); card.className = 'council-brief-item';
      card.append(text('h4', entry.heading), text('p', entry.body), text('small', entry.detail)); wrap.appendChild(card);
    });
  }
  function render() {
    buildSeats(); buildRoundList(); buildQuestion(); renderResults(); renderBrief(); renderControls();
  }

  $('council-idea').oninput = rememberDraft; $('council-due').oninput = rememberDraft;
  $('council-answer').onsubmit = async (event) => {
    event.preventDefault(); if (!canAnswer()) return;
    rememberDraft(); const draft = drafts[draftKey()]; const r = round();
    if (!r.free && !draft.pick) { error('Choose a direction, or choose “I have another idea.”'); return; }
    if ((r.free || draft.pick === 'own') && !draft.idea.trim()) { error('Write your idea before sending.'); $('council-idea').focus(); return; }
    if (r.due && !draft.due) { error('Choose a date you can show your result.'); return; }
    const answer = { session: SESSION, round: r.id, name: person, pick: r.free ? 'free' : draft.pick, idea: draft.idea.trim(), due: r.due ? draft.due : '', updatedAt: Date.now() };
    const id = `${SESSION}_${r.id}_${person}`;
    busy = true; renderControls();
    try {
      if (rehearsal) answers = [...answers.filter((a) => !(a.round === answer.round && a.name === answer.name)), answer];
      else await answerRef.doc(id).set(answer);
      error(rehearsal ? 'Rehearsal answer saved in memory only.' : 'Answer saved. You can revise it while the round is open.');
    } catch { error('Your answer did not save. Your draft is still here; check Contributor access or connection and retry.'); }
    finally { busy = false; render(); }
  };
  $('council-start').onclick = () => {
    const seconds = state.phase === 'paused' ? Math.max(1, state.remaining) : round().seconds;
    writeState({ phase: 'running', remaining: seconds, deadline: Date.now() + seconds * 1000 });
  };
  $('council-pause').onclick = () => writeState({ phase: 'paused', remaining: secondsLeft(), deadline: 0 });
  $('council-extend').onclick = () => state.phase === 'running'
    ? writeState({ deadline: Math.max(Date.now(), state.deadline) + 30000 })
    : writeState({ remaining: state.remaining + 30 });
  $('council-reveal').onclick = () => writeState({ phase: 'revealed', remaining: secondsLeft(), deadline: 0, revealed: [...new Set([...state.revealed, round().id])] });
  $('council-catchup').onclick = () => writeState({ phase: 'catchup', deadline: 0 });
  $('council-next').onclick = () => {
    if (state.round === ROUNDS.filter((x) => !x.optional).length - 1 || state.round === ROUNDS.length - 1) $('council-brief-title').scrollIntoView({ behavior: 'instant', block: 'center' });
    else chooseRound(state.round + 1);
  };
  $('council-decision').onsubmit = async (event) => {
    event.preventDefault(); if (!host() || !connected() || busy) return;
    const value = $('council-agreement').value.trim(); if (!value) { error('Write the working decision, or note what is unresolved.'); return; }
    const decision = { session: SESSION, round: round().id, text: value, updatedAt: Date.now() };
    busy = true; renderControls();
    try {
      if (rehearsal) decisions = [...decisions.filter((d) => d.round !== decision.round), decision];
      else await decisionRef.doc(`${SESSION}_${decision.round}`).set(decision);
      error('Working decision saved in the brief.');
    } catch { error('Decision did not save. Your text is still here; check access or connection and retry.'); }
    finally { busy = false; render(); }
  };
  $('council-export').onclick = () => {
    const lines = ["Knight's Escape — Final meeting (Sat Nov 14)", rehearsal ? 'LOCAL REHEARSAL — not shared team decisions' : 'Working brief — confirm with missing teammates', ''];
    ROUNDS.forEach((r) => {
      const entry = briefEntry(r); lines.push(entry.heading, entry.body, entry.detail);
      if (revealed(r.id)) roundAnswers(r).forEach((a) => lines.push(`- ${a.name}: ${answerLabel(r, a)}${a.idea && !r.free && a.pick !== 'own' ? ' — ' + a.idea : ''}${a.due ? ' · Can show: ' + a.due : ''}`));
      lines.push('');
    });
    lines.push('Next: Katrina merges Sun to Tue (Nov 15 to 17). Devpost due Wed Nov 18, 11:45pm. Showcase Thu Nov 19, 6pm, HEC 119. No tasks were created automatically.');
    window.p9SaveText(rehearsal ? 'final-meeting-rehearsal.txt' : 'final-meeting-brief.txt', lines.join('\n'));
  };
  $('council-rehearse').onclick = () => {
    rehearsal = true; person = 'Katrina';
    connection('LOCAL REHEARSAL · answers stay in this tab and disappear on reload. Switch names to practice. Nothing is sent to the team.');
    $('council-rehearse').hidden = true; drawnKey = ''; render();
  };
  function syncError() {
    stateReady = false; answersReady = false; decisionsReady = false;
    connection('Council sync failed. Displayed answers may be old. Drafts are kept; reload to reconnect and check Contributor access.');
    renderControls(); buildRoundList();
  }
  function checkReady() {
    if (connected()) connection('SHARED COUNCIL · same round on every connected device. Responses are named and shown after reveal.');
    render();
  }
  render(); setInterval(renderControls, 250);
  if (window.claude?.use) {
    window.claude.use('db').then((database) => {
      if (!database) { connection('Sign in to Claude to join the shared council.'); return; }
      db = database;
      stateRef = db.doc('workshop_sessions/' + SESSION);
      answerRef = db.collection('workshop_answers');
      decisionRef = db.collection('workshop_decisions');
      stateRef.onSnapshot((snapshot) => {
        rememberDraft();
        if (snapshot.exists) state = cleanState(snapshot.data());
        stateReady = true; checkReady();
      }, syncError);
      answerRef.onSnapshot((snapshot) => {
        answers = snapshot.docs.map((doc) => doc.data()).filter((a) => a.session === SESSION && STUDENTS.includes(a.name) && ROUNDS.some((r) => r.id === a.round) && typeof a.idea === 'string');
        // One logical answer per student and round, even if malformed duplicate docs exist.
        answers = [...new Map(answers.sort((a, b) => (a.updatedAt || 0) - (b.updatedAt || 0)).map((a) => [a.round + '_' + a.name, a])).values()];
        answersReady = true; checkReady();
      }, syncError);
      decisionRef.onSnapshot((snapshot) => {
        decisions = snapshot.docs.map((doc) => doc.data()).filter((d) => d.session === SESSION && ROUNDS.some((r) => r.id === d.round) && typeof d.text === 'string');
        decisionsReady = true; checkReady();
      }, syncError);
    }).catch(() => { connection('Could not connect to the shared council. Reload in Claude to retry.'); });
  } else {
    connection('LOCAL PREVIEW · live multiplayer needs the published Claude artifact. You can rehearse here without saving shared answers.');
    $('council-rehearse').hidden = false;
  }
})();
