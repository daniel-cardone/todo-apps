import React, { useState } from "react";
import Header from "./components/Header";
import TodoList from "./components/TodoList";
import TaskCounter from "./components/TaskCounter";
import { ITasks } from "./interfaces/ITasks";
import TaskAdder from "./components/TaskAdder";
import Filter from "./components/Filter";

interface IGlobals {
  [key: string]: any;
}

export const Globals = React.createContext({} as IGlobals);

function App() {
  const [username, setUsername] = useState("user1");
  const [globalTaskList, setGlobalTaskList] = useState({} as ITasks);
  const [filterClass, setFilterClass] = useState("");
  const [editing, setEditing] = useState(new Set<string>());

  return (
    <Globals.Provider
      value={{ username, setUsername, setGlobalTaskList, setFilterClass, setEditing }}
    >
      <Header />
      <main>
        <TaskCounter tasks={globalTaskList} />
        <TaskAdder />
        <br />
        <Filter />
        <TodoList tasks={globalTaskList} editing={editing} filterClass={filterClass} />
      </main>
    </Globals.Provider>
  )
}

export default App;
