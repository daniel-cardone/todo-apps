import { useContext, useState } from "react";
import { Globals } from "../App";
import { ITaskEditFieldArgs } from "../interfaces/BtnArgs";

function TaskEditField({ uuid, originalTaskName, editing }: ITaskEditFieldArgs) {
    const { username, setGlobalTaskList, setEditing } = useContext(Globals);
    const [taskName, setTaskName] = useState(originalTaskName);

    async function renameTask() {
        if (taskName === "") return;

        const tasks = await fetch(`/rename`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                uuid,
                username,
                taskName
            })
        })
        .then(res => res.json());
        setGlobalTaskList(tasks);

        editing.delete(uuid);
        setEditing(new Set(editing));
    }

    function handleInput(e: { target: HTMLInputElement }) {
        setTaskName(e.target.value);
    }

    return (
        <div className="task-input-container flex-row">
            <input maxLength={100} value={taskName} onChange={handleInput} />
            <button onClick={renameTask}>Update</button>
        </div>
    );
}

export default TaskEditField;
