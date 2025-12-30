import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import usersReducer, {
   addUser,
   updateUser,
   deleteUser,
   fetchUsers,
   saveUsersToLocalStorage,
   type UserState,
} from '../features/users/usersSlice';

const usersSaveMiddleware = createListenerMiddleware();
usersSaveMiddleware.startListening({
   matcher: isAnyOf(addUser, updateUser, deleteUser, fetchUsers.fulfilled),
   effect: (action, listenerApi) => {
      const state = listenerApi.getState() as { users: UserState };
      saveUsersToLocalStorage(state.users.usersList);
   },
});

export const store = configureStore({
   reducer: {
      auth: authReducer,
      users: usersReducer,
   },
   middleware: getDefaultMiddleware =>
      getDefaultMiddleware().prepend(usersSaveMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
