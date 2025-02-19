"use client";

import { useSelector, useDispatch } from "react-redux";
import { setTodos, updateTodo } from "@/lib/features/todoSlice";
import HomeLayout from "@/components/layout/home";
import TaskCard from "@/components/card";
import { useQuery } from "@tanstack/react-query";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import AddTaskButton from "@/components/buttons/add";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Strict Mode compatible Droppable
const StrictModeDroppable = ({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};

const fetchTasks = async () => {
  const res = await fetch("https://dummyjson.com/c/d30a-526f-47cb-bb5b");
  return res.json();
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const todos = useSelector((state) => state.todos.todos)?.filter((task) => {
    if (!task.todo) return false;
    if (priorityFilter === "all") return true;
    if (priorityFilter === "low") return task.priority === 0;
    if (priorityFilter === "medium") return task.priority === 1;
    if (priorityFilter === "high") return task.priority === 2;
    return task.todo.toLowerCase().includes(searchTerm.toLowerCase());
  });
  const dispatch = useDispatch();
  const { data, status } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTasks,
    initialData: { todos },
  });

  useEffect(() => {
    if (!todos && data && data.todos) {
      dispatch(setTodos(data.todos));
    }
  }, [data, dispatch, todos]);

  const [todoOpen, setTodoOpen] = useState(true);
  const [inProgressOpen, setInProgressOpen] = useState(true);
  const [completedOpen, setCompletedOpen] = useState(true);

  const handleDragEnd = useCallback(
    (result) => {
      const { destination, source, draggableId } = result;

      // Return if there's no destination or if the item was dropped in the same place
      if (
        !destination ||
        (destination.droppableId === source.droppableId &&
          destination.index === source.index)
      ) {
        return;
      }

      const task = todos?.find((t) => t.id === draggableId);
      if (!task) return;

      let updates = {};
      switch (destination.droppableId) {
        case "todo":
          updates = { inProgress: false, completed: false };
          break;
        case "inProgress":
          updates = { inProgress: true, completed: false };
          break;
        case "completed":
          updates = { inProgress: false, completed: true };
          break;
        default:
          return;
      }

      dispatch(updateTodo({ id: draggableId, updates }));
    },
    [dispatch, todos]
  );

  return (
    <HomeLayout>
      <div className="sticky top-0 z-20 bg-zinc-950 pb-5">
        <div className="flex justify-between items-center gap-2 pr-2 sm:pr-4 md:pr-6">
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-md px-2 md:px-3 py-1 md:py-2 min-w-[150px] max-w-[600px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#71717a"
            >
              <path d="M378.67-326q-108.44 0-183.56-75.17Q120-476.33 120-583.33t75.17-182.17q75.16-75.17 182.5-75.17 107.33 0 182.16 75.17 74.84 75.17 74.84 182.27 0 43.23-14 82.9-14 39.66-40.67 73l236 234.66q9.67 9.37 9.67 23.86 0 14.48-9.67 24.14-9.67 9.67-24.15 9.67-14.48 0-23.85-9.67L532.67-380q-30 25.33-69.64 39.67Q423.39-326 378.67-326Zm-.67-66.67q79.17 0 134.58-55.83Q568-504.33 568-583.33q0-79-55.42-134.84Q457.17-774 378-774q-79.72 0-135.53 55.83-55.8 55.84-55.8 134.84t55.8 134.83q55.81 55.83 135.53 55.83Z" />
            </svg>
            <input
              type="text"
              placeholder="Search tasks"
              className="bg-zinc-900 text-zinc-100 w-full focus:outline-none text-sm md:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex justify-end items-center gap-3 md:gap-6 w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#71717a"
            >
              <path d="M193.33-200q-14.16 0-23.75-9.62-9.58-9.61-9.58-23.83 0-14.22 9.58-23.72 9.59-9.5 23.75-9.5H240v-296q0-83.66 49.67-149.5Q339.33-778 420-796v-24q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v24q80.67 18 130.33 83.83Q720-646.33 720-562.67v296h46.67q14.16 0 23.75 9.62 9.58 9.62 9.58 23.83 0 14.22-9.58 23.72-9.59 9.5-23.75 9.5H193.33ZM480-501.33ZM480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM306.67-266.67h346.66v-296q0-72-50.66-122.66Q552-736 480-736t-122.67 50.67q-50.66 50.66-50.66 122.66v296Z" />
            </svg>
            <img
              src="/avatar.png"
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full"
              alt="avatar"
            />
            <span className="text-zinc-400 font-medium tracking-wide text-base sm:text-lg md:text-xl">
              Aditya Coomar
            </span>
          </div>
        </div>
        <div className="flex justify-between items-end w-full pr-2 sm:pr-4 md:pr-6 mt-10">
          <div className="flex flex-wrap items-center gap-4 w-fit">
            <div className="text-xl sm:text-2xl md:text-3xl tracking-wider text-zinc-100 font-medium">
              Your Sprint Board
            </div>
            <div className="flex items-center gap-3 border bg-zinc-900 border-zinc-800 rounded-md px-2 py-[2px] md:py-1">
              <span className="text-zinc-400 font-medium text-sm sm:text-base md:text-lg lg:text-xl tracking-wide">
                Priority
              </span>
              <Select
                defaultValue={priorityFilter}
                onValueChange={(value) => setPriorityFilter(value)}
              >
                <SelectTrigger className="bg-zinc-900 text-zinc-100 px-2 py-[2px] md:py-1 min-w-20 text-xs sm:text-sm md:text-base lg:text-lg border border-zinc-900 rounded-sm focus:outline-none focus-visible:outline-none">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 text-zinc-100 border border-zinc-700 rounded-lg text-sm sm:text-base md:text-lg">
                  <SelectItem value={"all"}>All</SelectItem>
                  <SelectItem value={"low"}>Low</SelectItem>
                  <SelectItem value={"medium"}>Medium</SelectItem>
                  <SelectItem value={"high"}>High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <AddTaskButton />
        </div>
      </div>
      <div className="h-full mt-5 flex flex-col w-full ml-1">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex flex-wrap gap-4 justify-start items-start">
            {/* Todo Column */}
            <div className="flex flex-col justify-center items-center w-fit px-3 py-4 min-w-[360px] max-w-[550px] border border-zinc-900 rounded-[8px] gap-6">
              <Collapsible
                className="w-full"
                open={todoOpen}
                onOpenChange={setTodoOpen}
              >
                <div className="flex justify-between items-center gap-2 w-full">
                  <span className="text-zinc-100 font-semibold text-lg tracking-wide flex gap-2">
                    <span>Todo</span>
                    <span className="bg-zinc-700 rounded-full px-2 py-1 text-sm font-medium">
                      {todos?.filter(
                        (task) => !task.completed && !task.inProgress
                      ).length || 0}
                    </span>
                  </span>
                  <CollapsibleTrigger>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20px"
                      viewBox="0 -960 960 960"
                      width="20px"
                      fill="#a1a1aa"
                    >
                      <path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z" />
                    </svg>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <StrictModeDroppable
                    droppableId="todo"
                    isDropDisabled={false}
                    isCombineEnabled={true}
                    ignoreContainerClipping={true}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex flex-col justify-center items-center gap-4 mt-6 min-h-[50px]"
                      >
                        {status === "loading" && <div>Loading...</div>}
                        {status === "error" && <div>Error fetching data</div>}
                        {status === "success" &&
                          todos &&
                          todos
                            .filter(
                              (task) => !task.completed && !task.inProgress
                            )
                            .sort((a, b) => {
                              let dateA = new Date(a.dueDate);
                              let dateB = new Date(b.dueDate);
                              if (dateA - dateB !== 0) {
                                return dateA - dateB;
                              }
                              return b.priority - a.priority;
                            })
                            .map((task, index) => (
                              <Draggable
                                key={task.id}
                                draggableId={task.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`w-full transition-opacity ${
                                      snapshot.isDragging ? "opacity-75" : ""
                                    }`}
                                  >
                                    <TaskCard
                                      taskName={task.todo}
                                      taskID={task.id}
                                      priority={task.priority}
                                      dueDate={task.dueDate}
                                      description={task.description}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </StrictModeDroppable>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* In Progress Column */}
            <div className="flex flex-col justify-center items-center w-fit px-3 py-4 min-w-[360px] max-w-[550px] border border-zinc-900 rounded-[8px] gap-6">
              <Collapsible
                className="w-full"
                open={inProgressOpen}
                onOpenChange={setInProgressOpen}
              >
                <div className="flex justify-between items-center gap-2 w-full">
                  <span className="text-zinc-100 font-semibold text-lg tracking-wide flex gap-2">
                    <span>In Progress</span>
                    <span className="bg-zinc-700 rounded-full px-2 py-1 text-sm font-medium">
                      {todos?.filter((task) => task.inProgress).length || 0}
                    </span>
                  </span>
                  <CollapsibleTrigger>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20px"
                      viewBox="0 -960 960 960"
                      width="20px"
                      fill="#a1a1aa"
                    >
                      <path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z" />
                    </svg>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <StrictModeDroppable
                    droppableId="inProgress"
                    isDropDisabled={false}
                    isCombineEnabled={true}
                    ignoreContainerClipping={true}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex flex-col justify-center items-center gap-4 mt-6 min-h-[50px]"
                      >
                        {status === "loading" && <div>Loading...</div>}
                        {status === "error" && <div>Error fetching data</div>}
                        {status === "success" &&
                          todos &&
                          todos
                            .filter((task) => task.inProgress)
                            .sort((a, b) => {
                              let dateA = new Date(a.dueDate);
                              let dateB = new Date(b.dueDate);
                              if (dateA - dateB !== 0) {
                                return dateA - dateB;
                              }
                              return b.priority - a.priority;
                            })
                            .map((task, index) => (
                              <Draggable
                                key={task.id}
                                draggableId={task.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`w-full transition-opacity ${
                                      snapshot.isDragging ? "opacity-75" : ""
                                    }`}
                                  >
                                    <TaskCard
                                      taskName={task.todo}
                                      taskID={task.id}
                                      priority={task.priority}
                                      dueDate={task.dueDate}
                                      description={task.description}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </StrictModeDroppable>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Completed Column */}
            <div className="flex flex-col justify-center items-center w-fit px-3 py-4 min-w-[360px] max-w-[550px] border border-zinc-900 rounded-[8px] gap-6">
              <Collapsible
                className="w-full"
                open={completedOpen}
                onOpenChange={setCompletedOpen}
              >
                <div className="flex justify-between items-center gap-2 w-full">
                  <span className="text-zinc-100 font-semibold text-lg tracking-wide flex gap-2">
                    <span>Completed</span>
                    <span className="bg-zinc-700 rounded-full px-2 py-1 text-sm font-medium">
                      {todos?.filter((task) => task.completed).length || 0}
                    </span>
                  </span>
                  <CollapsibleTrigger>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20px"
                      viewBox="0 -960 960 960"
                      width="20px"
                      fill="#a1a1aa"
                    >
                      <path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z" />
                    </svg>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <StrictModeDroppable
                    droppableId="completed"
                    isDropDisabled={false}
                    isCombineEnabled={true}
                    ignoreContainerClipping={true}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex flex-col justify-center items-center gap-4 mt-6 min-h-[50px]"
                      >
                        {status === "loading" && <div>Loading...</div>}
                        {status === "error" && <div>Error fetching data</div>}
                        {status === "success" &&
                          todos &&
                          todos
                            .filter((task) => task.completed)
                            .sort((a, b) => {
                              let dateA = new Date(a.dueDate);
                              let dateB = new Date(b.dueDate);
                              if (dateA - dateB !== 0) {
                                return dateB - dateA;
                              }
                              return b.priority - a.priority;
                            })
                            .map((task, index) => (
                              <Draggable
                                key={task.id}
                                draggableId={task.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`w-full transition-opacity ${
                                      snapshot.isDragging ? "opacity-75" : ""
                                    }`}
                                  >
                                    <TaskCard
                                      taskName={task.todo}
                                      taskID={task.id}
                                      priority={task.priority}
                                      dueDate={task.dueDate}
                                      description={task.description}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </StrictModeDroppable>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </DragDropContext>
      </div>
    </HomeLayout>
  );
}
