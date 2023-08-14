import { useContext, useState } from "react";
import { Globals } from "../App";

function TaskAdder() {
    const { username, setGlobalTaskList } = useContext(Globals);
    const [taskName, setTaskName] = useState("");
    
    async function createTask() {
        const tasks = await fetch(`/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                taskName
            })
        })
        .then(res => res.json());
        setGlobalTaskList(tasks);
        setTaskName("");
    }

    function handleInput(e: { target: HTMLInputElement }) {
        setTaskName(e.target.value);
    }
    
    return (
        <div className="flex-row task-input-container">
            <input placeholder="New task..." maxLength={100} value={taskName} onChange={handleInput} />
            <button onClick={createTask}>Add</button>
        </div>
    );
}

export default TaskAdder;
