import { Routes, Route, Navigate } from 'react-router';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';
import { PrivateRoute } from './components/PrivateRoute';
import { Layout } from './components/Layout';
import { useEffect, useState } from 'react';
import { ConfigProvider, theme } from 'antd';

export const App = () => {
   const [darkMode, setDarkMode] = useState<boolean>(false);

   useEffect(() => {
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
   }, [darkMode]);

   return (
      <ConfigProvider
         theme={{ algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}
      >
         <div>
            <button onClick={() => setDarkMode(!darkMode)}>
               {darkMode ? 'Светлая тема' : 'Тёмная тема'}
            </button>
         </div>
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
      </ConfigProvider>
   );
};
