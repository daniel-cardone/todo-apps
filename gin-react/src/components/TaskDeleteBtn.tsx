import { useContext } from "react";
import { Globals } from "../App";
import { IBasicBtnArgs } from "../interfaces/BtnArgs";

function TaskDeleteBtn({ uuid }: IBasicBtnArgs) {
    const { username, setGlobalTaskList } = useContext(Globals);

    async function deleteTask() {
        const tasks = await fetch(`/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                uuid,
                username
            })
        })
            .then(res => res.json());
        setGlobalTaskList(tasks);
    }

    return (
        <button
            className={`task-delete-btn`}
            onClick={deleteTask}
        >
            Delete
        </button>
    );
}

export default TaskDeleteBtn;
