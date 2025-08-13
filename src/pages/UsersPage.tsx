import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useApp';
import { addUser, updateUser, deleteUser, type User } from '../features/users/usersSlice';
import { Button, Form, Input, message, Modal, Space, Table } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

export const UsersPage = () => {
   const users = useAppSelector(state => state.users.usersList);
   const dispatch = useAppDispatch();

   const [name, setName] = useState<string>('');
   const [age, setAge] = useState<string>('');

   const [isModalEditable, setIsModalEditable] = useState<boolean>(false);
   const [editUserId, setEditUserId] = useState<string | null>(null);
   const [editName, setEditName] = useState<string>('');
   const [editAge, setEditAge] = useState<number>(0);
   const [editCreatedAt, setEditCreatedAt] = useState<string>('');

   const handleAddUser = () => {
      const ageNum = Number(age);
      if (name && age && !isNaN(ageNum) && ageNum >= 0 && ageNum <= 100 && /^[^\d]+$/.test(name)) {
         dispatch(addUser({ name, age: ageNum }));
         setName('');
         setAge('');
      }
   };

   const handleDeleteUser = (id: string) => {
      dispatch(deleteUser(id));
      alert('User was deleted');
   };

   const handleEdit = (record: User) => {
      setEditUserId(record.id);
      setEditName(record.name);
      setEditAge(record.age);
      setEditCreatedAt(record.createdAt);
      setIsModalEditable(true);
   };

   const handleUpdateUser = () => {
      const ageNum = +editAge;
      if (!editName || isNaN(ageNum) || ageNum < 0 || ageNum > 100 || /\d/.test(editName)) {
         message.error('Please enter valid name/age');
         return;
      }
      if (editUserId) {
         dispatch(
            updateUser({ id: editUserId, name: editName, age: ageNum, createdAt: editCreatedAt })
         );
         message.success('User was updated!');
         setIsModalEditable(false);
         setEditUserId(null);
         setEditName('');
         setEditAge(0);
      }
   };

   const columns: ColumnsType<(typeof users)[number]> = [
      {
         title: 'Name',
         dataIndex: 'name',
         key: 'name',
         sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
         title: 'Age',
         dataIndex: 'age',
         key: 'age',
         sorter: (a, b) => a.age - b.age,
      },
      {
         title: 'Create At',
         dataIndex: 'createdAt',
         key: 'createAt',
         render: text => new Date(text).toLocaleString(),
         sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      },
      {
         title: 'Actions',
         key: 'actions',
         render: (_, record) => (
            <Space>
               <Button icon={<EditOutlined />} type="link" onClick={() => handleEdit(record)} />
               <Button
                  icon={<DeleteOutlined />}
                  type="link"
                  danger
                  onClick={() => handleDeleteUser(record.id)}
               />
            </Space>
         ),
      },
   ];

   return (
      <div className="space-y-4">
         <h2 className="text-xl font-semibold">Users</h2>

         <div className="space-x-2">
            <input
               type="text"
               value={name}
               onChange={e => setName(e.target.value)}
               placeholder="Name"
               className="border px-2 py-1"
            />
            <input
               type="number"
               value={age}
               onChange={e => setAge(e.target.value)}
               placeholder="Age"
               className="border px-2 py-1"
            />
            <button
               onClick={handleAddUser}
               className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 cursor-pointer"
            >
               Add User
            </button>
         </div>

         <Table columns={columns} dataSource={users} rowKey="id" pagination={false} />

         <Modal
            title="Edit User"
            open={isModalEditable}
            onOk={handleUpdateUser}
            onCancel={() => setIsModalEditable(false)}
            okText="Update"
         >
            <Form layout="vertical">
               <Form.Item label="Name">
                  <Input
                     value={editName}
                     onChange={e => setEditName(e.target.value)}
                     placeholder="Name"
                  />
               </Form.Item>
               <Form.Item label="Age">
                  <Input
                     type="number"
                     value={editAge}
                     onChange={e => setEditAge(+e.target.value)}
                     placeholder="Age"
                  />
               </Form.Item>
            </Form>
         </Modal>
      </div>
   );
};
