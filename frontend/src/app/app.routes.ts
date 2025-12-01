import { Routes } from '@angular/router';
import { ProjectsList } from './pages/projects/projects-list/projects-list';
import { ProjectBoard } from './pages/projects/project-board/project-board';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'projects',
    pathMatch: 'full'
  },
  {
    path: 'projects',
    component: ProjectsList
  },
  {
    path: 'projects/:id',
    component: ProjectBoard
  },
];
