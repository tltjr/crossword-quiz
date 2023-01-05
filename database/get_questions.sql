create or replace function quiz.get_questions(_user_id int)
  returns table (questionid integer,
    text text,
    answer character varying(15),
    usages integer,
    resultid integer,
    easy boolean,
    medium boolean,
    hard boolean)
language plpgsql as
$func$

declare _level integer; 

begin

  select level into _level from quiz.get_level(_user_id);

  return query
  select q.questionid, q.text, q.answer, q.usages, r.resultid, r.easy, r.medium, r.hard
  from quiz.question q
  left join quiz.result r using(questionid)
  where (r.userid = _user_id or not exists (select 1 from quiz.result r2 where r2.userid = _user_id and r2.questionid = q.questionid))
  and q.level = _level
  order by r.easy nulls first, r.medium nulls first, r.hard nulls first, q.usages desc;

end
$func$;
