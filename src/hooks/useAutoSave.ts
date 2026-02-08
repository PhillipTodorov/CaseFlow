import { useEffect, useRef, useState } from "react";
import { saveDraft } from "../utils/storage";

export function useAutoSave(
  data: Record<string, unknown>,
  intervalMs: number = 5000
) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const dataRef = useRef(data);
  const previousDataRef = useRef<string>("");

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    const timer = setInterval(() => {
      const currentData = JSON.stringify(dataRef.current);
      if (
        currentData !== previousDataRef.current &&
        Object.keys(dataRef.current).length > 0
      ) {
        setIsSaving(true);
        saveDraft(dataRef.current);
        previousDataRef.current = currentData;
        setLastSaved(new Date());
        setTimeout(() => setIsSaving(false), 500);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs]);

  return { lastSaved, isSaving };
}
