using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AnimeCentralServer.Domain
{
    public class Anime
    {
        [Key]
        public int ID { get; set; }
        public string Title { get; set; }
        public int NoEpisodes { get; set; }
        public string Synonyms { get; set; }
        public string Status { get; set; }
        public string Synopsis { get; set; }
        public DateTime LastTimeModified { get; set; }
    }
}
