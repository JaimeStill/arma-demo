using arma_demo.data;
using arma_demo.web.Models.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace arma_demo.web.Models.Extensions
{
    public static class NoteExtensions
    {
        public static NoteModel CastToNoteModel(this Note note)
        {
            var model = new NoteModel
            {
                id = note.Id,
                title = note.Title,
                value = note.Value,
                isDeleted = note.IsDeleted,
                user = note.User.CastToUserModel(),
                category = note.Category.CastToCategoryModel()
            };

            return model;
        }

        public static Task<IQueryable<NoteModel>> SelectNotes(this IQueryable<Note> notes)
        {
            return Task.FromResult(notes.Select(x => x.CastToNoteModel()));
        }

        public static IQueryable<Note> SetNoteIncludes(this DbSet<Note> notes)
        {
            return notes.Include(x => x.User).Include(x => x.Category);
        }

        public static async Task<IEnumerable<NoteModel>> GetNotes(this AppDbContext db)
        {
            var model = await db.Notes.SetNoteIncludes().Where(x => !x.IsDeleted).SelectNotes();
            return model.AsEnumerable();
        }

        public static async Task<IEnumerable<NoteModel>> GetUserNotes(this AppDbContext db, int userId)
        {
            var model = await db.Notes.SetNoteIncludes().Where(x => !x.IsDeleted && x.UserId == userId).SelectNotes();
            return model.AsEnumerable();
        }

        public static async Task<IEnumerable<NoteModel>> GetDeletedNotes(this AppDbContext db)
        {
            var model = await db.Notes.SetNoteIncludes().Where(x => x.IsDeleted).SelectNotes();
            return model.AsEnumerable();
        }

        public static async Task<IEnumerable<NoteModel>> GetUserDeletedNotes(this AppDbContext db, int userId)
        {
            var model = await db.Notes.SetNoteIncludes().Where(x => x.IsDeleted && x.UserId == userId).SelectNotes();
            return model.AsEnumerable();
        }

        public static async Task<NoteModel> GetNote(this AppDbContext db, int id)
        {
            var note = await db.Notes.SetNoteIncludes().FirstOrDefaultAsync(x => x.Id == id);
            return note.CastToNoteModel();
        }

        public static async Task<int> CreateNote(this AppDbContext db, NoteModel model)
        {
            if (await model.Validate())
            {
                var note = new Note
                {
                    Title = model.title,
                    Value = model.value,
                    UserId = model.user.id,
                    CategoryId = model.category.id,
                    IsDeleted = false
                };

                await db.Notes.AddAsync(note);
                await db.SaveChangesAsync();

                return note.Id;
            }

            return 0;
        }

        public static async Task UpdateNote(this AppDbContext db, NoteModel model)
        {
            if (await model.Validate())
            {
                var note = await db.Notes.FindAsync(model.id);

                note.Title = model.title;
                note.Value = model.value;
                note.CategoryId = model.category.id;

                await db.SaveChangesAsync();
            }
        }

        public static async Task ToggleNoteDeleted(this AppDbContext db, int id)
        {
            var note = await db.Notes.FindAsync(id);
            note.IsDeleted = !note.IsDeleted;
            await db.SaveChangesAsync();
        }

        public static async Task DeleteNote(this AppDbContext db, int id)
        {
            var note = await db.Notes.FindAsync(id);
            db.Notes.Remove(note);
            await db.SaveChangesAsync();
        }

        public static Task<bool> Validate(this NoteModel model)
        {
            if (string.IsNullOrEmpty(model.title))
            {
                throw new Exception("Title must have a value");
            }

            if (string.IsNullOrEmpty(model.value))
            {
                throw new Exception("The note must not be empty");
            }

            return Task.FromResult(true);
        }
    }
}
