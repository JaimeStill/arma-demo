using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace arma_demo.web.Models.ViewModels
{
    public class UserModel
    {
        public int id { get; set; }
        public string identifier { get; set; }
        public string email { get; set; }
        public string displayName { get; set; }
        public string theme { get; set; }
        public string sidepanel { get; set; }
        public IEnumerable<NoteModel> notes { get; set; }
    }
}
