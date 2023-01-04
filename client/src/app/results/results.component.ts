import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  results: any;
  grade: number = 0;

  @Output()
  restart: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  settings: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  setResults(results: any): void {
    this.results = results;
    this.grade = (results.filter((r: any) => r.result).length / results.length) * 100;
  }

  playAgain(): void {
    this.restart.emit();
  }

  changeSettings(): void {
    this.settings.emit();
  }

  ngOnInit(): void {
  }
}
