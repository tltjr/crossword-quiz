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
            return connection.Query(@"select * from quiz.get_questions(@userId);", new { userId = _userId });
        }
    }
}
