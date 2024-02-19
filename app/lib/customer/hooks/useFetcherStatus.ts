import {useEffect, useMemo, useRef, useState} from 'react';

interface FetcherStatusProps {
  fetcherErrors?: string[] | null;
  state?: 'idle' | 'submitting' | 'loading' | undefined;
}

export function useFetcherStatus({
  fetcherErrors = [],
  state = 'idle',
}: FetcherStatusProps) {
  const stateRef = useRef('idle');

  const [errors, setErrors] = useState<string[]>([]);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [success, setSuccess] = useState(false);

  const status = useMemo(() => {
    return {
      started,
      finished,
      success,
    };
  }, [started, finished, success]);

  useEffect(() => {
    const actionComplete =
      (stateRef.current === 'submitting' || stateRef.current === 'loading') &&
      state === 'idle';

    setStarted(state === 'submitting' || state === 'loading');
    setFinished(actionComplete);
    setSuccess(
      actionComplete && (!fetcherErrors || fetcherErrors.length === 0),
    );

    if (fetcherErrors?.length) {
      setErrors(fetcherErrors);
    }

    stateRef.current = state;
  }, [state, fetcherErrors?.length]);

  useEffect(() => {
    return () => {
      setErrors([]);
      setStarted(false);
      setFinished(false);
      setSuccess(false);
      stateRef.current = 'idle';
    };
  }, []);

  return {errors, setErrors, status};
}
