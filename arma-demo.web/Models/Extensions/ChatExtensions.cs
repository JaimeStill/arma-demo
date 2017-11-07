using arma_demo.data;
using arma_demo.web.Models.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace arma_demo.web.Models.Extensions
{
    public static class ChatExtensions
    {
        public static ChatModel CastToChatModel(this Chat chat)
        {
            var model = new ChatModel
            {
                id = chat.Id,
                message = chat.Message,
                timeSent = chat.TimeSent,
                user = chat.User.CastToUserModel()
            };

            return model;
        }

        public static Task<IQueryable<ChatModel>> SelectChats(this IQueryable<Chat> chats)
        {
            return Task.FromResult(chats.Select(x => x.CastToChatModel()));
        }

        public static IQueryable<Chat> SetChatIncludes(this DbSet<Chat> chats)
        {
            return chats.Include(x => x.User);
        }

        public static async Task<IEnumerable<ChatModel>> GetChats(this AppDbContext db)
        {
            var model = await db.Chats.SetChatIncludes().SelectChats();
            return model.ToList().OrderByDescending(x => x.timeSent).Take(20).OrderBy(x => x.timeSent);
        }

        public static async Task<IEnumerable<ChatModel>> GetAllChats(this AppDbContext db)
        {
            var model = await db.Chats.SetChatIncludes().SelectChats();
            return model.ToList().OrderBy(x => x.timeSent);
        }

        public static async Task AddChat(this AppDbContext db, ChatModel model)
        {
            if (await model.Validate())
            {
                var chat = new Chat
                {
                    Message = model.message,
                    TimeSent = DateTime.Now,
                    UserId = model.user.id
                };

                await db.Chats.AddAsync(chat);
                await db.SaveChangesAsync();
            }
        }

        public static Task<bool> Validate(this ChatModel model)
        {
            if (string.IsNullOrEmpty(model.message))
            {
                throw new Exception("Message must have a value");
            }

            return Task.FromResult(true);
        }
    }
}