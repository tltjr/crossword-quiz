import { Component, OnInit, ViewChild } from '@angular/core';
import { QuizComponent } from '../quiz/quiz.component';
import { ResultsComponent } from '../results/results.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  topic: string = 'gods';
  difficulty: string = 'hard';
  results: any;
  activeComponent: string = 'select';

  @ViewChild(QuizComponent)
  quizComponent: QuizComponent | undefined;

  @ViewChild(ResultsComponent)
  resultsComponent: ResultsComponent | undefined;

  constructor() { }

  onSelect(event: any): void {
    this.topic = event.topic;
    this.difficulty = event.difficulty;
    this.startNewQuiz();
  }

  onQuizComplete(event: any): void {
    if (this.resultsComponent) {
      this.quizComponent?.detachListeners();
      this.resultsComponent.setResults(event);
      this.activeComponent = 'results';
    }
  }

  restart(): void {
    this.startNewQuiz();
  }

  settings(): void {
    this.quizComponent?.detachListeners();
    this.activeComponent = 'select';
  }

  ngOnInit(): void {
  }

  private startNewQuiz(): void {
    if (this.quizComponent) {
      this.quizComponent.startNewQuiz(this.topic, this.difficulty);
      this.activeComponent = 'quiz';
    }
  }
}
