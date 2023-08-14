# gin-react
### Technologies
- `React`: Web library for dynamic, stateful pages and reusable components
- `Scss`: CSS superset allowing nesting, variables, helper functions, and more
- `TypeScript`: JavaScript with type-checking to ensure code safety and prevent issues before runtime
- `gin`: Go library for serving the page as well as API endpoints

### Directory Structure
- `/public`: The compiled web page, works as a static directory
- `/src`: The developer-written web page before compilation
- `/src/components`: Individual reusable components with states
- `/src/interfaces`: TypeScript definitions for necessary data structures
- `main.go`: The gin server providing static hosting and API endpoints
- `userdata.db`: The Sqlite3 database
