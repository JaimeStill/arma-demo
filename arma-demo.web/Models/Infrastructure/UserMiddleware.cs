using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace arma_demo.web.Models.Infrastructure
{
    public class UserMiddleware
    {
        private readonly RequestDelegate next;

        public UserMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task Invoke(HttpContext httpContext, UserManager userManager)
        {
            await userManager.CheckUserProfile(httpContext);

            await next(httpContext);

            userManager.Dispose();
        }
    }
}
