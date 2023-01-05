public class Result
{
    public int? ResultId { get; set; }
    public int QuestionId { get; set;}
    public int UserId { get; set; }
    public string Difficulty { get; set; } = "";
    public bool Correct { get; set; }

    public override string ToString()
    {
        return $"ResultId: {ResultId}, QuestionId: {QuestionId}, UserId: {UserId}, Difficulty: {Difficulty}, Correct: {Correct}";
    }
}