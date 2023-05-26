import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./actionsApi";
import { createSelector } from "@reduxjs/toolkit";
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {},
    token: "",
    loading: false,
    userLogIn: false,
    error: "",
  },
  reducers: {
    authReceived: (auth, action) => {
      auth.token = action.payload.token;
      auth.loading = false;
      auth.userLogIn = true;
      localStorage.setItem("token", action.payload.token);
    },
    userEdit: (auth, action) => {
      auth.user = action.payload.user;
      auth.loading = false;
    },
    authRequested: (auth, action) => {
      auth.loading = true;
    },
    authRequestFalid: (auth, action) => {
      const last = action.payload.substr(action.payload.length - 3);
      auth.error = last;
      auth.loading = false;
    },

    userReceived: (auth, action) => {
      auth.user = action.payload.user;
      auth.loading = false;
    },

    userLogOut: (auth, action) => {
      auth.user = {};
      auth.token = "";
      auth.userLogIn = false;
      localStorage.removeItem("token");
    },

    tokenRecive: (auth, action) => {
      auth.token = localStorage.getItem("token");
      auth.userLogIn = true;
      if (!auth.token) {
        auth.userLogIn = false;
      }
    },
    loadingSet: (auth, action) => {
      auth.loading = true;
    },
  },
});
export const {
  authReceived,
  userEdit,
  authRequested,
  authRequestFalid,
  userReceived,
  userLogOut,
  tokenRecive,
  loadingSet,
} = authSlice.actions;
export default authSlice.reducer;
export const receiveAuth = (auth) =>
  apiCallBegan({
    url: "Accounts/Login",
    method: "post",
    data: auth,
    onStart: authRequested.type,
    onSuccess: authReceived.type,
    onError: authRequestFalid.type,
  });
export const receiveAuth2 = (auth) =>
  apiCallBegan({
    url: "Accounts/signup",
    method: "post",
    data: auth,
    onStart: authRequested.type,
    onSuccess: authReceived.type,
    onError: authRequestFalid.type,
  });

export const editUser = (user, token) =>
  apiCallBegan({
    method: "post",
    url: "Accounts/editUserInfo",
    data: { user, token },
    onStart: authRequested.type,
    onSuccess: userEdit.type,
    onError: authRequestFalid.type,
  });

export const receiveUser = (user) => {
  return {
    type: userReceived.type,
    payload: {
      user,
    },
  };
};

export const reciveToken = () => {
  return {
    type: tokenRecive.type,
  };
};

export const logOutUser = () => {
  return {
    type: userLogOut.type,
  };
};
export const setLoading = () => {
  return {
    type: loadingSet.type,
  };
};
export const selecteUser = createSelector(
  (state) => state.entities.auth,
  (auth) => auth.user
);
export const selecteToken = createSelector(
  (state) => state.entities.auth,
  (auth) => auth.token
);
export const selectAuthLoading = createSelector(
  (state) => state.entities.auth,
  (auth) => auth.loading
);
export const selectLogIn = createSelector(
  (state) => state.entities.auth,
  (auth) => auth.userLogIn
);

export const selectError = createSelector(
  (state) => state.entities.auth,
  (auth) => auth.error
);
