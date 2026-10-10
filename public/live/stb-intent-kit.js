/* Shared Intent presentation only. Material discovery uses the existing live Store client; job evaluation stays there. */
(function(root){
  'use strict';
  function mountWoodLookup({host,projectId,candidateRevisionId,accept,onPick,requirementText}){
    if(!host)return;
    const doc=host.ownerDocument;
    const form=doc.createElement('form');form.className='stb-wood-search';
    const input=doc.createElement('input');input.type='search';input.placeholder='Search Store wood';input.setAttribute('aria-label','Search Store wood');
    const button=doc.createElement('button');button.type='submit';button.textContent='LOOK IN STORE';
    const note=doc.createElement('p');note.className='stb-wood-result';note.setAttribute('aria-live','polite');note.textContent=requirementText+' Store chooses parent stock when it evaluates the job.';
    const rows=doc.createElement('div');rows.className='stb-wood-rows';
    form.append(input,button);host.append(form,note,rows);
    let token=0;
    form.addEventListener('submit',async event=>{
      event.preventDefault();const query=input.value.trim();if(!query){note.textContent='Enter the wood you want to find.';return;}
      const current=++token;rows.replaceChildren();button.disabled=true;note.textContent='Asking Store for matching items…';
      try{
        const answer=await root.STBStoreClient.lookupOfferings({projectId,candidateRevisionId:String(typeof candidateRevisionId==='function'?candidateRevisionId():candidateRevisionId),searchText:query});
        if(current!==token)return;
        note.textContent=answer.totalMatches+' Store items match'+(answer.truncated?' (showing '+answer.rawOfferings.length+')':'')+'. Item lookup does not evaluate this job.';
        for(const item of answer.rawOfferings){
          const row=doc.createElement('div');row.className='stb-wood-row';const label=doc.createElement('p');
          label.textContent=item.description+' · '+item.storeSku;
          const pick=doc.createElement('button');pick.type='button';const allowed=accept(item);pick.disabled=!allowed;pick.textContent=allowed?'USE THIS WOOD CLASS':'DIFFERENT MATERIAL';
          if(!allowed)pick.title=requirementText;
          pick.addEventListener('click',()=>{onPick(item);note.textContent='Wood class selected from Store '+String(answer.storePin).slice(0,7)+'. The current job still needs its own Store answer.';});
          row.append(label,pick);rows.append(row);
        }
      }catch(error){if(current===token){rows.replaceChildren();note.textContent='Store could not answer ('+(error?.message||'STORE_ZERO_UNAVAILABLE')+').';}}
      finally{if(current===token)button.disabled=false;}
    });
  }
  root.STBIntentKit=Object.freeze({mountWoodLookup});
})(window);
