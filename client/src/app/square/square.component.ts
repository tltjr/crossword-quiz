import {
  Component,
  OnInit,
  Input,
} from '@angular/core';
import { Square } from '../square';

@Component({
  selector: '[app-square]',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnInit {
  @Input()
  square: Square;
  @Input()
  columnIndex: number = 0;
  @Input()
  squareWidth: number = 45;

  squareXOffset: number = 0;
  letterXOffset: number | undefined;
  letterYOffset: number | undefined;
  letterFontSize: string = '20px';
  fill: string = 'White';

  constructor() {
    this.square = new Square('', false);
  }

  ngOnInit() {
    this.setLayout();
    this.setFill();
  }

  private setLayout(): void {
    this.squareXOffset = this.columnIndex * this.squareWidth;
    if (this.squareWidth >= 35) {
      this.letterFontSize = '20px';
    } else if (this.squareWidth >= 20) {
      this.letterFontSize = '16px';
    } else {
      this.letterFontSize = '13px';
    }
    if (this.squareWidth >= 20) {
      this.letterYOffset = (this.squareWidth / 2) + 8;
    } else {
      this.letterYOffset = this.squareWidth - 2;
    }
    this.letterXOffset = this.squareXOffset + (this.squareWidth / 2);
  }

  private setFill(): void {
    if (this.square.correct) {
      this.fill = '#00ff00';
    } else if (this.square.incorrect) {
      this.fill = '#ff0000';
    } else if (this.square && this.square.current) {
      this.fill = '#ffda00';
    } else {
      this.fill = 'White';
    }
  }
}
