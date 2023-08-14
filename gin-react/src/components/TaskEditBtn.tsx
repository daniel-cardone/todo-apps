import { useContext } from "react";
import { Globals } from "../App";
import { IEditBtnArgs } from "../interfaces/BtnArgs";

function TaskEditBtn({ uuid, editing }: IEditBtnArgs) {
    const { setEditing } = useContext(Globals);

    function beginEdit() {
        setEditing(new Set([...Array.from(editing), uuid]));
    }

    return (
        <button
            className={`task-edit-btn`}
            onClick={beginEdit}
        >
            Edit
        </button>
    );
}

export default TaskEditBtn;
