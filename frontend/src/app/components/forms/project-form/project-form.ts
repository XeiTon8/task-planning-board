import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Projects } from '../../../services/projects';
import { IProject } from '../../../types/project';

@Component({
  selector: 'project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-form.html',
  styleUrl: './project-form.scss'
})
export class ProjectForm {

  loading = false;
  @Input() project: IProject | null = null;

  @Output() created = new EventEmitter<IProject>();
  @Output() updated = new EventEmitter<IProject>();
  @Output() cancel = new EventEmitter<void>();
  

  form: FormGroup;
  formType: string = "";
 
  constructor(
    private fb: FormBuilder,
    private projectsService: Projects
  ) {
    this.form = this.fb.group({
    name: ['', Validators.required],
    description: ['']
  });
  }

  ngOnInit() {
    if (this.project) {
      this.form.patchValue({
        name: this.project.name,
        description: this.project.description
      });
    }
    console.log(this.project);
  }

  ngOnChanges() {
  this.formType = this.project ? "Edit" : "Create";
}

  onSubmit() {
    if (this.form.invalid) return;

    const data = this.form.value;
    this.loading = true;

    // Updating existing project
    if (this.project) {
      this.projectsService.updateProject(this.project.id, data).subscribe({
        next: updatedProject => {
          this.updated.emit(updatedProject);
        }
      });
      return;
    }

    this.projectsService.createProject(data).subscribe({
      next: (createdProject) => {
        this.created.emit(createdProject);
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        alert("Error while creating a project.");
        console.error(error)
      }
    });
  }
  
  onCancel() {
  this.cancel.emit();
}
}
