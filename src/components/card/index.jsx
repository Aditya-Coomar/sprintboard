import EditTaskButton from "@/components/buttons/edit";

const TaskCard = ({ taskID, taskName, description, priority, dueDate }) => {
  const priorityCode = {
    0: {color : "bg-green-700/50 text-green-500", text: "Low"},
    1: {color : "bg-yellow-700/50 text-yellow-500", text: "Medium"},
    2: {color : "bg-red-700/50 text-red-500", text: "High"}
  };
  return (
    <>
      <div className="w-full px-5 py-6 rounded-xl shadow-lg bg-zinc-900 text-zinc-100 flex flex-col gap-5">
        <div className="flex justify-between items-start gap-8">
          <span className="font-medium text-xl tracking-wide">
            {taskName || "Sprint Board Task Name"}
          </span>
            <EditTaskButton taskID={taskID} />
        </div>
        <div className="font-light tracking-wider text-base text-zinc-400">
          {`SB-0${taskID || "01"}`}
        </div>
        <div
          className={`${
            priorityCode[priority]?.color || "bg-green-700/50 text-green-500"
          } px-2 py-[2px] rounded-[6px] text-base font-semibold w-fit`}
        >
          {priorityCode[priority]?.text || "Low"}
        </div>
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="18px"
              viewBox="0 -960 960 960"
              width="18px"
              fill="#a1a1aa"
            >
              <path d="M580-240q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-40q0-17 11.5-28.5T280-880q17 0 28.5 11.5T320-840v40h320v-40q0-17 11.5-28.5T680-880q17 0 28.5 11.5T720-840v40h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z" />
            </svg>
            <span className="text-lg text-zinc-400">{dueDate || "No Due Date"}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#a1a1aa"
            >
              <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-240v-32q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v32q0 33-23.5 56.5T720-160H240q-33 0-56.5-23.5T160-240Zm80 0h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
            </svg>
            <span className="text-lg text-zinc-400">Me</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskCard;
