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

  totalComplete(): number {
    let numComplete = 0;
    if (this.easy) {
      numComplete++;
    }
    if (this.medium) {
      numComplete++;
    }
    if (this.hard) {
      numComplete++;
    }
    return numComplete;
  }

  updateResult(correct: boolean): void {
    switch (this.difficulty()) {
      case 'easy':
        this.easy = correct;
        break;
      case 'medium':
        this.medium = correct;
        // If the user got the medium question wrong, we need to revert them to easy
        if (!correct) {
          this.easy = false;
        }
        break;
      case 'hard':
        this.hard = correct;
        // If the user got the hard question wrong, we need to revert them to medium
        if (!correct) {
          this.medium = false;
        }
        break;
    }
  }

  allComplete(): boolean {
    return this.easy && this.medium && this.hard;
  }
}