using Microsoft.AspNetCore.Mvc;
using Minio;
namespace uploadManager.Extensions
{
    public static class MinioExtensions
    {
        public async static Task<FileStreamResult> ToFileStreamResult(
            this MinioClient client,
            string bucketId,
            string objectId
        )
        {
            try
            {
                MemoryStream stream = new MemoryStream();
                var objArg = new GetObjectArgs()
                    .WithBucket(bucketId)
                    .WithObject(objectId)
                    .WithCallbackStream(
                        (_stream) =>
                        {
                            // TODO: Read _stream with buffer bytes when minio have large object
                            _stream.CopyTo(stream);
                        }
                    );

                var objStat = await client.GetObjectAsync(objArg);

                stream.Position = 0;
                return new FileStreamResult(stream, objStat.ContentType)
                {
                    LastModified = DateTimeOffset.FromFileTime(objStat.LastModified.ToFileTime()),
                    EntityTag = new Microsoft.Net.Http.Headers.EntityTagHeaderValue(
                        string.Concat("\"", objStat.ETag, "\"")
                    ),
                    EnableRangeProcessing = true
                };
            }
            catch (Exception)
            {
                throw;
            }
        }

    }
}
