import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useApp';
import { addUser, updateUser, deleteUser, type User } from '../features/users/usersSlice';
import { Button, Form, Input, message, Modal, Space, Table } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { exportToCSV, exportToExcel } from '../utils/exportUtils';

export const UsersPage = () => {
   const users = useAppSelector(state => state.users.usersList);
   const dispatch = useAppDispatch();

   const [name, setName] = useState<string>('');
   const [age, setAge] = useState<string>('');
   const [searchField, setSearchField] = useState<string>('');

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

   const uniqueAge = Array.from(new Set(users.map(unique => unique.age))).sort((a, b) => a - b);

   const filtredUsers = users.filter(user => {
      const search = searchField.toLowerCase();
      return (
         user.name.toLowerCase().includes(search) ||
         user.age.toString().includes(search) ||
         new Date(user.createdAt).toLocaleDateString().includes(search)
      );
   });

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
         filters: uniqueAge.map(age => ({ text: age.toString(), value: age })),
         onFilter: (value, record) => record.age === value,
      },
      {
         title: 'Created At',
         dataIndex: 'createdAt',
         key: 'createdAt',
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
               value={searchField}
               onChange={e => setSearchField(e.target.value)}
               placeholder="Search users..."
               className="border-b-3 max-w-xs focus:border-b-1 focus:outline-0"
            />
            <input
               type="text"
               value={name}
               onChange={e => setName(e.target.value)}
               placeholder="Name"
               className="border px-2 py-1 focus:outline-0 rounded-lg"
            />
            <input
               type="number"
               value={age}
               onChange={e => setAge(e.target.value)}
               placeholder="Age"
               className="border px-2 py-1 focus:outline-0 rounded-xl"
            />
            <button
               onClick={handleAddUser}
               className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 cursor-pointer"
            >
               Add User
            </button>
            <Button onClick={() => exportToCSV(filtredUsers)}>Export to CSV-file</Button>
            <Button type="primary" onClick={() => exportToExcel(filtredUsers)}>
               Export Excel-file
            </Button>
         </div>

         <Table columns={columns} dataSource={filtredUsers} rowKey="id" pagination={false} />

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
