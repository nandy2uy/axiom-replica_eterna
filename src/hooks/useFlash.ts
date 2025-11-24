import { useState, useEffect, useRef } from 'react';

export const useFlash = (value: number) => {
  const [flash, setFlash] = useState<'green' | 'red' | null>(null);
  const prevValue = useRef(value);

  useEffect(() => {
    if (value > prevValue.current) {
      setFlash('green');
    } else if (value < prevValue.current) {
      setFlash('red');
    }

    prevValue.current = value;

    // Remove flash after 300ms
    const timeout = setTimeout(() => setFlash(null), 300);
    return () => clearTimeout(timeout);
  }, [value]);

  return flash;
};