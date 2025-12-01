import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Projects } from './projects';
import { environment } from "../../environments/environment";
import { IProject } from '../types/project';

describe('Projects', () => {
  let service: Projects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Projects, provideHttpClientTesting()]
    });
    service = TestBed.inject(Projects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should fetch all', () => {
   const mockProjects: IProject[] = [
      { id: 1, name: 'Test Project', createdAt: '2025-11-30T00:00:00.000Z', totalTasks: 1 }
    ];

    service.getProjects().subscribe(projects => {
      expect(projects).toEqual(mockProjects);
    });

    const req = httpMock.expectOne(environment.apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockProjects);
  });
});
