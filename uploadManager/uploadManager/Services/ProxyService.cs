using System.Net;

namespace uploadManager.Services
{
    public class ProxyService
    {
        public WebProxy WebProxy { get; set; }

        public ProxyService(ConfigService configService)
        {
            var proxyUrl = configService.GetProxyValue();

            this.WebProxy = new WebProxy()
            {
                Address = new Uri(proxyUrl),
                UseDefaultCredentials = true
            };
        }
    }
}
