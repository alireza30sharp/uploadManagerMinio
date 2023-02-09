namespace uploadManager.Models
{
    public class MinioFiles
    {
        public string Path { get; set; }
        public Dictionary<string, string>? Tags { get; set; }
    }
}
