import { Component, OnInit, Renderer2 } from '@angular/core';
import { Square } from '../square';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  answer = 'THOR';
  answerArray: Square[] = [];
  squareWidth = 45;
  letterIndex: number = 0;

  lastInput: string = '';
  inputListener: () => void | null;
  keydownListener: () => void | null;

  constructor(private renderer: Renderer2) {
    let charArray = this.answer.split('');
    this.answerArray.push(new Square('', true));
    charArray.slice(1).forEach(() => {
     this.answerArray.push(new Square('', false))
    });
    this.inputListener = () => {};
    this.keydownListener = () => {};
    this.attachListeners();
  }

  next(): void {
    console.log('next');
  }

  skip(): void {
    console.log('skip');
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

  // detachListeners(): void {
  //   if (this.keydownListener) {
  //     this.keydownListener();
  //     this.keydownListener = null;
  //   }
  //   if (this.inputListener) {
  //     this.inputListener();
  //     this.inputListener = null;
  //   }
  // }

  ngOnInit(): void {
  }

  private isValidKey(event: any): boolean {
    const isLetter = event.keyCode >= 65 && event.keyCode <= 90;
    const isBackspace = event.keyCode === 8;
    if (!isLetter && !isBackspace) {
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
    }
    const nextSq = this.answerArray[this.letterIndex];
    nextSq.current = true;
    this.answerArray[this.letterIndex] = {...nextSq};
  }
}
