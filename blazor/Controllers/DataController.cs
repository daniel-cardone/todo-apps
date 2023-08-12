using blazor.Shared.Templates;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;

namespace blazor.Controllers
{
	public class DataController : Controller
	{
        private readonly string _connectionString = "Data Source=Data/userdata.db";

        [HttpGet]
		[Route("/tasks/{username}")]
		public UserTasks Tasks(string username)
		{
			UserTasks userTasks = new();

            using (var connection = new SqliteConnection(_connectionString))
            {
                connection.Open();

                string query = "SELECT * FROM Tasks WHERE Username = @Username";
                using var command = new SqliteCommand(query, connection);
                command.Parameters.AddWithValue("@Username", username);
                using var reader = command.ExecuteReader();

                while (reader.Read())
                {
                    string uuid = reader.GetString(reader.GetOrdinal("Uuid"));
                    string taskName = reader.GetString(reader.GetOrdinal("TaskName"));
                    string taskStatus = reader.GetString(reader.GetOrdinal("TaskStatus"));
                    DateTime date = reader.GetDateTime(reader.GetOrdinal("Date"));

                    if (!userTasks.Tasks.ContainsKey(uuid))
                    {
                        userTasks.Tasks[uuid] = new TaskItem();
                    }

                    userTasks.Tasks[uuid] = new TaskItem
                    {
                        TaskName = taskName,
                        TaskStatus = taskStatus,
                        Date = date
                    };
                }
            }

            return userTasks;
        }
	}
}
