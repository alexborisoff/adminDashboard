import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export interface FetchUsersParams {
   page: number;
   limit: number;
}

export const fetchUsers = createAsyncThunk(
   'users/fetchUsers',
   async ({ page, limit }: FetchUsersParams) => {
      const res = await axios.get(
         `https://dummyjson.com/users?limit=${limit}&skip=${(page - 1) * limit}`
      );
      return { users: res.data.users, total: res.data.total };
   }
);

export interface User {
   id: string;
   name: string;
   age: number;
   createdAt: string;
}

interface UserState {
   usersList: User[];
   total: number;
   loading: boolean;
}

const loadFromLocalStorage = (): User[] => {
   try {
      const data = localStorage.getItem('usersList');
      return data ? JSON.parse(data) : [];
   } catch {
      return [];
   }
};

const saveToLocalStorage = (users: User[]) => {
   localStorage.setItem('usersList', JSON.stringify(users));
};

const initialState: UserState = {
   usersList: loadFromLocalStorage(),
   total: 0,
   loading: false,
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
         saveToLocalStorage(state.usersList);
      },
      updateUser: (state, action: PayloadAction<User>) => {
         const index = state.usersList.findIndex(user => user.id === action.payload.id);
         if (index !== -1) {
            state.usersList[index] = action.payload;
            saveToLocalStorage(state.usersList);
         }
      },
      deleteUser: (state, action: PayloadAction<string>) => {
         state.usersList = state.usersList.filter(user => user.id !== action.payload);
         saveToLocalStorage(state.usersList);
      },
   },
   extraReducers(builder) {
      builder
         .addCase(fetchUsers.pending, state => {
            state.loading = true;
         })
         .addCase(fetchUsers.fulfilled, (state, action) => {
            state.usersList = action.payload.users;
            state.total = action.payload.total;
            state.loading = false;
         });
   },
});

export const { addUser, updateUser, deleteUser } = usersSlice.actions;
export default usersSlice.reducer;
