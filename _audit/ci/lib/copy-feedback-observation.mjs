/** Observe a new success transition on this button after its native click.
 * Keeping the observation in the page avoids losing a short-lived state while
 * a later automation round trip is delayed. This does not extend UI feedback.
 */
export async function observeFreshCopyFeedback(target) {
  const observation = await target.evaluateHandle(el => {
    let clicked = false, seen = false, disposed = false, clickedAt = null, observedAt = null;
    let resolve;
    const completion = new Promise(done => { resolve = done; });
    const hasOk = value => (value || '').split(/\s+/).includes('ok');
    const snapshot = () => ({ seen, clicked, clickedAt, observedAt });
    const observer = new MutationObserver(records => {
      for (let index = 0; index < records.length; index++) {
        // A mutation batch may contain both addition and expiry. The next
        // record's old value preserves the intermediate class state.
        const before = records[index].oldValue;
        const after = records[index + 1]?.oldValue ?? el.className;
        if (clicked && !seen && !hasOk(before) && hasOk(after)) {
          seen = true;
          observedAt = performance.now();
          resolve(snapshot());
        }
      }
    });
    const click = event => {
      if (!event.isTrusted || clicked) return;
      observer.takeRecords(); // Discard mutations queued before this action.
      clicked = true;
      clickedAt = performance.now();
    };
    observer.observe(el, { attributes: true, attributeFilter: ['class'], attributeOldValue: true });
    el.addEventListener('click', click, true);
    return {
      read: snapshot,
      async wait(timeout) {
        if (disposed) throw new Error('Copy feedback observer disposed');
        let timer;
        try {
          return await Promise.race([completion, new Promise(done => {
            timer = setTimeout(() => done(snapshot()), timeout);
          })]);
        } finally { clearTimeout(timer); }
      },
      dispose() {
        disposed = true;
        observer.disconnect();
        el.removeEventListener('click', click, true);
      },
    };
  });
  return {
    read: () => observation.evaluate(state => state.read()),
    async wait(timeout = 2500) {
      const result = await observation.evaluate((state, limit) => state.wait(limit), timeout);
      if (!result.seen) throw new Error('No fresh copy feedback after native click');
      return result;
    },
    async dispose() {
      try { await observation.evaluate(state => state.dispose()); }
      finally { await observation.dispose(); }
    },
  };
}
