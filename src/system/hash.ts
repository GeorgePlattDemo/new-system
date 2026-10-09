import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils.js";

/**
 * Store Zero's published calculation canonicalization.
 * System uses it only to verify a receipt or demand hash the Store already made.
 * It is not a pricing function and it does not invent a second canonical form.
 * Same rule as the Store candidate: sorted object keys, JSON scalars, no whitespace.
 */
function stable(value: unknown): string {
  if (Array.isArray(value)) return "[" + value.map((item) => stable(item)).join(",") + "]";
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return (
      "{" +
      Object.keys(record)
        .sort()
        .map((key) => JSON.stringify(key) + ":" + stable(record[key]))
        .join(",") +
      "}"
    );
  }
  return JSON.stringify(value);
}

function hexSha256(text: string): string {
  return bytesToHex(sha256(utf8ToBytes(text)));
}

export function calculationHash(value: unknown): string {
  return hexSha256(stable(value));
}

/** SHA-256 of the exact bytes that will be, or were, put on the wire. */
export function sha256Bytes(bytes: string): string {
  return hexSha256(bytes);
}
