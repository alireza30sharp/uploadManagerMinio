using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Reactive.Linq;
using System.IO;
using System.Text.RegularExpressions;
using System.Web;
using System.Net;
using Minio;
using Minio.DataModel;
using Minio.DataModel.Tags;
using Minio.Exceptions;
using Newtonsoft.Json;
using System.Text.Json;
using uploadManager.Models;
using uploadManager.Services;
using uploadManager.Extensions;
namespace uploadManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MediaController : ControllerBase
    {
        private readonly HttpService httpService;
        private readonly ConfigService configService;
        private readonly MinioService minioService;
        public MediaController(
      ConfigService configService,
      MinioService minioService,
      HttpService httpService
  )
        {
            this.httpService = httpService;
            this.configService = configService;
            this.minioService = minioService;

            ServicePointManager.ServerCertificateValidationCallback +=
                (sender, cert, chain, sslPolicyErrors) => true;
        }

        [HttpGet]
        public async Task<IActionResult> GetAsync()
        {
            if (Request.QueryString.Value == null)
            {
                return StatusCode((int)HttpStatusCode.BadRequest);
            }

            var queryString = Request.QueryString.Value;
            if (queryString.Contains("bucketId") && queryString.Contains("objectId"))
            {
                var qs = HttpUtility.ParseQueryString(queryString);

                return await MinioAsync(
                    qs["bucketId"]!,
                    qs["objectId"]!,
                    qs["server"] ?? String.Empty
                );
            }

            return StreamAsync();
        }

        /*[HttpGet("Minio")]*/
        private async Task<IActionResult> MinioAsync(string bucketId, string objectId, string server)
        {
            if (String.IsNullOrEmpty(bucketId) || String.IsNullOrEmpty(objectId))
            {
                return StatusCode((int)HttpStatusCode.BadRequest);
            }

            try
            {
                if (String.IsNullOrEmpty(server))
                {
                    server = configService.DefaultProfileSectionKey;
                }

                return await minioService.Build(server).ToFileStreamResult(bucketId, objectId);
            }
            catch
            {
            }

            return StatusCode((int)HttpStatusCode.NotFound);
        }

        /// <summary>
        /// <para>
        ///     دریافت
        /// </para>
        /// <example>
        ///     /api/Message/GetStream/?https://instagram.fbkk28-1.fna.fbcdn.net/v/t51.2885-15/282044089_532915761717702_6851397334720809014_n.jpg
        /// </example>
        /// </summary>
        /// <returns></returns>
        ///
        //[HttpGet("Stream")]
        private IActionResult StreamAsync()
        {
            if (Request.QueryString.Value == null)
            {
                return StatusCode((int)HttpStatusCode.BadRequest);
            }

            using (var client = httpService.NewHttpClient())
            {
                try
                {
                    var qs = Request.QueryString.Value.Substring(1);
                    var httpRes = client.GetAsync(qs).GetAwaiter().GetResult();
                    if (httpRes.StatusCode != HttpStatusCode.OK)
                    {
                        return StatusCode((int)httpRes.StatusCode);
                    }

                    var _uri = new Uri(qs);
                    var ext = new FileInfo(_uri.AbsolutePath).Extension;
                    if (String.IsNullOrEmpty(ext))
                    {
                        ext = new FileInfo(_uri.AbsoluteUri).Extension;
                    }

                    return File(
                        httpRes.Content.ReadAsStream(),
                        System.Web.MimeMapping.GetMimeMapping(ext)
                    );
                }
                catch (System.Exception)
                {
                    return StatusCode((int)HttpStatusCode.InternalServerError);
                }
            }
        }


        [HttpPost("Upload/{BucketName}")]
        public async Task<IActionResult> UploadAsync(string BucketName, [FromForm] MinioUploadFile UploadFile
        )
        {
            try
            {
                if (String.IsNullOrEmpty(BucketName) ||
                    UploadFile.File == null
                   )
                {
                    return StatusCode((int)HttpStatusCode.BadRequest);
                }

                var minioClient = minioService.BuildApi(BucketName);

                var fileName = String.Concat(Guid.NewGuid(), Path.GetExtension(UploadFile.File.FileName));

                // Check exist Bucket Name
                var found = await minioClient.BucketExistsAsync(BucketName);
                if (!found)
                {
                    return StatusCode((int)HttpStatusCode.NotFound, $"bucket {BucketName} not found");
                }

                using (var reader = new StreamReader(UploadFile.File.OpenReadStream()))
                {
                    fileName = String.IsNullOrEmpty(UploadFile.FileName) ? fileName : UploadFile.FileName;

                    var putObjectArgs = new PutObjectArgs()
                        .WithBucket(BucketName)
                        .WithObject(fileName)
                        .WithObjectSize(UploadFile.File.Length)
                        .WithStreamData(reader.BaseStream)
                        .WithContentType(UploadFile.File.ContentType);
                    //.WithHeaders(tags);

                    if (!String.IsNullOrEmpty(UploadFile.Tags))
                    {
                        var dic = JsonConvert.DeserializeObject<Dictionary<string, string>>(UploadFile.Tags.ToString());

                        putObjectArgs.WithTagging(Tagging.GetObjectTags(dic));
                    }

                    // Upload a file to bucket.
                    await minioClient.PutObjectAsync(putObjectArgs);
                }

                return StatusCode((int)HttpStatusCode.OK, new
                {
                    FileName = fileName,
                    ContentType = UploadFile.File.ContentType,
                    Size = UploadFile.File.Length
                });
            }
            catch (Exception e)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
            }
        }

        [HttpPost("UpdateTags/{BucketName}")]
        public async Task<IActionResult> UpdateTagsAsync(string BucketName, [FromForm] MinioRenameFile RenameFile
        )
        {
            try
            {
                if (Directory.Exists("Files"))
                {
                    GC.Collect();
                    GC.WaitForPendingFinalizers();
                    Directory.Delete("Files", true);
                }

                Directory.CreateDirectory("Files");

                if (String.IsNullOrEmpty(BucketName) ||
                    String.IsNullOrEmpty(RenameFile.FileName) ||
                    String.IsNullOrEmpty(RenameFile.Tags)
                   )
                {
                    return StatusCode((int)HttpStatusCode.BadRequest);
                }

                var minioClient = minioService.BuildApi(BucketName);
                // Check exist Bucket Name
                var found = await minioClient.BucketExistsAsync(BucketName);
                if (!found)
                {
                    return StatusCode((int)HttpStatusCode.NotFound, $"bucket {BucketName} not found");
                }

                string fileName = RenameFile.FileName.Split("/").LastOrDefault();

                var args = new GetObjectArgs()
                    .WithBucket(BucketName)
                    .WithObject(RenameFile.FileName)
                    .WithFile($"Files/{fileName}");

                var minioFile = await minioClient.GetObjectAsync(args);

                if (String.IsNullOrEmpty(minioFile.ObjectName))
                {
                    return StatusCode((int)HttpStatusCode.NotFound);
                }

                var putObjectArgs = new PutObjectArgs()
                    .WithBucket(BucketName)
                    .WithObject(RenameFile.FileName)
                    .WithFileName($"Files/{fileName}")
                    .WithObjectSize(minioFile.Size)
                    .WithContentType(minioFile.ContentType);


                var tags = new GetObjectTagsArgs()
                    .WithBucket(BucketName)
                    .WithObject(RenameFile.FileName);
                var minioTagsFile = await minioClient.GetObjectTagsAsync(tags);

                var dic = minioTagsFile.GetTags();


                var newTags = JsonConvert.DeserializeObject<Dictionary<string, string>>(RenameFile.Tags.ToString());

                if (dic != null)
                {
                    foreach (KeyValuePair<string, string> entry in newTags)
                    {
                        if (dic.ContainsKey(entry.Key))
                        {
                            dic.Remove(entry.Key);
                        }

                        dic.Add(entry.Key, entry.Value);
                    }
                }
                else
                {
                    dic = newTags;
                }


                putObjectArgs.WithTagging(Tagging.GetObjectTags(dic));

                // Upload a file to bucket.
                await minioClient.PutObjectAsync(putObjectArgs);


                return StatusCode((int)HttpStatusCode.OK, new
                {
                    FileName = RenameFile.FileName,
                    ContentType = minioFile.ContentType,
                    Size = minioFile.Size,
                    Tags = dic
                });
            }
            catch (Exception e)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
            }
        }

        [HttpGet("Search/{BucketName}")]
        public async Task<IActionResult> SearchAsync(string BucketName, bool IsRecursive = false)
        {
            try
            {
                List<MinioFiles> files = new List<MinioFiles>();

                List<string> filePath = new List<string>();

                if (String.IsNullOrEmpty(BucketName))
                {
                    return StatusCode((int)HttpStatusCode.BadRequest);
                }

                var minioClient = minioService.BuildApi(BucketName);

                // Check exist Bucket Name
                var found = await minioClient.BucketExistsAsync(BucketName);
                if (!found)
                {
                    return StatusCode((int)HttpStatusCode.NotFound);
                }

                var listArgs = new ListObjectsArgs()
                    .WithBucket(BucketName)
                    .WithVersions(false)
                    .WithRecursive(IsRecursive);

                IObservable<Item> observable = minioClient.ListObjectsAsync(listArgs);

                observable.Subscribe(async item =>
                {
                    if (item.IsDir == false)
                    {
                        filePath.Add(item.Key);
                    }
                }, ex => throw ex
                    , () => { }
                );

                observable.Wait();


                if (filePath.Count > 0)
                {
                    foreach (string fPath in filePath)
                    {
                        Dictionary<string, string> tags = new Dictionary<string, string>();

                        var fileTags = await minioClient.GetObjectTagsAsync(
                            new GetObjectTagsArgs()
                                .WithBucket(BucketName)
                                .WithObject(fPath)
                        );

                        if (fileTags != null && fileTags.GetTags() != null)
                        {
                            tags = fileTags.GetTags();
                        }

                        files.Add(new MinioFiles()
                        {
                            Path = $"{BucketName}/{fPath}",
                            Tags = tags
                        });
                    }
                }

                return Ok(files);
            }
            catch (Exception e)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
            }
        }

        [HttpPost("DeleteFile/{BucketName}")]
        public async Task<IActionResult> DeleteFileAsync(string BucketName, string FileName)
        {
            try
            {
                if (String.IsNullOrEmpty(BucketName) ||
                    String.IsNullOrEmpty(FileName)
                   )
                {
                    return StatusCode((int)HttpStatusCode.BadRequest);
                }

                var minioClient = minioService.BuildApi(BucketName);

                // Check exist Bucket Name
                var found = await minioClient.BucketExistsAsync(BucketName);
                if (!found)
                {
                    return StatusCode((int)HttpStatusCode.NotFound, $"bucket {BucketName} not found");
                }

                var objArgs = new RemoveObjectArgs()
                    .WithBucket(BucketName)
                    .WithObject(FileName);

                await minioClient.RemoveObjectAsync(objArgs);

                return StatusCode((int)HttpStatusCode.OK,
                    $"Removed object {FileName} from bucket {BucketName} successfully");
            }
            catch (Exception e)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
            }
        }
    }
}
