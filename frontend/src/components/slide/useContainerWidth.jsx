import { useLayoutEffect, useState, useRef, useCallback } from "react";

const useContainerWidth = (dependencies = []) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const wrapperRef = useRef(null);
  const measureRetryRef = useRef(0);
  const resizeObserverRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const updateContainerWidth = useCallback(() => {
    if (!wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const width = rect.width > 0 ? rect.width - 64 : 0;

    if (width > 0) {
      setContainerWidth(width);
      measureRetryRef.current = 0;
    } else if (measureRetryRef.current < 10) {
      measureRetryRef.current += 1;
      requestAnimationFrame(() => {
        requestAnimationFrame(updateContainerWidth);
      });
    }
  }, []);

  const debouncedUpdate = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      updateContainerWidth();
    }, 300);
  }, [updateContainerWidth]);

  useLayoutEffect(() => {
    const timeouts = [
      setTimeout(updateContainerWidth, 0),
      setTimeout(updateContainerWidth, 100),
    ];

    requestAnimationFrame(() => {
      requestAnimationFrame(updateContainerWidth);
    });

    if (wrapperRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => {
        debouncedUpdate();
      });
      resizeObserverRef.current.observe(wrapperRef.current);
    }

    window.addEventListener("resize", debouncedUpdate);

    return () => {
      timeouts.forEach(clearTimeout);
      window.removeEventListener("resize", debouncedUpdate);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, dependencies);

  return { containerWidth, wrapperRef };
};

export default useContainerWidth;