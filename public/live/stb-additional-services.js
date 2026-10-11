/* Compact shared Additional Services menu. No modification of Store prices or job authority. */
(function(root){
'use strict';
const groups=[
['A · Pickup, packing & delivery','A01|Counter pickup — ASAP;A02|Scheduled pickup;A03|Will-call hold;A04|Palletize / wrap / strap;A05|Bundle by assembly;A06|Delivery — curb / inside / room;A07|Liftgate / boom;A08|Load vehicle;A09|Returnable pallet / crate;A10|Protective crating;A11|Delivery time window'],
['B · Sanding & preparation','B01|Sand cut ends / edges — grit;B02|Scuff-sand surfaces — grit;B03|Full sanding — faces / grit;B04|Break sharp edges — 1/16 / 1/8;B05|Remove mill marks / snipe;B06|Remove grade / pencil marks;B07|Raise grain and re-sand;B08|Vacuum / clean parts'],
['C · Panels & sheets','C01|Remove tabs — snap / trim / sand;C02|Remove onion skin;C03|Edge band — veneer / PVC / wood;C04|Fill plywood-edge voids;C05|Keep / label offcuts;C06|Scrap / recycle offcuts;C07|Seal sheet edges'],
['D · Holes & hardware','D01|Drill final diameter;D02|Deburr / chamfer holes;D03|Countersink / counterbore;D04|Install inserts / T-nuts;D05|Counted hardware kit;D06|Preinstall hardware;D07|Test-fit hardware'],
['E · Identification & grouping','E01|Part labels — tag / pencil / laser;E02|Mark top / face / end;E03|Mark grain direction;E04|Number for build guide;E05|Bag / label small parts;E06|Group subassemblies;E07|Printed cut list / guide / answer;E08|QR / barcode labels'],
['F · Finish & protection','F01|Prime / paint / stain / clear — coats;F02|Seal end grain;F03|Treat pressure-treated cuts;F04|Back-prime trim;F05|Film / slip sheets;F06|Covered dry staging;F07|Wrap finished parts'],
['G · Inspection & quality','G01|Dimensions — sample / all;G02|Check square / diagonals;G03|Moisture reading;G04|Appearance-selected stock;G05|Finished-part photos;G06|Recorded tolerance report'],
['H · Assembly','H01|Dry-fit at yard;H02|Glue-up / preassembly;H03|Knock-down / reassembly marks;H04|Assembly jigs / templates'],
['I · Paperwork & closeout','I01|Credit unused material / hardware;I02|Recycle packaging;I03|Finish safety data sheets;I04|Digital job / build records']
].map(([title,items])=>[title,items.split(';').map(row=>row.split('|'))]);
const ids=groups.flatMap(g=>g[1].map(row=>row[0]));
if(ids.length!==62||new Set(ids).size!==62)throw Error('ADDL_SERVICES_CATALOG_INVALID');
const css=[
'.stb-as-host{display:inline-flex;position:relative;align-items:center;flex:0 0 auto;line-height:1}',
'.stb-as-trigger{min-height:22px;padding:3px 6px;border:1px solid rgba(110,110,110,.38);border-radius:5px;background:transparent;color:inherit;font:600 10px/1.2 system-ui,sans-serif;white-space:nowrap;cursor:pointer;opacity:.8}',
'.stb-as-trigger:hover,.stb-as-trigger:focus-visible{opacity:1;border-color:currentColor}',
'.stb-as-workline{display:grid!important;grid-template-columns:minmax(0,1fr) auto;gap:3px 10px!important;align-items:center}',
'.stb-as-workline>#stb-bench-workline{grid-column:1;grid-row:1;min-width:0}',
'.stb-as-workline>span:not(.stb-as-host){grid-column:1;grid-row:2;min-width:0}',
'.stb-as-workline>.stb-as-host{grid-column:2;grid-row:1 / span 2;justify-self:end}',
'.stb-as-host--alcove{margin:0 0 3px 0}',
'.stb-as-host--window-seat{display:flex;justify-content:flex-end;margin:0 0 6px}',
'.stb-as-host--outdoor{display:flex;justify-content:flex-end;margin:0 0 9px}',
'.stb-as-host--playhouse{display:flex;justify-content:flex-end;margin:3px 0 6px}',
'.stb-as-host>.stb-as-trigger{font:600 10px/1.2 system-ui,sans-serif!important;min-height:22px!important;padding:3px 6px!important;white-space:nowrap!important}',
'.stb-as-popup{position:fixed;z-index:2147483600;box-sizing:border-box;overflow:auto;padding:10px 12px;border:1px solid #aeb5ba;border-radius:9px;background:#fff;color:#272c30;box-shadow:0 10px 36px rgba(0,0,0,.2);font:11px/1.3 system-ui,sans-serif;text-align:left}',
'.stb-as-popup[hidden]{display:none!important}',
'.stb-as-top{display:flex;justify-content:space-between;gap:12px;align-items:center;margin:0 0 7px;padding:0 0 6px;border-bottom:1px solid #ddd}',
'.stb-as-top strong{font-size:12px}',
'.stb-as-close{font:600 11px system-ui,sans-serif;cursor:pointer;background:#f7f7f7;border:1px solid #c8c8c8;border-radius:5px;padding:4px 8px;color:#333}',
'.stb-as-columns{column-count:4;column-gap:14px}',
'.stb-as-group{break-inside:avoid;display:inline-block;width:100%;vertical-align:top;margin:0 0 9px}',
'.stb-as-group h4{font:700 10px/1.25 system-ui,sans-serif;margin:0 0 3px;padding:0 0 2px;color:#354b58;border-bottom:1px solid #dedede}',
'.stb-as-choice{display:flex;align-items:start;gap:4px;margin:0 0 2px;cursor:pointer;font:10px/1.23 system-ui,sans-serif;color:#282828}',
'.stb-as-choice input{appearance:auto;flex:none;width:12px;height:12px;margin:0;accent-color:#495d64}',
'.stb-as-foot{display:flex;flex-wrap:wrap;justify-content:space-between;gap:2px 12px;margin:7px 0 0;padding:6px 0 0;border-top:1px solid #e1e1e1;color:#555;font-size:10px}',
'@media(max-width:660px){.stb-as-columns{column-count:2}}',
'@media(max-width:390px){.stb-as-columns{column-count:1}}'
].join('\n');
const selections=new Map();
const key=project=>'stb-addl-svcs-review-v1:'+project;
function selected(project){
 if(!selections.has(project)){
  let initial=[];try{initial=JSON.parse(root.sessionStorage.getItem(key(project))||'[]');}catch(_){}
  selections.set(project,new Set(Array.isArray(initial)?initial.filter(id=>ids.includes(id)):[]));
 }
 return selections.get(project);
}
function anchor(doc,p){
 if(p==='start-own')return doc.getElementById('stb-bench-workline')?.closest('.workline');
 if(p==='alcove')return doc.querySelector('#alcove-config #shelves');
 if(p==='window-seat')return doc.querySelector('#s-bench .ctl > #ctlcol');
 if(p==='outdoor')return doc.querySelector('#s-build [data-knob="SIZE"]');
 if(p==='playhouse')return doc.querySelector('#playhouse-machine #s001-tool-controls');
 return null;
}
function mount(doc,p){
 const target=anchor(doc,p);
 if(!target||target.querySelector('[data-stb-as-project="'+p+'"]')||!doc.body)return;
 if(!doc.getElementById('stb-as-style')){
  const style=doc.createElement('style');style.id='stb-as-style';style.textContent=css;(doc.head||doc.documentElement).appendChild(style);
 }
 const host=doc.createElement('span');host.className='stb-as-host stb-as-host--'+p;host.dataset.stbAsProject=p;
 const toggle=doc.createElement('button');toggle.type='button';toggle.className='stb-as-trigger';
 toggle.textContent='Addl svcs ▾';toggle.setAttribute('aria-label','Additional services');
 toggle.setAttribute('aria-expanded','false');
 const panel=doc.createElement('section');panel.className='stb-as-popup';panel.id='stb-as-popup-'+p;
 panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Additional services');
 toggle.setAttribute('aria-controls',panel.id);
 const top=doc.createElement('div');top.className='stb-as-top';
 const title=doc.createElement('strong');title.textContent='Additional services';
 const close=doc.createElement('button');close.type='button';close.className='stb-as-close';
 close.textContent='Close ×';close.setAttribute('aria-label','Close additional services');top.append(title,close);panel.append(top);
 const columns=doc.createElement('div');columns.className='stb-as-columns';
 const choices=selected(p);
 const count=doc.createElement('span');count.textContent=choices.size+' selected · planning only';
 for(const [heading,rows] of groups){
  const section=doc.createElement('section');section.className='stb-as-group';
  const h=doc.createElement('h4');h.textContent=heading;section.append(h);
  for(const [id,label] of rows){
   const row=doc.createElement('label');row.className='stb-as-choice';
   const check=doc.createElement('input');check.type='checkbox';check.value=id;check.checked=choices.has(id);
   check.setAttribute('aria-label',id+' '+label);
   const words=doc.createElement('span');words.textContent=label;row.append(check,words);section.append(row);
   check.addEventListener('change',()=>{
    if(check.checked)choices.add(id);else choices.delete(id);
    try{root.sessionStorage.setItem(key(p),JSON.stringify([...choices]));}catch(_){}
    count.textContent=choices.size+' selected · planning only';
   });
  }
  columns.append(section);
 }
 panel.append(columns);
 const foot=doc.createElement('div');foot.className='stb-as-foot';
 const yard=doc.createElement('span');yard.textContent='Every yard may expand or condense this list.';
 foot.append(yard,count);panel.append(foot);
 host.append(toggle);
 if(p==='start-own'){
  target.classList.add('stb-as-workline');
  const caption=target.querySelector('span');if(caption)caption.before(host);else target.append(host);
 }else if(p==='window-seat')target.before(host);
 else target.after(host);
 doc.body.append(panel);
 const view=doc.defaultView;
 function place(){
  if(panel.hidden)return;
  const r=toggle.getBoundingClientRect(),vw=view.innerWidth,vh=view.innerHeight;
  const width=Math.min(790,Math.max(200,vw-24)),left=Math.max(12,Math.min(vw-width-12,r.right-width));
  const below=Math.max(0,vh-r.bottom-12),above=Math.max(0,r.top-12);
  const up=(p==='start-own'&&above>170)||(below<230&&above>below);
  const max=Math.max(100,Math.min(480,(up?above:below)-6));
  panel.style.width=width+'px';panel.style.left=left+'px';panel.style.maxHeight=max+'px';
  panel.style.top=(up?Math.max(8,r.top-max-6):r.bottom+6)+'px';
 }
 function show(open){panel.hidden=!open;toggle.setAttribute('aria-expanded',String(open));if(open)place();}
 toggle.addEventListener('click',()=>show(panel.hidden));
 close.addEventListener('click',()=>{show(false);toggle.focus();});
 doc.addEventListener('pointerdown',e=>{if(!panel.hidden&&!panel.contains(e.target)&&!host.contains(e.target))show(false);});
 doc.addEventListener('keydown',e=>{if(!panel.hidden&&e.key==='Escape'){show(false);toggle.focus();}});
 doc.addEventListener('scroll',place,true);view.addEventListener('resize',place);
}
const watched=new WeakSet();let pending=false;
function schedule(){if(!pending){pending=true;root.setTimeout(()=>{pending=false;scan();},160);}}
function visit(win,seen){
 let doc;try{doc=win.document;}catch(_){return;}
 if(!doc||seen.has(doc))return;seen.add(doc);
 if(!watched.has(doc)){
  watched.add(doc);
  new win.MutationObserver(schedule).observe(doc.documentElement,{childList:true,subtree:true});
  doc.addEventListener('load',schedule,true);
 }
 for(const p of ['start-own','alcove','window-seat','outdoor','playhouse'])mount(doc,p);
 for(const frame of doc.querySelectorAll('iframe'))try{if(frame.contentWindow)visit(frame.contentWindow,seen);}catch(_){}
}
function scan(){visit(root,new Set());}
if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',scan,{once:true});else scan();
root.STBAdditionalServices=Object.freeze({version:'STB-ADDL-SVCS-0.1',list:()=>groups.map(([name,rows])=>({name,services:rows.map(([id,label])=>({id,label}))})),selection:project=>[...selected(project)]});
})(window);
