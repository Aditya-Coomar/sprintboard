import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "@/lib/features/todoSlice";

export const store = configureStore({
  reducer: {
    todos: todoReducer
  }
});
