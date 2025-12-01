import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProject } from '../../../types/project';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
})
export class ProjectCard {

  @Input() project!: IProject;
  @Input() listView = false;

  @Output() edit = new EventEmitter<IProject>();
  @Output() delete = new EventEmitter<IProject>();
  @Output() open = new EventEmitter<IProject>();

  onEdit(event: Event) {
    event.stopPropagation();
    this.edit.emit(this.project);
    console.log("Project: ", this.project);
  }

  onDelete(event: Event) {
    event.stopPropagation();
    this.delete.emit(this.project);
  }

  onOpen() {
    this.open.emit(this.project);
  }

  get totalTasks(): number {
    return Number(this.project.totalTasks);
  }
}
