using uploadManager.Models;
using uploadManager.Utilities.Domains;
using uploadManager.Extensions;
namespace uploadManager.Services
{
    public class TranslationService
    {
        public IConfiguration _configuration { get; }



        public TranslationService(IConfiguration configuration)
        {
            _configuration = configuration;

        }

        public string SaveJsonFile(string json, string fileName)
        {
            try
            {
                var uploadsRootFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploadConvert\\");
                if (!Directory.Exists(uploadsRootFolder))
                {
                    Directory.CreateDirectory(uploadsRootFolder);
                }



                string filePath = uploadsRootFolder + fileName;
                File.WriteAllText(filePath, json);
                //FileStream fs = File.OpenWrite(filePath);
                return filePath;
            }
            catch (Exception ex)
            {
                return "";
            }
        }
    }
}
