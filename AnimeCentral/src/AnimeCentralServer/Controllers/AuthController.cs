using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AnimeCentralServer.Context;
using Newtonsoft.Json;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace AnimeCentralServer.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        public AnimeDbContext Context { get; set; }

        public AuthController(AnimeDbContext context)
        {
            Context = context;
        }

        // GET: api/values
        [HttpGet("{username}/{password}")]
        public object Get(string username, string password)
        {
            try
            {
                var user = Context.Users.FirstOrDefault(it => it.Username == username && it.Password == password);
                if (user == null)
                    return new { success = false, message = "Invalid username or password" };

                user.Token = Guid.NewGuid().ToString();

                Context.SaveChanges();

                return new { success = true, token = user.Token };
            }
            catch (Exception exception)
            {
                return new { success = false, message = exception.Message };
            }
        }

        [Route("session")]
        [HttpGet]
        public JsonResult Session(string username, string password)
        {
            try
            {
                var user = Context.Users.FirstOrDefault(it => it.Username == username && it.Password == password);
                if (user == null)
                    return Json(new { success = false, message = "Invalid username or password" });

                user.Token = Guid.NewGuid().ToString();

                Context.SaveChanges();

                Response.StatusCode = 201;
                return Json(new { success = true, token = user.Token });
            }
            catch (Exception exception)
            {
                return Json(new { success = false, message = exception.Message });
            }
        }

    }
}
