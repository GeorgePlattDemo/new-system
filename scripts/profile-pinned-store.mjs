#!/usr/bin/env node
// Read-only timed replay of an actual published Outdoor request against the pinned Store checkout.
// No new quote is admitted, and the original Store answer and receipt are left unchanged.
import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join, resolve } from 'node:path';

export async function profilePinnedStoreAnswer(published){
  const root=resolve(process.env.STORE_ZERO_ROOT||fileURLToPath(new URL('../.store-zero/',import.meta.url)));
  const load=rel=>import(pathToFileURL(join(root,rel)).href);
  const [{requestProblems,evaluateStoreRequest},{loadCatalog},{loadMachineConfig},
    {compileDefinition,evaluateManufacturingJob}]=await Promise.all([
      load('src/requests/store-request.mjs'),
      load('src/evaluation/catalog.mjs'),
      load('src/machine/configuration.mjs'),
      load('src/evaluation/engine/store-manufacturing-core.mjs')
    ]);
  const m=published.mappedCallInputs;
  assert.ok(m?.demand&&m?.manifest,'Profile requires the actual Store definition and manifest');
  const request={requestType:m.requestType,requestId:published.requestId,demand:m.demand,manifest:m.manifest};
  const stages={};
  const time=(name,run)=>{
    const start=performance.now(),answer=run();
    stages[name]=Math.round((performance.now()-start)*100)/100;
    return answer;
  };
  assert.equal(time('requestContractMs',()=>requestProblems(request)),null);
  const catalog=time('catalogLoadAndValidationMs',()=>loadCatalog());
  const registered=time('machineConfigLoadAndValidationMs',()=>loadMachineConfig());
  const compiled=time('definitionCompilationMs',()=>compileDefinition(
    {requestType:request.requestType,requestId:request.requestId,demand:request.demand},request.manifest));
  assert.equal(compiled.status,'COMPILED');
  const result=time('manufacturingSearchAndQMs',()=>evaluateManufacturingJob(catalog,compiled.job,registered.model));
  const live=published.rawEvaluation;
  assert.equal(result.status,live.status);
  assert.equal(result.Q,live.Q);
  assert.deepEqual(result.manifestCoverage,live.manifestCoverage);
  assert.deepEqual(result.selectedStock,live.selectedStock);
  assert.equal(result.calculationIdentity?.inputHash,live.calculationIdentity?.inputHash);
  assert.equal(result.calculationIdentity?.resultHash,live.calculationIdentity?.resultHash);
  const full=time('freshEndToEndRequestLayerMs',()=>evaluateStoreRequest(request,{
    release:published.storePin,now:()=>published.evaluationReceipt.evaluatedAt
  }));
  assert.equal(full.Q,live.Q);
  assert.equal(full.evaluationReceipt.receiptHash,published.evaluationReceipt.receiptHash);
  const wire=time('responseSerializationMs',()=>JSON.stringify(full));
  return {revision:request.demand.configurationVersion,searchNodes:result.optimization?.nodes,
    searchComplete:result.optimization?.searchComplete,bytes:wire.length,stages};
}
