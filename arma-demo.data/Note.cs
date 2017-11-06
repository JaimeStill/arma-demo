using System;
using System.Collections.Generic;
using System.Text;

namespace arma_demo.data
{
    public class Note
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; }
        public string Value { get; set; }
        public bool IsDeleted { get; set; }

        public User User { get; set; }
    }
}
