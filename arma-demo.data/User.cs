using System;
using System.Collections.Generic;
using System.Text;

namespace arma_demo.data
{
    public class User
    {
        public int Id { get; set; }
        public string Identifier { get; set; }
        public string Email { get; set; }
        public string DisplayName { get; set; }
        public string Theme { get; set; }
        public string Sidepanel { get; set; }
    }
}
