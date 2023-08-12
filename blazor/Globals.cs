
using blazor.Shared.Templates;

namespace blazor
{
	public class Globals
	{
		public event Action? Notify;

		private string _username = "";
		public string Username
		{
			get => _username;
			set
			{
				if (_username != value)
				{
					_username = value;
					if (Notify != null)
					{
						Notify?.Invoke();
					}
				}
			}
		}

		public static async Task<UserTasks> GetUserTasks(HttpClient Http, string username)
		{
            return await Http.GetFromJsonAsync<UserTasks>("tasks/" + username) ?? new();
		}
	}
}
