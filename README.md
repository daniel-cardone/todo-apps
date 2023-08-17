# todo-apps
Several TODO list app examples using various different web technologies.\
Each app has the following functionalities:
- Create a task
- Complete a task
- Reset (un-complete) a task
- Delete a task
- Filter list by completion status

For consistency, each app shares the same stylesheet, written in SCSS

### Folders
- `blazor`
    - UI written using Blazor
    - Backend written ASP.NET
    - Entirely server-side rendered (rather than WebAssembly)
    - Uses Postres database hosted on Supabase
- `express`
    - UI written using Pug, Scss, and TypeScript
    - Backend written in Node.js using express
    - Pre-compiled client-side rendering
    - Uses local .json file as a database
- `gin-react`
    - UI written using React (TypeScript)
    - Backend written in Go using gin
    - Pre-compiled client-side rendering
    - Uses local Sqlite3 database
