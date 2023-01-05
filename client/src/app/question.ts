export class Question {
  questionid: number;
  text: string;
  answer: string;
  usages: number;
  resultid: number;
  easy: boolean;
  medium: boolean;
  hard: boolean;
  level: number;

  constructor(
    questionid: number,
    text: string,
    answer: string,
    usages: number,
    resultid: number,
    easy: boolean,
    medium: boolean,
    hard: boolean,
    level: number
  ) {
    this.questionid = questionid;
    this.text = text;
    this.answer = answer;
    this.usages = usages;
    this.resultid = resultid;
    this.easy = easy;
    this.medium = medium;
    this.hard = hard;
    this.level = level;
  }

  difficulty(): string {
    if (!this.easy) {
      return 'easy';
    } else {
      if (!this.medium) {
        return 'medium';
      } else {
        return 'hard';
      }
    }
  }
}