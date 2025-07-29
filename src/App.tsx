import { Routes, Route, Navigate } from 'react-router';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';
import { PrivateRoute } from './components/PrivateRoute';
import { Layout } from './components/Layout';

export const App = () => {
   return (
      <Routes>
         <Route path="/login" element={<LoginPage />} />
         <Route
            path="/"
            element={
               <PrivateRoute>
                  <Layout />
               </PrivateRoute>
            }
         >
            <Route element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
         </Route>
         <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
   );
};
