using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace arma_demo.web.Hubs
{
    public class Host : Hub
    {
        public Task Send()
        {
            return Clients.All.InvokeAsync("Send");
        }

        public Task Typing(bool typing)
        {
            return Clients.All.InvokeAsync("Typing", typing);
        }
    }
}
