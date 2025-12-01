import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITask } from '../types/task';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Tasks {

  private URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllTasks(projectId: number) {
    return this.http.get<ITask[]>(`${this.URL}/${projectId}/tasks`);
  }

  createTask(projectId: number, task: ITask) {
    return this.http.post<ITask>(`${this.URL}/${projectId}/tasks`, task);
  }

  updateTask(projectId: number, taskId: number, task: ITask) {
    return this.http.put<ITask>(`${this.URL}/${projectId}/tasks/${taskId}`, task);
  }

  deleteTask(projectId: number, taskId: number)  {
    return this.http.delete<void>(`${this.URL}/${projectId}/tasks/${taskId}`);
  }
  
}
