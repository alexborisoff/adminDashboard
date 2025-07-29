import { useAppDispatch } from '../hooks/useApp';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { logout } from '../features/auth/authSlice';

export const Layout = () => {
   const dispatch = useAppDispatch();
   const navigate = useNavigate();

   const handleLogout = () => {
      dispatch(logout());
      navigate('/login');
   };

   const navLinkClass = ({ isActive }: { isActive: boolean }) =>
      isActive ? 'text-blue-400 font-semibold' : 'hover:text-blue-400';

   return (
      <div className="flex h-screen">
         <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
            <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
            <nav className="flex flex-col space-y-2">
               <NavLink to="/dashboard" className={navLinkClass}>
                  Dashboard
               </NavLink>
               <NavLink to="/users" className={navLinkClass}>
                  Users
               </NavLink>
               <button onClick={handleLogout} className="text-left hover:text-red-400">
                  Logout
               </button>
            </nav>
         </aside>
         <main className="flex-1 p-6 overflow-y-auto">
            <header className="mb-4 border-b pb-2">
               <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
            </header>
            <Outlet />
         </main>
      </div>
   );
};
