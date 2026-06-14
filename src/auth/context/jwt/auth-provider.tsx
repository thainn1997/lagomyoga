'use client';

import { SWRConfig } from 'swr';
import { useMemo, useEffect, useReducer, useCallback } from 'react';

import axios, { fetcher, endpoints } from 'src/utils/axios';

import { local } from './utils';
import { AuthContext } from './auth-context';
import { AuthUserType, ActionMapType, AuthStateType } from '../../types';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    const data = {
      email,
      password,
    };
    window?.localStorage.removeItem('access_token');
    window?.localStorage.removeItem('refresh_token');
    delete axios.defaults.headers.common.Authorization;

    const res = await axios.post(endpoints.auth.login, data);

    const { access_token, refresh_token } = res.data;

    local(access_token, refresh_token);

    dispatch({
      type: Types.LOGIN,
      payload: {
        user: {
          access_token,
          refresh_token,
        },
      },
    });
  }, []);

  //

  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const access_token = localStorage.getItem('access_token');
      const refresh_token = localStorage.getItem('refresh_token');

      if (access_token) {
        local(access_token, refresh_token);

        const res = await axios.get(endpoints.auth.me);

        dispatch({
          type: Types.INITIAL,
          payload: {
            user: {
              ...res.data,
              access_token,
              refresh_token,
            },
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // REGISTER
  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      const data = {
        email,
        password,
        firstName,
        lastName,
      };

      const res = await axios.post(endpoints.auth.register, data);

      const { access_token } = res.data;

      localStorage.setItem('access_token', access_token);

      dispatch({
        type: Types.REGISTER,
        payload: {
          user: {
            access_token,
          },
        },
      });
    },
    []
  );

  // LOGOUT
  const logout = useCallback(async () => {
    window?.localStorage.removeItem('access_token');
    window?.localStorage.removeItem('refresh_token');
    delete axios.defaults.headers.common.Authorization;

    local(null, null);
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status]
  );

  return (
    <SWRConfig value={{ fetcher, revalidateIfStale: false }}>
      <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>
    </SWRConfig>
  );
}
