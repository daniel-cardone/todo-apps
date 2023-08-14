import { useContext, useEffect, useRef } from "react";
import { Globals } from "../App";
import TaskStatusUpdateBtn from "./TaskStatusUpdateBtn";
import { ITasks } from "../interfaces/ITasks";
import TaskDeleteBtn from "./TaskDeleteBtn";
import TaskEditField from "./TaskEditField";
import TaskEditBtn from "./TaskEditBtn";

function TodoList({ tasks, editing, filterClass }: { tasks: ITasks, editing: Set<string>, filterClass: string }) {
    const { username, setGlobalTaskList } = useContext(Globals);
    const firstRender = useRef(true);
    useEffect(() => {
        async function getTasks() {
            const tasks = await fetch(`/tasks/${username}`).then(res => res.json());
            setGlobalTaskList(tasks);
        }
        
        if (firstRender.current) {
            firstRender.current = false;
        } else {
            getTasks();
        }
    }, [username]);

    console.log(editing)

    return (
        <div id="todoList" className={filterClass}>
            {Object.keys(tasks).map(uuid => {
                const { taskName, taskStatus, date } = tasks[uuid];
                return (
                    <div className={`todo-item ${taskStatus.replace(" ", "-")}`} key={crypto.randomUUID()}>
                        <p className="status-indicator">{taskStatus}</p>
                        <h3>
                            {
                                editing.has(uuid) ? (
                                    <TaskEditField uuid={uuid} originalTaskName={taskName} editing={editing} />
                                ) : (
                                    taskName
                                )
                            }
                        </h3>
                        <div className="task-options">
                            <div className="flex-row">
                                <TaskStatusUpdateBtn action="complete" uuid={uuid} taskStatus={taskStatus} />
                                <TaskStatusUpdateBtn action="reset" uuid={uuid} taskStatus={taskStatus} />
                                <TaskEditBtn uuid={uuid} editing={editing} />
                                <TaskDeleteBtn uuid={uuid}></TaskDeleteBtn>
                            </div>
                            <p className="task-date">{new Date(parseInt(date)).toLocaleDateString()}</p>
                        </div>
                    </div>
                );
            })}
      </div>
    );
}

export default TodoList;

