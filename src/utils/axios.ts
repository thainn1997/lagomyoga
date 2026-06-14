import axios, { AxiosRequestConfig } from 'axios';

import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: HOST_API,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.response.use((response) => response.data);

axiosInstance.interceptors.request.use((config: any) => {
  const token = window?.localStorage?.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/users/me',
    login: '/auth/login',
    refresh: '/auth/refresh',
    register: '/api/auth/register',
  },
  post: {
    list: '/posts',
    details: '/posts/:title',
    latest: '/posts/latest',
    search: '/posts?search=:title',
  },
};
