import { useNavigate } from 'react-router';
import { login } from '../features/auth/authSlice';
import { useAppDispatch } from '../hooks/useApp';

export const LoginPage = () => {
   const dispatch = useAppDispatch();
   const navigate = useNavigate();

   const handleLogin = () => {
      dispatch(login());
      navigate('/dashboard');
   };

   return (
      <div className="p-4 text-center">
         <h2 className="text-2xl mb-4">Login Page</h2>
         <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleLogin}
         >
            Login
         </button>
      </div>
   );
};
