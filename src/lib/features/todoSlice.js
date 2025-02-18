"use client";

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todos: null,
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTodos: (state, action) => {
      state.todos = action.payload;
    },

    sortTodos: (state) => {
      if (!state.todos) return;
      state.todos.sort((a, b) => {
        let dateA = new Date(a.dueDate);
        let dateB = new Date(b.dueDate);
        if (dateA - dateB !== 0) return dateA - dateB;
        return b.priority - a.priority;
      });
    },

    addTodo: (state, action) => {
      if (!state.todos) return;
      state.todos.push(action.payload);
    },

    updateTodo: (state, action) => {
      if (!state.todos) return;
      const { id, updates } = action.payload;
      const index = state.todos.findIndex((todo) => todo.id === id);
      if (index !== -1) {
        state.todos[index] = { ...state.todos[index], ...updates };
      }
    },

    deleteTodo: (state, action) => {
      if (!state.todos) return;
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
  },
});

export const getTodoById = (state, id) => {
  return state.todos.todos.find((todo) => todo.id === id);
};

export const { setTodos, addTodo, updateTodo, deleteTodo } = todoSlice.actions;

export default todoSlice.reducer;
