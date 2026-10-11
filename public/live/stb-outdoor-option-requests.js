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
  root.STBOutdoorOptionRequests={split};
})(typeof window==='undefined'?globalThis:window);
