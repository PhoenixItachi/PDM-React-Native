using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.IO;
using System.Xml;
using System.Globalization;
using System.Text;
using AnimeCentralServer.Domain;
using AnimeCentralServer.Context;
using Newtonsoft.Json;

namespace AnimeCentralServer.Controllers
{
    [Route("api/[controller]")]
    public class AnimeController : Controller
    {
        public AnimeDbContext Context { get; set; }

        public AnimeController(AnimeDbContext context)
        {
            Context = context;
        }

        // GET api/values
        [HttpGet]
        public JsonResult Get()
        {

            if (Request.Headers["Authorization"].Count == 0)
                return Json(new { success = false, message = "Token not found." });

            var token = Request.Headers["Authorization"][0];
            if (Context.Users.Where(u => u.Token == token).Count() == 0)
                return Json(new { success = false, message = "Invalid token." });

            var animeList = Context.Anime.ToList();
            return Json(animeList);
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
