import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit {

  selectedTopic: string = 'Common';
  topics: string[] = ['Common', 'Gods', 'Rivers', 'In France', 'In Spain', 'In Italy'];

  selectedDifficulty: string = 'Hard';
  difficulties: string[] = ['Easy', 'Medium', 'Hard'];

  @Output()
  select: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  startQuiz(): void {
    let topic = this.selectedTopic.toLocaleLowerCase().replace(/\s/g, '');
    console.log(topic);
    let difficulty = this.selectedDifficulty.toLocaleLowerCase().replace(/\s/g, '');
    console.log(difficulty);
    this.select.emit({ topic: topic, difficulty: difficulty });
  }

  ngOnInit(): void {
  }

}
