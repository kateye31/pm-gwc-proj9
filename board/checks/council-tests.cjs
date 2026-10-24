const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

module.exports = async function councilTests({ page, evaluate, send, url, mock }) {
  const waitFor = async (ev, expression) => {
    for (let i = 0; i < 60; i++) {
      if (await ev(expression)) return;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw Error('Timed out: ' + expression);
  };
  const click = (selector) => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  await click('.nav [data-go="council"]');
  await click('[data-person="Katrina"]');
  assert.equal(await evaluate("document.getElementById('council-host').hidden"), false);
  assert.equal(await evaluate("document.querySelectorAll('#council-rounds li').length"), 6);
  assert.equal(await evaluate("document.querySelectorAll('#council-bonus li').length"), 2);
  // A second page simulates a student device. The mock shares data via storage events.
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const studentPage = (method, params) => send(method, params, sessionId);
  await studentPage('Runtime.enable'); await studentPage('Page.enable');
  await studentPage('Page.addScriptToEvaluateOnNewDocument', { source: mock });
  const student = async (expression) => {
    const result = await studentPage('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  await studentPage('Page.navigate', { url: url + '#council' });
  await waitFor(student, "document.getElementById('council-connection')?.textContent.includes('SHARED COUNCIL')");
  await student("document.querySelector('[data-person=Leslie]').click()");
  assert.equal(await student("document.getElementById('council-host').hidden"), true);
  await click('#council-start');
  await waitFor(student, "!document.getElementById('council-submit').disabled");
  await student("document.querySelector('input[value=quiz]').click(); document.getElementById('council-idea').value='Explain with a tiny Knight example'; document.getElementById('council-submit').click()");
  await waitFor(evaluate, "document.getElementById('council-arrivals').textContent.includes('Leslie · sent')");
  assert.equal(await evaluate("document.getElementById('council-results').hidden"), true);
  assert.equal(await evaluate("document.getElementById('council-brief').textContent.includes('Knight example')"), false);
  // Update the same answer: one record, not a second vote.
  await student("document.querySelector('input[value=cards]').click(); document.getElementById('council-submit').click()");
  await waitFor(evaluate, "JSON.parse(localStorage.getItem('quest-board-qa-db'))['workshop_answers/meeting-1_recall_Leslie']?.pick === 'cards'");
  await click('#council-pause');
  await waitFor(student, "document.getElementById('council-phase').textContent.startsWith('Paused')");
  assert.equal(await student("document.getElementById('council-submit').disabled"), true);
  await page('Page.reload');
  await waitFor(evaluate, "document.getElementById('council-phase')?.textContent.startsWith('Paused')");
  // Seat choice is local storage on the same QA computer; explicitly restore the host.
  await click('[data-person="Katrina"]');
  await click('#council-start');
  await evaluate("qaDB.doc('workshop_sessions/meeting-1').update({ deadline: Date.now() - 1000 })");
  await waitFor(student, "document.getElementById('council-phase').textContent.startsWith('Time is up')");
  assert.equal(await student("document.getElementById('council-submit').disabled"), true);
  await click('#council-extend');
  await waitFor(student, "!document.getElementById('council-submit').disabled");
  await click('#council-reveal');
  await waitFor(student, "!document.getElementById('council-results').hidden");
  assert.equal(await evaluate("document.getElementById('council-result-count').textContent"), '1/4 voices');
  assert.match(await evaluate("document.getElementById('council-result-note').textContent"), /Missing: Sanjana, Shirley, Tvishaa/);
  await evaluate("document.getElementById('council-agreement').value='Start with a worked example'; document.querySelector('#council-decision button').click()");
  await waitFor(student, "document.getElementById('council-brief').textContent.includes('Start with a worked example')");
  await click('#council-catchup');
  await waitFor(student, "document.getElementById('council-clock').textContent === 'OPEN'");
  // Write failures must keep the draft and never claim success.
  await student("window.qaFailWrites=true; document.getElementById('council-idea').value='KEEP THIS DRAFT'; document.getElementById('council-submit').click()");
  await waitFor(student, "document.getElementById('council-answer-status').textContent.includes('did not save')");
  assert.equal(await student("document.getElementById('council-idea').value"), 'KEEP THIS DRAFT');
  await student('window.qaFailWrites=false');
  await click('#council-next');
  await waitFor(student, "document.getElementById('council-question').textContent.includes('adapt to each player')");
  await click('#council-start');
  await waitFor(student, "!document.getElementById('council-submit').disabled");
  await student("document.querySelector('input[value=own]').click(); document.getElementById('council-idea').value='A dragon lost its library card'; document.getElementById('council-submit').click()");
  await waitFor(evaluate, "document.getElementById('council-arrivals').textContent.includes('Leslie · sent')");
  await click('#council-reveal');
  await waitFor(evaluate, "document.getElementById('council-result-rows').textContent.includes('lost its library card')");
  // Free-text ideas and proposed commitments are retained without creating tasks.
  await click('[data-round="5"]'); await click('#council-start');
  await waitFor(student, "document.getElementById('council-question').textContent.includes('tiny detail')");
  await waitFor(student, "!document.getElementById('council-submit').disabled");
  await student("document.getElementById('council-idea').value='<img src=x onerror=alert(1)> A polite dragon'; document.getElementById('council-submit').click()");
  await waitFor(evaluate, "document.getElementById('council-arrivals').textContent.includes('Leslie · sent')");
  await click('#council-reveal');
  assert.equal(await evaluate("document.querySelectorAll('#council-result-rows img').length"), 0, 'User text must not become HTML');
  await click('[data-round="7"]'); await click('#council-start');
  await waitFor(student, "document.getElementById('council-question').textContent.includes('next time')");
  await waitFor(student, "!document.getElementById('council-submit').disabled");
  await student("document.getElementById('council-idea').value='Draft one useful hint'; document.getElementById('council-due').value='2026-10-30'; document.getElementById('council-submit').click()");
  await waitFor(evaluate, "document.getElementById('council-arrivals').textContent.includes('Leslie · sent')");
  await click('#council-reveal');
  assert.equal(await evaluate("Object.keys(JSON.parse(localStorage.getItem('quest-board-qa-db'))).filter(k=>k.startsWith('tasks/')).length"), 3);
  await evaluate("window.qaBrief=null; window.p9SaveText=async(name,text)=>{window.qaBrief=text;return true}; document.getElementById('council-export').click()");
  const brief = await evaluate('window.qaBrief');
  assert.match(brief, /Draft one useful hint.*2026-10-30/);
  assert.match(brief, /Start with a worked example/);
  assert.match(brief, /No tasks were created automatically/);
  // Mood is now five tap targets (radio group) instead of a range slider.
  await evaluate("document.querySelector('.nav [data-go=today]').click()");
  await evaluate("document.querySelectorAll('#mood button')[0].click()");
  assert.equal(await evaluate("document.querySelectorAll('#mood button')[0].getAttribute('aria-checked')"), 'true');
  assert.equal(await evaluate("document.querySelectorAll('#mood button')[0].getAttribute('aria-label')"), 'Wiped out');
  await evaluate("document.querySelectorAll('#mood button')[1].click()");
  assert.equal(await evaluate("document.querySelectorAll('#mood [aria-checked=true]').length"), 1);
  await evaluate("document.querySelector('.nav [data-go=council]').click()");
  await click('[data-round="0"]');
  console.log('Council interaction checks complete; checking artwork and screenshots.');
  await evaluate('document.activeElement.blur()');
  await page('Page.bringToFront');
  await evaluate("document.querySelector('.council-backdrop').decode()");
  assert.equal(await evaluate("document.querySelector('.council-backdrop').naturalWidth > 0"), true, 'Council artwork must load');
  for (const [width, height, file] of [[1440, 1100, 'meeting-desktop.png'], [390, 844, 'meeting-mobile.png']]) {
    await page('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
    await evaluate("document.getElementById('council').scrollIntoView({block:'start'}); window.scrollBy(0, -(document.querySelector('.topbar')?.getBoundingClientRect().height || 0) - 12)");
    assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true, 'Meeting mobile overflow');
    const image = await page('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, file), Buffer.from(image.data, 'base64'));
    await evaluate("document.getElementById('council-question').scrollIntoView({block:'start'}); window.scrollBy(0, -(document.querySelector('.topbar')?.getBoundingClientRect().height || 0) - 14)");
    const questionImage = await page('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'question-' + width + '.png'), Buffer.from(questionImage.data, 'base64'));
  }
  await evaluate("document.querySelector('.nav [data-go=today]').click(); document.getElementById('checkin').scrollIntoView({block:'start'}); window.scrollBy(0, -(document.querySelector('.topbar')?.getBoundingClientRect().height || 0) - 14)");
  const moodImage = await page('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'mood-mobile.png'), Buffer.from(moodImage.data, 'base64'));
  await send('Target.closeTarget', { targetId });
  console.log('PASS: two-device round sync, answer replacement, pause/reload, expiry/extend, reveal, catch-up, failed-write drafts, free text safety, commitments, brief export, tap-to-pick mood faces, and responsive meeting.');
};
