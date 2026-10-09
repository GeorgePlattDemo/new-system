import { useCallback, useEffect, useRef, useState } from "react";
import { emptyRecord, loadRecord, parkForReopen, type RecordFile } from "@/system/session.ts";

const KEY = "stb-new-system-record-1";

export type BenchState =
  | { ready: false }
  | { ready: true; problem: "MALFORMED" | "UNSUPPORTED_VERSION"; raw: string }
  | { ready: true; problem: null; record: RecordFile };

export function useRecord() {
  const [state, setState] = useState<BenchState>({ ready: false });
  const recordRef = useRef<RecordFile | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const record = emptyRecord();
      recordRef.current = record;
      setState({ ready: true, problem: null, record });
      return;
    }
    try {
      const loaded = loadRecord(JSON.parse(raw));
      if (!loaded.ok) {
        recordRef.current = null;
        setState({ ready: true, problem: loaded.code, raw });
        return;
      }
      const record = parkForReopen(loaded.record);
      recordRef.current = record;
      localStorage.setItem(KEY, JSON.stringify(record));
      setState({ ready: true, problem: null, record });
    } catch {
      recordRef.current = null;
      setState({ ready: true, problem: "MALFORMED", raw });
    }
  }, []);

  const update = useCallback((next: RecordFile | ((current: RecordFile) => RecordFile)) => {
    const prev = recordRef.current;
    if (!prev) return;
    const record = typeof next === "function" ? next(prev) : next;
    recordRef.current = record;
    localStorage.setItem(KEY, JSON.stringify(record));
    setState({ ready: true, problem: null, record });
  }, []);

  return { state, update };
}