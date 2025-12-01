import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taskStatus',
})
export class StatusPipe implements PipeTransform {

  transform(value: string): string {
    
    if (!value) return '';

    const status: Record<string, string> = {
      'todo': 'To-Do',
      'in_progress': "In Progress",
      'done': "Done"
    }

    return status[value];
  }

}
