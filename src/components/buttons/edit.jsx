import { useSelector, useDispatch } from "react-redux";
import { getTodoById, updateTodo } from "@/lib/features/todoSlice";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useState } from "react";

const EditTaskButton = ({ taskID }) => {
  const todo = useSelector((state) => getTodoById(state, taskID));
  const [task, setTask] = useState({ ...todo });

  const [dialogOpen, setDialogOpen] = useState(false);

  const dispatch = useDispatch();

  const handleUpdateTask = (e) => {
    e.preventDefault();
    dispatch(updateTodo({
      id: task.id,
      updates: task,
    }));
    setDialogOpen(false);
  };

  return (
    <>
      <Dialog
        onDismiss={() =>
          setTask({
            id: null,
            todo: "",
            description: "",
            dueDate: null,
            priority: 0,
            completed: false,
            inProgress: false,
          })
        }
      >
        <DialogTrigger asChild>
          <button
            className="focus:outline-none"
            onClick={() => setDialogOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#D9D9D9"
            >
              <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
            </svg>
          </button>
        </DialogTrigger>
        {dialogOpen && (
          <DialogContent
            className="bg-zinc-950 text-zinc-100 border border-zinc-800 rounded-xl min-w-[350px]"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogTitle className="tracking-wider font-semibold text-lg">
              Add a new task
            </DialogTitle>
            <DialogDescription className="text-base font-light tracking-wider -mt-2">
              Add a new task to your sprint board
            </DialogDescription>
            <form className="flex flex-col gap-6 mt-4">
              <div className="flex flex-col gap-2">
                <span className="font-semibold tracking-wide">Title</span>
                <input
                  type="text"
                  placeholder="Enter task name"
                  value={task?.todo}
                  onChange={(e) => setTask({ ...task, todo: e.target.value })}
                  className="bg-zinc-900 text-zinc-100 px-4 py-3 border border-zinc-700 rounded-lg focus:outline-none focus-visible:outline-none"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-semibold tracking-wide">Description</span>
                <textarea
                  type="text"
                  value={task?.description}
                  onChange={(e) =>
                    setTask({ ...task, description: e.target.value })
                  }
                  className="bg-zinc-900 text-zinc-100 px-4 py-3 border border-zinc-700 rounded-lg focus:outline-none focus-visible:outline-none h-[100px]"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-semibold tracking-wide">Due Date</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "justify-start text-left font-normal bg-zinc-900 text-zinc-100 px-4 py-3 border border-zinc-700 rounded-lg focus:outline-none focus-visible:outline-none",
                        !task.dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon />
                      {task.dueDate ? (
                        format(task.dueDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100">
                    <Calendar
                      mode="single"
                      selected={task?.dueDate}
                      onSelect={(date) => setTask({ ...task, dueDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-semibold tracking-wide">Priority</span>
                <Select
                  defaultValue={
                    task.priority === 0
                      ? "low"
                      : task.priority === 1
                      ? "medium"
                      : "high"
                  }
                  onValueChange={(value) => {
                    if (value === "low") {
                      setTask({ ...task, priority: 0 });
                    } else if (value === "medium") {
                      setTask({ ...task, priority: 1 });
                    } else if (value === "high") {
                      setTask({ ...task, priority: 2 });
                    }
                  }}
                >
                  <SelectTrigger className="bg-zinc-900 text-zinc-100 px-4 py-3 border border-zinc-700 rounded-lg focus:outline-none focus-visible:outline-none">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 text-zinc-100 border border-zinc-700 rounded-lg">
                    <SelectItem value={"low"}>Low</SelectItem>
                    <SelectItem value={"medium"}>Medium</SelectItem>
                    <SelectItem value={"high"}>High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="flex justify-between gap-4 mt-3">
                <button></button>
                <button
                  className="bg-emerald-500 px-4 py-2 text-lg text-zinc-950 font-semibold tracking-wide flex items-center justify-center gap-3 rounded-[8px] focus:outline-none focus-within:outline-none focus-visible:outline-none"
                  onClick={handleUpdateTask}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#09090b"
                  >
                    <path d="M200-400q-17 0-28.5-11.5T160-440q0-17 11.5-28.5T200-480h200q17 0 28.5 11.5T440-440q0 17-11.5 28.5T400-400H200Zm0-160q-17 0-28.5-11.5T160-600q0-17 11.5-28.5T200-640h360q17 0 28.5 11.5T600-600q0 17-11.5 28.5T560-560H200Zm0-160q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h360q17 0 28.5 11.5T600-760q0 17-11.5 28.5T560-720H200Zm320 520v-66q0-8 3-15.5t9-13.5l209-208q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-380L655-172q-6 6-13.5 9t-15.5 3h-66q-17 0-28.5-11.5T520-200Zm300-223-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z" />
                  </svg>
                  <span>Update</span>
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default EditTaskButton;
