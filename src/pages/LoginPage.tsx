import { useNavigate } from 'react-router';
import { useAppDispatch } from '../hooks/useApp';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button, Form, Input, message } from 'antd';
import { login, type User } from '../features/auth/authSlice';
import FormItem from 'antd/es/form/FormItem';

export interface Сredentials {
   email: string;
   password: string;
}

export const LoginPage = () => {
   const dispatch = useAppDispatch();
   const navigate = useNavigate();
   const [loading, setLoading] = useState<boolean>(false);

   const handleLogin = async (credentials: Сredentials) => {
      setLoading(true);
      try {
         const mockUser: User = {
            id: uuidv4(),
            email: credentials.email,
            name: credentials.email.split('@')[0],
            role: 'admin',
         };

         const mockAccessToken = `mock_access_token_${Date.now()}`;
         const mockRefreshToken = `mock_refresh_token_${Date.now()}`;

         dispatch(
            login({
               user: mockUser,
               accessToken: mockAccessToken,
               refreshToken: mockRefreshToken,
               expiresIn: 3600,
            })
         );

         message.success('Successful login!');
         navigate('/dashboard');
      } catch (error) {
         message.error('Failed login. Check credentials.');
         console.error('Login error:', error);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-50">
         <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
            <Form name="login" onFinish={handleLogin} layout="vertical" autoComplete="off">
               <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                     { required: true, message: 'Enter your email' },
                     { type: 'email', message: 'Incorrect email' },
                  ]}
               >
                  <Input placeholder="example@mail.com" size="large" />
               </Form.Item>

               <FormItem
                  label="Password"
                  name="password"
                  rules={[
                     { required: true, message: 'Enter your password' },
                     { min: 8, message: 'Password must be at least 8 characters long' },
                  ]}
               >
                  <Input.Password placeholder="Enter your password..." size="large" />
               </FormItem>

               <Form.Item>
                  <Button type="primary" htmlType="submit" block loading={loading} size="large">
                     Log In
                  </Button>
               </Form.Item>
            </Form>

            <div className="mt-4 text-sm text-gray-500 text-center">©Borisoff Inc.</div>
         </div>
      </div>
   );
};
