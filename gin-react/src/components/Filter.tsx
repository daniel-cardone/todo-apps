import { useContext } from "react";
import { Globals } from "../App";

function Filter() {
    const { setFilterClass } = useContext(Globals);
    return (
        <div className="filter">
            <h2>Filter Tasks</h2>
            <div className="filter-btns">
                <button onClick={() => setFilterClass("")}>All</button>
                <button onClick={() => setFilterClass("in-progress")}>In Progress</button>
                <button onClick={() => setFilterClass("complete")}>Complete</button>
            </div>
        </div>
    );
}

export default Filter;
