using blazor.Shared.Templates;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System.Text;
using System.Text.Json;

namespace blazor.Controllers
{
    public class DataController : Controller
    {
        private readonly string _connectionString = System.IO.File.ReadAllText("db_secret.txt", Encoding.UTF8);

        [HttpGet]
        [Route("/tasks/{username}")]
        public UserTasks GetTasks(string username)
        {
            UserTasks userTasks = new();

            using (var connection = new NpgsqlConnection(_connectionString))
            {
                connection.Open();

                string query = "SELECT * FROM Tasks WHERE Username = @Username ORDER BY Date DESC";
                using var command = new NpgsqlCommand(query, connection);
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

        [HttpPost]
        [Route("/add")]
        public StatusCodeResult AddTask([FromBody] JsonElement json)
        {
            string? username = json.GetString("username");
            string? taskName = json.GetString("taskName");
            if (username == null || taskName == null || username.Length > 12 || taskName.Length > 100)
            {
                return BadRequest();
            }

            string taskStatus = "in progress";
            DateTime date = DateTime.Now;
            string uuid = Guid.NewGuid().ToString();

            using (var connection = new NpgsqlConnection(_connectionString))
            {
                connection.Open();

                string query = "INSERT INTO Tasks (Username, Uuid, TaskName, TaskStatus, Date) Values (@Username, @Uuid, @TaskName, @TaskStatus, @Date)";
                using var command = new NpgsqlCommand(query, connection);
                command.Parameters.AddWithValue("@Username", username);
                command.Parameters.AddWithValue("@Uuid", uuid);
                command.Parameters.AddWithValue("@TaskName", taskName);
                command.Parameters.AddWithValue("@TaskStatus", taskStatus);
                command.Parameters.AddWithValue("@Date", date);
                int affectedRows = command.ExecuteNonQuery();

                if (affectedRows == 0)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError);
                }
            }

            return Ok();
        }

		[HttpPost]
		[Route("/status")]
        public StatusCodeResult UpdateTaskStatus([FromBody] JsonElement json)
        {
			string? username = json.GetString("username");
			string? uuid = json.GetString("uuid");
			string? newStatus = json.GetString("newStatus");
			if (username == null || uuid == null || username.Length > 12 || (newStatus != "in progress" && newStatus != "complete"))
			{
                return BadRequest();
			}

			using (var connection = new NpgsqlConnection(_connectionString))
			{
				connection.Open();

				string query = "UPDATE Tasks SET TaskStatus = @NewStatus WHERE Username = @Username AND Uuid = @Uuid";
				using var command = new NpgsqlCommand(query, connection);
				command.Parameters.AddWithValue("@NewStatus", newStatus);
				command.Parameters.AddWithValue("@Username", username);
				command.Parameters.AddWithValue("@Uuid", uuid);
				int affectedRows = command.ExecuteNonQuery();

				if (affectedRows == 0)
				{
					return BadRequest();
				}
			}

			return Ok();
		}

        [HttpPost]
        [Route("/rename")]
        public StatusCodeResult RenameTask([FromBody] JsonElement json)
        {
            string? username = json.GetString("username");
            string? uuid = json.GetString("uuid");
            string? newName= json.GetString("newName");
            if (username == null || uuid == null || newName == null || username.Length > 12 || newName.Length > 100)
            {
                return BadRequest();
            }

            using (var connection = new NpgsqlConnection(_connectionString))
            {
                connection.Open();

                string query = "UPDATE Tasks SET TaskName = @NewName WHERE Username = @Username AND Uuid = @Uuid";
                using var command = new NpgsqlCommand(query, connection);
                command.Parameters.AddWithValue("@NewName", newName);
                command.Parameters.AddWithValue("@Username", username);
                command.Parameters.AddWithValue("@Uuid", uuid);
                int affectedRows = command.ExecuteNonQuery();

                if (affectedRows == 0)
                {
                    return BadRequest();
                }
            }

            return Ok();
        }

        [HttpPost]
        [Route("/delete")]
        public StatusCodeResult DeleteTask([FromBody] JsonElement json)
        {
            string? username = json.GetString("username");
            string? uuid = json.GetString("uuid");
            if (username == null || uuid == null || username.Length > 12)
            {
                return BadRequest();
            }

            using (var connection = new NpgsqlConnection(_connectionString))
            {
                connection.Open();

                string query = "DELETE FROM Tasks WHERE Username = @Username AND Uuid = @Uuid";
                using var command = new NpgsqlCommand(query, connection);
                command.Parameters.AddWithValue("@Username", username);
                command.Parameters.AddWithValue("@Uuid", uuid);
                int affectedRows = command.ExecuteNonQuery();

                if (affectedRows == 0)
                {
                    return BadRequest();
                }
            }

            return Ok();
        }
    }
}
