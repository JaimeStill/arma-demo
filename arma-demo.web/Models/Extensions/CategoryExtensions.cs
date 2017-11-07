using arma_demo.data;
using arma_demo.web.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace arma_demo.web.Models.Extensions
{
    public static class CategoryExtensions
    {
        public static CategoryModel CastToCategoryModel(this Category category)
        {
            var model = new CategoryModel
            {
                id = category.Id,
                name = category.Name,
                isDeleted = category.IsDeleted
            };

            return model;
        }

        public static Task<IQueryable<CategoryModel>> SelectCategories(this IQueryable<Category> categories)
        {
            return Task.FromResult(categories.Select(x => x.CastToCategoryModel()));
        }

        public static async Task<IEnumerable<CategoryModel>> GetCategories(this AppDbContext db)
        {
            var model = await db.Categories.Where(x => !x.IsDeleted).SelectCategories();
            return model.AsEnumerable();
        }

        public static async Task<IEnumerable<CategoryModel>> GetDeletedCategories(this AppDbContext db)
        {
            var model = await db.Categories.Where(x => x.IsDeleted).SelectCategories();
            return model.AsEnumerable();
        }

        public static async Task<CategoryModel> GetCategory(this AppDbContext db, int id)
        {
            var category = await db.Categories.FindAsync(id);
            return category.CastToCategoryModel();
        }

        public static async Task CreateCategory(this AppDbContext db, CategoryModel model)
        {
            if (await model.Validate())
            {
                var category = new Category
                {
                    Name = model.name,
                    IsDeleted = false
                };

                await db.Categories.AddAsync(category);
                await db.SaveChangesAsync();
            }
        }

        public static async Task UpdateCategory(this AppDbContext db, CategoryModel model)
        {
            if (await model.Validate())
            {
                var category = await db.Categories.FindAsync(model.id);
                category.Name = model.name;
                await db.SaveChangesAsync();
            }
        }

        public static async Task ToggleCategoryDeleted(this AppDbContext db, int id)
        {
            var category = await db.Categories.FindAsync(id);
            category.IsDeleted = !category.IsDeleted;
            await db.SaveChangesAsync();
        }

        public static Task<bool> Validate(this CategoryModel model)
        {
            if (string.IsNullOrEmpty(model.name))
            {
                throw new Exception("Category must have a value");
            }

            return Task.FromResult(true);
        }
    }
}
