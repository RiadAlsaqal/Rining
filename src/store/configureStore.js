import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import api from "./middleware/api";
import reducer from "./reducer";
export const Store = configureStore({
  reducer,
  middleware: [...getDefaultMiddleware(), api],
});
