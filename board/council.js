// Meeting 1. Prompts are content; answers and decisions come from the shared DB.
// Rehearsal is opt-in, in-memory only, and never writes to the shared board.
(() => {
  const $ = (id) => document.getElementById(id);
  const STUDENTS = ['Leslie', 'Sanjana', 'Shirley', 'Tvishaa'];
  const PEOPLE = [...STUDENTS, 'Katrina'];
  const SESSION = 'meeting-1';
  const ART = { gawain: '@ART:gawain@', odyssey: '@ART:odyssey@', beowulf: '@ART:beowulf@' };
  // Only questions the team hasn't answered yet. Their earlier polls already chose the player
  // (college, 4 of 4), the problem (personalized help + remembering) and the story (design deck).
  const ROUNDS = [
    { id: 'recall', label: 'Remember it', category: 'You voted: struggle to remember', seconds: 60,
      question: 'How does our game help players remember?',
      prompt: 'Your polls said remembering OOP is the hard part. Pick one way the game brings ideas back, then add your own spin.',
      impact: 'What players carry out of each chamber, and what the Final Door asks.',
      coach: 'Remind them this came from their own poll (Leslie ranked it #1). Keep it to one mechanic for the first version.',
      options: [
        ['cards', 'Keys are flashcards', 'Every key you win shows the idea you just used, and you keep them.', 'gawain'],
        ['quiz', 'The warlock quizzes back', 'At the Final Door he re-asks one question from each chamber.', 'odyssey'],
        ['book', 'A growing spell book', 'Each cracked puzzle adds its code to your spell book to review.', 'beowulf'] ] },
    { id: 'personal', label: 'Your own path', category: 'You voted: personalized help', seconds: 60,
      question: 'How does the game adapt to each player?',
      prompt: '"Want personalized help" was the #1 problem for three of you. What is the smallest version we can build by Nov 12?',
      impact: 'What "choose your difficulty" on the knight-select screen actually changes.',
      coach: 'Steer toward the smallest version: one setting or one rule. No accounts, no AI calls, no saved progress.',
      options: [
        ['levels', 'Pick your rank', 'Squire, Knight or Champion changes how many hints you get.', 'gawain'],
        ['adaptive', 'Hints that adapt', 'Wrong twice? The next hint gets more specific.', 'odyssey'],
        ['report', 'A weak-spot scroll', 'At the end, see which chamber tripped you up and what to review.', 'beowulf'] ] },
    { id: 'hint', label: 'Our helping hand', category: 'Design for getting stuck', seconds: 60,
      question: 'How does the castle help a stuck player?',
      prompt: 'A hint should teach a step, not hand over the answer. What would help a college student new to OOP?',
      impact: 'The wording of the hint and wrong-answer feedback.',
      coach: 'Keep hints as text in the first version. Talking characters, audio and animation can wait.',
      options: [
        ['guide', 'A friendly guide', 'A character asks a useful question: "Which part is the blueprint?"', 'gawain'],
        ['clue', 'A clue in the room', 'A short inscription gives an example using a different object.', 'odyssey'],
        ['explain', 'Explain the misstep', 'A wrong answer explains the confusion and invites another try.', 'beowulf'] ] },
    { id: 'maze', label: 'The Maze', category: 'Make chamber 1 playable', seconds: 90,
      question: 'What are the 5 turns in the Maze about?',
      prompt: 'The design deck says: pick the right direction, multiple choice, 5 turns. What does each turn test?',
      impact: 'The first five questions in rooms.js.',
      coach: 'Ask: "What does a right answer prove the player understands?" Keep multiple-choice buttons; skip a live code editor.',
      options: [
        ['blueprint', 'Blueprint or object?', 'Each turn shows code; pick the path that names the class vs. the object.', 'gawain'],
        ['trace', 'Follow the code', 'Trace a tiny Java snippet; each answer is a direction.', 'odyssey'],
        ['repair', 'Spot the broken line', 'One direction has a bug in creating the Knight. Avoid it.', 'beowulf'] ] },
    { id: 'warlock', label: 'Our warlock', category: 'Give the villain a voice', seconds: 60,
      question: 'Who is the warlock, and why did he trap you?',
      prompt: 'The story is yours already. Decide his personality, then write one line he says.',
      impact: 'His opening speech and how he taunts you in each chamber.',
      coach: 'Read every line out loud. Keep the funniest; it becomes the opening of the game.',
      options: [
        ['riddler', 'A bored riddle-lover', 'He traps knights because nobody plays his puzzles anymore.', 'gawain'],
        ['failed', 'A knight who failed', 'He never escaped his own test and wants company.', 'odyssey'],
        ['trickster', 'A sly trickster', 'He lies on purpose in the Hall of Illusions.', 'beowulf'] ] },
    { id: 'twist', label: 'Our creative twist', category: 'Your signature move', seconds: 120,
      question: 'What tiny detail could only come from us?',
      prompt: 'Invent a funny character, room name, clue, line of dialogue or ending. Keep it small enough to draw or write today.',
      impact: 'Student-authored story and visual details, not more required features.',
      coach: 'Give quiet thinking time before anyone speaks. Read every idea. Combine ideas only with the authors\u2019 agreement.',
      free: true },
    { id: 'proof', label: 'Proof it teaches', category: 'Bonus \u00b7 test the learning', seconds: 60, optional: true,
      question: 'How will we know a player learned something?',
      prompt: 'Your polls asked for "applying concepts to new problems." Choose one simple thing to watch during a playtest.',
      impact: 'One check for an outside playtester, without building analytics.',
      coach: 'Enjoyment surveys alone do not show learning. Ask for a small demonstration of understanding.',
      options: [
        ['explain', 'Explain it back', 'Ask the player to explain class versus object in their own words.', 'gawain'],
        ['transfer', 'Try a fresh example', 'After the chamber, ask a similar question with different names.', 'odyssey'],
        ['observe', 'Watch and ask why', 'Watch where they hesitate, then ask how they chose an answer.', 'beowulf'] ] },
    { id: 'commitment', label: 'My next small win', category: 'Bonus \u00b7 turn ideas into action', seconds: 90, optional: true,
      question: 'What can you show us next time?',
      prompt: 'Name one small result you can own, when you can show it, and any help you need. It is okay to ask for a partner or a smaller task.',
      impact: 'A proposed commitment to discuss and add to Tasks together.',
      coach: 'Ask what fits their actual week. A proposed commitment is not an assigned task until the student and team agree.',
      free: true, due: true }
  ];
  // Shared with the party screen (party.js), which runs the same rounds on a big screen + phones.
  window.P9_ROUNDS = ROUNDS; window.P9_ART = ART;

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
    $('council-number').textContent = r.optional ? 'Optional round · protect the build time' : `Round ${state.round + 1} of 6`;
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
    $('council-next').textContent = state.round === 5 ? 'Finish core rounds ↓' : state.round === ROUNDS.length - 1 ? 'View our brief ↓' : 'Next round →';
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
    if (state.round === 5 || state.round === ROUNDS.length - 1) $('council-brief-title').scrollIntoView({ behavior: 'instant', block: 'center' });
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
    const lines = ["Knight's Escape — Meeting 1", rehearsal ? 'LOCAL REHEARSAL — not shared team decisions' : 'Working brief — confirm with missing teammates', ''];
    ROUNDS.forEach((r) => {
      const entry = briefEntry(r); lines.push(entry.heading, entry.body, entry.detail);
      if (revealed(r.id)) roundAnswers(r).forEach((a) => lines.push(`- ${a.name}: ${answerLabel(r, a)}${a.idea && !r.free && a.pick !== 'own' ? ' — ' + a.idea : ''}${a.due ? ' · Can show: ' + a.due : ''}`));
      lines.push('');
    });
    lines.push('Next: 18-minute build sprint, then agree on one small task per student with a date. No tasks were created automatically.');
    window.p9SaveText(rehearsal ? 'meeting-1-rehearsal.txt' : 'meeting-1-working-brief.txt', lines.join('\n'));
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
