import {
  Component,
  Input,
  OnInit,
  Renderer2,
  Output,
  EventEmitter
} from '@angular/core';
import { DataService } from '../data.service';
import { Square } from '../square';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  quiz: any;
  questionIndex = 0;
  currentQuestion: any = '';
  answerArray: Square[] = [];
  squareWidth = 45;
  letterIndex: number = 0;

  lastInput: string = '';
  inputListener: (() => void) | null;
  keydownListener: (() => void) | null;

  topic: string = 'gods';
  difficulty: string = 'hard';

  @Output()
  quizComplete: EventEmitter<any> = new EventEmitter();

  constructor(private renderer: Renderer2, private dataService: DataService) {
    this.inputListener = () => {};
    this.keydownListener = () => {};
  }

  next(): void {
    this.questionIndex++;
    let answer = this.answerArray.map((square) => square.letter).join("");
    this.currentQuestion.yourAnswer = answer;
    this.currentQuestion.result = answer === this.currentQuestion.answer;
    this.setQuestion();
  }

  skip(): void {
    this.questionIndex++;
    this.currentQuestion.result = false;
    this.setQuestion();
  }

  setQuestion(): void {
    this.answerArray.length = 0;
    if (this.questionIndex >= this.quiz.length) {
      this.quizComplete.emit(this.quiz);
    } else {
      this.currentQuestion = this.quiz[this.questionIndex];
      let charArray = this.currentQuestion.answer.split('');
      let revealedIndices = this.getRevealedIndices(charArray.length);
      let startFound = false;
      charArray.forEach((ch: string, index: number) => {
        if (revealedIndices.includes(index)) {
          this.answerArray.push(new Square(ch, false))
        } else {
          this.answerArray.push(new Square('', !startFound))
          if (!startFound) {
            this.letterIndex = index;
          }
          startFound = true;
        }
      });
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

  startNewQuiz(topic: string, difficulty: string): void {
    this.topic = topic;
    this.difficulty = difficulty;
    this.quiz = this.dataService.getQuizData(this.topic);
    this.questionIndex = 0;
    this.currentQuestion = '';
    this.answerArray = [];
    this.setQuestion();
    this.attachListeners();
  }

  ngOnInit(): void {
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
    switch (this.difficulty) {
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
}
