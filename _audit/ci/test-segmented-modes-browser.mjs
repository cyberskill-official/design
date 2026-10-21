import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const browserName = process.env.CS_TEST_BROWSER || 'chromium',
  source = 'components/forms/SegmentedControl.jsx',
  require = createRequire(import.meta.url);
async function compile(mutation) {
  let applied = false;
  const result = await build({
    stdin: {
      contents: `import {SegmentedControl} from './${source}';window.SegmentModeFixture=SegmentedControl;`,
      resolveDir: resolve('.')
    },
    bundle: true,
    write: false,
    format: 'iife',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    plugins: [{
      name: 'mode-source',
      setup(builder) {
        builder.onResolve({
          filter: /^react$/
        }, () => ({
          path: 'react',
          namespace: 'peer'
        }));
        builder.onLoad({
          filter: /.*/,
          namespace: 'peer'
        }, () => ({
          contents: 'module.exports=window.React;',
          loader: 'js'
        }));
        if (mutation) builder.onLoad({
          filter: /components\/forms\/SegmentedControl\.jsx$/
        }, args => {
          const text = readFileSync(args.path, 'utf8');
          assert(text.includes(mutation.before));
          applied = true;
          return {
            contents: text.replace(mutation.before, mutation.after),
            loader: 'jsx'
          };
        });
      }
    }]
  });
  if (mutation) assert(applied);
  return result.outputFiles[0].text;
}
const positive = await compile(),
  negative = await compile({
    before: 'role === "tablist" ? "tabs" : "radio"',
    after: 'role === "tablist" ? "tabs" : "tabs"'
  });
const ignoredAlias = await compile({
  before: 'mode === undefined ? (role === "tablist" ? "tabs" : "radio") : mode',
  after: 'mode === undefined ? "radio" : mode'
});
const aliasOverridesMode = await compile({
  before: 'mode === undefined ? (role === "tablist" ? "tabs" : "radio") : mode',
  after: 'role !== undefined ? (role === "tablist" ? "tabs" : "radio") : (mode === undefined ? "radio" : mode)'
});
async function mount(page, {
  mode,
  orientation = 'horizontal',
  theme = 'light',
  role
} = {}) {
  await page.evaluate(({
    mode,
    orientation,
    theme,
    role
  }) => {
    const h = React.createElement;
    window.segmentChanges = [];
    window.segmentCancel = false;
    function App() {
      const [value, setValue] = React.useState('a'),
        ref = React.useRef(null);
      window.segmentRootRef = ref;
      const tabs = mode === 'tabs' || (mode === undefined && role === 'tablist'),
        items = ['a', 'b', 'c'].map((value, i) => ({
          value,
          label: ['Alpha', 'Beta', 'Gamma'][i],
          id: 'segment-' + value,
          ...(tabs ? {
            'aria-controls': 'segment-' + value + '-panel'
          } : {})
        }));
      return h('form', {
        'data-theme': theme,
        id: 'segment-form'
      }, h(SegmentModeFixture, {
        ...(mode === undefined ? {} : {
          mode
        }),
        ref,
        options: items,
        value,
        onChange: next => {
          segmentChanges.push(next);
          setValue(next);
        },
        'aria-label': 'Choice',
        'aria-orientation': orientation,
        ...(role ? {
          role
        } : {}),
        onKeyDownCapture: event => {
          if (segmentCancel) event.preventDefault();
        },
        style: {
          flexDirection: orientation === 'vertical' ? 'column' : 'row'
        }
      }), ...(tabs ? items.map(item => h('section', {
        key: item.value,
        id: item['aria-controls'],
        role: 'tabpanel',
        'aria-labelledby': item.id,
        hidden: value !== item.value,
        tabIndex: 0
      }, item.label + ' content')) : []), h('input', {
        'aria-label': 'After group'
      }));
    }
    renderFixture(h(App));
  }, {
    mode,
    orientation,
    theme,
    role
  });
}
async function verify(page, mode, index) {
  const role = mode === 'tabs' ? 'tab' : 'radio',
    selection = mode === 'tabs' ? 'aria-selected' : 'aria-checked',
    other = mode === 'tabs' ? 'aria-checked' : 'aria-selected';
  assert.equal(await page.getByRole(mode === 'tabs' ? 'tablist' : 'radiogroup', {
    name: 'Choice'
  }).count(), 1);
  const values = await page.getByRole(role).evaluateAll((elements, {
    selection,
    other
  }) => elements.map(el => ({
    selected: el.getAttribute(selection),
    other: el.getAttribute(other),
    tabIndex: el.tabIndex
  })), {
    selection,
    other
  });
  assert.deepEqual(values, [0, 1, 2].map(i => ({
    selected: String(i === index),
    other: null,
    tabIndex: i === index ? 0 : -1
  })));
  assert.equal(await page.evaluate(() => segmentRootRef.current === document.querySelector('.cs-segmented')), true);
  assert.equal(await page.locator('input[type=radio]').count(), 0, 'No native serialization controls are invented');
  assert.deepEqual(await page.evaluate(() => [...new FormData(document.getElementById('segment-form')).entries()]), []);
}
async function paint(page, mode, theme) {
  await mount(page, {
    mode,
    theme
  });
  await page.getByRole(mode === 'tabs' ? 'tab' : 'radio', {
    name: 'Alpha'
  }).focus();
  // A forced-colors media flip plus React remount can leave an immediate native
  // outline snapshot ahead of the authored focus-visible paint under load.
  // Require the real active focus state and existing reset.css 2px contour; a
  // persistent role-specific gap still times out rather than being normalized.
  await page.waitForFunction(() => {
    const node=document.activeElement;
    if(!node?.matches('.cs-segmented button:focus-visible'))return false;
    const style=getComputedStyle(node);
    return style.outlineStyle==='solid'&&style.outlineWidth==='2px';
  });
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  return page.locator('.cs-segmented button').evaluateAll(elements => elements.map(el => {
    const s = getComputedStyle(el);
    return {
      background: s.backgroundColor,
      color: s.color,
      border: s.border,
      boxShadow: s.boxShadow,
      outline: s.outline,
      borderRadius: s.borderRadius,
      height: el.getBoundingClientRect().height
    };
  }));
}
const rows = [],
  paints = [];
