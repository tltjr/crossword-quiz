import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit {

  @Output()
  select: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  startQuiz(): void {
    this.select.emit({ topic: 'gods', difficulty: 'hard' });
  }

  ngOnInit(): void {
  }

}
