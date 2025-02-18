import { useSelector, useDispatch } from "react-redux";
import { getTodoById, updateTodo, deleteTodo } from "@/lib/features/todoSlice";

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
    dispatch(
      updateTodo({
        id: task.id,
        updates: task,
      })
    );
    setDialogOpen(false);
  };

  const handleDeleteTask = (e) => {
    e.preventDefault();
    dispatch(deleteTodo(task.id));
    setDialogOpen(false);
  };

  const handleMarkInProgress = (e) => {
    e.preventDefault();
    dispatch(
      updateTodo({
        id: task.id,
        updates: { ...task, inProgress: true, completed: false },
      })
    );
    setDialogOpen(false);
  };

  const handleMarkComplete = (e) => {
    e.preventDefault();
    dispatch(
      updateTodo({
        id: task.id,
        updates: { ...task, completed: true, inProgress: false },
      })
    );
    setDialogOpen(false);
  };

  const handleReopenTask = (e) => {
    e.preventDefault();
    dispatch(
      updateTodo({
        id: task.id,
        updates: { ...task, completed: false, inProgress: false },
      })
    );
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
            className="focus:outline-none z-10"
            onClick={(e) => {
              setDialogOpen(true);
            }}
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
                      disabled={task.completed}
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
                  <SelectTrigger
                    className="bg-zinc-900 text-zinc-100 px-4 py-3 border border-zinc-700 rounded-lg focus:outline-none focus-visible:outline-none"
                    disabled={task.completed}
                  >
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 text-zinc-100 border border-zinc-700 rounded-lg">
                    <SelectItem value={"low"}>Low</SelectItem>
                    <SelectItem value={"medium"}>Medium</SelectItem>
                    <SelectItem value={"high"}>High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div
                className={`flex justify-between items-stretch gap-4 mt-3 w-full`}
              >
                <button
                  className="bg-red-700/50  p-2 text-lg text-red-500 font-semibold tracking-wide flex items-center justify-center gap-3 rounded-[8px] focus:outline-none focus-within:outline-none focus-visible:outline-none"
                  onClick={handleDeleteTask}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#ef4444"
                  >
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h160q0-17 11.5-28.5T400-840h160q17 0 28.5 11.5T600-800h160q17 0 28.5 11.5T800-760q0 17-11.5 28.5T760-720v520q0 33-23.5 56.5T680-120H280Zm120-160q17 0 28.5-11.5T440-320v-280q0-17-11.5-28.5T400-640q-17 0-28.5 11.5T360-600v280q0 17 11.5 28.5T400-280Zm160 0q17 0 28.5-11.5T600-320v-280q0-17-11.5-28.5T560-640q-17 0-28.5 11.5T520-600v280q0 17 11.5 28.5T560-280Z" />
                  </svg>
                </button>
                <div className="flex gap-4 items-stretch justify-end">
                  {!task.completed && (
                    <button
                      className="bg-emerald-500 px-4 py-2 text-zinc-950 font-semibold tracking-wide flex items-center justify-center gap-2 rounded-[8px] focus:outline-none focus-within:outline-none focus-visible:outline-none"
                      onClick={handleUpdateTask}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#09090b"
                      >
                        <path d="M200-400q-17 0-28.5-11.5T160-440q0-17 11.5-28.5T200-480h200q17 0 28.5 11.5T440-440q0 17-11.5 28.5T400-400H200Zm0-160q-17 0-28.5-11.5T160-600q0-17 11.5-28.5T200-640h360q17 0 28.5 11.5T600-600q0 17-11.5 28.5T560-560H200Zm0-160q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h360q17 0 28.5 11.5T600-760q0 17-11.5 28.5T560-720H200Zm320 520v-66q0-8 3-15.5t9-13.5l209-208q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-380L655-172q-6 6-13.5 9t-15.5 3h-66q-17 0-28.5-11.5T520-200Zm300-223-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z" />
                      </svg>
                      <span>Update</span>
                    </button>
                  )}
                  {!task.completed && !task.inProgress && (
                    <button
                      className="bg-sky-500 px-4 py-2 text-zinc-950 font-semibold tracking-wide flex items-center justify-center gap-2 rounded-[8px] focus:outline-none focus-within:outline-none focus-visible:outline-none"
                      onClick={handleMarkInProgress}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#09090b"
                      >
                        <path d="M392-90q-137-31-224.5-140T80-480q0-141 87.5-250T392-870q19-5 33.5 7t14.5 32q0 14-8 25t-22 14q-110 25-180 112t-70 200q0 113 70 200t180 112q14 3 22 14t8 25q0 20-14.5 32T392-90Zm176 0q-19 5-33.5-7T520-129q0-14 8-25t22-14q27-6 52.5-16.5T651-210q11-8 24.5-6t23.5 12q14 14 12 32.5T693-142q-29 18-60.5 31T568-90Zm188-170q-10-10-12-23.5t6-24.5q15-23 25.5-49t16.5-53q3-14 14-21.5t25-7.5q20 0 32 14.5t7 33.5q-8 33-21 64.5T818-266q-11 16-29.5 18T756-260Zm75-260q-14 0-25-8t-14-22q-6-27-16.5-52.5T750-651q-8-12-6-25.5t12-23.5q14-14 32.5-12t29.5 19q18 29 31 60.5t21 64.5q5 19-7 33.5T831-520ZM651-750q-23-15-48.5-25.5T550-792q-14-3-22-14t-8-25q0-20 14.5-32t33.5-7q33 8 64.5 21t60.5 31q17 11 19 29.5T700-756q-10 10-23.5 12t-25.5-6ZM479-280q-17 0-28.5-11.5T439-320v-205l-75 76q-12 12-28.5 12T307-449q-12-12-12.5-28.5T306-506l145-146q11-11 28-11t28 11l143 143q12 12 12.5 29T651-451q-12 12-29 12t-29-12l-74-74v205q0 17-11.5 28.5T479-280Z" />
                      </svg>
                      <span>Mark in Progress</span>
                    </button>
                  )}
                  {!task.completed && task.inProgress && (
                    <button
                      className="bg-green-500 px-4 py-2 text-zinc-950 font-semibold tracking-wide flex items-center justify-center gap-2 rounded-[8px] focus:outline-none focus-within:outline-none focus-visible:outline-none"
                      onClick={handleMarkComplete}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#09090b"
                      >
                        <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q48 0 93.5 11t87.5 32q15 8 19.5 24t-5.5 30q-10 14-26.5 18t-32.5-4q-32-15-66.5-23t-69.5-8q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-8-.5-15.5T798-511q-2-17 6.5-32.5T830-564q16-5 30 3t16 24q2 14 3 28t1 29q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-328 372-373q11-11 27.5-11.5T852-781q11 11 11 28t-11 28L452-324q-12 12-28 12t-28-12L282-438q-11-11-11-28t11-28q11-11 28-11t28 11l86 86Z" />
                      </svg>
                      <span>Mark as Complete</span>
                    </button>
                  )}
                  {task.completed && (
                    <button
                      className="bg-yellow-500 px-4 py-2 text-zinc-950 font-semibold tracking-wide flex items-center justify-center gap-2 rounded-[8px] focus:outline-none focus-within:outline-none focus-visible:outline-none"
                      onClick={handleReopenTask}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#09090b"
                      >
                        <path d="M240-280v-400q0-17 11.5-28.5T280-720q17 0 28.5 11.5T320-680v400q0 17-11.5 28.5T280-240q-17 0-28.5-11.5T240-280Zm221 4q-20 12-40.5 0T400-311v-338q0-23 20.5-35t40.5 0l282 170q20 12 20 34t-20 34L461-276Z" />
                      </svg>
                      <span>Reopen Task</span>
                    </button>
                  )}
                </div>
              </div>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default EditTaskButton;
