"use client";
import { useDispatch } from "react-redux";
import { addTodo } from "@/lib/features/todoSlice";

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

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import Strike from "@tiptap/extension-strike";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading,
  Quote,
  Code,
  Strikethrough,
  Undo,
  Redo,
} from "lucide-react";

const AddTaskButton = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Underline,
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      CodeBlock,
      Strike,
      Placeholder.configure({
        placeholder: "Write something...",
        showOnlyWhenEditable: true,
      }),
    ],
    content: "",
  });

  const [task, setTask] = useState({
    id: null,
    todo: "",
    description: "",
    dueDate: null,
    priority: 0,
    completed: false,
    inProgress: false,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const dispatch = useDispatch();

  const handleCreateTask = (e) => {
    e.preventDefault();
    dispatch(
      addTodo({
        ...task,
        id: String(Date.now()),
        description: editor && editor.getHTML(),
        dueDate: task.dueDate
          ? task.dueDate.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
          : null,
      })
    );
    setTask({
      id: null,
      todo: "",
      description: "",
      dueDate: null,
      priority: 0,
      completed: false,
      inProgress: false,
    });
    editor && editor.commands.clearContent();
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
            className="bg-emerald-500 px-2 sm:px-3 md:px-4 py-2 min-w-[120px] text-sm sm:text-base md:text-lg text-zinc-950 font-semibold tracking-wide flex items-center justify-center gap-1 md:gap-3 rounded-sm md:rounded-[8px] focus:outline-none focus-within:outline-none focus-visible:outline-none"
            onClick={() => setDialogOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#09090b"
            >
              <path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z" />
            </svg>
            <span>Add Task</span>
          </button>
        </DialogTrigger>
        {dialogOpen && (
          <DialogContent
            className="bg-zinc-950 text-zinc-100 border border-zinc-800 rounded-xl min-w-[350px] overflow-auto max-h-screen"
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
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-semibold tracking-wide">Description</span>
                {/* Toolbar */}
                <div className="flex flex-wrap gap-2 bg-zinc-800 p-2 rounded-md">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      editor.chain().focus().toggleBold().run();
                    }}
                    className={`p-1 rounded ${
                      editor.isActive("bold") ? "bg-zinc-700" : ""
                    }`}
                  >
                    <Bold size={16} className="text-white" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      editor.chain().focus().toggleItalic().run();
                    }}
                    className={`p-1 rounded ${
                      editor.isActive("italic") ? "bg-zinc-700" : ""
                    }`}
                  >
                    <Italic size={16} className="text-white" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      editor.chain().focus().toggleUnderline().run();
                    }}
                    className={`p-1 rounded ${
                      editor.isActive("underline") ? "bg-zinc-700" : ""
                    }`}
                  >
                    <UnderlineIcon size={16} className="text-white" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      editor.chain().focus().toggleStrike().run();
                    }}
                    className={`p-1 rounded ${
                      editor.isActive("strike") ? "bg-zinc-700" : ""
                    }`}
                  >
                    <Strikethrough size={16} className="text-white" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      editor.chain().focus().toggleHeading({ level: 2 }).run();
                    }}
                    className={`p-1 rounded ${
                      editor.isActive("heading", { level: 2 })
                        ? "bg-zinc-700"
                        : ""
                    }`}
                  >
                    <Heading size={16} className="text-white" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      editor.chain().focus().toggleHeading({ level: 3 }).run();
                    }}
                    className={`p-1 rounded ${
                      editor.isActive("heading", { level: 3 })
                        ? "bg-zinc-700"
                        : ""
                    }`}
                  >
                    <Heading size={14} className="text-white" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      editor.chain().focus().toggleBulletList().run();
                    }}
                    className={`p-1 rounded ${
                      editor.isActive("bulletList") ? "bg-zinc-700" : ""
                    }`}
                  >
                    <List size={16} className="text-white" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      editor.chain().focus().toggleOrderedList().run();
                    }}
                    className={`p-1 rounded ${
                      editor.isActive("orderedList") ? "bg-zinc-700" : ""
                    }`}
                  >
                    <ListOrdered size={16} className="text-white" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      editor.chain().focus().toggleBlockquote().run();
                    }}
                    className={`p-1 rounded ${
                      editor.isActive("blockquote") ? "bg-zinc-700" : ""
                    }`}
                  >
                    <Quote size={16} className="text-white" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      editor.chain().focus().toggleCodeBlock().run();
                    }}
                    className={`p-1 rounded ${
                      editor.isActive("codeBlock") ? "bg-zinc-700" : ""
                    }`}
                  >
                    <Code size={16} className="text-white" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      editor.chain().focus().undo().run();
                    }}
                    className="p-1 rounded"
                  >
                    <Undo size={16} className="text-white" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      editor.chain().focus().redo().run();
                    }}
                    className="p-1 rounded"
                  >
                    <Redo size={16} className="text-white" />
                  </button>
                </div>

                {/* Editor Content */}
                <div className="bg-zinc-900 text-white px-4 py-3 border border-zinc-700 rounded-lg h-40 overflow-y-auto">
                  <EditorContent
                    editor={editor}
                    className="focus:outline-none w-full"
                  />
                </div>
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
                  defaultValue={task.priority}
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
              <DialogFooter className="flex justify-end gap-4 mt-3">
                <button
                  className="bg-emerald-500 px-4 py-2 text-lg text-zinc-950 font-semibold tracking-wide flex items-center justify-center gap-3 rounded-[8px] focus:outline-none focus-within:outline-none focus-visible:outline-none"
                  onClick={handleCreateTask}
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
                  <span>Create</span>
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default AddTaskButton;
