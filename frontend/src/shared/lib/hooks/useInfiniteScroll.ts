import { useEffect, useRef, type RefObject } from 'react';

type InfiniteScrollOptions = {
  hasMore: boolean;
  isLoading: boolean;
  rootMargin?: string;
};

export function useInfiniteScroll(
  callback: () => void,
  { hasMore, isLoading, rootMargin = '300px' }: InfiniteScrollOptions
): RefObject<HTMLDivElement | null> {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const element = sentinelRef.current;
    if (!element || isLoading || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          callback();
        }
      },
      {
        rootMargin,
      }
    );

    observer.observe(element);
    return (): void => observer.disconnect();
  }, [hasMore, isLoading, rootMargin]);
  return sentinelRef;
}
