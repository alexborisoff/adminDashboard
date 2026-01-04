import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import authReducer, {
   login,
   refreshAccessToken,
   updatesUser,
   logout,
   type AuthState,
   saveAuthToLocalStorage,
   clearAuthFromLocalStorage,
} from '../features/auth/authSlice';
import usersReducer, {
   addUser,
   updateUser,
   deleteUser,
   fetchUsers,
   saveUsersToLocalStorage,
   type UserState,
} from '../features/users/usersSlice';

const authSaveMiddleware = createListenerMiddleware();
authSaveMiddleware.startListening({
   matcher: isAnyOf(login, refreshAccessToken, updatesUser, logout),
   effect: (_, listenerApi) => {
      const state = listenerApi.getState() as { auth: AuthState };
      if (state.auth.isAuthenticated) {
         saveAuthToLocalStorage(state.auth);
      } else {
         clearAuthFromLocalStorage();
      }
   },
});

const usersSaveMiddleware = createListenerMiddleware();
usersSaveMiddleware.startListening({
   matcher: isAnyOf(addUser, updateUser, deleteUser, fetchUsers.fulfilled),
   effect: (_, listenerApi) => {
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
      getDefaultMiddleware().prepend(authSaveMiddleware.middleware,usersSaveMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
