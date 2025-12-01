import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProject } from '../types/project';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class Projects {
  private URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getProjects() {
    return this.http.get<IProject[]>(this.URL);
  }

  public getProjectByID(id: number) {
    return this.http.get<IProject>(`${this.URL}/${id}`);
  }

  public createProject(project: Partial<IProject>) {
    return this.http.post<IProject>(this.URL, project);
  }

  public updateProject(id: number, project: Partial<IProject>) {
    return this.http.put<IProject>(`${this.URL}/${id}`, project);
  }

  public deleteProject(id: number) {
    return this.http.delete(`${this.URL}/${id}`);
  }
}
