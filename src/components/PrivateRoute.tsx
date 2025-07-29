import type { JSX } from 'react';
import { useAppSelector } from '../hooks/useApp';
import { Navigate } from 'react-router';

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
   const isAuth = useAppSelector(state => state.auth.isAuthenticated);
   return isAuth ? children : <Navigate to="/login" replace />;
};
