import { ITasks } from "../interfaces/ITasks";

function TaskCounter({ tasks }: { tasks: ITasks }) {
    let inProgressTasks = 0;
    for (const key in tasks) {
        if (tasks[key].taskStatus !== "complete") {
            inProgressTasks++;
        }
    }
    return (
        <p>{ inProgressTasks } task{ inProgressTasks === 1 ? "" : "s" } in progress</p>
    );
}

export default TaskCounter;
