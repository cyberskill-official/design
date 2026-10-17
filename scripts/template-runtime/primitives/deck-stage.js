/* CyberSkill responsive deck stage source. Compatibility candidate. */
(() => {
  'use strict';
  if(customElements.get('deck-stage'))return;
  class DeckStage extends HTMLElement {
    static observedAttributes = ['width','height','lang'];
    constructor() {
      super();this.index=0;
      const root=this.attachShadow({mode:'open'});
      root.innerHTML=`<style>
        :host{display:block;position:relative;width:100%;height:100vh;overflow:hidden;background:var(--cs-color-surface-page,#fffdf8)}
        .viewport{position:absolute;inset:0;display:grid;place-items:center;overflow:auto}
        .canvas{position:relative;width:var(--deck-width);height:var(--deck-height);flex:none;transform:scale(var(--deck-scale,1));transform-origin:center}
        ::slotted(section){position:absolute;inset:0;width:100%;height:100%;box-sizing:border-box}
        ::slotted(section:not([data-deck-active])){display:none}
        nav{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:8px;padding:6px;border-radius:8px;background:var(--cs-color-surface-panel,#fffdf8);color:var(--cs-color-text-primary,#26323a);font-family:var(--cs-font-family-ui,system-ui)}
        button{min-width:44px;min-height:44px;border:1px solid var(--cs-color-border-default,#8c8277);border-radius:6px;color:inherit;background:inherit;font:inherit;cursor:pointer}
        button:focus-visible{outline:2px solid var(--cs-color-focus,#45210e);outline-offset:2px}
        @media print{:host{height:auto;overflow:visible}.viewport,.canvas{position:static;display:block;width:auto;height:auto;overflow:visible;transform:none}nav{display:none}::slotted(section){position:relative;display:block!important;width:100%;height:auto;min-height:0;aspect-ratio:var(--deck-ratio,16/9);break-inside:avoid;break-after:page}}
      </style><div class="viewport"><div class="canvas"><slot></slot></div></div><nav aria-label="Slide navigation"><button type="button" data-act="previous">←</button><span role="status" aria-live="polite"></span><button type="button" data-act="next">→</button></nav>`;
      this.shadowRoot.querySelector('[data-act="previous"]').addEventListener('click',()=>this.go(this.index-1));
      this.shadowRoot.querySelector('[data-act="next"]').addEventListener('click',()=>this.go(this.index+1));
      this.handleKey = event => {
        if(event.defaultPrevented||event.ctrlKey||event.altKey||event.metaKey||event.shiftKey)return;
        if(event.composedPath().some(node=>node instanceof Element && (node.matches('input,textarea,select,[contenteditable]:not([contenteditable="false"])') || ['slider','combobox','listbox','grid','tree','menu','tablist'].includes(node.getAttribute('role')))))return;
        const deltas={ArrowRight:1,ArrowDown:1,PageDown:1,ArrowLeft:-1,ArrowUp:-1,PageUp:-1};
        if(event.key in deltas){event.preventDefault();this.go(this.index+deltas[event.key]);}
        else if(event.key==='Home'||event.key==='End'){event.preventDefault();this.go(event.key==='Home'?0:this.slides.length-1);}
      };
    }
    get slides(){return Array.from(this.children).filter(el=>el.localName==='section');}
    connectedCallback(){
      this.refresh();window.addEventListener('keydown',this.handleKey);
      this.resizeObserver=new ResizeObserver(()=>this.size());this.resizeObserver.observe(this);
      this.contentObserver=new MutationObserver(()=>this.refresh());this.contentObserver.observe(this,{childList:true,attributes:true,attributeFilter:['data-label'],subtree:true});
      this.langObserver=new MutationObserver(()=>this.refresh());this.langObserver.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    }
    disconnectedCallback(){window.removeEventListener('keydown',this.handleKey);this.resizeObserver?.disconnect();this.contentObserver?.disconnect();this.langObserver?.disconnect();}
    attributeChangedCallback(){if(this.isConnected)this.refresh();}
    size(){
      const width=Math.max(1,Number(this.getAttribute('width'))||1920),height=Math.max(1,Number(this.getAttribute('height'))||1080);
      const bounds=this.getBoundingClientRect();const scale=Math.max(0.01,Math.min(bounds.width/width,Math.max(1,bounds.height-76)/height));
      this.style.setProperty('--deck-width',width+'px');this.style.setProperty('--deck-height',height+'px');this.style.setProperty('--deck-ratio',width+' / '+height);this.style.setProperty('--deck-scale',String(scale));
    }
    refresh(){this.go(Math.min(this.index,Math.max(0,this.slides.length-1)));this.size();}
    go(index){
      const slides=this.slides;this.index=Math.max(0,Math.min(index,Math.max(0,slides.length-1)));
      for(const [i,slide]of slides.entries()){
        slide.toggleAttribute('data-deck-active',i===this.index);
        slide.inert=i!==this.index;slide.setAttribute('aria-hidden',String(i!==this.index));
      }
      const vi=(this.getAttribute('lang')||document.documentElement.lang).toLowerCase().startsWith('vi');
      this.shadowRoot.querySelector('nav').setAttribute('aria-label',vi?'Điều hướng trang':'Slide navigation');
      this.shadowRoot.querySelector('[data-act="previous"]').setAttribute('aria-label',vi?'Trang trước':'Previous slide');
      this.shadowRoot.querySelector('[data-act="next"]').setAttribute('aria-label',vi?'Trang sau':'Next slide');
      this.shadowRoot.querySelector('[data-act="previous"]').disabled=this.index===0;
      this.shadowRoot.querySelector('[data-act="next"]').disabled=this.index>=slides.length-1;
      this.shadowRoot.querySelector('[role="status"]').textContent=slides.length?(this.index+1)+' / '+slides.length:'';
      this.dispatchEvent(new CustomEvent('cs-slide-change',{detail:{index:this.index,label:slides[this.index]?.getAttribute('data-label')||''},bubbles:true}));
    }
  }
  customElements.define('deck-stage',DeckStage);
})();
