/** Source vocabulary is evidence, never a registered manufacturing instruction.
 * This is a System-only gate. Store remains the sole authority for stock, tool
 * registration, feasibility, motion, occupied time and Q.
 */
export type SourceEnd = {
  angleDeg: number; endRelation?: string; lengthDatum?: string;
  endPointOrientation?: string; plane?: string; sourceTerm?: unknown;
};
export type EndMeaning = {
  endCut: { angleDeg: number; endRelation: string; lengthDatum: string;
    plane: string; endPointOrientation?: string };
  evidence: { sourceTerm: string|null; interpretation: "GEOMETRY_ESTABLISHED"|"SOURCE_WORDING_NOT_OPERATIVE";
    sourceTermUsedAsAuthority: false };
};
export type EndResolution = { ok: true; value: EndMeaning } |
  { ok: false; code: string; fact: string; sourceTerm: string|null };

/** No natural-language synonym is treated as enough to supply a missing plane. */
export function resolvePlanEnd(source: SourceEnd): EndResolution {
  const sourceTerm = typeof source.sourceTerm === "string" ? source.sourceTerm.trim() || null : null;
  const angle = source.angleDeg;
  if (!Number.isFinite(angle) || angle < 0) return {ok:false,code:"END_ANGLE_NOT_ESTABLISHED",fact:"angleDeg",sourceTerm};
  // A square cut has the pre-existing adopted square-end convention. Angled
  // cuts require separately established facts; never infer these from "bevel".
  if (angle === 0) return {ok:true,value:{
    endCut:{angleDeg:0,endRelation:source.endRelation??"parallel",
      lengthDatum:source.lengthDatum??"long-long-outer-edge",
      plane:source.plane??"miter-face",
      ...(source.endPointOrientation?{endPointOrientation:source.endPointOrientation}:{})},
    evidence:{sourceTerm,interpretation:sourceTerm?"SOURCE_WORDING_NOT_OPERATIVE":"GEOMETRY_ESTABLISHED",sourceTermUsedAsAuthority:false}
  }};
  for (const [key,value] of [["endRelation",source.endRelation],["lengthDatum",source.lengthDatum],["plane",source.plane]] as const)
    if (!value) return {ok:false,code:"ANGLED_END_GEOMETRY_UNRESOLVED",fact:key,sourceTerm};
  if (source.lengthDatum === "long-point-to-short-point" && !source.endPointOrientation)
    return {ok:false,code:"END_POINT_ORIENTATION_UNRESOLVED",fact:"endPointOrientation",sourceTerm};
  return {ok:true,value:{
    endCut:{angleDeg:angle,endRelation:source.endRelation!,
      lengthDatum:source.lengthDatum!,plane:source.plane!,
      ...(source.endPointOrientation?{endPointOrientation:source.endPointOrientation}:{})},
    evidence:{sourceTerm,interpretation:sourceTerm?"SOURCE_WORDING_NOT_OPERATIVE":"GEOMETRY_ESTABLISHED",sourceTermUsedAsAuthority:false}
  }};
}

