import { useContext } from "react";
import { Globals } from "../App";
import { IStatusUpdateBtnArgs } from "../interfaces/BtnArgs";

function TaskStatusUpdateBtn({ action, uuid, taskStatus }: IStatusUpdateBtnArgs) {
    const { username, setGlobalTaskList } = useContext(Globals);

    async function completeTask() {
        const tasks = await fetch(`/status`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action,
                uuid,
                username
            })
        })
            .then(res => res.json());
        setGlobalTaskList(tasks);
    }

    let extraClass = "";
    if ((action === "complete" && taskStatus === "complete") || (action === "reset" && taskStatus !== "complete")) {
        extraClass = "hidden";
    }

    return (
        <button
            className={`task-${action}-btn ${extraClass}`}
            onClick={completeTask}
        >
            {action.charAt(0).toUpperCase() + action.slice(1)}
        </button>
    );
}

export default TaskStatusUpdateBtn;
