using arma_demo.data;
using arma_demo.web.Models.Extensions;
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
    public class CategoryController : Controller
    {
        private AppDbContext db;

        public CategoryController(AppDbContext db)
        {
            this.db = db;
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<CategoryModel>> GetCategories()
        {
            return await db.GetCategories();
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<CategoryModel>> GetDeletedCategories()
        {
            return await db.GetDeletedCategories();
        }

        [HttpGet("[action]/{id}")]
        public async Task<CategoryModel> GetCategory([FromRoute]int id)
        {
            return await db.GetCategory(id);
        }

        [HttpPost("[action]")]
        public async Task CreateCategory([FromBody]CategoryModel model)
        {
            await db.CreateCategory(model);
        }

        [HttpPost("[action]")]
        public async Task UpdateCategory([FromBody]CategoryModel model)
        {
            await db.UpdateCategory(model);
        }

        [HttpPost("[action]")]
        public async Task ToggleCategoryDeleted([FromBody]int id)
        {
            await db.ToggleCategoryDeleted(id);
        }
    }
}
