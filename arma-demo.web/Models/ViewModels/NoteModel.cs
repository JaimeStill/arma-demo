using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace arma_demo.web.Models.ViewModels
{
    public class NoteModel
    {
        public int id { get; set; }
        public string title { get; set; }
        public string value { get; set; }
        public bool isDeleted { get; set; }
        public UserModel user { get; set; }
    }
}
