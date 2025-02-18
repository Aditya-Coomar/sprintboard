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
  const todos = useSelector((state) => state.todos.todos);
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
      <div className="flex justify-between items-center w-full">
        <div></div>
        <AddTaskButton />
      </div>
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
                <StrictModeDroppable droppableId="todo" isDropDisabled={false} isCombineEnabled={true} ignoreContainerClipping={true}>
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
                          .filter((task) => !task.completed && !task.inProgress)
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
                <StrictModeDroppable droppableId="inProgress" isDropDisabled={false} isCombineEnabled={true} ignoreContainerClipping={true}>
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
                <StrictModeDroppable droppableId="completed" isDropDisabled={false} isCombineEnabled={true} ignoreContainerClipping={true}>
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
    </HomeLayout>
  );
}
