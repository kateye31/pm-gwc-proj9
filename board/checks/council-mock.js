// Injected only by browser QA. Never embedded in the production artifact.
(() => {
  const KEY = 'quest-board-qa-db';
  if (!localStorage.getItem(KEY)) localStorage.setItem(KEY, JSON.stringify({
    'tasks/a': { title: 'QA overdue', owner: 'Leslie', status: 'doing', due: '2020-01-01' },
    'tasks/b': { title: 'QA second', owner: 'Leslie', status: 'doing', due: '2099-01-01' },
    'tasks/c': { title: 'QA done', owner: 'Shirley', status: 'done', due: '2020-01-01' }
  }));
  const subscriptions = [];
  function read() { return JSON.parse(localStorage.getItem(KEY)); }
  function notify() { subscriptions.forEach((callback) => callback()); }
  addEventListener('storage', (event) => { if (event.key === KEY) notify(); });
  function documentRef(path) {
    return {
      onSnapshot(callback) {
        const emit = () => { const value = read()[path]; callback({ exists: !!value, data: () => value }); };
        subscriptions.push(emit); emit();
      },
      async set(value) {
        if (window.qaFailWrites) throw Error('QA permission failure');
        const records = read(); records[path] = value;
        localStorage.setItem(KEY, JSON.stringify(records)); notify();
      },
      async update(value) { return this.set({ ...read()[path], ...value }); },
      async delete() { const records = read(); delete records[path]; localStorage.setItem(KEY, JSON.stringify(records)); notify(); }
    };
  }
  const db = {
    doc: documentRef,
    collection(name) {
      return {
        doc(id) { return documentRef(name + '/' + id); },
        async add(value) { return documentRef(name + '/' + Date.now()).set(value); },
        onSnapshot(callback) {
          const emit = () => callback({ docs: Object.entries(read()).filter(([key]) => key.startsWith(name + '/')).map(([key, value]) => ({ id: key.split('/')[1], data: () => value })) });
          subscriptions.push(emit); emit();
        }
      };
    }
  };
  window.qaDB = db;
  window.claude = { use: async () => db };
})();
