import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { toast } from 'sonner';
import { useStore } from '../store/store';

const BASE_URL = 'http://proxy-xinneth-dev.apps.rm3.7wse.p1.openshiftapps.com';

export const apiAuthors = axios.create({ baseURL: `${BASE_URL}/app-authors` });
export const apiBooks = axios.create({ baseURL: `${BASE_URL}/app-books` });
export const apiCustomers = axios.create({ baseURL: `${BASE_URL}/app-customers` });

const setupInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config) => {
    useStore.getState().setLoading(true);
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      useStore.getState().setLoading(false);
      return response;
    },
    (error) => {
      useStore.getState().setLoading(false);
      const message = error.response?.data?.message || error.message || 'Ocurrió un error inesperado';
      useStore.getState().setError(message);
      toast.error(message);
      return Promise.reject(error);
    }
  );
};

setupInterceptors(apiAuthors);
setupInterceptors(apiBooks);
setupInterceptors(apiCustomers);
