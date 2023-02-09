//using Minio;
//using System.Net;
//using System.Net;
//using System.Reactive.Linq;
//using Minio;
//namespace BucketToAnotherBucket
//{
//    public class Class1
//    {


//string endpoint = "endpoint ";
//    string accessKey = "accessKey";
//    string secretKey = "secretKey+6qophAoPkRVUmRTTO0izZ";


//    ServicePointManager
//            .ServerCertificateValidationCallback +=
//    (sender, cert, chain, sslPolicyErrors) => true;

//bool finished = false;
//    MinioClient minioClient = new MinioClient(endpoint, accessKey, secretKey).WithSSL();
//    MinioClient minioClientnew =
//        new MinioClient("1.sys", "accessKey1", "secretKey1").WithSSL();

//    List<String> x = new List<string>();

//    var uploadsRootFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploadConvert\\");
//if (!Directory.Exists(uploadsRootFolder))
//{
//    Directory.CreateDirectory(uploadsRootFolder);
//}

//var observable = minioClient.ListObjectsAsync("bacut"); //

//observable.Subscribe(
//    item => { x.Add(item.Key); },
//    ex => Console.WriteLine("OnError: {0}", ex.Message),
//    () => { finished = true; });

//observable.Wait();

//x.ForEach(async item =>
//{
//    string fileName = uploadsRootFolder + item;
//    await minioClient.GetObjectAsync("issue", item, fileName);
//    await minioClientnew.PutObjectAsync("blobs", item, fileName);
//    File.Delete(uploadsRootFolder + item);
//});
//    }
//}