import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export interface User {
   id: string;
   name: string;
   age: number;
   createdAt: string;
}

interface UserState {
   usersList: User[];
}

const initialState: UserState = {
   usersList: [],
};

const usersSlice = createSlice({
   name: 'usersList',
   initialState,
   reducers: {
      addUser: (state, action: PayloadAction<Omit<User, 'id' | 'createdAt'>>) => {
         state.usersList.push({
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            ...action.payload,
         });
      },
      updateUser: (state, action: PayloadAction<User>) => {
         const index = state.usersList.findIndex(user => user.id === action.payload.id);
         if (index !== -1) {
            state.usersList[index] = action.payload;
         }
      },
      deleteUser: (state, action: PayloadAction<string>) => {
         state.usersList = state.usersList.filter(user => user.id !== action.payload);
      },
   },
});

export const { addUser, updateUser, deleteUser } = usersSlice.actions;
export default usersSlice.reducer;
