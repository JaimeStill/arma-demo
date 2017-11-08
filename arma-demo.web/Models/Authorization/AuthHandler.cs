using arma_demo.web.Models.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace arma_demo.web.Models.Authorization
{
    public class AuthHandler : AuthorizationHandler<AuthorizationRequirement>
    {
        UserManager manager;
        public AuthHandler(UserManager manager)
        {
            this.manager = manager;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, AuthorizationRequirement requirement)
        {
            if (manager.CurrentUser == null)
            {
                context.Fail();
            }
            else
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
