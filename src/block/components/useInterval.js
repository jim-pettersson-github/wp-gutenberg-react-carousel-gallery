const { useEffect, useRef } = wp.element;

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {
    function handler() {
      savedCallback.current();
    }
    let intervalId = null;
    if (delay > 0) {
      intervalId = setInterval(handler, delay);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
  }, [delay]);
};

export default useInterval;
