import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ITask } from '../../../types/task';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatusPipe } from '../../../pipes/status-pipe';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusPipe],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss'
})
export class TaskCard {

  @Input() task!: ITask;
  @Input() isEditing: boolean = false;

  @Output() edit = new EventEmitter<ITask>();
  @Output() delete = new EventEmitter<ITask>();

  onEdit(event: Event) {
    event.stopPropagation();
    this.edit.emit(this.task);
  }

  onDelete(event: Event) {
    event.stopPropagation();
    this.delete.emit(this.task);
  }
}
