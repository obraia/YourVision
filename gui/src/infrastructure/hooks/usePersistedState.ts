import { useState, useEffect, Dispatch, SetStateAction } from 'react';

type Response<T> = [T, Dispatch<SetStateAction<T>>];

export default function usePersistedState<T>(
  key: string,
  initialState: T
): Response<T> {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    async function getItem() {
      const storageValue = localStorage.getItem(key);
      if (storageValue) setState(JSON.parse(storageValue));
    }
    getItem();
  }, []);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}
