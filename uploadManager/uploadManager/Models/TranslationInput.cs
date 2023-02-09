namespace uploadManager.Models
{
    public class TranslationInput
    {
        public long? id { get; set; }
        public string? client { get; set; }
        public string? key { get; set; }
        public string? fa { get; set; }
        public string? en { get; set; }
        public string? ar { get; set; }
        public int? repeat { get; set; }
    }
}
