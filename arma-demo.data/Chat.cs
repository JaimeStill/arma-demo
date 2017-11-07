using System;

namespace arma_demo.data
{
    public class Chat
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Message { get; set; }
        public DateTime TimeSent { get; set; }

        public User User { get; set; }
    }
}