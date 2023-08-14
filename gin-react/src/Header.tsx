function Header() {
  return (
    <header>
      <nav>
        <h2>Select User:</h2>
        <ul>
          <li>
            <button className="user active" data-username="user1">User 1</button>
          </li>
          <li>
            <button className="user" data-username="user2">User 2</button>
          </li>
          <li>
            <button className="user" data-username="user3">User 3</button>
          </li>
        </ul>
      </nav>
      <h1>TODO List</h1>
    </header>
  );
}

export default Header;
