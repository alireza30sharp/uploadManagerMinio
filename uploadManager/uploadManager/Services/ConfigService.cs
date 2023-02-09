using uploadManager.Models;
using uploadManager.Utilities.Domains;
namespace uploadManager.Services
{
    public class ConfigService
    {
        public IConfiguration Configuration { get; }
        public string DefaultProfileSectionKey
        {
            get { return Configuration.GetSection(Configs.MINIO_DEFAULT_PROFILE_KEY).Get<string>()!; }
        }
        public ConfigService(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        public string GetProxyValue()
        {
            return Configuration.GetSection("Proxy").Value!;
        }
        public MinioConfigData GetMinioServerData(string minioKey)
        {
            return Configuration.GetSection(Configs.MINIO_KEY).GetSection(minioKey).Get<MinioConfigData>()!;
        }

        public MinioConfigApiData GetMinioApiData(string minioKey)
        {
            return Configuration.GetSection(Configs.MINIO_API).GetSection(minioKey).Get<MinioConfigApiData>()!;
        }

        public string GetMinioApiServerUrl()
        {
            return Configuration.GetSection(Configs.MINIO_API).GetSection(Configs.MINIO_API_SERVER_URL).Value!;
        }
        public IEnumerable<MinioConfigData> GetMinioServerDataProfiles()
        {
            var keys = Configuration.GetSection(Configs.MINIO_PROFILES_KEY).Get<string>()!;
            var configKeys = keys.Split(";", StringSplitOptions.RemoveEmptyEntries);
            var configItems = new List<MinioConfigData>();
            foreach (var key in configKeys)
            {
                yield return GetMinioServerData(key);
            }
        }
    }
}
