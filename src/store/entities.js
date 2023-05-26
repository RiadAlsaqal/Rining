import { combineReducers } from "@reduxjs/toolkit";
import friendsReducer from "./friends";
import groubsReducer from "./groubs";
import notificationReducer from "./notification";
import authReducer from "./auth";
import membersSlice from "./members";
import callsSlice from "./calls";
export default combineReducers({
  friends: friendsReducer,
  groubs: groubsReducer,
  notification: notificationReducer,
  auth: authReducer,
  members: membersSlice,
  calls: callsSlice,
});
