(function(root){
  'use strict';

  var ACTOR_ORDER = Object.freeze([
    'project-definition',
    'store-answer',
    'accept-pay',
    'store-yard',
    'handoff-record',
    'project-library'
  ]);

  var CURRENT_ARTIFACTS = Object.freeze({
    startOwn: Object.freeze({projectId:'start-own', artifact:'stb-start-own-bench-leg-0.1.html', projectClass:'USER_DEFINED_BOARD'}),
    outdoor: Object.freeze({projectId:'outdoor-build', artifact:'stb-outdoor-picnic-0.4.html', projectClass:'BOUNDED_SOURCE_BACKED'}),
    alcove: Object.freeze({projectId:'alcove', artifact:'system-build-current.html#alcove-capture', projectClass:'ALCOVE_INSERT'}),
    sheetS001: Object.freeze({projectId:'sheet-s001', artifact:'system-build-current.html#playhouse-s001', projectClass:'SHEET_ROUTED_OPENING'})
  });

  /*
   * Store authority is path-specific. Do not collapse these into one universal
   * Store pin: the current Store master explicitly preserves different pins for
   * documentary doctrine, executable Stage-2 evidence, published jobs, and the
   * class-scoped Window Seat recovery model.
   */
  var STORE_AUTHORITIES = Object.freeze({
    canonical: Object.freeze({
      repository:'GeorgePlattDemo/scan-to-build-store',
      doctrineFile:'STORE-ZERO.md',
      doctrinePin:'f88ec61c42446755d00259f88e7fd09f2702fd92',
      catalogFile:'store-zero-catalog.json',
      catalogPin:'4402abeb6b0299a5b6db2eec85ed04c3b0236bcc',
      stage2ExecutablePin:'b40cdc60a405d6c2a63d846f2c2e89cddc5bb95d',
      publishedJobsPin:'4402abeb6b0299a5b6db2eec85ed04c3b0236bcc'
    }),
    startOwn: Object.freeze({
      projectId:'start-own',
      projectClass:'USER_DEFINED_BOARD',
      materialCatalogPin:'9c62d9d6f7775deef83d47196d32c9b5174a352c',
      capabilityBasis:'STB-D001-DIMENSIONAL-TRAVEL-0.1',
      capabilityPin:'9c62d9d6f7775deef83d47196d32c9b5174a352c',
      economicsModel:'STB-STORE-ZERO-PRICE-1',
      economicsVersion:'0.3.0',
      economicsStatus:'PINNED_STORE_ISSUED_REFERENCE',
      economicsPin:'9c62d9d6f7775deef83d47196d32c9b5174a352c',
      governingStandard:'DIMENSIONAL-STORE-TRAVEL-STANDARD-0.1.md',
      acceptanceWorkflowRun:'36479757210',
      systemIntegrationPin:null,
      legacyGeneralRecoverySelected:false
    }),
    outdoor: Object.freeze({
      projectId:'outdoor-build',
      projectClass:'BOUNDED_SOURCE_BACKED',
      materialCatalogPin:'4402abeb6b0299a5b6db2eec85ed04c3b0236bcc',
      capabilityBasis:'CURRENT_CANONICAL_STORE_ZERO',
      capabilityPin:'f88ec61c42446755d00259f88e7fd09f2702fd92',
      economicsModel:null,
      economicsStatus:'UNRESOLVED_CLASS_SCOPED_RECOVERY',
      legacyGeneralRecoverySelected:false
    }),
    alcove: Object.freeze({
      projectId:'alcove',
      projectClass:'ALCOVE_INSERT',
      materialCatalogPin:'4402abeb6b0299a5b6db2eec85ed04c3b0236bcc',
      capabilityBasis:'D001-BOARD-EDGE-MILL-REF-0.3',
      capabilityPin:'f88ec61c42446755d00259f88e7fd09f2702fd92',
      economicsModel:null,
      economicsStatus:'PROJECT_NATIVE_REFERENCE',
      economicsReason:'Alcove economics are owned by the Alcove implementation. The shared Store handoff contract may carry the identified Alcove answer forward but must not recalculate or replace it.',
      legacyGeneralRecoverySelected:false
    }),
    sheetS001: Object.freeze({
      projectId:'sheet-s001',
      projectClass:'SHEET_ROUTED_OPENING',
      materialCatalogPin:'4402abeb6b0299a5b6db2eec85ed04c3b0236bcc',
      capabilityBasis:'S001-MODE2-ARCHED-APERTURE-V0',
      capabilityPin:'4402abeb6b0299a5b6db2eec85ed04c3b0236bcc',
      economicsModel:null,
      economicsStatus:'BUDGETARY_MATERIAL_ONLY',
      legacyGeneralRecoverySelected:false
    })
  });


  /*
   * Exact Store Zero material rows needed by the Start Your Own browser surface.
   * Source: the existing mapped SKU subset of store-zero-catalog.json at System STORE_PIN.
   * Guarded against the pinned catalog by test/store/user1-reference-guard.test.mjs.
   * Project UI data contains no material price authority of its own.
   */
  /*
   * USER 1 SPECIMENS
   *
   * These four records are explanatory history. They are not a current price,
   * not completeness, and not permission to accept or go downstream.
   * A current answer is a fresh Store evaluation of this exact definition.
   */
  var USER1_STORE_REFERENCE = Object.freeze({
    status:'STORE_ISSUED_REFERENCE',
    source:Object.freeze({
      repository:'GeorgePlattDemo/scan-to-build-store',
      storePin:'9c62d9d6f7775deef83d47196d32c9b5174a352c',
      pricingFile:'store-zero-pricing-engine.mjs',
      travelFile:'d001-travel-standard.mjs',
      governingStandard:'DIMENSIONAL-STORE-TRAVEL-STANDARD-0.1.md',
      workflowRun:'36479757210',
      systemIntegrationPin:null
    }),
    demand:Object.freeze({
      configurationId:'SYO-USER1-XBRACE',
      configurationVersion:'0.1',
      materialDemand:Object.freeze({species:'spf',form:'board',nominalT:2,nominalW:4}),
      definedWorkpieceLengthIn:60,
      partQty:2,
      partLengthIn:16,
      sawAngleDeg:30,
      cutPlane:'miter-face',
      endIdentity:'both',
      endRelation:'parallel',
      lengthDatum:'long-long-outer-edge',
      datumCMethod:'REFERENCE_CUT',
      requiredOps:Object.freeze(['MITER_LIMITED','SPOT_ON_LOCATION']),
      spotMode:'SPOT_ON_LOCATION',
      spotLocationRule:'CENTERED_ON_PART',
      spotAcrossWidthRule:'CENTERED_ON_WIDE_FACE',
      spotXIn:8,
      declaredSawCuts:3,
      declaredSpotCount:2
    }),
    materialResolution:Object.freeze({
      status:'MAPPED',
      storeSku:'STB-ZERO-SPF-2X4-60-001',
      pricingReferenceSku:'STB-ZERO-SPF-2X4-60-001',
      pricingReferenceStockLengthIn:60,
      requestedMinimumWorkpieceLengthIn:60,
      requestedDefinedWorkpieceLengthIn:60,
      workpieceLengthIn:60,
      selectionPolicy:'SHORTEST_COMPLETE_STORE_OFFERING',
      consideredCandidates:Object.freeze([
        Object.freeze({storeSku:'STB-ZERO-SPF-2X4-60-001',stockLengthIn:60,candidateStatus:'SUPPORTABLE',reason:null})
      ]),
      quantity:1,
      stockLengthIn:60,
      unitPrice:2.61,
      materialTotal:2.61,
      allocationClaimed:false,
      cellFamily:Object.freeze(['D-001']),
      supportedOps:Object.freeze(['CROSSCUT','MITER_LIMITED','SPOT_ON_LOCATION','DRILL','MILL_LONGITUDINAL_PROFILE','MILL_END_PROFILE']),
      source:Object.freeze({
        repository:'GeorgePlattDemo/scan-to-build-store',
        file:'store-zero-catalog.json',
        pin:'9c62d9d6f7775deef83d47196d32c9b5174a352c',
        clock:'2026-09-10'
      })
    }),
    estimate:Object.freeze({
      status:'BUDGETARY_ESTIMATE',
      complete:true,
      completeness:'COMPLETE_FOR_TRAVEL_STANDARD',
      documentKind:'BudgetaryEstimate',
      engine:Object.freeze({
        id:'STB-STORE-ZERO-PRICE-1',
        version:'0.3.0',
        clock:'2026-09-22',
        documentKind:'BudgetaryEstimate'
      }),
      cycle:Object.freeze({
        model:'STB-D001-DIMENSIONAL-TRAVEL-0.1',
        version:'0.2.0',
        basis:'DECLARED_STAGE2_MODEL',
        measured:false,
        commissioned:false,
        T_job_min:1.4227
      }),
      totals:Object.freeze({
        material:2.61,
        hardware:0,
        machine_service:5.93,
        Q:8.54,
        Q_basis:'CALCULATED_FROM_DECLARED_STAGE2_MODEL'
      }),
      travel:Object.freeze({
        derivedSawCuts:3,
        derivedSpotCount:2,
        finalRemainderIn:27.625
      }),
      economics:Object.freeze({
        id:'STB-D001-STORE-ECONOMICS-S2-0.1',
        version:'0.1.0',
        basis:'DECLARED_STAGE2_MODEL',
        measured:false,
        forecastProductiveHours:600,
        annualCostPoolUsd:120000,
        targetGrossMargin:0.20,
        breakEvenPerHour:200,
        sellRatePerHour:250,
        setupCharge:0,
        setupTimeMin:0
      }),
      calculationIdentity:Object.freeze({
        inputHash:'bea3c0b3841d013b463277ebaa02121bef79b65abe5e46b05a40f337afa3b868',
        resultHash:'0fd6b7d19ef8f64d133486c9d2ccf72256b2993bb60aa14c77b3c3e8004973bc'
      })
    })
  });

  var USER1_STORE_REFERENCE_18 = Object.freeze({
    status:'STORE_ISSUED_REFERENCE',
    source:Object.freeze({
      repository:'GeorgePlattDemo/scan-to-build-store',
      storePin:'9c62d9d6f7775deef83d47196d32c9b5174a352c',
      pricingFile:'store-zero-pricing-engine.mjs',
      travelFile:'d001-travel-standard.mjs',
      governingStandard:'DIMENSIONAL-STORE-TRAVEL-STANDARD-0.1.md',
      workflowRun:'36479757210',
      systemIntegrationPin:null,
      systemDiagnosticRun:'35791336322'
    }),
    demand:Object.freeze({
      configurationId:'SYO-USER1-XBRACE',
      configurationVersion:'0.2',
      materialDemand:Object.freeze({species:'spf',form:'board',nominalT:2,nominalW:4}),
      definedWorkpieceLengthIn:60,
      partQty:2,
      partLengthIn:18,
      sawAngleDeg:26.387799961242997,
      cutPlane:'miter-face',
      endIdentity:'both',
      endRelation:'parallel',
      lengthDatum:'long-long-outer-edge',
      datumCMethod:'REFERENCE_CUT',
      requiredOps:Object.freeze(['MITER_LIMITED','SPOT_ON_LOCATION']),
      spotMode:'SPOT_ON_LOCATION',
      spotLocationRule:'CENTERED_ON_PART',
      spotAcrossWidthRule:'CENTERED_ON_WIDE_FACE',
      spotXIn:9,
      declaredSawCuts:3,
      declaredSpotCount:2
    }),
    materialResolution:Object.freeze({
      status:'MAPPED',
      storeSku:'STB-ZERO-SPF-2X4-72-001',
      pricingReferenceSku:'STB-ZERO-SPF-2X4-72-001',
      pricingReferenceStockLengthIn:72,
      requestedMinimumWorkpieceLengthIn:60,
      requestedDefinedWorkpieceLengthIn:60,
      workpieceLengthIn:72,
      selectionPolicy:'SHORTEST_COMPLETE_STORE_OFFERING',
      consideredCandidates:Object.freeze([
        Object.freeze({storeSku:'STB-ZERO-SPF-2X4-60-001',stockLengthIn:60,candidateStatus:'REFUSED',reason:'LAST_REMAIN_BELOW_TWO_ROLLER_CONTROL'}),
        Object.freeze({storeSku:'STB-ZERO-SPF-2X4-72-001',stockLengthIn:72,candidateStatus:'SUPPORTABLE',reason:null})
      ]),
      quantity:1,
      stockLengthIn:72,
      unitPrice:3.13,
      materialTotal:3.13,
      allocationClaimed:false,
      cellFamily:Object.freeze(['D-001']),
      supportedOps:Object.freeze(['CROSSCUT','MITER_LIMITED','SPOT_ON_LOCATION','DRILL','MILL_LONGITUDINAL_PROFILE','MILL_END_PROFILE']),
      source:Object.freeze({
        repository:'GeorgePlattDemo/scan-to-build-store',
        file:'store-zero-catalog.json',
        pin:'9c62d9d6f7775deef83d47196d32c9b5174a352c',
        clock:'2026-09-10'
      })
    }),
    estimate:Object.freeze({
      status:'BUDGETARY_ESTIMATE',
      complete:true,
      completeness:'COMPLETE_FOR_TRAVEL_STANDARD',
      documentKind:'BudgetaryEstimate',
      engine:Object.freeze({
        id:'STB-STORE-ZERO-PRICE-1',
        version:'0.3.0',
        clock:'2026-09-22',
        documentKind:'BudgetaryEstimate'
      }),
      cycle:Object.freeze({
        model:'STB-D001-DIMENSIONAL-TRAVEL-0.1',
        version:'0.2.0',
        basis:'DECLARED_STAGE2_MODEL',
        measured:false,
        commissioned:false,
        T_job_min:1.425
      }),
      totals:Object.freeze({
        material:3.13,
        hardware:0,
        machine_service:5.94,
        Q:9.07,
        Q_basis:'CALCULATED_FROM_DECLARED_STAGE2_MODEL'
      }),
      travel:Object.freeze({
        derivedSawCuts:3,
        derivedSpotCount:2,
        finalRemainderIn:35.625
      }),
      economics:Object.freeze({
        id:'STB-D001-STORE-ECONOMICS-S2-0.1',
        version:'0.1.0',
        basis:'DECLARED_STAGE2_MODEL',
        measured:false,
        forecastProductiveHours:600,
        annualCostPoolUsd:120000,
        targetGrossMargin:0.20,
        breakEvenPerHour:200,
        sellRatePerHour:250,
        setupCharge:0,
        setupTimeMin:0
      }),
      calculationIdentity:Object.freeze({
        inputHash:'e594a8fd7ca9de466c0f5e85fc929ec51221e45405add3e5707fa0277fbb2add',
        resultHash:'595b797784e7f97d11a16e70a6e202eddf2cd6f38c02a165159fe4ce2abf9a37'
      })
    })
  });

  var USER1_STORE_REFERENCE_SYP = Object.freeze({
    status:'STORE_ISSUED_REFERENCE',
    source:Object.freeze({
      repository:'GeorgePlattDemo/scan-to-build-store',
      storePin:'9c62d9d6f7775deef83d47196d32c9b5174a352c',
      pricingFile:'store-zero-pricing-engine.mjs',
      travelFile:'d001-travel-standard.mjs',
      governingStandard:'DIMENSIONAL-STORE-TRAVEL-STANDARD-0.1.md',
      workflowRun:null,
      systemIntegrationPin:null
    }),
    demand:Object.freeze({
      configurationId:'SYO-USER1-XBRACE',
      configurationVersion:'0.1',
      materialDemand:Object.freeze({species:'syp-treated',form:'board',nominalT:2,nominalW:4}),
      definedWorkpieceLengthIn:60,
      partQty:2,
      partLengthIn:16,
      sawAngleDeg:30,
      cutPlane:'miter-face',
      endIdentity:'both',
      endRelation:'parallel',
      lengthDatum:'long-long-outer-edge',
      datumCMethod:'REFERENCE_CUT',
      requiredOps:Object.freeze(['MITER_LIMITED','SPOT_ON_LOCATION']),
      spotMode:'SPOT_ON_LOCATION',
      spotLocationRule:'CENTERED_ON_PART',
      spotAcrossWidthRule:'CENTERED_ON_WIDE_FACE',
      spotXIn:8,
      declaredSawCuts:3,
      declaredSpotCount:2
    }),
    materialResolution:Object.freeze({
      status:'MAPPED',
      storeSku:'STB-ZERO-PTAG-2X4-72-001',
      pricingReferenceSku:'STB-ZERO-PTAG-2X4-72-001',
      pricingReferenceStockLengthIn:72,
      requestedMinimumWorkpieceLengthIn:60,
      requestedDefinedWorkpieceLengthIn:60,
      workpieceLengthIn:72,
      selectionPolicy:'SHORTEST_COMPLETE_STORE_OFFERING',
      consideredCandidates:Object.freeze([
        Object.freeze({storeSku:'STB-ZERO-PTAG-2X4-72-001',stockLengthIn:72,candidateStatus:'SUPPORTABLE',reason:null})
      ]),
      quantity:1,
      stockLengthIn:72,
      unitPrice:5.15,
      materialTotal:5.15,
      allocationClaimed:false,
      cellFamily:Object.freeze(['D-001']),
      supportedOps:Object.freeze(['CROSSCUT','MITER_LIMITED','SPOT_ON_LOCATION']),
      source:Object.freeze({
        repository:'GeorgePlattDemo/scan-to-build-store',
        file:'store-zero-catalog.json',
        pin:'9c62d9d6f7775deef83d47196d32c9b5174a352c',
        clock:'2026-09-10'
      })
    }),
    estimate:Object.freeze({
      status:'BUDGETARY_ESTIMATE',
      complete:true,
      completeness:'COMPLETE_FOR_TRAVEL_STANDARD',
      documentKind:'BudgetaryEstimate',
      engine:Object.freeze({
        id:'STB-STORE-ZERO-PRICE-1',
        version:'0.3.0',
        clock:'2026-09-22',
        documentKind:'BudgetaryEstimate'
      }),
      cycle:Object.freeze({
        model:'STB-D001-DIMENSIONAL-TRAVEL-0.1',
        version:'0.2.0',
        basis:'DECLARED_STAGE2_MODEL',
        measured:false,
        commissioned:false,
        T_job_min:1.4227
      }),
      totals:Object.freeze({
        material:5.15,
        hardware:0,
        machine_service:5.93,
        Q:11.08,
        Q_basis:'CALCULATED_FROM_DECLARED_STAGE2_MODEL'
      }),
      travel:Object.freeze({
        derivedSawCuts:3,
        derivedSpotCount:2,
        finalRemainderIn:39.625
      }),
      economics:Object.freeze({
        id:'STB-D001-STORE-ECONOMICS-S2-0.1',
        version:'0.1.0',
        basis:'DECLARED_STAGE2_MODEL',
        measured:false,
        forecastProductiveHours:600,
        annualCostPoolUsd:120000,
        targetGrossMargin:0.20,
        breakEvenPerHour:200,
        sellRatePerHour:250,
        setupCharge:0,
        setupTimeMin:0
      }),
      calculationIdentity:Object.freeze({
        inputHash:'8b7dd9e5de4a8335a6f20e9ff5f2b02952f1dc3c5387f0363bb3eb80de07b906',
        resultHash:'f95709beb9f77cc8981bae4c501f6f4fa8a0f6a1d8f471f4b8794d0325d5bef5'
      })
    })
  });

  var USER1_STORE_REFERENCE_SYP_18 = Object.freeze({
    status:'STORE_ISSUED_REFERENCE',
    source:Object.freeze({
      repository:'GeorgePlattDemo/scan-to-build-store',
      storePin:'9c62d9d6f7775deef83d47196d32c9b5174a352c',
      pricingFile:'store-zero-pricing-engine.mjs',
      travelFile:'d001-travel-standard.mjs',
      governingStandard:'DIMENSIONAL-STORE-TRAVEL-STANDARD-0.1.md',
      workflowRun:null,
      systemIntegrationPin:null
    }),
    demand:Object.freeze({
      configurationId:'SYO-USER1-XBRACE',
      configurationVersion:'0.2',
      materialDemand:Object.freeze({species:'syp-treated',form:'board',nominalT:2,nominalW:4}),
      definedWorkpieceLengthIn:60,
      partQty:2,
      partLengthIn:18,
      sawAngleDeg:26.387799961242997,
      cutPlane:'miter-face',
      endIdentity:'both',
      endRelation:'parallel',
      lengthDatum:'long-long-outer-edge',
      datumCMethod:'REFERENCE_CUT',
      requiredOps:Object.freeze(['MITER_LIMITED','SPOT_ON_LOCATION']),
      spotMode:'SPOT_ON_LOCATION',
      spotLocationRule:'CENTERED_ON_PART',
      spotAcrossWidthRule:'CENTERED_ON_WIDE_FACE',
      spotXIn:9,
      declaredSawCuts:3,
      declaredSpotCount:2
    }),
    materialResolution:Object.freeze({
      status:'MAPPED',
      storeSku:'STB-ZERO-PTAG-2X4-72-001',
      pricingReferenceSku:'STB-ZERO-PTAG-2X4-72-001',
      pricingReferenceStockLengthIn:72,
      requestedMinimumWorkpieceLengthIn:60,
      requestedDefinedWorkpieceLengthIn:60,
      workpieceLengthIn:72,
      selectionPolicy:'SHORTEST_COMPLETE_STORE_OFFERING',
      consideredCandidates:Object.freeze([
        Object.freeze({storeSku:'STB-ZERO-PTAG-2X4-72-001',stockLengthIn:72,candidateStatus:'SUPPORTABLE',reason:null})
      ]),
      quantity:1,
      stockLengthIn:72,
      unitPrice:5.15,
      materialTotal:5.15,
      allocationClaimed:false,
      cellFamily:Object.freeze(['D-001']),
      supportedOps:Object.freeze(['CROSSCUT','MITER_LIMITED','SPOT_ON_LOCATION']),
      source:Object.freeze({
        repository:'GeorgePlattDemo/scan-to-build-store',
        file:'store-zero-catalog.json',
        pin:'9c62d9d6f7775deef83d47196d32c9b5174a352c',
        clock:'2026-09-10'
      })
    }),
    estimate:Object.freeze({
      status:'BUDGETARY_ESTIMATE',
      complete:true,
      completeness:'COMPLETE_FOR_TRAVEL_STANDARD',
      documentKind:'BudgetaryEstimate',
      engine:Object.freeze({
        id:'STB-STORE-ZERO-PRICE-1',
        version:'0.3.0',
        clock:'2026-09-22',
        documentKind:'BudgetaryEstimate'
      }),
      cycle:Object.freeze({
        model:'STB-D001-DIMENSIONAL-TRAVEL-0.1',
        version:'0.2.0',
        basis:'DECLARED_STAGE2_MODEL',
        measured:false,
        commissioned:false,
        T_job_min:1.425
      }),
      totals:Object.freeze({
        material:5.15,
        hardware:0,
        machine_service:5.94,
        Q:11.09,
        Q_basis:'CALCULATED_FROM_DECLARED_STAGE2_MODEL'
      }),
      travel:Object.freeze({
        derivedSawCuts:3,
        derivedSpotCount:2,
        finalRemainderIn:35.625
      }),
      economics:Object.freeze({
        id:'STB-D001-STORE-ECONOMICS-S2-0.1',
        version:'0.1.0',
        basis:'DECLARED_STAGE2_MODEL',
        measured:false,
        forecastProductiveHours:600,
        annualCostPoolUsd:120000,
        targetGrossMargin:0.20,
        breakEvenPerHour:200,
        sellRatePerHour:250,
        setupCharge:0,
        setupTimeMin:0
      }),
      calculationIdentity:Object.freeze({
        inputHash:'30b6c02b11db30cf100be72ea4696c03b8ed7d2f217979c53cdae6ce73325e91',
        resultHash:'de1e0e0bdf0f77a6c5ea205191765ba0b846472fc0813fe71d9ddf28fd176333'
      })
    })
  });

  var USER1_STORE_REFERENCES = Object.freeze([USER1_STORE_REFERENCE,USER1_STORE_REFERENCE_18,USER1_STORE_REFERENCE_SYP,USER1_STORE_REFERENCE_SYP_18]);

  function roundN(value, places){
    var p=Math.pow(10, places == null ? 2 : places);
    return Math.round(Number(value)*p)/p;
  }

  function user1StoreDemandMatchesReference(input,reference){
    input=input || {};
    reference=reference || USER1_STORE_REFERENCE;
    var d=reference.demand;
    var parts=Array.isArray(input.parts)?input.parts:[];
    var ops=Array.isArray(input.requiredOps)?input.requiredOps.slice().sort():[];
    var expectedOps=d.requiredOps.slice().sort();
    var material=input.materialDemand||{};
    if(String(material.species||'')!==d.materialDemand.species) return false;
    if(String(material.form||'')!==d.materialDemand.form) return false;
    if(Number(material.nominalT)!==d.materialDemand.nominalT || Number(material.nominalW)!==d.materialDemand.nominalW) return false;
    if(String(input.configurationId||'')!==d.configurationId) return false;
    if(String(input.configurationVersion||'')!==d.configurationVersion) return false;
    if(Number(input.definedWorkpieceLengthIn)!==d.definedWorkpieceLengthIn) return false;
    if(Math.abs(Number(input.sawAngleDeg)-Number(d.sawAngleDeg))>1e-9) return false;
    if(String(input.cutPlane||'')!==d.cutPlane) return false;
    if(String(input.endIdentity||'')!==d.endIdentity) return false;
    if(String(input.endRelation||'')!==d.endRelation) return false;
    if(String(input.lengthDatum||'')!==d.lengthDatum) return false;
    if(String(input.datumCMethod||'')!==d.datumCMethod) return false;
    if(Number(input.declaredSawCuts)!==d.declaredSawCuts) return false;
    if(Number(input.declaredSpotCount)!==d.declaredSpotCount) return false;
    if(ops.join('|')!==expectedOps.join('|')) return false;
    if(parts.length!==2) return false;
    for(var i=0;i<parts.length;i++){
      var part=parts[i]||{};
      var features=Array.isArray(part.features)?part.features:[];
      if(String(part.partId||'')!=='PART-'+(i+1)) return false;
      if(Number(part.lengthIn)!==d.partLengthIn) return false;
      if(features.length!==1) return false;
      var feature=features[0]||{};
      if(String(feature.kind||'')!==d.spotMode) return false;
      if(Number(feature.xIn)!==d.spotXIn) return false;
      if(String(feature.locationRule||'')!==d.spotLocationRule) return false;
      if(String(feature.acrossWidthRule||'')!==d.spotAcrossWidthRule) return false;
    }
    return true;
  }

  function user1StoreReferenceForDemand(input){
    for(var i=0;i<USER1_STORE_REFERENCES.length;i++){
      if(user1StoreDemandMatchesReference(input,USER1_STORE_REFERENCES[i])) return USER1_STORE_REFERENCES[i];
    }
    return null;
  }

  function unresolvedUser1StoreAnswer(status, codes, reason, receipt){
    return Object.freeze({
      status:status,
      complete:false,
      freshEvaluation:false,
      capabilityStatus:'UNRESOLVED',
      economicsStatus:'UNRESOLVED',
      priceCompleteness:'UNAVAILABLE',
      material:null,
      machineService:null,
      combinedValue:null,
      estimate:null,
      calculationIdentity:null,
      materialResolution:null,
      refusalConditions:Object.freeze([]),
      unresolvedConditions:Object.freeze((codes || []).slice()),
      source:USER1_STORE_REFERENCE.source,
      evaluationReceipt:receipt || null,
      reason:reason
    });
  }

  function resolveUser1StoreReference(input){
    var reference=user1StoreReferenceForDemand(input);
    var specimen=reference ? {
      role:'EXPLANATORY_HISTORY',
      suppliesCurrentAnswer:false,
      partLengthIn:reference.demand.partLengthIn,
      species:reference.demand.materialDemand.species,
      q:reference.estimate.totals.Q
    } : null;
    if(!reference){
      return unresolvedUser1StoreAnswer(
        'STORE_ANSWER_REQUIRED',
        ['STORE_ANSWER_REQUIRED'],
        'No current answer is stored in the browser. Confirm asks the Store.',
        null
      );
    }
    return Object.freeze({
      status:'HISTORICAL_SPECIMEN',
      complete:false,
      freshEvaluation:false,
      capabilityStatus:'NOT_A_CURRENT_ANSWER',
      economicsStatus:'HISTORICAL_ONLY',
      priceCompleteness:'NOT_A_CURRENT_ANSWER',
      material:null,
      machineService:null,
      combinedValue:null,
      estimate:null,
      calculationIdentity:null,
      materialResolution:null,
      refusalConditions:Object.freeze([]),
      unresolvedConditions:Object.freeze(['HISTORICAL_SPECIMEN_IS_NOT_A_CURRENT_ANSWER']),
      source:null,
      evaluationReceipt:null,
      historicalSpecimen:Object.freeze(specimen)
    });
  }

  function storeAuthority(key){
    return STORE_AUTHORITIES[key] || null;
  }

  function clone(value){
    return value == null ? value : JSON.parse(JSON.stringify(value));
  }

  function freezeCopy(value){
    var copy = clone(value);
    if(copy && typeof copy === 'object') Object.freeze(copy);
    return copy;
  }

  function comparisonDemand(part){
    if(!part) return null;
    var operations=[
      Object.freeze({kind:'STRAIGHT_CUT', required:part.straightCut !== false}),
      Object.freeze({
        kind:'ANGLED_CUT',
        endCondition:String(part.endCondition || ''),
        angleDegrees:Number(part.angleDegrees),
        angleReference:String(part.angleReference || ''),
        cutPlane:String(part.cutPlane || ''),
        endIdentity:String(part.endIdentity || ''),
        endRelation:String(part.endRelation || ''),
        lengthDatum:String(part.lengthDatum || '')
      })
    ];
    var spot=part.spotDemand && typeof part.spotDemand==='object' ? part.spotDemand : null;
    if(spot && spot.required!==false){
      operations.push(Object.freeze({
        kind:'SPOT_ON_LOCATION',
        mode:String(spot.mode || 'SPOT_ON_LOCATION'),
        required:true,
        countPerPart:Number.isFinite(Number(spot.countPerPart)) ? Number(spot.countPerPart) : null,
        locationRule:String(spot.locationRule || ''),
        locationAlongLengthIn:spot.locationAlongLengthIn == null ? null : Number(spot.locationAlongLengthIn),
        acrossWidthRule:String(spot.acrossWidthRule || ''),
        derivation:freezeCopy(spot.derivation || null),
        totalCount:Number.isFinite(Number(spot.totalCount)) ? Number(spot.totalCount) : null
      }));
    }
    var geometry={
      finishedLength:Number(part.finishedLength),
      endCondition:String(part.endCondition || ''),
      angleDegrees:Number(part.angleDegrees),
      angleReference:String(part.angleReference || ''),
      cutPlane:String(part.cutPlane || ''),
      endIdentity:String(part.endIdentity || ''),
      endRelation:String(part.endRelation || ''),
      lengthDatum:String(part.lengthDatum || '')
    };
    if(part.parentLengthIn != null && Number.isFinite(Number(part.parentLengthIn))){
      geometry.parentLengthIn=Number(part.parentLengthIn);
    }
    if(part.definedWorkpieceLengthIn != null && Number.isFinite(Number(part.definedWorkpieceLengthIn))){
      geometry.definedWorkpieceLengthIn=Number(part.definedWorkpieceLengthIn);
    }
    if(spot) geometry.spotDemand=freezeCopy(spot);
    if(part.datumCMethod) geometry.datumCMethod=String(part.datumCMethod);
    if(Array.isArray(part.requiredOps)) geometry.requiredOps=freezeCopy(part.requiredOps);
    if(Number.isFinite(Number(part.declaredSawCuts))) geometry.declaredSawCuts=Number(part.declaredSawCuts);
    if(Number.isFinite(Number(part.declaredSpotCount))) geometry.declaredSpotCount=Number(part.declaredSpotCount);
    if(Array.isArray(part.parts)) geometry.identifiedParts=freezeCopy(part.parts);
    return Object.freeze({
      materialDemand: Object.freeze({stockClass:String(part.stockClass || '')}),
      operationDemand: Object.freeze(operations),
      quantity:Number(part.quantity),
      requiredGeometryDatumFacts:Object.freeze(geometry)
    });
  }

  function createComparisonHandoff(input){
    input = input || {};
    var demand = comparisonDemand(input.physicalDemand);
    if(!demand) throw new Error('physicalDemand is required');
    if(!input.projectId) throw new Error('projectId is required');
    if(!input.definitionId) throw new Error('definitionId is required');
    return Object.freeze({
      protocol:'stb.store-handoff/0.1',
      actorOrder:ACTOR_ORDER,
      projectId:String(input.projectId),
      projectClass:String(input.projectClass || ''),
      definitionId:String(input.definitionId),
      versionId:String(input.versionId || input.definitionId),
      materialDemand:demand.materialDemand,
      operationDemand:demand.operationDemand,
      quantity:demand.quantity,
      requiredGeometryDatumFacts:demand.requiredGeometryDatumFacts,
      sourceAuthority:freezeCopy(input.sourceAuthority || null),
      unresolvedConditions:Object.freeze((input.unresolvedConditions || []).map(String)),
      requestedServices:Object.freeze((input.requestedServices || [
        'material-answer',
        'capability-answer',
        'economics',
        'availability-timing',
        'services'
      ]).map(String)),
      authority:Object.freeze({
        commercial:false,
        productionRelease:false,
        machineReadiness:false,
        cycleStart:false,
        physicalFabrication:false
      })
    });
  }

  function stable(value){
    if(Array.isArray(value)) return '['+value.map(stable).join(',')+']';
    if(value && typeof value === 'object'){
      return '{'+Object.keys(value).sort().map(function(key){
        return JSON.stringify(key)+':'+stable(value[key]);
      }).join(',')+'}';
    }
    return JSON.stringify(value);
  }

  function storeDemandIdentity(handoff){
    if(!handoff) return null;
    return stable({
      materialDemand:handoff.materialDemand,
      operationDemand:handoff.operationDemand,
      quantity:handoff.quantity,
      requiredGeometryDatumFacts:handoff.requiredGeometryDatumFacts,
      requestedServices:handoff.requestedServices
    });
  }

  function sameStoreDemand(a,b){
    var left=storeDemandIdentity(a), right=storeDemandIdentity(b);
    return !!left && left===right;
  }

  root.STBStoreHandoffContract = Object.freeze({
    version:'0.9',
    actorOrder:ACTOR_ORDER,
    currentArtifacts:CURRENT_ARTIFACTS,
    storeAuthorities:STORE_AUTHORITIES,
    storeAuthority:storeAuthority,
    startOwnStoreCatalog:START_OWN_STORE_CATALOG,

    user1StoreReference:USER1_STORE_REFERENCE,
    user1StoreReferences:USER1_STORE_REFERENCES,
    user1StoreReferenceForDemand:user1StoreReferenceForDemand,
    user1StoreDemandMatchesReference:user1StoreDemandMatchesReference,
    resolveUser1StoreReference:resolveUser1StoreReference,
    comparisonDemand:comparisonDemand,
    createComparisonHandoff:createComparisonHandoff,
    storeDemandIdentity:storeDemandIdentity,
    sameStoreDemand:sameStoreDemand
  });
})(window);
