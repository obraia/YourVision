import axios from 'axios';

const useAxios = (path = '') => {
  const api = axios.create({
    baseURL: 'api' + path,
    headers: {
      'Content-Type': 'application/json'
    },
  });

  return api;
}

export { useAxios }
