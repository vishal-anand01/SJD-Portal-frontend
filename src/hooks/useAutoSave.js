// Path: frontend/src/hooks/useAutoSave.js
import { useRef } from "react";

/**
 * returns a function triggerSave(value) that debounces calls and calls asyncFn(value)
 * @param {function} asyncFn - async function receiving value
 * @param {number} delay - debounce ms
 */
const useAutoSave = (asyncFn, delay = 1000) => {
  const timer = useRef(null);
  const lastPromise = useRef(null);

  const trigger = (value) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      lastPromise.current = asyncFn(value);
      try {
        await lastPromise.current;
      } catch (err) {
        // swallow; caller handles
      }
    }, delay);
  };

  return trigger;
};

export default useAutoSave;
