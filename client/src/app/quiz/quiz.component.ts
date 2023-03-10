import {
  Component,
  OnInit,
  Renderer2,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question } from '../question';
import { Square } from '../square';
import { SquareUpdateParams } from '../square-update-params';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  level: number | undefined;
  completionPercentage: string = "0%";
  questions: Question[] = [];
  questionIndex = 0;
  currentQuestion: Question = new Question(0, '', '', 0, 0, false, false, false, 0);
  answerArray: Square[] = [];
  squareWidth = 45;
  letterIndex: number = 0;

  lastInput: string = '';
  inputListener: (() => void) | null;
  keydownListener: (() => void) | null;

  @ViewChild('hiddenInput')
  hiddenInput: ElementRef | undefined;

  @Output()
  quizComplete: EventEmitter<any> = new EventEmitter();

  constructor(private renderer: Renderer2, private httpClient: HttpClient) {
    this.inputListener = () => {};
    this.keydownListener = () => {};
  }

  next(): void {
    let correct = true;
    this.answerArray.forEach((square, index) => {
      if (square.letter !== this.currentQuestion.answer[index]) {
        square.incorrect = true;
        correct = false;
      }
    });
    if (!correct) {
      console.log('WRONG!');
      console.log(`Correct answer: ${this.currentQuestion.answer}`);
      this.answerArray.forEach((square, index) => {
        if (square.incorrect) {
          this.udpateSquare({ index: index, letter: this.currentQuestion.answer[index] });
        }
      });
    } else {
      let answer = this.answerArray.map((square) => square.letter).join("");
      console.log(`Answer: ${answer}`);
      console.log(`Correct!`);
      this.answerArray.forEach((square, index) => {
        this.udpateSquare({ index: index, correct: true });
      });
    }
    this.updateResults(correct);
    if (this.questions.every((question) => question.allComplete())) {
        console.info('Level cleared!!!');
    } else {
      setTimeout(() => {
        this.questionIndex++;
        this.setQuestion();
      }, correct ? 500 : 1000);
    }
  }


  skip(): void {
    this.updateResults(false);
    this.questionIndex++;
    this.setQuestion();
  }

  setQuestion(): void {
    this.answerArray.length = 0;
    if (this.questionIndex === this.questions.length) {
      this.getQuestions();
    } else {
      this.currentQuestion = this.questions[this.questionIndex];
      while (this.currentQuestion.allComplete() && this.questionIndex < this.questions.length - 1) {
        this.questionIndex++;
        this.currentQuestion = this.questions[this.questionIndex];
      }
      this.level = this.currentQuestion.level;
      if (this.currentQuestion.answer) {
        let charArray = this.currentQuestion.answer.split('');
        let revealedIndices = this.getRevealedIndices(charArray.length);
        let startFound = false;
        let question = '';
        charArray.forEach((ch: string, index: number) => {
          if (revealedIndices.includes(index)) {
            this.answerArray.push(new Square(ch, false));
            question += ch;
          } else {
            this.answerArray.push(new Square('', !startFound));
            question += '_';
            if (!startFound) {
              this.letterIndex = index;
            }
            startFound = true;
          }
        });
        console.log(`Difficulty: ${this.currentQuestion.difficulty()}; Question: ${question}`);
      }
    }
    if (this.hiddenInput) {
      this.hiddenInput.nativeElement.focus();
    }
  }

  attachListeners(): void {
    this.inputListener = this.renderer.listen('document', 'input', (event) => {
      let inputData: string = '';
      let newInputDataLength: number = 0;
      if (event.data !== null) {
        inputData = event.data.toUpperCase();
        if (inputData !== ' ' && inputData === this.lastInput) {
          return;
        }
        newInputDataLength = inputData.length;
      }
      const previousInputLength: number = this.lastInput ? this.lastInput.length : 0;
      this.lastInput = inputData;
      if (inputData !== null
        && inputData.length > 1
        && previousInputLength < inputData.length) {
          inputData = inputData.substring(inputData.length - 1); // get last letter only
      }
      if (inputData === null || newInputDataLength < previousInputLength) {
        this.handleBackspace();
      } else if (inputData.match(/^[A-Z]$/) != null) {
        let match = inputData.match(/^[A-Z]$/);
        if (match != null && match.length === 1) {
          this.handleLetter(inputData);
        }
      }
    });
    this.keydownListener = this.renderer.listen('document', 'keydown', (event) => {
      if (event.key === 'Unidentified') {
        return;
      }
      if (this.isValidKey(event)) {
        this.handleKey(event);
      }
    });
  }

  detachListeners(): void {
    if (this.keydownListener) {
      this.keydownListener();
      this.keydownListener = null;
    }
    if (this.inputListener) {
      this.inputListener();
      this.inputListener = null;
    }
  }

  click(event: any, letterIndex: number): void {
    event.preventDefault();
    let sq = this.answerArray[this.letterIndex];
    sq.current = false;
    this.answerArray[this.letterIndex] = {...sq};
    this.letterIndex = letterIndex;
    sq = this.answerArray[this.letterIndex];
    sq.current = true;
    this.answerArray[this.letterIndex] = {...sq};
    if (this.hiddenInput) {
      this.hiddenInput.nativeElement.focus();
    }
  }

  ngOnInit(): void {
    this.getQuestions();
    this.attachListeners();
  }

  private getQuestions(): void {
    this.httpClient.get(environment.baseUrl + 'questions').subscribe((questions: any) => {
      this.questions = questions.map((question: any) => {
        return new Question(
          question.questionid,
          question.text,
          question.answer,
          question.usages,
          question.resultid,
          question.easy,
          question.medium,
          question.hard,
          question.level);
      });
      this.questionIndex = 0;
      this.updateCompletionPercentage();
      this.answerArray = [];
      this.setQuestion();
    });
  }

  private updateResults(correct: boolean): void {
    let params = {
      questionid: this.currentQuestion.questionid,
      resultid: this.currentQuestion.resultid,
      correct: correct,
      difficulty: this.currentQuestion.difficulty()
    }
    this.currentQuestion.updateResult(correct);
    this.httpClient.post(environment.baseUrl + 'result', params).subscribe(() => {
    });
    this.updateCompletionPercentage();
  }

  private updateCompletionPercentage(): void {
    let totalQuestions = 0;
    let totalComplete = 0;
    this.questions.forEach((question: Question) => {
      totalQuestions += 3;
      totalComplete += question.totalComplete();
    });
    this.completionPercentage = `${Math.round((totalComplete / totalQuestions) * 100)}%`;
  }

  private isValidKey(event: any): boolean {
    const isLetter = event.keyCode >= 65 && event.keyCode <= 90;
    const isBackspace = event.keyCode === 8;
    const isEnter = event.keyCode === 13;
    const isArrowKey = event.keyCode > 36 && event.keyCode < 41;
    if (!isLetter && !isBackspace && !isEnter && !isArrowKey) {
      return false;
    }
    return true;
  }

  private handleKey(event: any): void {
    event.preventDefault();
    if (event.keyCode === 8) {
      this.handleBackspace();
    } else if (event.keyCode >= 65 && event.keyCode <= 90) {
      this.handleLetter(event.key.toUpperCase());
    } else if (event.keyCode > 36 && event.keyCode < 41) {
      this.handleArrow(event.keyCode);
    } else if (event.keyCode === 13) {
      this.next();
    }
  }

  private handleBackspace(): void {
    const sq = this.answerArray[this.letterIndex];
    sq.letter = '';
    sq.current = false;
    this.answerArray[this.letterIndex] = {...sq};
    if (this.letterIndex > 0) {
      this.letterIndex--;
    }
    // this.udpateSquare({ index: this.letterIndex, current: true});
    const nextSq = this.answerArray[this.letterIndex];
    nextSq.current = true;
    this.answerArray[this.letterIndex] = {...nextSq};
  }

  private handleLetter(letter: string): void {
    const sq = this.answerArray[this.letterIndex];
    sq.letter = letter;
    sq.current = false;
    this.answerArray[this.letterIndex] = {...sq};
    if (this.letterIndex < this.answerArray.length - 1) {
      this.letterIndex++;
      let nextSq = this.answerArray[this.letterIndex];
      while (this.letterIndex < this.answerArray.length - 1 && nextSq.letter !== '') {
        this.letterIndex++;
        nextSq = this.answerArray[this.letterIndex];
      }
      nextSq.current = true;
      this.answerArray[this.letterIndex] = {...nextSq};
    }
  }

  private handleArrow(keyCode: number): void {
    const sq = this.answerArray[this.letterIndex];
    sq.current = false;
    this.answerArray[this.letterIndex] = {...sq};
    switch (keyCode) {
      // arrow left
      case 37:
        if (this.letterIndex > 0) {
          this.letterIndex--;
        }
        break;
      // arrow right
      case 39:
        if (this.letterIndex < this.answerArray.length - 1) {
          this.letterIndex++
        }
        break;
    }
    const nextSq = this.answerArray[this.letterIndex];
    nextSq.current = true;
    this.answerArray[this.letterIndex] = {...nextSq};
  }

  private getRevealedIndices(length: any) {
    let allIndices = [...Array(length).keys()]
    let numberRevealed = 0;
    let difficulty = this.currentQuestion.difficulty();
    switch (difficulty) {
      case 'easy':
        numberRevealed = Math.floor(length * 0.75);
        break;
      case 'medium':
        numberRevealed = Math.floor(length * 0.5);
        break;
      case 'hard':
        numberRevealed = 0;
        break;
    }
    this.shuffleArray(allIndices);
    return allIndices.slice(0, numberRevealed);
  }

  private shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  private udpateSquare({index, current, correct, incorrect, letter}: SquareUpdateParams): void {
    const nextSq = this.answerArray[index];
    if (current) {
      nextSq.current = current;
    }
    if (correct) {
      nextSq.correct = correct;
    }
    if (incorrect) {
      nextSq.incorrect = incorrect;
    }
    if (letter) {
      nextSq.letter = letter;
    }
    this.answerArray[index] = {...nextSq};
  }
}
