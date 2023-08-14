import { useContext } from "react";
import { Globals } from "../App";

function Header() {
  const { username, setUsername } = useContext(Globals);

  return (
    <header>
      <nav>
        <h2>Select User:</h2>
        <ul>
          {Array(3).fill(0).map((_, index) => (
            <li key={crypto.randomUUID()}>
              <button
                className={`user ${username === `user${index + 1}` ? "active" : ""}`}
                onClick={() => setUsername(`user${index + 1}`)}
              >
                User {index + 1}
              </button>
            </li>
            ))}
        </ul>
      </nav>
      <h1>TODO List</h1>
    </header>
  );
}

export default Header;
