import { useAppSelector } from '../hooks/useApp';

export const UsersPage = () => {
   const users = useAppSelector(state => state.users.usersList);

   return (
      <div className="space-y-4">
         <h2 className="text-xl font-semibold">Users</h2>
         {users.length ? (
            <p className="text-gray-500"> List of users empty.</p>
         ) : (
            <table>
               <thead>
                  <tr className='bg-gray-100'>
                     <th className='border px-4 py-2'>Name</th>
                     <th className='border px-4 py-2'>Age</th>
                     <th className='border px-4 py-2'>Created At</th>
                  </tr>
               </thead>
               <tbody>
                  {users.map((user) => (
                  <tr key={user.id} className='text-center'>
                     <td className='border px-4 py-2'>{user.name}</td>
                     <td className='border px-4 py-2'>{user.age}</td>
                     <td className='border px-4 py-2'>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                  ))}
               </tbody>
            </table>
         )}
      </div>
   );
};
