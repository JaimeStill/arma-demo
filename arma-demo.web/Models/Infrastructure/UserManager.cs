using arma_demo.data;
using arma_demo.web.Models.Extensions;
using arma_demo.web.Models.ViewModels;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace arma_demo.web.Models.Infrastructure
{
    public class UserManager
    {
        public UserModel CurrentUser { get; set; }
        public AppDbContext db { get; set; }

        public UserManager(AppDbContext db)
        {
            this.db = db;
        }

        public async Task CheckUserProfile(HttpContext context)
        {
            if (context.User != null && context.User.Identity.IsAuthenticated)
            {
                CurrentUser = await db.GetUserProfile(context.User.Claims);
            }
        }

        public void Dispose()
        {
            CurrentUser = new UserModel();
        }
    }
}
