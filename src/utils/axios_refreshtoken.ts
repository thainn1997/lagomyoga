import axios from 'axios';

// eslint-disable-next-line import/no-mutable-exports
export let isRefreshing = false;
// eslint-disable-next-line import/no-mutable-exports
export let refreshSubscribers = [];
let callbackErrorAuthentication = () => {};

axios.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export const updateIsRefreshing = (value: any) => {
  isRefreshing = value;
};
export const updateRefreshSubscribers = (value: any) => {
  refreshSubscribers = value;
};
const removeLocalStorage = () => {
  window.localStorage.removeItem('access_token');
  window.localStorage.removeItem('refresh_token');
};

export const refreshAccessToken = async () => {
  const refresh_token_old = localStorage.getItem('refresh_token');
  if (!refresh_token_old) {
    removeLocalStorage();
    return null;
  }
  const res: any = await axios
    .post(`${process.env.NEXT_PUBLIC_HOST_API}/auth/refresh`, {
      refresh_token: refresh_token_old,
      mode: 'json',
    })
    .catch((error) => {});

  if (!res) {
    removeLocalStorage();
    return null;
  }
  const { access_token, refresh_token, expires } = res?.data.data || {};
  window.localStorage.setItem('refresh_token', refresh_token);
  window.localStorage.setItem('access_token', access_token);
  localStorage.setItem('expires', expires);
  return access_token;
};

export function subscribeTokenRefresh(cb: any) {
  refreshSubscribers.push(cb as never);
}

export function onRrefreshed(token: any) {
  refreshSubscribers.map((cb: any) => cb(token));
  refreshSubscribers = [];
}

export const constructCallBack = (handle: any) => {
  callbackErrorAuthentication = handle;
};

export async function interceptorError(error: any) {
  // eslint-disable-next-line radix
  const auth_expires_at = parseInt((window.localStorage.getItem('auth_expires_at') as any) || 1);
  const now = new Date().getTime();

  if (error?.response?.status === 401 || error?.response?.status === 403) {
    if (error.response.status === 403 && now < auth_expires_at) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    const retryOrigReq = new Promise((resolve, reject) => {
      subscribeTokenRefresh((token: any) => {
        originalRequest.headers.Authorization = token ? `Bearer ${token}` : '';
        resolve(axios(originalRequest));
      });
    });
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const result: any = await refreshAccessToken();
        if (!result) {
          isRefreshing = false;
          return await Promise.reject(error);
        }
        isRefreshing = false;
        onRrefreshed(result);
      } catch (err) {
        isRefreshing = false;
        callbackErrorAuthentication();
        return Promise.reject(err);
      }
    }
    return retryOrigReq;
  }
  return Promise.reject(error);
}
