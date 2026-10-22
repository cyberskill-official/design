/** Inject at navigation start in the isolated consumer benchmark only. */
export function observeConsumerPerformance() {
  const supported = globalThis.PerformanceObserver?.supportedEntryTypes || [];
  const sample = {
    readinessMs: null,
    firstContentfulPaintMs: null,
    largestContentfulPaintMs: null,
    longTaskCount: supported.includes('longtask') ? 0 : null,
    longTaskTotalMs: supported.includes('longtask') ? 0 : null,
    interactionToRenderOpportunityMs: null,
    supportedEntryTypes: [...supported]
  };
  window.__csConsumerPerformance = sample;
  const observers = [];
  for (const type of ['paint', 'largest-contentful-paint', 'longtask']) {
    if (!supported.includes(type)) continue;
    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') sample.firstContentfulPaintMs = entry.startTime;
        if (entry.entryType === 'largest-contentful-paint') sample.largestContentfulPaintMs = entry.startTime;
        if (entry.entryType === 'longtask') {
          sample.longTaskCount++;
          sample.longTaskTotalMs += entry.duration;
        }
      }
    });
    observer.observe({
      type,
      buffered: true
    });
    observers.push(observer);
  }
  let started = false;
  const ready = () => {
    if (started || !document.querySelector('main h1') || !document.querySelector('input') || !document.querySelector('button')) return;
    started = true;
    changes.disconnect();
    document.body.getBoundingClientRect();
    Promise.resolve(document.fonts?.ready).then(() => {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        sample.readinessMs = performance.now();
      }));
    });
  };
  const changes = new MutationObserver(ready);
  changes.observe(document, {
    childList: true,
    subtree: true
  });
  document.addEventListener('DOMContentLoaded', ready, {
    once: true
  });
  addEventListener('pagehide', () => {
    changes.disconnect();
    for (const observer of observers) observer.disconnect();
  }, {
    once: true
  });
}

/** Measures a real native click through the next frame after the fixture commit. */
export function armConsumerInteraction() {
  const button = document.querySelector('button');
  if (!button || !window.__csConsumerPerformance) throw Error('Missing consumer interaction target or instrumentation');
  button.addEventListener('click', () => {
    const start = performance.now();
    const check = () => {
      if (document.querySelector('output')?.textContent === 'An') {
        requestAnimationFrame(() => {
          window.__csConsumerPerformance.interactionToRenderOpportunityMs = performance.now() - start;
        });
      } else if (performance.now() - start < 10000) requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  }, {
    capture: true,
    once: true
  });
}

/** Browser-side snapshot: unavailable observer metrics remain null. */
export function consumerPerformanceSnapshot() {
  const sample = window.__csConsumerPerformance;
  const navigation = performance.getEntriesByType('navigation')[0];
  if (!sample || !Number.isFinite(sample.readinessMs) || !navigation) throw Error('Consumer performance readiness/navigation evidence is missing');
  const fields = ['responseEnd', 'domContentLoadedEventEnd', 'loadEventEnd'];
  const timings = Object.fromEntries(fields.map(name => {
    const value = navigation[name];
    if (!Number.isFinite(value) || value < 0) throw Error('Invalid navigation timing: ' + name);
    return [name + 'Ms', value];
  }));
  return {
    ...sample,
    navigation: timings,
    scope: 'One cold loopback sample. Readiness is observed fixture DOM plus fonts and two frame opportunities; interaction ends at the next frame after the expected DOM commit. Not hardware presentation, INP, device certification or a latency budget.'
  };
}
