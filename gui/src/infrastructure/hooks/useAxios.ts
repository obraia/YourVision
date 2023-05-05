import { useState, useEffect } from 'react';
import axios from 'axios';

interface IAxiosParams {
  url: string;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  body?: object;
  headers?: object;
}

const useAxios = ({ url, method, body, headers }: IAxiosParams) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setloading] = useState(true);

  const fetchData = () => {
    axios[method](url, headers, body)
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setloading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [method, url, body, headers]);

  return { response, error, loading };
};

export default useAxios;
