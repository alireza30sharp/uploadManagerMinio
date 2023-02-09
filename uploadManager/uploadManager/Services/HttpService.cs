using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace uploadManager.Services
{
    public class HttpService
    {
        public ProxyService ProxyService { get; }

        public HttpService(ProxyService proxyService)
        {
            ProxyService = proxyService;
        }

        public HttpClient NewHttpClient()
        {
            var httpClientHandler = new HttpClientHandler() { Proxy = ProxyService.WebProxy };
            var client = new HttpClient(handler: httpClientHandler, disposeHandler: false);
            client.Timeout = TimeSpan.FromMinutes(30);
            return client;
        }
    }
}
