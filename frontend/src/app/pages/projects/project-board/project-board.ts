import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tasks } from '../../../services/tasks';
import { Projects } from '../../../services/projects';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { TaskCard } from '../../../components/cards/task-card/task-card';
import { TaskForm } from '../../../components/forms/task-form/task-form';

import { ITask } from '../../../types/task';
import { IProject } from '../../../types/project';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-board',
  standalone: true,
  imports: [TaskCard, TaskForm, CommonModule],
  templateUrl: './project-board.html',
  styleUrl: './project-board.scss'
})
export class ProjectBoard {

  projectId!: number;
  project: IProject | null = null;

  tasks$!: Observable<ITask[]>;
  tasks: ITask[] = [];

  taskFormOpen = false;
  editingTask: ITask | null = null;

  constructor(
    private route: ActivatedRoute,
    private tasksService: Tasks,
    private projectsService: Projects,
    private router: Router
  ) {}

  // Fetch
  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProject();
    this.loadTasks();
  }

  loadProject() {
    this.projectsService.getProjectByID(this.projectId).subscribe({
      next: proj => (this.project = proj),
      error: (err) => {
        alert("Failed to load project"), 
        console.error(err)
      }
    });
  }

  loadTasks() {
    this.tasks$ = this.tasksService.getAllTasks(this.projectId).pipe(
      tap(tasks => {
        this.tasks = tasks
      }),
      catchError(err => {
        console.error(err);
        return of([]);
      })
    )
  }

   deleteTask(task: ITask) {
    const confirmDelete = confirm(`Delete task "${task.title}"?`);
    if (!confirmDelete) return;

    this.tasks = this.tasks.filter((taskToDel) => taskToDel.id !== task.id)
    this.tasksService.deleteTask(this.projectId, task.id).subscribe({
      next: () => {
        this.loadTasks()
      },
      error: () => alert("Failed to delete task")
    });
  }

  // Form
  openCreateTask() {
    this.editingTask = null;
    this.taskFormOpen = true;
  }

  editTask(task: ITask) {
    this.editingTask = task;
    this.taskFormOpen = true;
  }

  onTaskCreated() {
    this.closeTaskForm();
    this.loadTasks();
  }

  onTaskUpdated() {
    this.closeTaskForm();
    this.loadTasks();
  }

  closeTaskForm() {
    this.taskFormOpen = false;
    this.editingTask = null;
  }

  // Rendering columns by status
  get todoTasks() {
  return this.tasks.filter(task => task.status === 'todo');
  }

  get inProgressTasks() {
    return this.tasks.filter(task => task.status === 'in_progress');
  }

  get doneTasks() {
    return this.tasks.filter(task => task.status === 'done');
  }

  onGoBack() {
     this.router.navigate(['/']);
  }
  
}
