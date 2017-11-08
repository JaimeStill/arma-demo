using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using arma_demo.data;
using Microsoft.EntityFrameworkCore;
using arma_demo.web.Models.Extensions;
using arma_demo.web.Models.Infrastructure;
using arma_demo.web.Hubs;
using arma_demo.web.Models.Authorization;
using Microsoft.AspNetCore.Authorization;

namespace arma_demo.web
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IHostingEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;
        }

        public IHostingEnvironment Environment { get; }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
            services.AddSignalR();

            if (Environment.IsDevelopment())
            {
                services.AddDbContext<AppDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("Azure")));
            }
            else
            {
                services.AddDbContext<AppDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("Azure")));
            }

            services.AddAzureAuthentication(Configuration, Environment);
            services.AddScoped<UserManager>();

            services.AddAuthorization(options =>
            {
                options.AddPolicy("Authenticated", policy => policy.Requirements.Add(new AuthorizationRequirement()));
            });

            services.AddScoped<IAuthorizationHandler, AuthHandler>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseAuthentication();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseUserMiddleware();

            app.UseExceptionHandler(errorApp => 
            {
                errorApp.Run(async context => 
                {
                    context.Response.StatusCode = 500;
                    context.Response.ContentType = "application/json";

                    var error = context.Features.Get<IExceptionHandlerFeature>();

                    if (error != null)
                    {
                        var ex = error.Error;

                        await context.Response.WriteAsync(new ApiError
                        {
                            Message = ex.Message
                        }.ToString(), Encoding.UTF8);
                    }
                });
            });

            app.UseSignalR(routes =>
            {
                routes.MapHub<Host>("host");
            });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }
    }
}
