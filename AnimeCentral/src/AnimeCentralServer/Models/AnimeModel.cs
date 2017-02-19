using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AnimeCentralServer.Models
{
    public class AnimeModel
    {
        [Required]
        public string Title { get; set; }

        [Required]
        [Range(1, 2000)]
        public int NoEpisodes { get; set; }

        [Required]
        public string Synonyms { get; set; }

        [Required]
        public string Status { get; set; }

        [Required]
        public string Synopsis { get; set; }
    }
}
