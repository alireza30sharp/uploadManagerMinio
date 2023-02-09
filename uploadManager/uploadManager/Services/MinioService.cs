using Minio;
using System.Net;
using uploadManager.Models;
using Minio.DataModel;
namespace uploadManager.Services
{
    public class MinioService
    {
        private readonly ConfigService configService;

        public MinioService(ConfigService configService)
        {
            ServicePointManager.ServerCertificateValidationCallback +=
                (sender, cert, chain, sslPolicyErrors) => true;
            this.configService = configService;
        }

        public MinioClient Build(MinioConfigData mcd)
        {
            return new MinioClient()
                .WithEndpoint(mcd.Url)
                .WithCredentials(mcd.AccessKey, mcd.SecretKey)
                .WithSSL();
        }

        public MinioClient Build(string configKey)
        {
            var mcd = configService.GetMinioServerData(configKey);

            return new MinioClient()
                .WithEndpoint(mcd.Url)
                .WithCredentials(mcd.AccessKey, mcd.SecretKey)
                .Build();
        }
        public MinioClient BuildApi(string configKey)
        {
            var mcd = configService.GetMinioApiData(configKey);

            HttpClientHandler clientHandler = new HttpClientHandler();
            clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };
            // Pass the handler to httpclient(from you are calling api)
            HttpClient client = new HttpClient(clientHandler);
            return new MinioClient()
                .WithEndpoint(configService.GetMinioApiServerUrl())
                .WithCredentials(mcd.AccessKey, mcd.SecretKey)
                //.WithSSL()
                .WithHttpClient(client)
                .Build();
        }
    }
}
