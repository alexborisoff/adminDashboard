import { Routes, Route, Navigate } from 'react-router';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';
import { PrivateRoute } from './components/PrivateRoute';

export const App = () => {
   return (
      <Routes>
         <Route path="/login" element={<LoginPage />} />
         <Route
            path="/dashboard"
            element={
               <PrivateRoute>
                  <DashboardPage />
               </PrivateRoute>
            }
         />
         <Route
            path="/users"
            element={
               <PrivateRoute>
                  <UsersPage />
               </PrivateRoute>
            }
         />
         <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
   );
};
