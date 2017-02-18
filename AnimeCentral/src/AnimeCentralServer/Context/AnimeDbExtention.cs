using AnimeCentralServer.Domain;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.IO;
using System.Net;
using System.Text;
using System.Xml;
using AnimeCentralServer.Utils;

namespace AnimeCentralServer.Context
{
    public class AnimeDbExtention
    {
        public const string REQUEST_LIST_LINK = @"https://myanimelist.net/malappinfo.php?u=phoenixitachi&type=anime&status=all";
        public const string REQUEST_ANIME_LINK = @"https://myanimelist.net/api/anime/search.xml?q=";

        public static void Seed(IApplicationBuilder app)
        {

            using (var context = app.ApplicationServices.GetRequiredService<AnimeDbContext>())
            {
                WebRequest request = WebRequest.Create(REQUEST_LIST_LINK);
                WebResponse response = request.GetResponse();
                var rawXML = new StreamReader(response.GetResponseStream()).ReadToEnd();

                WebClient webClient = new WebClient();

                XmlDocument xml = new XmlDocument();
                xml.LoadXml(rawXML); // suppose that myXmlString contains "<Names>...</Names>"

                XmlNodeList xnList = xml.SelectNodes("/myanimelist/anime");
                int animeCount = 0;
                foreach (XmlNode xn in xnList)
                {
                    animeCount++;
                    if (animeCount > 10)
                        break;

                    request = WebRequest.Create(REQUEST_ANIME_LINK + xn["series_title"].InnerText);
                    request.UseDefaultCredentials = true;
                    request.PreAuthenticate = true;
                    string encoded = Convert.ToBase64String(Encoding.ASCII.GetBytes("PhoenixItachi" + ":" + "juventus32"));
                    request.Headers["Authorization"] = "Basic " + encoded;

                    response = request.GetResponse();
                    rawXML = new StreamReader(response.GetResponseStream()).ReadToEnd();
                    xml.LoadXml(rawXML);
                    var animeNode = xml.SelectNodes("/anime/entry")[0];

                    var anime = new Anime()
                    {
                        Title = xn["series_title"].InnerText,
                        NoEpisodes = int.Parse(xn["series_episodes"].InnerText),
                        Synonyms = xn["series_synonyms"].InnerText,
                        Synopsis = animeNode["synopsis"].InnerText,
                        Status = animeNode["status"].InnerText,
                        LastTimeModified = DateTime.Now
                    };

                    context.Anime.Add(anime);
                    context.SaveChanges();
                }

                context.Users.Add(new User()
                {
                    Email = "juventus09deva@yahoo.com",
                    Password = "admin",
                    Username = "Admin",
                });

                context.SaveChanges();

            }

        }

        
    }
}
