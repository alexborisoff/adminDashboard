import type { AuthState } from '../features/auth/authSlice';

export const isTokenValid = (authState: AuthState): boolean => {
   if (!authState.isAuthenticated || !authState.accessToken || !authState.expiresAt) {
      return false;
   }

   const now = Date.now();
   return authState.expiresAt > now;
};

export const getTimeUntilExpiry = (authState: AuthState): number | null => {
   if (!authState.expiresAt) {
      return null;
   }

   const now = Date.now();
   const timeUntilExpiry = authState.expiresAt - now;
   return timeUntilExpiry > 0 ? timeUntilExpiry : 0;
};

export const shouldRefreshToken = (authState: AuthState, thresholdMinutes = 5): boolean => {
   const timeUntilExpiry = getTimeUntilExpiry(authState);
   if (timeUntilExpiry === null) {
      return false;
   }

   const thresholdMs = thresholdMinutes * 60 * 1000;
   return timeUntilExpiry < thresholdMs && timeUntilExpiry > 0;
};
