import { useEffect, type ReactNode } from 'react';
import { isTokenValid, shouldRefreshToken } from '../utils/authUtils';
import { useAppDispatch, useAppSelector } from '../hooks/useApp';
import { Navigate } from 'react-router';
import { logout } from '../features/auth/authSlice';

interface PrivateRouteProps {
   children: ReactNode;
   requiredRole?: 'admin' | 'user' | 'moderator';
}

export const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
   const dispatch = useAppDispatch();
   const authState = useAppSelector(state => state.auth);

   useEffect(() => {
      if (!isTokenValid(authState)) {
         dispatch(logout());
         return;
      }

      if (shouldRefreshToken(authState, 5)) {
         console.warn('Токен скоро истечет. Рекомендуется обновление сессии!');
      }
   }, [authState, dispatch]);

   if (!isTokenValid(authState) || !authState.user) {
      return <Navigate to="/login" replace />;
   }

   if (requiredRole && authState.user.role !== requiredRole && authState.user.role !== 'admin') {
      return <Navigate to="/dashboard" replace />;
   }

   return <>{children}</>;
};
