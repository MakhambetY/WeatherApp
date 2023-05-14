import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {fetchUserLogin, fetchUserRegister} from '../../api/auth';
import {getItem, setItem} from '../../helpers/persistanceStorage';
import {axios} from '../../api/axios';

interface IUser {
  user: {
    username: string;
    email: string;
    token: string;
    password: string;
  };
}

interface ICurrentUser extends IUser {
  isLogged: boolean;
  errorMessage: string;
  userLoading: 'idle' | 'loading' | 'error';
}

const initialState: ICurrentUser = {
  isLogged: false || getItem('accessToken'),
  errorMessage: '',
  user: {
    username: 'Anonymous',
    email: 'none',
    token: '',
    password: '',
  },
  userLoading: 'idle',
};

const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    getCurrentUserStart: (state) => {
      state.userLoading = 'loading';
      state.isLogged = false;
    },
    getCurrentUserSuccess: (state, action: PayloadAction<ICurrentUser>) => {
      state.user = action.payload.user;
      state.isLogged = true;
      state.userLoading = 'idle';
    },
    logoutCurrentUser: (state) => {
      new Promise(() => {
        axios.post(`${import.meta.env.VITE_BASE_JAVA_API_URL}/logout`);
      });
      setItem('accessToken', '');
      state.isLogged = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserLogin.fulfilled, (state, {payload}) => {
        state.isLogged = true;
        state.userLoading = 'idle';

        setItem('accessToken', payload.data.access_token);
      })
      .addCase(fetchUserLogin.rejected, (state, {payload}) => {
        if (axios.isAxiosError(payload)) {
          state.errorMessage = payload.message;
          state.userLoading = 'error';
          state.isLogged = false;
        } else {
          state.isLogged = false;
          state.userLoading = 'error';
          // state.errorMessage = payload; // ERROR type error
        }
      })
      .addCase(fetchUserLogin.pending, (state) => {
        state.userLoading = 'loading';
      })
      .addCase(fetchUserRegister.fulfilled, (state, {payload}) => {
        state.isLogged = true;
        state.userLoading = 'idle';

        setItem('accessToken', payload.data.access_token);
      })
      .addCase(fetchUserRegister.rejected, (state, {payload}) => {
        if (axios.isAxiosError(payload)) {
          state.errorMessage = payload.message;
          state.userLoading = 'error';
          state.isLogged = false;
        } else {
          state.isLogged = false;
          state.userLoading = 'error';
          // state.errorMessage = payload; // ERROR type error
        }
      })
      .addCase(fetchUserRegister.pending, (state) => {
        state.userLoading = 'loading';
      });
  },
});

const {actions, reducer} = currentUserSlice;

export default reducer;

export const {getCurrentUserStart, getCurrentUserSuccess, logoutCurrentUser} =
  actions;
