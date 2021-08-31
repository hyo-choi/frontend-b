import { useState, useEffect, useCallback } from 'react';

const baseOption = {
  root: null,
  threshold: 0.8,
  rootMargin: '0px',
};

const useIntersect = (onIntersect: Function) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const checkIntersect = useCallback(([entry], observer) => {
    if (entry.isIntersecting) {
      onIntersect(entry, observer);
    }
  }, []);
  useEffect(() => {
    let observer: IntersectionObserver;
    if (ref) {
      observer = new IntersectionObserver(checkIntersect, { ...baseOption });
      observer.observe(ref);
    }
    return () => observer && observer.disconnect();
  }, [ref, checkIntersect]);
  return [ref, setRef];
};

export default useIntersect;
