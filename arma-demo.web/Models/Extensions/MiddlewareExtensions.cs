using arma_demo.web.Models.Infrastructure;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading.Tasks;

namespace arma_demo.web.Models.Extensions
{
    public static class MiddlewareExtensions
    {
        public static AuthenticationBuilder AddAzureAuthentication(this IServiceCollection services, IConfiguration config, IHostingEnvironment env)
        {
            return services.AddAuthentication(sharedOptions =>
            {
                sharedOptions.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                sharedOptions.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
            })
            .AddCookie()
            .AddOpenIdConnect(option =>
            {
                option.ClientId = env.IsProduction() ? config["AzureAd:ClientId"] : config["AzureAd:TestClientId"];
                option.Authority = String.Format(config["AzureAd:AadInstance"], config["AzureAd:Tenant"]);
                option.SignedOutRedirectUri = env.IsProduction() ? config["AzureAd:PostLogoutRedirectUri"] : config["AzureAd:TestLogoutRedirectUri"];
                option.Events = new OpenIdConnectEvents
                {
                    OnRemoteFailure = OnAuthenticateionFailed
                };
            });
        }

        public static IApplicationBuilder UseUserMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<UserMiddleware>();
        }

        public static Task OnAuthenticateionFailed(RemoteFailureContext context)
        {
            context.HandleResponse();
            context.Response.Redirect($"/Home/Error?message={context.Failure.Message}");
            return Task.FromResult(0);
        }
    }
}
