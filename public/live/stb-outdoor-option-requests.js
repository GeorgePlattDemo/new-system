(function(root){
  'use strict';
  // Each alternative is its own manufacturing job. These definitions never enter the terms flow.
  function split(def){
    const packages=def.cutPackages||[],items=def.itemLines||[];
    const woods=[...new Set(packages.map(p=>String(p.packageId).split('|')[0]))];
    const tiers=[...new Set(items.map(p=>String(p.lineId).split('|')[0]))];
    const selected=packages.filter(p=>String(p.packageId).startsWith((def.optionWood||woods[0])+'|'));
    const make=(kind,key,cutPackages,itemLines=[])=>({kind,key,definition:{
      configurationId:def.configurationId,
      configurationVersion:def.configurationVersion+'-'+kind+'-'+key,
      cutPackages,
      ...(itemLines.length?{itemLines}:{})
    }});
    return [
      ...woods.map(key=>make('wood',key,packages.filter(p=>String(p.packageId).startsWith(key+'|')))),
      ...tiers.map(key=>make('tier',key,selected,items.filter(p=>String(p.lineId).startsWith(key+'|'))))
    ];
  }
  const queues=[[],[]];let active=false;
  async function drain(){
    if(active)return;
    active=true;
    while(queues[0].length||queues[1].length){
      const job=queues[0].shift()||queues[1].shift();
      try{
        // A started inquiry finishes normally. Only obsolete, queued previews are discarded.
        if(job.preview&&!job.isCurrent())throw Object.assign(new Error('OUTDOOR_PREVIEW_SUPERSEDED'),{code:'OUTDOOR_PREVIEW_SUPERSEDED'});
        job.resolve(await job.run());
      }catch(error){job.reject(error)}
    }
    active=false;
  }
  function enqueue(run,{preview=false,isCurrent=()=>true}={}){
    return new Promise((resolve,reject)=>{
      queues[preview?1:0].push({run,resolve,reject,preview,isCurrent});drain();
    });
  }
  root.STBOutdoorOptionRequests={split,enqueue};
})(typeof window==='undefined'?globalThis:window);
