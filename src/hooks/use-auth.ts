import useSWR from 'swr';

export function useAuth(options?: any) {
  const { data: profile, error, mutate } = useSWR('/users/me?fields=*.*');

  async function login() {
    await mutate();
  }
  async function logout() {
    await mutate(null as any, false);
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    } catch (error1) {
      console.log(error1);
    }
  }
  const firstLoading = profile === undefined && error === undefined;

  const profileObj = profile?.data?.data || {};

  return {
    isLogin: firstLoading ? null : !!profile,
    profile: { ...profileObj, roleName: profileObj.role?.name || '' },
    role: profile?.role?.name,
    error,
    login,
    logout,
    getProfile: mutate,
    firstLoading,
    data: profile,
  };
}
