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
    public dynamic Get()
    {
        using(var connection = new NpgsqlConnection(_connectionString))
        {
            int level = GetLevel();
            return connection.Query(@"select q.questionid, q.text, q.answer, q.usages, r.resultid, r.easy, r.medium, r.hard
                                      from quiz.question q
                                      left join quiz.result r using(questionid)
                                      where (r.userid = @userId or not exists (select 1 from quiz.result where userid = @userId and questionid = q.questionid))
                                      and level = @level
                                      order by easy nulls first, medium nulls first, hard nulls first, usages desc;",
                                      new
                                      {
                                        userId = _userId,
                                        level = level
                                      });
        }
    }

    private int GetLevel()
    {
        using(var connection = new NpgsqlConnection(_connectionString))
        {
            return connection.QuerySingle<int>(@"select min(q.level) as level
                                      from quiz.question q
                                      left join quiz.result r using(questionid)
                                      where (r.userid = @userId or not exists (select 1 from quiz.result where userid = @userId and questionid = q.questionid))
                                      and (r.easy is null or r.easy = false or r.medium is null or r.medium = false or r.hard is null or r.hard = false);", new { userId = _userId });
        }
    }
}
