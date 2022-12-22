import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizComponent } from './quiz/quiz.component';
import { ResultsComponent } from './results/results.component';
import { SelectComponent } from './select/select.component';

const routes: Routes = [
  { path: '', component: QuizComponent },
  { path: 'select', component: SelectComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'results', component: ResultsComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
