using Microsoft.AspNetCore.Mvc;

namespace blazor.Controllers
{
	public class DataController : Controller
	{
		[HttpGet]
		[Route("/tasks/{username}")]
		public string Tasks(string username)
		{
			return username.ToUpper();
		}
	}
}
