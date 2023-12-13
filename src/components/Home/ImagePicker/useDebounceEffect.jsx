import { useEffect } from 'react';

export function useDebounceEffect(fn, waitTime, deps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      fn();
    }, waitTime);

    return () => {
      clearTimeout(timer);
    };
  }, deps);
}
