using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using uploadManager.Services;
using uploadManager.Extensions;
namespace uploadManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly ConfigService configService;
        private readonly MinioService minioService;
        public ImageController(ConfigService configService, MinioService minioService)
        {
            this.configService = configService;
            this.minioService = minioService;
        }

        [HttpGet("Url")]
        public async Task<ActionResult> UrlAsync(string bucket, string obj)
        {
            if (String.IsNullOrEmpty(bucket) || String.IsNullOrEmpty(obj))
            {
                return StatusCode((int)HttpStatusCode.BadRequest);
            }

            foreach (var cfg in configService.GetMinioServerDataProfiles())
            {
                try
                {
                    return await minioService.Build(cfg).ToFileStreamResult(bucket, obj);
                }
                catch { }
            }

            return StatusCode((int)HttpStatusCode.NotFound);
        }
    }
}
