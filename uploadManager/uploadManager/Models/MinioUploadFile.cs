namespace uploadManager.Models
{
    public class MinioUploadFile
    {
        public IFormFile File { get; set; }
        public string? FileName { get; set; }
        /// <summary>
        /// append Tags for files
        /// </summary>
        /// <example>{"type":"develop","name":"yourName"}</example>
        public string? Tags { get; set; }
    }
    public class MinioRenameFile
    {
        public string FileName { get; set; }
        /// <summary>
        /// append Tags for files
        /// </summary>
        /// <example>{"type":"develop","name":"yourName"}</example>
        public string? Tags { get; set; }
    }
}
