import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export interface User {
   id: string;
   name: string;
   age: number;
   createdAt: string;
}

interface UserState {
   users: User[];
}

const initialState: UserState = {
   users: [],
};

const usersSlice = createSlice({
   name: 'users',
   initialState,
   reducers: {
      addUser: (state, action: PayloadAction<Omit<User, 'id' | 'createdAt'>>) => {
         state.users.push({
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            ...action.payload,
         });
      },
      updateUser: (state, action: PayloadAction<User>) => {
         const index = state.users.findIndex(user => user.id === action.payload.id);
         if (index !== -1) {
            state.users[index] = action.payload;
         }
      },
      deleteUser: (state, action: PayloadAction<string>) => {
         state.users = state.users.filter(user => user.id !== action.payload);
      },
   },
});

export const { addUser, updateUser, deleteUser } = usersSlice.actions;
export default usersSlice.reducer;