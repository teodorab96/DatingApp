using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;

namespace API.Data
{
    public class DataContext : IdentityDbContext<AppUser,AppRole,int,IdentityUserClaim<int>,AppUserRole,IdentityUserLogin<int>,IdentityRoleClaim<int>,IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<UserLike> Likes { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Group> Groups {get; set;}
        public DbSet<Connection> Connections { get; set; }

        protected override void OnModelCreating(ModelBuilder builder) {
            //jer vršimo override 
            base.OnModelCreating(builder);

            builder.Entity<AppUser>()
                    .HasMany(ur => ur.UserRoles)
                    .WithOne(u => u.User)
                    .HasForeignKey(ur => ur.UserId)
                    .IsRequired();

            builder.Entity<AppRole>()
                    .HasMany(ur => ur.UserRoles)
                    .WithOne(u => u.Role)
                    .HasForeignKey(ur => ur.RoleId)
                    .IsRequired();


            builder.Entity<UserLike>()
                //Da u tabeli kljuc bude kombinacija ova dva kljuca
                    .HasKey(k => new {k.SourceUserId,k.LikedUserId});

            builder.Entity<UserLike>()
                    .HasOne(s => s.SourceUser)
                    .WithMany(l => l.LikedUsers)
                    .HasForeignKey(s => s.SourceUserId )
                    .OnDelete(DeleteBehavior.Cascade);
            builder.Entity<UserLike>()
                    .HasOne(s => s.LikedUser)
                    .WithMany(l => l.LikedByUser)
                    .HasForeignKey(s => s.LikedUserId)
                    .OnDelete(DeleteBehavior.Cascade);


            builder.Entity<Message>()
                    .HasOne(u => u.Recipient)
                    .WithMany(m => m.MessagesReceived)
                    .OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Message>()
                    .HasOne(u => u.Sender)
                    .WithMany(m =>m.MessagesSent)
                    .OnDelete(DeleteBehavior.Restrict);

        }
    }
}