using arma_demo.data;
using arma_demo.web.Models.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace arma_demo.web.Models.Extensions
{
    public static class IdentityExtensions
    {
        public static UserModel CastToUserModel(this User user)
        {
            var model = new UserModel
            {
                id = user.Id,
                identifier = user.Identifier,
                email = user.Email,
                displayName = user.DisplayName,
                theme = user.Theme,
                sidepanel = user.Sidepanel
            };

            return model;
        }

        public static Task<IQueryable<UserModel>> SelectUsers(this IQueryable<User> users)
        {
            return Task.FromResult(users.Select(x => x.CastToUserModel()));
        }

        public static Task<string> GetDefaultDisplayName(this IEnumerable<Claim> claims)
        {
            var last = claims.FirstOrDefault(x => x.Type.Contains("surname")).Value;
            var first = claims.FirstOrDefault(x => x.Type.Contains("givenname")).Value;

            return Task.FromResult($"{first} {last}");
        }

        public static Task<string> GetEmail(this IEnumerable<Claim> claims)
        {
            var email = claims.FirstOrDefault(x => x.Type.Contains("upn"));

            if (email == null)
            {
                email = claims.FirstOrDefault(x => x.Type.Contains("emailaddress"));
            }

            return Task.FromResult(email.Value);
        }

        public static async Task<UserModel> GetUserProfile(this AppDbContext db, IEnumerable<Claim> claims)
        {
            var user = await db.CheckUserExists(claims.FirstOrDefault(x => x.Type.Contains("objectidentifier")).Value);

            if (user == null)
            {
                user = await db.CreateNewUser(claims);
            }

            return user.CastToUserModel();
        }

        public static async Task<User> CheckUserExists(this AppDbContext db, string identifier)
        {
            var user = await db.Users.FirstOrDefaultAsync(x => x.Identifier == identifier);

            return user;
        }

        public static async Task<User> CreateNewUser(this AppDbContext db, IEnumerable<Claim> claims)
        {
            var user = new User
            {
                Identifier = claims.FirstOrDefault(x => x.Type.Contains("objectidentifier")).Value,
                Email = await claims.GetEmail(),
                DisplayName = await claims.GetDefaultDisplayName(),
                Theme = "light-green",
                Sidepanel = "full"
            };

            await db.Users.AddAsync(user);
            await db.SaveChangesAsync();

            return user;
        }

        public static async Task<IEnumerable<UserModel>> GetUsers(this AppDbContext db)
        {
            var model = await db.Users.SelectUsers();
            return model.AsEnumerable();
        }

        public static async Task SetThemePreference(this AppDbContext db, UserModel model)
        {
            var user = await db.Users.FindAsync(model.id);
            user.Theme = model.theme;
            await db.SaveChangesAsync();
        }

        public static async Task SetSidepanelPreference(this AppDbContext db, UserModel model)
        {
            var user = await db.Users.FindAsync(model.id);
            user.Sidepanel = model.sidepanel;
            await db.SaveChangesAsync();
        }

        public static async Task UpdateDisplayName(this AppDbContext db, UserModel model)
        {
            var user = await db.Users.FindAsync(model.id);
            user.DisplayName = model.displayName;
            await db.SaveChangesAsync();
        }
    }
}
