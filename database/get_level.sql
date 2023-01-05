create or replace function quiz.get_level(_user_id int)
  returns table (level integer)
language plpgsql as
$func$
begin

  return query
  select min(q.level) as level
  from quiz.question q
  left join quiz.result r using(questionid)
  where (r.userid = @userId or not exists (select 1 from quiz.result where userid = @userId and questionid = q.questionid))
  and (r.easy is null or r.easy = false or r.medium is null or r.medium = false or r.hard is null or r.hard = false);

end
$func$;
