import { useCallback, useEffect, useState } from 'react';

export default function useFetch(fetcher) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  const [prevFetcher, setPrevFetcher] = useState(() => fetcher);
  if (prevFetcher !== fetcher) {
    setPrevFetcher(fetcher);
    setError(null);
    setLoading(true);
  }

  useEffect(() => {
    const controller = new AbortController();

    fetcher(controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err);
        setLoading(false);
      });

    return () => controller.abort();
  }, [fetcher, attempt]);

  const retry = useCallback(() => {
    setError(null);
    setLoading(true);
    setAttempt((current) => current + 1);
  }, []);

  return { data, error, loading, retry };
}
