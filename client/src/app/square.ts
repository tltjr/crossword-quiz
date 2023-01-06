export class Square {
  letter: string;
  current: boolean;
  correct: boolean = false;
  incorrect: boolean = false;

  constructor(letter: string, current: boolean) {
    this.letter = letter;
    this.current = current;
  }
}
