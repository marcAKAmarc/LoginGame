using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(LoginGame.Startup))]
namespace LoginGame
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
