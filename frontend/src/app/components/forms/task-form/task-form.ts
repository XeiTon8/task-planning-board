import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ITask, TaskPriority, TaskStatus } from '../../../types/task';
import { Tasks } from '../../../services/tasks';

@Component({
  selector: 'task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrls: ['./task-form.scss'],
})
export class TaskForm {
  @Input() projectId!: number;
  @Input() task: ITask | null = null;

  @Output() created = new EventEmitter<ITask>();
  @Output() updated = new EventEmitter<ITask>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder, private tasksService: Tasks) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: [TaskStatus.TODO, Validators.required],
      priority: [TaskPriority.LOW, Validators.required],
      dueDate: ['']
    });
  }

  ngOnInit() {
    if (this.task) {
      this.form.patchValue({
        title: this.task.title,
        description: this.task.description || '',
        status: this.task.status,
        priority: this.task.priority,
        dueDate: this.task.due_date ? this.task.due_date.substring(0, 10) : '',
      });
    }
  }

  submit() {
    if (this.form.invalid) return;

    const data = this.form.value;

    const task = {
      ...data,
      projectId: this.projectId,
      dueDate: data.dueDate || null
    };

    // Update if a task already exists
    if (this.task) {
      this.tasksService.updateTask(this.projectId, this.task.id, task)
        .subscribe(updated => this.updated.emit(updated));
      return;
    }

    this.tasksService.createTask(this.projectId, task)
      .subscribe(created => this.created.emit(created));
  }
}
