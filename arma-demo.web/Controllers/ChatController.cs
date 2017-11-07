using arma_demo.data;
using arma_demo.web.Models.Extensions;
using arma_demo.web.Models.Infrastructure;
using arma_demo.web.Models.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace arma_demo.web.Controllers
{
    [Route("api/[controller]")]
    public class ChatController : Controller
    {
        private AppDbContext db;
        private UserManager manager;

        public ChatController(AppDbContext db, UserManager manager)
        {
            this.db = db;
            this.manager = manager;
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<ChatModel>> GetChats()
        {
            return await db.GetChats();
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<ChatModel>> GetAllChats()
        {
            return await db.GetAllChats();
        }

        [HttpPost("[action]")]
        public async Task AddChat([FromBody]ChatModel model)
        {
            model.user = manager.CurrentUser;
            await db.AddChat(model);
        }
    }
}
