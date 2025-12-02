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
      <div className="w-screen h-screen flex flex-col items-center justify-center">
         <h2 className="text-xl mb-4">Welcome, push Login button to Log In</h2>
         <button
            className="px-4 py-2 w-[15%] h-[7vh] bg-blue-600 text-white text-xl rounded-3xl hover:bg-blue-700 cursor-pointer"
            onClick={handleLogin}
         >
            Log In
         </button>
      </div>
   );
};
