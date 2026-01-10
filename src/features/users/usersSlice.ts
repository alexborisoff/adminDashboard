import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { STORAGE_KEYS } from '../../constants/validation';

export interface FetchUsersParams {
   page: number;
   limit: number;
}

export const fetchUsers = createAsyncThunk(
   'users/fetchUsers',
   async (params: FetchUsersParams, thunkAPI) => {
      try {
         const res = await axios.get(
            `https://dummyjson.com/users?limit=${params.limit}&skip=${
               (params.page - 1) * params.limit
            }`
         );
         return { users: res.data.users, total: res.data.total };
      } catch (error) {
         if (axios.isAxiosError(error)) {
            return thunkAPI.rejectWithValue(
               error.response?.data?.message || error.message || 'Failed to fetch users'
            );
         }
         return thunkAPI.rejectWithValue('An unexpected error occurred');
      }
   }
);

export interface User {
   id: string;
   name: string;
   age: number;
   createdAt: string;
}

export interface UserState {
   usersList: User[];
   total: number;
   loading: boolean;
   error: string | null;
}

const loadFromLocalStorage = (): User[] => {
   try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : [];
   } catch {
      return [];
   }
};

export const saveUsersToLocalStorage = (users: User[]): void => {
   try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
   } catch (error) {
      console.error('Failed to save users to localStorage:', error);
   }
};

const initialState: UserState = {
   usersList: loadFromLocalStorage(),
   total: 0,
   loading: false,
   error: null,
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
   extraReducers(builder) {
      builder
         .addCase(fetchUsers.pending, state => {
            state.loading = true;
            state.error = null;
         })
         .addCase(fetchUsers.fulfilled, (state, action) => {
            state.usersList = action.payload.users;
            state.total = action.payload.total;
            state.loading = false;
            state.error = null;
         })
         .addCase(fetchUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
         });
   },
});

export const { addUser, updateUser, deleteUser } = usersSlice.actions;
export default usersSlice.reducer;
