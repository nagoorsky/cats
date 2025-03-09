import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { config } from '../shared/config';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getManyFacts', () => {
    it('should fetch multiple facts', () => {
      const mockFacts = { data: ['fact1', 'fact2'] };
      const size = 2;

      service.getManyFacts(size).subscribe(response => {
        expect(response).toEqual(mockFacts);
      });

      const req = httpMock.expectOne(`${config.apiUrl}?count=${size}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockFacts);
    });
  });

  describe('getOneFact', () => {
    it('should fetch a single fact', () => {
      const mockFact = { data: ['fact1'] };

      service.getOneFact().subscribe(response => {
        expect(response).toEqual(mockFact);
      });

      const req = httpMock.expectOne(config.apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockFact);
    });
  });
});
