import { TestBed } from '@angular/core/testing';
import { ProgressBarService } from './progress-bar.service';

describe('ProgressBarService', () => {
  let service: ProgressBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with loading set to false', () => {
    expect(service.loading()).toBe(false);
  });

  it('should set loading to true when show is called', () => {
    service.show();
    expect(service.loading()).toBe(true);
  });

  it('should set loading to false when hide is called', () => {
    service.show();
    service.hide();
    expect(service.loading()).toBe(false);
  });
});
