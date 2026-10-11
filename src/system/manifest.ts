/** System's expected components and features, from the complete controlling definition before wire translation. */
type Json=Record<string,unknown>;
const obj=(v:unknown):Json=>v&&typeof v==='object'&&!Array.isArray(v)?v as Json:{};
const list=(v:unknown):Json[]=>Array.isArray(v)?v.map(obj):[];
export function definitionManifest(requestType:string,definition:Json,unresolvedRequirements:unknown[]=[]):Json {
  const jobId=String(definition.configurationId??''),revision=String(definition.configurationVersion??'');
  let boardPartIds:string[]=[],sheetPackageIds:string[]=[],featureIds:string[]=[],items:Json[]=[];
  if(requestType==='USER_DEFINED_BOARD_V1'){
    const parts=list(definition.parts);boardPartIds=parts.map(p=>String(p.partId??''));
    featureIds=parts.flatMap(p=>list(p.features).map((f,i)=>String(f.featureId??`declared:${String(p.partId||'part')}:feature:${i}`)));
  }else if(requestType==='ALCOVE_INSERT_V1'){
    const parts=list(definition.componentPrograms);boardPartIds=parts.map(p=>String(p.componentId??''));
    featureIds=parts.flatMap(p=>list(p.features).map(f=>String(f.featureId??'')));
    const hardware=obj(definition.hardwareDemand);if(Object.keys(hardware).length)items=[{lineId:String(hardware.requirementId??''),qty:hardware.qty}];
  }else if(requestType==='CUT_PACKAGE_V1'){
    const parts=list(definition.cutPackages).flatMap(p=>list(p.parts));boardPartIds=parts.map(p=>String(p.partId??p.componentId??''));
    featureIds=parts.flatMap(p=>[...list(p.spots??p.features),...list(p.edgeProfiles)].map(f=>String(f.featureId??'')));
    items=list(definition.itemLines).map(i=>({lineId:String(i.lineId??i.requirementId??''),qty:i.qty}));
  }else if(requestType==='SHEET_PACKAGE_V1'){
    sheetPackageIds=[jobId];featureIds=list(definition.features).map(f=>String(f.featureId??''));
  }else throw new Error('MANIFEST_REQUEST_TYPE_NOT_DECLARED');
  const sourceUnresolved=Array.isArray(definition.unresolvedConditions)?definition.unresolvedConditions:[];
  return {jobId,revision,boardPartIds,sheetPackageIds,featureIds,items,unresolvedRequirements:[...sourceUnresolved,...unresolvedRequirements]};
}
