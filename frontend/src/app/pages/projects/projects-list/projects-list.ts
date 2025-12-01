import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Projects } from '../../../services/projects';
import { IProject } from '../../../types/project';
import { catchError, map, Observable, of } from 'rxjs';

import { ProjectForm } from '../../../components/forms/project-form/project-form';
import { ProjectCard } from '../../../components/cards/project-card/project-card';



@Component({
  selector: 'app-projects-list',
  imports: [ProjectForm, ProjectCard, CommonModule],
  templateUrl: './projects-list.html',
  styleUrl: './projects-list.scss',
})
export class ProjectsList {

  loading: boolean | null = null;
  viewMode: 'grid' | 'list' = 'grid';


  projects$: Observable<IProject[]>;

  editingProject: IProject | null = null;
  projectFormCalled = false;

  constructor(private projectsService: Projects, private router: Router) {
    this.projects$ = this.fetchProjects();
  }

  // Fetch
  private fetchProjects() {
    this.loading = true;
    return this.projects$ = this.projectsService.getProjects().pipe(
      catchError(err => {
        console.error(err);
        this.loading = false;
        return of([]);
      }),
    );
  }
  
  public openProjectCard(project: IProject) {
    this.router.navigate(['/projects', project.id]);
  }

  public deleteProject(project: IProject) {
     const confirmed = confirm(`Delete project "${project.name}"?`);
     if (!confirmed) return;

      this.projects$ = this.projects$.pipe(
        map(projects => projects.filter(proj => proj.id !== project.id))
      );
  
      this.projectsService.deleteProject(project.id).subscribe({
        error: (err) => {
          console.error("Error while deleting a project: ", err);
          alert("Error happened while deleting a project")
          this.fetchProjects();
        }
      });
    }

  // Form
  public openProjectForm() {
    this.projectFormCalled = true;
  }

  public openEditProject(projectToEdit: IProject) {
    this.editingProject = projectToEdit;
    this.projectFormCalled = true;
  }

  onProjectCreated(project: IProject) {
  this.projectFormCalled = false;
  this.projects$ = this.projectsService.getProjects();
  }

  onProjectUpdated(updatedProject: IProject) {
    this.projectFormCalled = false;
    this.editingProject = null;
    this.projects$ = this.fetchProjects();
  }

  // UI
  public toggleView() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }
}
