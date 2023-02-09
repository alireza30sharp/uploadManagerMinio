using Minio;

namespace uploadManager.Services
{
    public static class ServiceExtension
    {
        public static void AddObjectStorageServices(this IServiceCollection svc)
        {
            svc.AddSingleton<ConfigService>();
            svc.AddSingleton<ProxyService>();
            svc.AddSingleton<TranslationService>();
            svc.AddScoped<HttpService>();
            svc.AddScoped<MinioService>();
        }
    }
}
