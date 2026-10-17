import assert from 'node:assert/strict';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
await withBrowserFixture(async page => {
  for (const name of ['Popover', 'Menu', 'Popconfirm']) {
    for (const modal of [false, true]) for (const triggerKind of ['element', 'text']) for (const activation of ['pointer', 'keyboard']) {
      await page.evaluate(({name, modal, triggerKind}) => {
        const h = React.createElement;
        const trigger = triggerKind === 'element' ? h('button', null, 'Open child') : 'Open child';
        const content = h('div', null, h('button', {id:'before'}, 'Before'),
          h(CS[name], {trigger, title:'Confirm', lang:'en'}, name === 'Menu' ? h(CS.MenuItem, null, 'Action') : h('button', null, 'Action')));
        renderFixture(modal ? h(CS.Dialog, {open:true, title:'Parent'}, content) : content);
      }, {name, modal, triggerKind});
      const trigger = page.getByRole('button', {name:'Open child', exact:true});
      await page.locator('#before').focus();
      if (activation === 'pointer') await trigger.click();
      else { await trigger.focus(); await trigger.press('Enter'); }
      await page.locator('[aria-expanded=true]').waitFor();
      const panel = page.locator(name === 'Popover' ? '.cs-popover__panel' : name === 'Menu' ? '.cs-menu__list' : '.cs-popconfirm__panel');
      await panel.getByRole(name === 'Menu' ? 'menuitem' : 'button').first().focus();
      await page.keyboard.press('Escape');
      assert.equal(await panel.count(), 0, `${name}: child dismissed`);
      assert.equal(await trigger.evaluate(el => document.activeElement === el), true, `${name}/${modal}/${triggerKind}/${activation}: return to activated trigger`);
      assert.equal(await page.getByRole('dialog', {name:'Parent', exact:true}).count(), modal ? 1 : 0);
      await page.evaluate(() => renderFixture(null));
    }
    await page.evaluate(name => {
      const h=React.createElement; window.openRequests=[];
      renderFixture(h(CS[name], {trigger:h('button',{onClick:event=>event.preventDefault()},'Blocked trigger'),title:'Confirm',onOpenChange:value=>openRequests.push(value)},'Body'));
    },name);
    await page.getByRole('button',{name:'Blocked trigger'}).click();
    assert.equal(await page.locator('[aria-expanded=true]').count(),0,'Canceled activation does not open');
    assert.deepEqual(await page.evaluate(()=>openRequests),[]);
    await page.evaluate(()=>renderFixture(null));
  }
}, {browserName:process.env.CS_TEST_BROWSER || 'chromium'});
console.log('PASS overlay trigger focus: 24 modal/nonmodal, element/text, pointer/keyboard cases and canceled activations');
