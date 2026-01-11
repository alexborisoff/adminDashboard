import { useAppDispatch, useAppSelector } from '../hooks/useApp';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { logout } from '../features/auth/authSlice';

export const Layout = () => {
   const dispatch = useAppDispatch();
   const navigate = useNavigate();
   const { user } = useAppSelector(state => state.auth);

   const handleLogout = () => {
      dispatch(logout());
      navigate('/login');
   };

   const navLinkClass = ({ isActive }: { isActive: boolean }) =>
      isActive ? 'text-blue-400 font-semibold' : 'hover:text-blue-400 transition-colors duration-300';

   return (
      <div className="flex h-screen">
         <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
            <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

            {user && (
               <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-300">Current user:</p>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{user.email}</p>
                  <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-600 text-green-400 rounded">
                     {user.role}
                  </span>
               </div>
            )}

            <nav className="flex flex-col space-y-2">
               <NavLink to="/dashboard" className={navLinkClass}>
                  Dashboard
               </NavLink>
               <NavLink to="/users" className={navLinkClass}>
                  Users
               </NavLink>
               <button
                  onClick={handleLogout}
                  className="absolute bottom-4 font-semibold text-red-600 hover:text-red-400 transition-colors duration-500 cursor-pointer "
               >
                  Logout
               </button>
            </nav>
         </aside>
         <main className="flex-1 p-6 overflow-y-auto">
            <header className="mb-4 border-b-2 pb-2">
               <h1 className="text-2xl font-semibold">MotorGroup Inc.</h1>
            </header>
            <Outlet />
         </main>
      </div>
   );
};
