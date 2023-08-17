# blazor
### Technologies
- `Blazor`: Web framework for creating reactive apps using HTML with C#
- `ASP.NET`: Server-side C# framework for serving the page as well as API endpoints
- `Scss`: CSS superset allowing nesting, variables, helper functions, and more

### Directory Structure
- `/Controllers`: All API endpoints
- `/Pages`: Basic page layouts
- `/Properties`: Configuation settings for compilation and deployment
- `/Shared`: Individual reusable and stateful component files
- `/Shared/Templates`: C# classes describing JSON received from backend
- `/wwwroot`: Contains Scss style as well as CSS compilation output
- `App.razor`: Basic setup for Blazor application
- `Globals.cs`: Variables and methods shared throughout the Blazor application with the ability to notify components to update their state
- `MainLayout.razor`: Renders the page
- `Program.cs`: Configures the Blazor project, routes, and any needed tools (HTTP client, Globals, etc)
- `_Imports.tazor`: Automatically imported into .razor files
- `appsettings.json`: Basic configuration
- `blazor.csproj`: Compilation instructions and library dependencies
