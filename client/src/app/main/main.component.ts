import { Component, OnInit, ViewChild } from '@angular/core';
import { QuizComponent } from '../quiz/quiz.component';
import { ResultsComponent } from '../results/results.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
