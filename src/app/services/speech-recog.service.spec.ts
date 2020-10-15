import { TestBed } from '@angular/core/testing';

import { SpeechRecogService } from './speech-recog-service';

describe('WindowRefService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpeechRecogService = TestBed.get(SpeechRecogService);
    expect(service).toBeTruthy();
  });
});
