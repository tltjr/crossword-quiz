using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Npgsql;
using Dapper;

namespace service.Controllers;

[ApiController]
public class QuizController : ControllerBase
{
    private readonly ILogger<QuizController> _logger;
    private readonly string _connectionString;

    private const int _userId = 1;

    public QuizController(ILogger<QuizController> logger, IOptions<ConnectionStrings> connectionStrings)
    {
        _logger = logger;
        _connectionString = connectionStrings.Value.DefaultConnection;
    }

    [HttpGet]
    [Route("questions")]
    public dynamic GetQuestions()
    {
        using(var connection = new NpgsqlConnection(_connectionString))
        {
            return connection.Query(@"select * from quiz.get_questions(@userId);", new { userId = _userId });
        }
    }

    [HttpPost]
    [Route("result")]
    public void UpdateResult([FromBody] Result result)
    {
        using(var connection = new NpgsqlConnection(_connectionString))
        {
            if (result.ResultId.HasValue)
            {
                var (easy, medium, hard) = GetResults(result.ResultId.Value);
                switch (result.Difficulty.ToLower()) {
                  case "easy":
                    easy = result.Correct;
                    break;
                  case "medium":
                    medium = result.Correct;
                    if (!result.Correct) {
                      easy = false;
                    }
                    break;
                  case "hard":
                    hard = result.Correct;
                    if (!result.Correct) {
                      medium = false;
                    }
                    break;
                }
                connection.Execute(@"update quiz.result set easy = @easy, medium = @medium, hard = @hard
                                     where resultid = @resultId and userId = @userId;",
                                     new
                                     {
                                        easy = easy,
                                        medium = medium,
                                        hard = hard,
                                        resultId = result.ResultId,
                                        userId = _userId
                                    });
            }
            else
            {
                // we always start with easy so should be able to only update the easy column
                connection.Execute(@"insert into quiz.result (questionid, userid, easy)
                                     values (@questionId, @userId, @easy);",
                                      new
                                      {
                                        questionId = result.QuestionId,
                                        userId = _userId,
                                        easy = result.Correct
                                      });
            }
        }
    }

    private (bool, bool, bool) GetResults(int resultId)
    {
        using(var connection = new NpgsqlConnection(_connectionString))
        {
            return connection.QuerySingle<(bool, bool, bool)>(@"select easy, medium, hard from quiz.result where resultid = @resultId and userId = @userId;",
                                                        new { resultId = resultId, userId = _userId });
        }
    }
}
