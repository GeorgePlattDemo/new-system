import { useCallback, useEffect, useRef, useState } from "react";
import { emptyRecord, loadRecord, parkForReopen, type RecordFile } from "@/system/session.ts";

const KEY = "stb-new-system-record-1";

export type BenchState =
  | { ready: false }
  | { ready: true; problem: "MALFORMED" | "UNSUPPORTED_VERSION"; raw: string; storageError: string | null }
  | { ready: true; problem: null; record: RecordFile; storageError: string | null };

function storageMessage(error: unknown): string {
  return error instanceof Error ? error.message : "The saved file could not be written.";
}

export function useRecord() {
  const [state, setState] = useState<BenchState>({ ready: false });
  const recordRef = useRef<RecordFile | null>(null);
  const rawRef = useRef<string>("");

  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(KEY);
    } catch (error) {
      rawRef.current = "";
      setState({ ready: true, problem: "MALFORMED", raw: "", storageError: storageMessage(error) });
      return;
    }
    if (!raw) {
      const record = emptyRecord();
      recordRef.current = record;
      setState({ ready: true, problem: null, record, storageError: null });
      return;
    }
    rawRef.current = raw;
    try {
      const loaded = loadRecord(JSON.parse(raw));
      if (!loaded.ok) {
        recordRef.current = null;
        setState({ ready: true, problem: loaded.code, raw, storageError: null });
        return;
      }
      const record = parkForReopen(loaded.record);
      recordRef.current = record;
      let storageError: string | null = null;
      try {
        localStorage.setItem(KEY, JSON.stringify(record));
      } catch (error) {
        storageError = storageMessage(error);
      }
      setState({ ready: true, problem: null, record, storageError });
    } catch {
      recordRef.current = null;
      setState({ ready: true, problem: "MALFORMED", raw, storageError: null });
    }
  }, []);

  const update = useCallback((next: RecordFile | ((current: RecordFile) => RecordFile)) => {
    const prev = recordRef.current;
    if (!prev) return;
    const record = typeof next === "function" ? next(prev) : next;
    recordRef.current = record;
    let storageError: string | null = null;
    try {
      localStorage.setItem(KEY, JSON.stringify(record));
    } catch (error) {
      storageError = storageMessage(error);
    }
    setState({ ready: true, problem: null, record, storageError });
  }, []);

  const replaceWithEmpty = useCallback(() => {
    const record = emptyRecord();
    try {
      localStorage.setItem(KEY, JSON.stringify(record));
    } catch (error) {
      setState((current) => (current.ready ? { ...current, storageError: storageMessage(error) } : current));
      return;
    }
    recordRef.current = record;
    rawRef.current = "";
    setState({ ready: true, problem: null, record, storageError: null });
  }, []);

  const savedText = useCallback(() => {
    if (state.ready && state.problem) return state.raw;
    if (recordRef.current) return JSON.stringify(recordRef.current, null, 2);
    return rawRef.current;
  }, [state]);

  return { state, update, replaceWithEmpty, savedText };
}
