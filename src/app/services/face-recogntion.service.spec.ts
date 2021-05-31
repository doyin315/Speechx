import { TestBed } from '@angular/core/testing';

import { FaceRecogntionService } from './face-recogntion.service';

describe('FaceRecogntionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FaceRecogntionService = TestBed.get(FaceRecogntionService);
    expect(service).toBeTruthy();
  });
});
