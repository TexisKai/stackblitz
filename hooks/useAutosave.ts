import { useEffect, useState } from "react";

export function useAutosave(value: any, onSave: (v: any) => void, delay = 800) {
  const [buffer, setBuffer] = useState(value);

  useEffect(() => setBuffer(value), [value]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (buffer !== value) onSave(buffer);
    }, delay);

    return () => clearTimeout(timeout);
  }, [buffer]);

  return { buffer, setBuffer };
}
