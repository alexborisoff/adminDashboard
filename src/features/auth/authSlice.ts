import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const AUTH_STORAGE_KEY = 'authState';

export type UserRole = 'admin' | 'user' | 'moderator';

export interface User {
   id: string;
   email: string;
   name: string;
   role: UserRole;
}

export interface AuthState {
   isAuthenticated: boolean;
   user: User | null;
   accessToken: string | null;
   refreshToken: string | null;
   expiresAt: number | null;
}

interface LoginPayload {
   user: User;
   accessToken: string;
   refreshToken?: string;
   expiresIn?: number;
}

export const loadAuthFromLocalStorage = (): Partial<AuthState> => {
   try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!data) return {};
      const parsedData = JSON.parse(data);
      const now = Date.now();
      if (parsedData.expiresAt && parsedData.expiresAt < now) {
         localStorage.removeItem(AUTH_STORAGE_KEY);
         return {};
      }
      return parsedData;
   } catch {
      return {};
   }
};

export const saveAuthToLocalStorage = (authState: AuthState) => {
   try {
      const dataToSave = {
         user: authState.user,
         accessToken: authState.accessToken,
         refreshToken: authState.refreshToken,
         expiresAt: authState.expiresAt,
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(dataToSave));
   } catch (error) {
      console.error('Failed to save auth state to local storage:', error);
   }
};

export const clearAuthFromLocalStorage = () => {
   try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
   } catch (error) {
      console.error('Failed to clear auth state from local storage:', error);
   }
};

const savedAuth = loadAuthFromLocalStorage();

const initialState: AuthState = {
   isAuthenticated: !!savedAuth.accessToken,
   user: savedAuth.user || null,
   accessToken: savedAuth.accessToken || null,
   refreshToken: savedAuth.refreshToken || null,
   expiresAt: savedAuth.expiresAt || null,
};

export const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      login: (state, action: PayloadAction<LoginPayload>) => {
         const { user, accessToken, refreshToken, expiresIn = 3600 } = action.payload;
         const expiresAt = Date.now() + expiresIn * 1000;

         state.isAuthenticated = true;
         state.user = user;
         state.accessToken = accessToken;
         state.refreshToken = refreshToken || null;
         state.expiresAt = expiresAt;
      },
      refreshAccessToken: (
         state,
         action: PayloadAction<{ accessToken: string; expiresIn?: number }>
      ) => {
         const { accessToken, expiresIn = 3600 } = action.payload;
         state.accessToken = accessToken;
         state.expiresAt = Date.now() + expiresIn * 1000;
      },
      updatesUser: (state,action:PayloadAction<Partial<User>>) => {
         if (state.user) {
            state.user = {...state.user,...action.payload}
         }
      },
      logout: state => {
         state.isAuthenticated = false;
      },
   },
});

export const { login, refreshAccessToken, updatesUser, logout } = authSlice.actions;
export default authSlice.reducer;
