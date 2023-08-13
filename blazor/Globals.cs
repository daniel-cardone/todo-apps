using blazor.Shared.Templates;
using static System.Net.WebRequestMethods;
using System;

namespace blazor
{
	public class Globals
	{
		public event Action? Notify;
		public event Action? SecondaryNotify;

		private string _username = "";
		public string Username
		{
			get => _username;
			set
			{
				if (_username != value)
				{
					_username = value;
					InvokeNotifier();
				}
			}
		}

		private string _currentFilter = "";
		public string CurrentFilter
		{
			get => _currentFilter;
			set
			{
				if (_currentFilter != value)
				{
					_currentFilter = value;
					InvokeNotifier();
				}
			}
		}

		private UserTasks _userTasks = new();
		public UserTasks UserTasks
		{
			get => _userTasks;
			set
			{
				if (_userTasks != value)
				{
					_userTasks = value;
					InvokeNotifier();
				}
			}
		}

		public static async Task<UserTasks> FetchUserTasks(HttpClient Http, string username)
		{
            return await Http.GetFromJsonAsync<UserTasks>("tasks/" + username) ?? new();
		}

		public static async Task<bool> AddNewTask(HttpClient Http, string username, string taskName)
		{
			var result = await Http.PostAsJsonAsync<object>("add", new
			{
				username,
				taskName
			});

			if (result.IsSuccessStatusCode)
			{
				return true;
			}

			return false;
		}

        public static async Task<bool> UpdateUserTask(HttpClient Http, string username, string uuid, string newStatus)
        {
            var result = await Http.PostAsJsonAsync<object>("status", new
            {
                username,
                uuid,
				newStatus
            });

            if (result.IsSuccessStatusCode)
            {
                return true;
            }
            return false;
        }

		public static async Task<bool> RenameUserTask(HttpClient Http, string username, string uuid, string newName)
		{
            var result = await Http.PostAsJsonAsync<object>("rename", new
            {
                username,
                uuid,
                newName
            });

            if (result.IsSuccessStatusCode)
            {
                return true;
            }
            return false;
        }

        public static async Task<bool> DeleteUserTask(HttpClient Http, string username, string uuid)
		{
            var result = await Http.PostAsJsonAsync<object>("delete", new
            {
                username,
                uuid
            });

            if (result.IsSuccessStatusCode)
            {
                return true;
            }

            return false;
        }

		public void InvokeNotifier()
		{
			Notify?.Invoke();
		}

		public void InvokeSecondaryNotifier()
		{
			SecondaryNotify?.Invoke();
		}
	}
}
