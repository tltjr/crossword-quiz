import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit {

  selectedTopic: string = 'Topic';
  topics: string[] = ['Common', 'Gods', 'Rivers', 'In France', 'In Spain', 'In Italy'];
  topicDropdownActive: boolean = false;

  selectedDifficulty: string = 'Difficulty';
  difficulties: string[] = ['Easy', 'Medium', 'Hard'];
  difficultyDropdownActive: boolean = false;

  @Output()
  select: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  selectTopic(topic: string): void {
    this.selectedTopic = topic;
    this.topicDropdownActive = false;
  }

  selectDifficulty(difficulty: string): void {
    this.selectedDifficulty = difficulty;
    this.difficultyDropdownActive = false;
  }

  startQuiz(): void {
    if (this.selectedTopic === 'Topic') {
      this.selectedTopic = 'Common';
    }
    if (this.selectedDifficulty === 'Difficulty') {
      this.selectedDifficulty = 'Easy';
    }
    let topic = this.selectedTopic.toLocaleLowerCase().replace(/\s/g, '');
    let difficulty = this.selectedDifficulty.toLocaleLowerCase().replace(/\s/g, '');
    this.select.emit({ topic: topic, difficulty: difficulty });
  }

  ngOnInit(): void {
  }

}
