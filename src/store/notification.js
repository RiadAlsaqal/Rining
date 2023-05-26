import { createSelector, createSlice } from "@reduxjs/toolkit";
import { apiCallBegan, apiCallFailed } from "./actionsApi";
import { friendAccept, friendReject } from "./friends";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    list: [],
    list2: [],
    isread: 0,
    error: false,
  },

  reducers: {
    notificationRecive: (noti, action) => {
      noti.list = action.payload.notification.Notifications;
      noti.isread = action.payload.notification.numberNotifications;
    },
    snackbarEnqueue: (noti, action) => {
      noti.list2 = [
        {
          id: action.payload.key,
          [action.payload.key]: action.payload.notification.message,
        },
        ...noti.list2,
      ];
      noti.list = [
        {
          id: action.payload.key,
          [action.payload.key]: action.payload.notification.message,
        },
        ...noti.list,
      ];
      noti.isread += +1;
    },
    snackbarClose: (noti, action) => {
      noti.list2 = noti.list2.map((notification) =>
        action.payload.dismissAll || notification.key === action.payload.key
          ? { ...notification, dismissed: true }
          : { ...notification }
      );
    },
    snackbarRemove: (noti, action) => {
      noti.list2 = noti.list2.filter(
        (notification) => notification.id !== action.payload.key
      );
    },
    isReadClean: (noti, action) => {
      noti.isread = 0;
    },
    errorClear: (state, action) => {
      state.error = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(friendAccept, (state, action) => {
        state.list = state.list.filter(
          (key) => action.payload.idNotif !== key.id
        );
        if (state.isread !== 0) state.isread -= 1;
      })
      .addCase(friendReject, (state, action) => {
        state.list = state.list.filter(
          (key) => action.payload.idNotif !== key.id
        );
        if (state.isread !== 0) state.isread -= 1;
      })
      .addCase(apiCallFailed, (state, action) => {
        state.error = true;
      });
  },
});
export const {
  snackbarClose,
  snackbarEnqueue,
  snackbarRemove,
  notificationRecive,
  isReadClean,
  errorClear,
} = notificationSlice.actions;
export default notificationSlice.reducer;

export const enqueueSnackbar = (notification) => {
  return {
    type: snackbarEnqueue.type,
    payload: {
      notification,
      key: notification.options.key,
    },
  };
};

export const closeSnackbar = (key) => {
  return {
    type: snackbarClose.type,
    payload: {
      dismissAll: !key,
      key,
    },
  };
};

export const removeSnackbar = (key) => {
  return {
    type: snackbarRemove.type,
    payload: { key },
  };
};
export const reciveNotification = (notification) => {
  return {
    type: notificationRecive.type,
    payload: {
      notification,
    },
  };
};
export const cleanIsRead = (token) =>
  apiCallBegan({
    url: "Accounts/notificationRead",
    method: "post",
    data: { token },
    onSuccess: isReadClean.type,
  });
export const clearError = () => {
  return {
    type: errorClear.type,
  };
};
export const selectNotificationBar = createSelector(
  (state) => state.entities.notification,
  (notification) => notification.list
);
export const selectNotification = createSelector(
  (state) => state.entities.notification,
  (notification) => notification.list2
);
export const selectIsread = createSelector(
  (state) => state.entities.notification,
  (notification) => notification.isread
);

export const selectError = createSelector(
  (state) => state.entities.notification,
  (notification) => notification.error
);
