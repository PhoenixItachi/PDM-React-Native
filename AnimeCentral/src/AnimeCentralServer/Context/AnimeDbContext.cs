using AnimeCentralServer.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AnimeCentralServer.Context
{
    public class AnimeDbContext : DbContext
    {
        public DbSet<Anime> Anime { get; set; }
        public DbSet<User> Users { get; set; }
        public AnimeDbContext() : base()
        {

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Filename=AnimeCentral.db");
        }

    }
}
