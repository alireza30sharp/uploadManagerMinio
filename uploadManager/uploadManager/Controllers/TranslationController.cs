using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.RegularExpressions;
using Minio;
using Minio.DataModel;
using Minio.DataModel.Tags;
using Minio.Exceptions;
using Newtonsoft.Json;
using System.Web;
using System.IO;
using uploadManager.Models;
using uploadManager.Services;
using uploadManager.Extensions;
namespace uploadManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TranslationController : ControllerBase
    {
        private readonly TranslationService _translationService;
        private readonly MinioService _minioService;
        public TranslationController(TranslationService translationService, MinioService minioService)
        {
            _translationService = translationService;
           _minioService = minioService;
        }
        [HttpPost("TranslationJson/{BucketName}")]
        public async Task<IActionResult> BuildJson(string BucketName, [FromBody] List<TranslationInput> translationInputs)
        {
          //  translationInputs=[{ "id":1,"client":"apiservice","key":"ایرا","fa":"ایرانی","en":null,"ar":"الایرانی","repeat":0},{ "id":1,"client":"apiservice","key":"ماشین","fa":"ماش","en":"car","ar":"السيارات","repeat":0},{ "id":3,"client":"apiservice","key":"کشور","fa":"کشور","en":"country","ar":"دولة","repeat":1}]
            try
            {

                if (String.IsNullOrEmpty(BucketName))
                {
                    return StatusCode((int)HttpStatusCode.BadRequest);
                }
                var minioClient = _minioService.BuildApi(BucketName);
                // Check exist Bucket Name
                var found = await minioClient.BucketExistsAsync(BucketName);
                /*
                 * بر اساس کلید های موجود زبان
                 */
                Dictionary<string, string> DictionaryEn = new Dictionary<string, string>();
                Dictionary<string, string> DictionaryFa = new Dictionary<string, string>();
                Dictionary<string, string> DictionaryAr = new Dictionary<string, string>();

                string fileName = "";
                var groupByClintId = translationInputs.Distinct(new ProductComparer()).GroupBy(x => x.client);

                if (groupByClintId.Count() > 0)
                {
                    foreach (var clintes in groupByClintId)
                    {
                        fileName += clintes.Key;
                        var list = clintes.ToList();
                        list.ForEach(s => DictionaryEn.Add(s.key, s.en));
                        list.ForEach(s => DictionaryFa.Add(s.key, s.fa));
                        list.ForEach(s => DictionaryAr.Add(s.key, s.ar));

                    }
                    string fullPath = "";
                    //ذخیره سازی فیزیکی فایل بر اساس کلید
                    fullPath = _translationService.SaveJsonFile(JsonConvert.SerializeObject(DictionaryEn), fileName + "-en.json");

                    await UploadAsyncToMinio(BucketName, fileName + "-en.json", fullPath);
                    fullPath = _translationService.SaveJsonFile(JsonConvert.SerializeObject(DictionaryFa), fileName + "-fa.json");
                    await UploadAsyncToMinio(BucketName, fileName + "-fa.json", fullPath);

                    fullPath = _translationService.SaveJsonFile(JsonConvert.SerializeObject(DictionaryAr), fileName + "-ar.json");
                    await UploadAsyncToMinio(BucketName, fileName + "-ar.json", fullPath);
                }


                return StatusCode((int)HttpStatusCode.OK, new
                {
                    FileName = fileName,
                    ContentType = "json",
                });
            }
            catch (Exception e)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
            }
        }

        private async Task<bool> UploadAsyncToMinio(string BucketName, string FileName, string FullPath)
        {
            var minioClient = _minioService.BuildApi(BucketName);
            var putObjectArgs = new PutObjectArgs()
                    .WithBucket(BucketName)
                    .WithObject(FileName)
                    .WithFileName($"{FullPath}");
            await minioClient.PutObjectAsync(putObjectArgs);


            return true;

        }
    }

    public class ProductComparer : IEqualityComparer<TranslationInput>
    {
        // Products are equal if their names and product numbers are equal.
        public bool Equals(TranslationInput x, TranslationInput y)
        {

            //Check whether the compared objects reference the same data.
            if (Object.ReferenceEquals(x, y)) return true;

            //Check whether any of the compared objects is null.
            if (Object.ReferenceEquals(x, null) || Object.ReferenceEquals(y, null))
                return false;

            //Check whether the products' properties are equal.
            return x.key == y.key;
        }
        public int GetHashCode(TranslationInput product)
        {
            //Check whether the object is null
            if (Object.ReferenceEquals(product, null)) return 0;

            //Get hash code for the Name field if it is not null.
            int hashProductName = product.key == null ? 0 : product.key.GetHashCode();

            //Get hash code for the Code field.
            int hashProductCode = product.key.GetHashCode();

            //Calculate the hash code for the product.
            return hashProductName ^ hashProductCode;
        }

    }
}
