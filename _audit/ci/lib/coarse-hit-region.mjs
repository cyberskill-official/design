/** Browser-side ownership check. Integer CSS coordinates, not touch activation. */
export function inspectCoarseHitRegion(target) {
  const doc=target.ownerDocument,box=target.getBoundingClientRect();
  const diameter=44,radius=diameter/2,edgeGuard=1,probeRadius=radius-edgeGuard;
  const method='44px_box_1px_inset_disk_integer_css_coordinates_v1';
  if(box.width<43.99||box.height<43.99)return {method,diameter,pass:false,reason:'box_below_floor',targetBounds:box.toJSON()};
  const clipped={left:box.left,top:box.top,right:box.right,bottom:box.bottom};
  let positionedEscape=null;
  for(let node=target;node;node=node.parentElement) {
    const css=doc.defaultView.getComputedStyle(node),rect=node.getBoundingClientRect();
    const specialContainingBlock=css.transform!=='none'||css.perspective!=='none'||css.filter!=='none'||/(layout|paint|strict|content)/.test(css.contain)||/(transform|perspective|filter)/.test(css.willChange)||css.contentVisibility==='auto';
    if(node!==target&&positionedEscape) {
      const contains=specialContainingBlock||(positionedEscape==='absolute'&&css.position!=='static');
      if(!contains)continue;
      positionedEscape=null;
    }
    // Overflow propagates from the HTML/body root to the viewport. Positioned
    // descendants escape intervening overflow until their containing block.
    // https://www.w3.org/TR/CSS22/visufx.html#overflow-clipping
    const rootViewport=node===doc.body||node===doc.documentElement;
    const hasClipBox=node!==target&&!['inline','contents'].includes(css.display);
    if(rootViewport) {
      clipped.left=Math.max(clipped.left,0);clipped.top=Math.max(clipped.top,0);
      clipped.right=Math.min(clipped.right,doc.documentElement.clientWidth);
      clipped.bottom=Math.min(clipped.bottom,doc.documentElement.clientHeight);
    } else if(hasClipBox&&/^(hidden|clip|auto|scroll)$/.test(css.overflowX)) {
      clipped.left=Math.max(clipped.left,rect.left+parseFloat(css.borderLeftWidth));
      clipped.right=Math.min(clipped.right,rect.right-parseFloat(css.borderRightWidth));
    }
    if(!rootViewport&&hasClipBox&&/^(hidden|clip|auto|scroll)$/.test(css.overflowY)) {
      clipped.top=Math.max(clipped.top,rect.top+parseFloat(css.borderTopWidth));
      clipped.bottom=Math.min(clipped.bottom,rect.bottom-parseFloat(css.borderBottomWidth));
    }
    if(css.position==='fixed')positionedEscape='fixed';
    else if(css.position==='absolute')positionedEscape='absolute';
  }
  // A fixed descendant without an ancestor containing block still uses the viewport.
  clipped.left=Math.max(clipped.left,0);clipped.top=Math.max(clipped.top,0);
  clipped.right=Math.min(clipped.right,doc.documentElement.clientWidth);clipped.bottom=Math.min(clipped.bottom,doc.documentElement.clientHeight);
  if(clipped.right-clipped.left<43.99||clipped.bottom-clipped.top<43.99)return {method,diameter,pass:false,reason:'clipped_box_below_floor',targetBounds:box.toJSON(),clippedBounds:clipped};
  const actionSelector='button,a[href],input:not([type=hidden]),select,textarea,summary,[role=button],[role=link],[role=option],[role=tab],[role=menuitem],[role=menuitemcheckbox],[role=menuitemradio],[role=checkbox],[role=radio],[role=switch],[role=slider],[role=separator][tabindex],[contenteditable=true],.cs-tree__twist,.cs-tree__label';
  const center={x:(clipped.left+clipped.right)/2,y:(clipped.top+clipped.bottom)/2};
  const xs=[center.x,clipped.left+radius,clipped.right-radius],ys=[center.y,clipped.top+radius,clipped.bottom-radius];
  const candidates=[center,...xs.flatMap(x=>ys.map(y=>({x,y})))].filter((point,index,all)=>all.findIndex(other=>Math.abs(other.x-point.x)<.01&&Math.abs(other.y-point.y)<.01)===index);
  const checks=[];
  for(const point of candidates) {
    let tested=0,misses=0;const firstMisses=[];
    // Keep a 1px guard inside the 44px region. DOM hit testing and native touch
    // adjustment can disagree near fractional shared borders. This probe does
    // not certify that guard or continuous/subpixel ownership.
    for(let x=Math.ceil(point.x-probeRadius);x<point.x+probeRadius;x++)for(let y=Math.ceil(point.y-probeRadius);y<point.y+probeRadius;y++) {
      const dx=x-point.x,dy=y-point.y;
      if(dx*dx+dy*dy>probeRadius*probeRadius)continue;
      const hit=doc.elementFromPoint(x,y);
      let owns=Boolean(hit&&(hit===target||target.contains(hit))),competitor=null;
      if(owns)for(let node=hit;node&&node!==target;node=node.parentElement) {
        if(!node.matches(actionSelector))continue;
        // A native label activates its associated control. Tree row and label
        // select the same node; its expansion twist is a separate action.
        const sameLabelControl=target.tagName==='LABEL'&&target.control===node;
        const sameTreeSelection=target.classList.contains('cs-tree__row')&&node.classList.contains('cs-tree__label')&&node.closest('.cs-tree__row')===target;
        if(!sameLabelControl&&!sameTreeSelection){owns=false;competitor=node;break;}
      }
      tested++;
      if(!owns) {
        misses++;
        if(firstMisses.length<8)firstMisses.push({x,y,dx,dy,hit:hit?.tagName||null,hitClass:typeof hit?.className==='string'?hit.className.slice(0,160):'',competingAction:competitor?.tagName||null});
      }
    }
    checks.push({center:point,tested,misses,firstMisses});
    if(misses===0)return {method,diameter,edgeGuard,probeDiameter:probeRadius*2,pass:true,targetBounds:box.toJSON(),clippedBounds:clipped,chosenCenter:point,requiredSamples:tested,checkedCandidates:checks.length,checks};
  }
  return {method,diameter,edgeGuard,probeDiameter:probeRadius*2,pass:false,reason:'no_owned_candidate_disk',targetBounds:box.toJSON(),clippedBounds:clipped,checkedCandidates:checks.length,checks};
}