await withBrowserFixture(async page => {
  await page.addScriptTag({
    content: positive
  });
  await page.addScriptTag({
    path: require.resolve('axe-core/axe.min.js')
  });
  const configurations = [
    {name:'default', expected:'radio'},
    {name:'explicit-radio', mode:'radio', expected:'radio'},
    {name:'explicit-tabs', mode:'tabs', expected:'tabs'},
    {name:'role-radio', role:'radiogroup', expected:'radio'},
    {name:'role-tabs', role:'tablist', expected:'tabs'},
    {name:'mode-radio-wins', mode:'radio', role:'tablist', expected:'radio'},
    {name:'mode-tabs-wins', mode:'tabs', role:'radiogroup', expected:'tabs'},
  ];
  for (const configuration of configurations) for (const orientation of ['horizontal', 'vertical']) {
    const mode=configuration.expected;
    await mount(page, {...configuration, orientation});
    await verify(page, mode, 0);
    const role = mode === 'tabs' ? 'tab' : 'radio',
      forward = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight',
      back = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft',
      other = orientation === 'vertical' ? 'ArrowRight' : 'ArrowDown';
    await page.getByRole(role, {
      name: 'Alpha'
    }).focus();
    const native = await page.getByRole(role, {
      name: 'Alpha'
    }).evaluate((el, key) => !el.dispatchEvent(new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true
    })), other);
    assert.equal(native, false);
    assert.deepEqual(await page.evaluate(() => segmentChanges), []);
    for (const event of [{
      isComposing: true
    }, {
      keyCode: 229
    }]) await page.getByRole(role, {
      name: 'Alpha'
    }).evaluate((el, {
      key,
      event
    }) => el.dispatchEvent(new KeyboardEvent('keydown', {
      key,
      ...event,
      bubbles: true,
      cancelable: true
    })), {
      key: forward,
      event
    });
    assert.deepEqual(await page.evaluate(() => segmentChanges), [], 'IME keys do not select');
    await page.evaluate(() => segmentCancel = true);
    await page.keyboard.press('End');
    await verify(page, mode, 0);
    assert.deepEqual(await page.evaluate(() => segmentChanges), [], 'Caller cancellation is retained');
    await page.evaluate(() => segmentCancel = false);
    for (const [key, index] of [[forward, 1], [forward, 2], [forward, 0], [back, 2], ['Home', 0], ['End', 2]]) {
      await page.keyboard.press(key);
      await verify(page, mode, index);
      assert.equal(await page.getByRole(role).nth(index).evaluate(el => el === document.activeElement), true);
    }
    assert.deepEqual(await page.evaluate(() => segmentChanges), ['b', 'c', 'a', 'c', 'a', 'c']);
    await page.getByRole(role, {
      name: 'Beta'
    }).focus();
    await page.keyboard.press('Space');
    await verify(page, mode, 1);
    await page.getByRole(role, {
      name: 'Gamma'
    }).focus();
    await page.keyboard.press('Enter');
    await verify(page, mode, 2);
    if (mode === 'tabs') {
      const tab = page.getByRole('tab', {
        name: 'Gamma'
      });
      assert.equal(await tab.evaluate(el => document.getElementById(el.getAttribute('aria-controls'))?.getAttribute('aria-labelledby')), await tab.getAttribute('id'));
      assert.equal(await page.getByRole('tabpanel', {
        name: 'Gamma'
      }).textContent(), 'Gamma content');
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'segment-c-panel');
    } else {
      assert.equal(await page.getByRole('tabpanel').count(), 0);
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-label')), 'After group', 'Radio group has one sequential Tab stop');
    }
    const axe = await page.evaluate(() => axe.run(document.getElementById('fixture'), {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']
      }
    }));
    assert.deepEqual(axe.violations.map(v => ({
      id: v.id,
      nodes: v.nodes.map(n => n.target)
    })), []);
    rows.push({
      configuration: configuration.name,
      mode: configuration.mode ?? 'omitted',
      alias: configuration.role ?? 'omitted',
      expected: mode,
      orientation,
      status: 'PASS'
    });
  }
  for (const theme of ['light', 'dark']) for (const forcedColors of ['none', 'active']) {
    await page.emulateMedia({
      forcedColors
    });
    const radio = await paint(page, 'radio', theme),
      tabs = await paint(page, 'tabs', theme);
    assert.deepEqual(radio, tabs, 'Radio and explicit-tabs selected/unselected/focus paint remain identical');
    if (forcedColors === 'none') assert.notEqual(radio[0].background, radio[1].background);
    paints.push({
      theme,
      forcedColors,
      radio,
      status: 'PASS'
    });
  }
  await page.emulateMedia({
    forcedColors: 'none'
  });
  await mount(page, {role:'tablist'});
  await verify(page, 'tabs', 0);
  for (const invalid of [{role:'button'},{role:'presentation'},{role:''},{role:null},{role:'button',mode:'tabs'},{mode:'invalid'}]) {
    const message=await page.evaluate(invalid=>{
      class Boundary extends React.Component {
        constructor(props){super(props);this.state={error:null};}
        static getDerivedStateFromError(error){return {error:String(error)}}
        render(){return this.state.error?React.createElement('output',{id:'segment-error'},this.state.error):this.props.children;}
      }
      renderFixture(React.createElement(Boundary,null,React.createElement(SegmentModeFixture,{options:[],...invalid})));
      return document.getElementById('segment-error')?.textContent;
    },invalid);
    assert.match(message,/Unsupported SegmentedControl (role|mode):/,'Invalid semantic inputs reject rather than leaking mismatched roles');
  }
  await page.addScriptTag({content:ignoredAlias});
  await mount(page,{role:'tablist'});
  await assert.rejects(()=>verify(page,'tabs',0),undefined,'Ignoring the retained alias must fail child and parent semantic assertions');
  await page.addScriptTag({content:aliasOverridesMode});
  await mount(page,{mode:'radio',role:'tablist'});
  await assert.rejects(()=>verify(page,'radio',0),undefined,'Letting a deprecated alias override explicit mode must fail semantics');
  await page.addScriptTag({
    content: negative
  });
  await mount(page);
  await assert.rejects(() => verify(page, undefined, 0), undefined, 'Old tablist default must fail radio semantics');
  await page.addScriptTag({
    content: positive
  });
  await page.emulateMedia({
    forcedColors: 'active'
  });
  const style = await page.addStyleTag({
    content: '.cs-segmented button[role="radio"][aria-checked="true"] { border-width: 0 !important; }'
  });
  await assert.rejects(async () => assert.deepEqual(await paint(page, 'radio', 'light'), await paint(page, 'tabs', 'light')), undefined, 'Missing checked forced-color geometry must fail paint comparison');
  await style.evaluate(el => el.remove());
  await page.emulateMedia({
    forcedColors: 'none'
  });
  await page.evaluate(() => renderFixture(null));
}, {
  browserName,
  development: true,
  contextOptions: {
    reducedMotion: 'reduce'
  }
});
await withBrowserFixture(async page => {
  await page.addScriptTag({
    content: positive
  });
  for (const mode of ['radio', 'tabs']) {
    await mount(page, {
      mode
    });
    const sizes = await page.locator('.cs-segmented button').evaluateAll(elements => elements.map(el => ({
      width: el.getBoundingClientRect().width,
      height: el.getBoundingClientRect().height
    })));
    assert(sizes.every(s => s.width >= 44 && s.height >= 44));
  }
}, {
  browserName,
  development: true,
  contextOptions: {
    hasTouch: true,
    reducedMotion: 'reduce'
  }
});
mkdirSync('test-results/segmented-modes', {
  recursive: true
});
writeFileSync(`test-results/segmented-modes/${browserName}.json`, JSON.stringify({
  status: 'PASS',
  browserName,
  sourceSha256: createHash('sha256').update(readFileSync(source)).digest('hex'),
  rows,
  paints,
  mutationsRejected: ['old-tabs-default', 'ignored-role-alias', 'alias-overrides-explicit-mode', 'missing-radio-forced-color-geometry'],
  coarseTargets44: true,
  scope: 'User-approved radio default, deprecated semantic role aliases and explicit mode precedence; actual keyboard/controlled/ref/panel/form boundary, theme/forced-color paint equivalence, boundedaxe and coarse44px. No publish/deprecation-clock/manualAT acceptance.'
}, null, 2) + '\n');
console.log('PASS ' + browserName + ': default/explicit/alias radio/tabs and precedence, two orientations, native activation/cancellation/IME, panel/ref/form boundaries, unchanged paint and44px targets');
