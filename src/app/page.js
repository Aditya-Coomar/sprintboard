"use client";

import { useSelector, useDispatch } from "react-redux";
import {
  setTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from "@/lib/features/todoSlice";

import HomeLayout from "@/components/layout/home";
import TaskCard from "@/components/card";
import { useQuery } from "@tanstack/react-query";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState, useEffect, use } from "react";
import AddTaskButton from "@/components/buttons/add";

const fetchTasks = async () => {
  const res = await fetch("https://dummyjson.com/c/88c7-108b-4b44-bb8d");
  return res.json();
};

export default function Home() {
  const todos = useSelector((state) => state.todos.todos);
  const dispatch = useDispatch();
  const { data, status } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTasks,
    initialData: { todos },
  });

  useEffect(() => {
    if (!todos && data && data.todos) {
      dispatch(setTodos(data.todos));
    }
  }, [data, dispatch]);

  const [todoOpen, setTodoOpen] = useState(true);
  const [inProgressOpen, setInProgressOpen] = useState(true);
  const [completedOpen, setCompletedOpen] = useState(true);

  console.log(todos);

  return (
    <>
      <HomeLayout>
        <div className="flex justify-between items-center w-full">
          <div></div>
          <AddTaskButton />
        </div>
        <div className="flex flex-wrap gap-4 justify-start items-start">
          {/* Todo */}
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
                    {
                      todos?.filter(
                        (task) => !task.completed && !task.inProgress
                      ).length || 0
                    }
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
                <div className="flex flex-col justify-center items-center gap-4 mt-6">
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
                      .map((task) => (
                        <TaskCard
                          key={task.id}
                          taskName={task.todo}
                          taskID={task.id}
                          priority={task.priority}
                          dueDate={task.dueDate}
                          description={task.description}

                        />
                      ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* In Progress */}
          <div className="flex flex-col justify-center items-center w-fit px-3 py-4 min-w-[360px] max-w-[550px] border border-zinc-900 rounded-[8px] gap-6">
            <Collapsible
              className="w-full"
              open={inProgressOpen}
              onOpenChange={setInProgressOpen}
            >
              <div className="flex justify-between items-center gap-2 w-full">
                <span className="text-zinc-100 font-semibold text-lg tracking-wide flex gap-2">
                  <span> In Progress </span>
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
                <div className="flex flex-col justify-center items-center gap-4 mt-6">
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
                      .map((task) => (
                        <TaskCard
                          key={task.id}
                          taskName={task.todo}
                          taskID={task.id}
                          priority={task.priority}
                          dueDate={task.dueDate}
                          taskDescription={task.description}
                        />
                      ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* In Completed */}
          <div className="flex flex-col justify-center items-center w-fit px-3 py-4 min-w-[360px] max-w-[550px] border border-zinc-900 rounded-[8px] gap-6">
            <Collapsible
              className="w-full"
              open={completedOpen}
              onOpenChange={setCompletedOpen}
            >
              <div className="flex justify-between items-center gap-2 w-full">
                <span className="text-zinc-100 font-semibold text-lg tracking-wide flex gap-2">
                  <span> Completed </span>
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
                <div className="flex flex-col justify-center items-center gap-4 mt-6">
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
                      .map((task) => (
                        <TaskCard
                          key={task.id}
                          taskName={task.todo}
                          taskID={task.id}
                          priority={task.priority}
                          dueDate={task.dueDate}
                          taskDescription={task.description}
                        />
                      ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </HomeLayout>
    </>
  );
}
