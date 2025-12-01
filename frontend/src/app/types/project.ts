import { ITask } from "./task";

export interface IProject {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  totalTasks: number;
}
