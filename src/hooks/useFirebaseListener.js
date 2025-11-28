import {useEffect, useRef, useState} from 'react';

/**
 * Custom hook for managing Firebase real-time listeners
 * Automatically handles cleanup to prevent memory leaks
 * 
 * @param {Function} subscribeFunction - Function that returns an unsubscribe function
 * @param {Array} dependencies - Dependencies array for useEffect
 * @param {Object} options - Options object
 * @returns {Object} - Object with data, loading, and error states
 */
export const useFirebaseListener = (
  subscribeFunction,
  dependencies = [],
  options = {},
) => {
  const {
    initialData = null,
    onError = null,
    enabled = true,
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const unsubscribeRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      unsubscribeRef.current = subscribeFunction((newData) => {
        if (isMountedRef.current) {
          setData(newData);
          setLoading(false);
          setError(null);
        }
      }, (err) => {
        if (isMountedRef.current) {
          setError(err);
          setLoading(false);
          if (onError) onError(err);
        }
      });
    } catch (err) {
      if (isMountedRef.current) {
        setError(err);
        setLoading(false);
        if (onError) onError(err);
      }
    }

    return () => {
      isMountedRef.current = false;
      if (unsubscribeRef.current && typeof unsubscribeRef.current === 'function') {
        try {
          unsubscribeRef.current();
        } catch (err) {
          console.error('Error unsubscribing from Firebase listener:', err);
        }
      }
    };
  }, dependencies);

  return {data, loading, error};
};

/**
 * Custom hook for managing multiple Firebase listeners
 * @param {Array} listeners - Array of listener configurations
 * @returns {Object} - Object with combined states
 */
export const useMultipleFirebaseListeners = (listeners = []) => {
  const [states, setStates] = useState(
    listeners.map(() => ({data: null, loading: true, error: null}))
  );
  const unsubscribesRef = useRef([]);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    listeners.forEach((listener, index) => {
      const {subscribeFunction, enabled = true} = listener;

      if (!enabled) {
        setStates(prev => {
          const newStates = [...prev];
          newStates[index] = {data: null, loading: false, error: null};
          return newStates;
        });
        return;
      }

      try {
        unsubscribesRef.current[index] = subscribeFunction(
          (newData) => {
            if (isMountedRef.current) {
              setStates(prev => {
                const newStates = [...prev];
                newStates[index] = {data: newData, loading: false, error: null};
                return newStates;
              });
            }
          },
          (err) => {
            if (isMountedRef.current) {
              setStates(prev => {
                const newStates = [...prev];
                newStates[index] = {data: null, loading: false, error: err};
                return newStates;
              });
            }
          }
        );
      } catch (err) {
        if (isMountedRef.current) {
          setStates(prev => {
            const newStates = [...prev];
            newStates[index] = {data: null, loading: false, error: err};
            return newStates;
          });
        }
      }
    });

    return () => {
      isMountedRef.current = false;
      unsubscribesRef.current.forEach(unsubscribe => {
        if (unsubscribe && typeof unsubscribe === 'function') {
          try {
            unsubscribe();
          } catch (err) {
            console.error('Error unsubscribing from Firebase listener:', err);
          }
        }
      });
      unsubscribesRef.current = [];
    };
  }, []);

  return states;
};

export default useFirebaseListener;
