using arma_demo.data;
using arma_demo.web.Models.Extensions;
using arma_demo.web.Models.Infrastructure;
using arma_demo.web.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace arma_demo.web.Controllers
{
    [Authorize(Policy = "Authenticated")]
    [Route("api/[controller]")]
    public class IdentityController : Controller
    {
        private UserManager manager;
        private AppDbContext db;

        public IdentityController(UserManager manager, AppDbContext db)
        {
            this.manager = manager;
            this.db = db;
        }

        [AllowAnonymous]
        [HttpGet("[action]")]
        public bool CheckAuthentication()
        {
            var authenticated = HttpContext.User.Identity == null ? false : HttpContext.User.Identity.IsAuthenticated;
            return authenticated;
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<UserModel>> GetUsers()
        {
            return await db.GetUsers();
        }

        [HttpGet("[action]")]
        public UserModel GetCurrentUser()
        {
            return manager.CurrentUser;
        }

        [HttpPost("[action]")]
        public async Task SetThemePreference([FromBody]UserModel model)
        {
            await db.SetThemePreference(model);
        }

        [HttpPost("[action]")]
        public async Task SetSidepanelPreference([FromBody]UserModel model)
        {
            await db.SetSidepanelPreference(model);
        }

        [HttpPost("[action]")]
        public async Task UpdateDisplayName([FromBody]UserModel model)
        {
            await db.UpdateDisplayName(model);
        }
    }
}
