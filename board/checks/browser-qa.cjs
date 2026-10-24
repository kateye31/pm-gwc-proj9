// Uses installed Chrome and Node only. Test records stay in the browser mock.
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');

async function main() {
  const artifact = fs.readFileSync(path.resolve(__dirname, '../quest-board.html'), 'utf8');
  assert.equal(/@ART:|\/\*@FONTS@\*\//.test(artifact), false, 'Unresolved assets');
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'quest-board-qa-'));
  const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
    '--headless=new', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'
  ], { windowsHide: true });
  let socket;
  try {
    const endpoint = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(Error('Chrome did not start')), 20000);
      chrome.on('error', reject);
      chrome.stderr.on('data', (chunk) => {
        const match = chunk.toString().match(/DevTools listening on (ws:\/\/\S+)/);
        if (match) { clearTimeout(timeout); resolve(match[1]); }
      });
    });
    socket = new WebSocket(endpoint);
    await new Promise((resolve) => socket.addEventListener('open', resolve, { once: true }));
    let serial = 0;
    const pending = new Map();
    const errors = [];
    socket.addEventListener('message', ({ data }) => {
      const msg = JSON.parse(data);
      if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.text);
      if (pending.has(msg.id)) {
        const { resolve, reject, timeout } = pending.get(msg.id); pending.delete(msg.id); clearTimeout(timeout);
        msg.error ? reject(Error(msg.error.message)) : resolve(msg.result);
      }
    });
    function send(method, params = {}, sessionId) {
      return new Promise((resolve, reject) => {
        const id = ++serial;
        const timeout = setTimeout(() => { pending.delete(id); reject(Error('Browser command timed out: ' + method)); }, 15000);
        pending.set(id, { resolve, reject, timeout });
        socket.send(JSON.stringify({ id, method, params, sessionId }));
      });
    }
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    const page = (method, params) => send(method, params, sessionId);
    const evaluate = async (expression) => {
      const result = await page('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
      return result.result.value;
    };
    await page('Runtime.enable'); await page('Page.enable');
    await page('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    const url = pathToFileURL(path.resolve(__dirname, '../quest-board.html')).href;
    await page('Page.navigate', { url });
    for (let i = 0; i < 50; i++) {
      if (await evaluate("document.getElementById('council-connection')?.textContent.length > 0")) break;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    assert.equal(await evaluate("document.querySelector('.screen:not([hidden])').id"), 's-today');
    for (const screen of ['council', 'tasks', 'plan', 'today']) {
      await evaluate(`document.querySelector('.nav [data-go="${screen}"]').click()`);
      assert.equal(await evaluate("document.querySelector('.screen:not([hidden])').id"), `s-${screen}`);
    }
    await evaluate("document.fonts.ready");
    await evaluate('Promise.all(document.getAnimations().map(animation => animation.finished))');
    await evaluate('window.scrollTo(0, 0)');
    const shot = await page('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'desktop.png'), Buffer.from(shot.data, 'base64'));
    await page('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false });
    assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true, 'Mobile overflow');
    await evaluate('window.scrollTo(0, 0)');
    const mobile = await page('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'mobile.png'), Buffer.from(mobile.data, 'base64'));
    await evaluate("document.querySelector('.nav [data-go=council]').click(); document.getElementById('council-rehearse').click(); document.getElementById('council-start').click(); document.querySelector('[data-person=Leslie]').click(); document.querySelector('input[value=quiz]').click(); document.getElementById('council-submit').click()");
    assert.equal(await evaluate("document.getElementById('council-arrivals').textContent.includes('Leslie · sent')"), true);
    await evaluate("document.querySelector('[data-person=Katrina]').click(); document.getElementById('council-reveal').click()");
    assert.equal(await evaluate("document.getElementById('council-result-count').textContent"), '1/4 voices');
    assert.equal(await evaluate("document.getElementById('council-connection').textContent.startsWith('LOCAL REHEARSAL')"), true);
    const mock = fs.readFileSync(path.join(__dirname, 'council-mock.js'), 'utf8');
    await page('Page.addScriptToEvaluateOnNewDocument', { source: mock });
    await page('Page.reload');
    for (let i = 0; i < 50; i++) {
      if (await evaluate("document.querySelectorAll('#people .person').length === 5")) break;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    assert.equal(await evaluate("document.querySelectorAll('#people .person').length"), 5);
    assert.equal(await evaluate("document.getElementById('council-arrivals').textContent.includes('Leslie · sent')"), false, 'Rehearsal must not persist or leak into shared answers');
    await require('./council-tests.cjs')({ page, evaluate, send, url, mock });
    assert.deepEqual(errors, [], 'Browser runtime exceptions');
    console.log('PASS: four screens, mobile width, council rehearsal isolation, shared council flow; screenshots captured.');
    await send('Browser.close');
  } finally {
    socket?.close(); chrome.kill();
    // Leave the unique temporary Chrome profile for OS cleanup.
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
