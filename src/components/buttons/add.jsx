import { useSelector, useDispatch } from "react-redux";
import {
  setTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from "@/lib/features/todoSlice";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";

const AddTaskButton = () => {
  const [task, setTask] = useState({});
  const dispatch = useDispatch();

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <button className="bg-emerald-500 px-4 py-2 text-lg text-zinc-950 font-semibold tracking-wide flex items-center justify-center gap-3 rounded-[8px] focus:outline-none focus-within:outline-none focus-visible:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#09090b"
            >
              <path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z" />
            </svg>
            <span>Add Task</span>
          </button>
        </DialogTrigger>
        <DialogContent className="bg-zinc-800 text-zinc-100 border-none rounded-xl min-w-[350px]">
          <DialogTitle className="tracking-wider font-semibold text-lg">
            Add a new task
          </DialogTitle>
          <DialogDescription className="text-base font-light tracking-wider -mt-2">
            Add a new task to your sprint board
          </DialogDescription>
          <form className="flex flex-col gap-4 mt-4"></form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddTaskButton;
