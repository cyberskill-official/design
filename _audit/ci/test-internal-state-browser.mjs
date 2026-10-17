import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';

execFileSync(process.execPath, ['_audit/ci/check-bundle-freshness.mjs'], {stdio:'pipe'});
const names = ['AIDisclosureBadge','Accordion','Anchor','BackTop','Carousel','CodeBlock','ContextMenu','Dock','FloatingActionButton','HotKeys','HoverCard','Image','Menubar','NavigationMenu','Popconfirm','Splitter','Terminal','Toolbar','Tooltip','TreeTable'];
const actionNames = new Set(['ContextMenu','Dock','FloatingActionButton','HotKeys','Menubar','Popconfirm','Terminal','Toolbar']);
await withBrowserFixture(async page => {
  await page.setViewportSize({width:600,height:600});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.evaluate(()=>{
    window.clipboardWrites = [];
    Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>clipboardWrites.push(value)}});
  });
  for (const name of names) for (const observed of actionNames.has(name) ? [false,true] : [false]) {
    await page.mouse.move(590,590);
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.evaluate(({name,observed})=>{
      const e = React.createElement;
      window.internalActions = [];
      const action = observed ? ()=>internalActions.push('action') : undefined;
      const props = {lang:'en'};
      let children;
      switch(name) {
        case 'AIDisclosureBadge': props.label='Disclosure'; break;
        case 'Accordion': Object.assign(props,{defaultOpen:-1,items:[{title:'Alpha',content:'Body'}]}); break;
        case 'Anchor': props.items=[{id:'internal-a',label:'Alpha'},{id:'internal-b',label:'Beta'}]; break;
        case 'BackTop': props.threshold=100; break;
        case 'Carousel': children=[e('div',{key:'a'},'Alpha'),e('div',{key:'b'},'Beta')]; break;
        case 'CodeBlock': props.code='sample'; break;
        case 'ContextMenu': props.items=[{label:'Action',onSelect:action}]; children=e('button',null,'Context target'); break;
        case 'Dock': props.items=[{label:'Action',icon:'A',onSelect:action}]; break;
        case 'FloatingActionButton': Object.assign(props,{position:'static',label:'Actions',icon:'A',actions:[{label:'Action',icon:'B',onSelect:action}]}); break;
        case 'HotKeys': props.bindings=[{keys:'ctrl+k',description:'Action',onTrigger:action}]; break;
        case 'HoverCard': Object.assign(props,{trigger:e('button',null,'Hover target'),openDelay:0,closeDelay:0}); children='Preview'; break;
        case 'Image': Object.assign(props,{src:'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="red"/%3E%3C/svg%3E',alt:'Fixture',preview:true}); break;
        case 'Menubar': props.menus=[{label:'Actions',items:[{label:'Action',onSelect:action}]}]; break;
        case 'NavigationMenu': props.items=[{label:'Actions',panel:[{label:'Destination',href:'#fixture'}]}]; break;
        case 'Popconfirm': Object.assign(props,{trigger:e('button',null,'Confirm target'),title:'Confirmation',onConfirm:action}); break;
        case 'Splitter': Object.assign(props,{start:'Alpha',end:'Beta',initial:50}); break;
        case 'Terminal': Object.assign(props,{welcome:'Welcome',onCommand:observed ? command=>{internalActions.push(command);return 'Result'} : undefined}); break;
        case 'Toolbar': Object.assign(props,{overflowAfter:1,items:[{label:'Primary'},{label:'Action',onSelect:action}]}); break;
        case 'Tooltip': props.label='Description'; children=e('button',null,'Tooltip target'); break;
        case 'TreeTable': Object.assign(props,{columns:[{key:'name',header:'Name'}],nodes:[{key:'a',name:'Alpha',children:[{key:'b',name:'Beta'}]}]}); break;
      }
      window.drawInternal = (extra = {})=>{
        const component=e(CS[name],{key:name+observed,...props,...extra},children);
        renderFixture(name === 'Anchor' || name === 'BackTop'
          ? e('div',{style:{position:'relative',height:2000}},component,
            e('section',{id:'internal-a',style:{position:'absolute',top:100,height:200}},'Section A'),
            e('section',{id:'internal-b',style:{position:'absolute',top:150,height:200}},'Section B'))
          : component);
      };
      window.readInternalState = ()=>{
        const count=selector=>document.querySelectorAll(selector).length;
        switch(name) {
          case 'AIDisclosureBadge': return count('.cs-ai-disclosure__panel');
          case 'Accordion': return count('.cs-accordion__panel');
          case 'Anchor': return document.querySelector('.cs-anchor [aria-current]')?.textContent;
          case 'BackTop': return count('.cs-backtop');
          case 'Carousel': return document.querySelector('.cs-carousel__slide[aria-hidden="false"]')?.textContent;
          case 'CodeBlock': return document.querySelector('.cs-code__copy')?.textContent;
          case 'ContextMenu': return count('.cs-ctxmenu-zone [role="menu"]');
          case 'Dock': return document.querySelector('.cs-dock__item')?.style.transform.includes('1.35');
          case 'FloatingActionButton': return count('.cs-fab__dial');
          case 'HotKeys': return count('.cs-hotkeys__sheet');
          case 'HoverCard': return count('.cs-hovercard__panel');
          case 'Image': return count('.cs-image__zoom');
          case 'Menubar': return count('.cs-menubar [role="menu"]');
          case 'NavigationMenu': return count('.cs-navmenu__panel');
          case 'Popconfirm': return count('.cs-popconfirm__panel');
          case 'Splitter': return document.querySelector('[role="separator"]')?.getAttribute('aria-valuenow');
          case 'Terminal': return count('.cs-terminal__body > .cs-terminal__line')-1;
          case 'Toolbar': return count('.cs-toolbar [role="menu"]');
          case 'Tooltip': return document.querySelector('.cs-tooltip')?.dataset.open;
          case 'TreeTable': return count('.cs-treetable tbody tr');
        }
      };
      drawInternal();
    },{name,observed});
    const initial = name === 'Anchor' || name === 'Carousel' ? 'Alpha' : name === 'CodeBlock' ? 'Copy' : name === 'Splitter' ? '50' : name === 'Tooltip' ? 'false' : name === 'Dock' ? false : name === 'TreeTable' ? 1 : 0;
    const active = name === 'Anchor' || name === 'Carousel' ? 'Beta' : name === 'CodeBlock' ? 'Copied ✓' : name === 'Splitter' ? '52' : name === 'Tooltip' ? 'true' : name === 'Dock' ? true : name === 'TreeTable' ? 2 : 1;
    const context = `${name}/${observed?'action callback':'no action callback'}`;
    await page.waitForFunction(expected=>readInternalState()===expected, initial);
    switch(name) {
      case 'AIDisclosureBadge': await page.getByRole('button',{name:'Disclosure',exact:true}).click(); break;
      case 'Accordion': await page.locator('.cs-accordion__trigger').click(); break;
      case 'Anchor': case 'BackTop': await page.evaluate(()=>window.scrollTo({top:190,behavior:'instant'})); break;
      case 'Carousel': await page.locator('.cs-carousel__nav.next').click(); break;
      case 'CodeBlock': await page.getByRole('button',{name:'Copy',exact:true}).click(); break;
      case 'ContextMenu': await page.getByRole('button',{name:'Context target',exact:true}).click({button:'right'}); break;
      case 'Dock': await page.locator('.cs-dock__item').hover(); break;
      case 'FloatingActionButton': await page.locator('.cs-fab__main').click(); break;
      case 'HotKeys': await page.evaluate(()=>document.activeElement?.blur()); await page.keyboard.press('?'); break;
      case 'HoverCard': await page.getByRole('button',{name:'Hover target',exact:true}).focus(); break;
      case 'Image': await page.locator('.cs-image.is-zoomable').waitFor(); await page.locator('.cs-image').click(); break;
      case 'Menubar': await page.locator('.cs-menubar__top').click(); break;
      case 'NavigationMenu': await page.locator('button.cs-navmenu__top').click(); break;
      case 'Popconfirm': await page.getByRole('button',{name:'Confirm target',exact:true}).click(); break;
      case 'Splitter': await page.getByRole('separator').press('ArrowRight'); break;
      case 'Terminal': await page.getByRole('textbox').fill('help'); await page.getByRole('textbox').press('Enter'); break;
      case 'Toolbar': await page.getByRole('button',{name:'More actions',exact:true}).click(); break;
      case 'Tooltip': await page.getByRole('button',{name:'Tooltip target',exact:true}).focus(); break;
      case 'TreeTable': await page.locator('.cs-treetable button').click(); break;
    }
    await page.waitForFunction(expected=>readInternalState()===expected, active);
    await page.evaluate(()=>drawInternal({className:'rerendered'}));
    assert.equal(await page.evaluate(()=>readInternalState()), active, context+': rerender preserves state');
    if (actionNames.has(name)) {
      if (name === 'HotKeys') await page.keyboard.press('Control+k');
      else if (name === 'Dock') await page.locator('.cs-dock__item').click();
      else if (name === 'FloatingActionButton') await page.locator('.cs-fab__mini').click();
      else if (name === 'Popconfirm') await page.getByRole('button',{name:'Confirm',exact:true}).click();
      else if (name !== 'Terminal') await page.getByRole('menuitem',{name:'Action',exact:true}).click();
      assert.deepEqual(await page.evaluate(()=>internalActions), observed ? [name === 'Terminal' ? 'help' : 'action'] : [], context+': action payload');
      if (['ContextMenu','FloatingActionButton','Menubar','Popconfirm','Toolbar'].includes(name)) {
        assert.equal(await page.evaluate(()=>readInternalState()), initial, context+': action closes independently of callback');
      }
    }
    if (name === 'CodeBlock') assert.equal(await page.evaluate(()=>clipboardWrites.at(-1)), 'sample');
    // Environmental triggers must return to their initial condition before
    // verifying a fresh mount: focus/hover/scroll are not controlled props.
    await page.mouse.move(590,590);
    await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo({top:0,behavior:'instant'});});
    await page.evaluate(()=>drawInternal({key:'reset'}));
    await page.waitForFunction(expected=>readInternalState()===expected, initial);
    assert.deepEqual(await page.evaluate(()=>internalActions), observed ? [name === 'Terminal' ? 'help' : 'action'] : [], context+': remount does not notify');
    await page.evaluate(()=>renderFixture(null));
  }
}, {browserName:process.env.CS_TEST_BROWSER || 'chromium'});
console.log('PASS internal state: 20 components, callback/no-callback where declared, interaction/environment state, rerender and remount reset');
