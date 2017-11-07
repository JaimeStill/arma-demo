using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace arma_demo.web.Models.ViewModels
{
    public class CategoryModel
    {
        public int id { get; set; }
        public string name { get; set; }
        public bool isDeleted { get; set; }
    }
}
