CREATE SCHEMA IF NOT EXISTS quiz;

--
-- Name: question; Type: TABLE; Schema: quiz; Owner: postgres
--

CREATE TABLE IF NOT EXISTS quiz.question (
    questionid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    text text NOT NULL,
    answer character varying(15) NOT NULL,
    usages integer NOT NULL
);

ALTER TABLE quiz.question OWNER TO postgres;

--
-- Name: result; Type: TABLE; Schema: quiz; Owner: postgres
--

CREATE TABLE IF NOT EXISTS quiz.result (
    resultid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    questionid integer NOT NULL,
    userid integer,
    percentage numeric(3, 2) NOT NULL,
    tries integer NOT NULL,
    difficulty character varying(10) NOT NULL
);

ALTER TABLE quiz.result OWNER TO postgres;

--
-- Name: quiz result_questionid_fkey; Type: FK CONSTRAINT; Schema: quiz; Owner: postgres
--

DO $$
BEGIN
  IF NOT EXISTS (SELECT constraint_name
                 FROM information_schema.table_constraints 
                 WHERE table_name = 'result' AND constraint_name = 'result_questionid_fkey') THEN
    ALTER TABLE ONLY quiz.result ADD CONSTRAINT result_questionid_fkey FOREIGN KEY (questionid) REFERENCES quiz.question(questionid);
  END IF;
END$$;
