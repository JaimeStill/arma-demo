using arma_demo.data;
using arma_demo.web.Models.Extensions;
using arma_demo.web.Models.Infrastructure;
using arma_demo.web.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace arma_demo.web.Controllers
{
    [Authorize(Policy = "Authenticated")]
    [Route("api/[controller]")]
    public class NoteController : Controller
    {
        private AppDbContext db;
        private UserManager manager;

        public NoteController(AppDbContext db, UserManager manager)
        {
            this.db = db;
            this.manager = manager;
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<NoteModel>> GetNotes()
        {
            return await db.GetNotes();
        }

        [HttpGet("[action]")]
        public async Task<List<NoteStat>> GetNoteStats()
        {
            return await db.GetNoteStats();
        }

        [HttpPost("[action]")]
        public async Task<IEnumerable<NoteModel>> GetUserNotes([FromBody]int id)
        {
            return await db.GetUserNotes(id);
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<NoteModel>> GetDeletedNotes()
        {
            return await db.GetDeletedNotes();
        }

        [HttpPost("[action]")]
        public async Task<IEnumerable<NoteModel>> GetUserDeletedNotes([FromBody]int id)
        {
            return await db.GetUserDeletedNotes(id);
        }

        [HttpGet("[action]/{id}")]
        public async Task<NoteModel> GetNote([FromRoute]int id)
        {
            return await db.GetNote(id);
        }

        [HttpPost("[action]")]
        public async Task<int> CreateNote([FromBody]NoteModel model)
        {
            model.user.id = manager.CurrentUser.id;
            return await db.CreateNote(model);
        }

        [HttpPost("[action]")]
        public async Task UpdateNote([FromBody]NoteModel model)
        {
            await db.UpdateNote(model);
        }

        [HttpPost("[action]")]
        public async Task ToggleNoteDeleted([FromBody]int id)
        {
            await db.ToggleNoteDeleted(id);
        }

        [HttpPost("[action]")]
        public async Task DeleteNote([FromBody]int id)
        {
            await db.DeleteNote(id);
        }
    }
}
