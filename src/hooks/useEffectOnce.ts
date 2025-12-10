import { EffectCallback, useEffect, useRef } from 'react';

// Ensures an effect runs only once per component mount,
// even under React 18 StrictMode double-invocation in development.
export function useEffectOnce(effect: EffectCallback) {
  const ranRef = useRef(false);
  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;
    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
