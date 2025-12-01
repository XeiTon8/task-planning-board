import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProjectsList } from './pages/projects/projects-list/projects-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProjectsList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('test-task');
}
