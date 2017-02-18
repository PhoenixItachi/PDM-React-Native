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
using Microsoft.AspNetCore.Http;
using AnimeCentralServer.Models;

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

        public JsonResult VerifyToken(HttpRequest request)
        {
            if (Request.Headers["Authorization"].Count == 0)
                return Json(new { success = false, message = "Token not found." });

            var token = Request.Headers["Authorization"][0];
            if (Context.Users.Where(u => u.Token == token).Count() == 0)
                return Json(new { success = false, message = "Invalid token." });

            return null;
        }

        [HttpGet]
        public ActionResult Get()
        {
            var authError = VerifyToken(Request);
            if (authError != null)
                return authError;

            var animeList = Context.Anime.ToList();
            return Json(animeList);
        }

        [HttpPost]
        public ActionResult Post([FromBody] AnimeModel animeModel)
        {
            var authError = VerifyToken(Request);
            if (authError != null)
                return authError;


            if (!ModelState.IsValid)
                return BadRequest();

            if (Context.Anime.Where(a => a.Title == animeModel.Title).Count() != 0)
            {
                Response.StatusCode = 409;
                return Json(new { status = "error", message = "already exists!" });
            }

            var anime = new Anime()
            {
                NoEpisodes = animeModel.NoEpisodes,
                Status = animeModel.Status,
                Synopsis = animeModel.Synopsis,
                Synonyms = animeModel.Synonyms,
                Title = animeModel.Title,
                LastTimeModified = DateTime.Now
            };

            Context.Add(anime);
            Context.SaveChanges();
            return Ok();
        }

        [HttpPost]
        [Route("EditAnime")]
        public ActionResult EditAnime(int id, [FromBody] AnimeModel model)
        {
            var authError = VerifyToken(Request);
            if (authError != null)
                return authError;

            if (!ModelState.IsValid)
                return BadRequest();

            var anime = Context.Anime.Where(a => a.ID == id).FirstOrDefault();
            if (anime == null)
                return NotFound("Anime don't exist");

            anime.Title = model.Title;
            Context.Update(anime);
            Context.SaveChanges();
            return Ok();
        }

        // DELETE api/values/5
        [HttpDelete]
        public ActionResult Delete(int id)
        {
            var authError = VerifyToken(Request);
            if (authError != null)
                return authError;

            var anime = Context.Anime.Where(a => a.ID == id).FirstOrDefault();
            if (anime == null)
                return NotFound("Anime don't exist");


            Context.Remove(anime);
            Context.SaveChanges();
            return Ok();
        }

        [Route("Sync")]
        [HttpGet]
        public ActionResult Sync(string lastTimeModified)
        {
            var authError = VerifyToken(Request);
            if (authError != null)
                return authError;

            DateTime requestDate;
            try
            {
                requestDate = DateTime.Parse(lastTimeModified);
                var toUpdate = Context.Anime.Where(a => a.LastTimeModified > requestDate).ToList();
                if (toUpdate.Count == 0)
                {
                    Response.StatusCode = 304;
                    return Json(new { });
                }
                else
                    return Ok();

            } catch (Exception e)
            {
                Response.StatusCode = 404;
                return Json(new { maessage = e.Message});
            }
        }
    }
}
