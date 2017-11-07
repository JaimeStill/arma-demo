using System;

namespace arma_demo.web.Models.ViewModels
{
    public class ChatModel
    {
        public int id { get; set; }
        public string message { get; set; }
        public DateTime timeSent { get; set; }
        public UserModel user { get; set; }
    }
}