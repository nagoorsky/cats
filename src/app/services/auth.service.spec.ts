import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let router: jest.Mocked<Router>;
  let storageMock: { [key: string]: string };

  beforeEach(() => {
    storageMock = {};

    const mockLocalStorage = {
      getItem: (key: string) => storageMock[key] || null,
      setItem: (key: string, value: string) => storageMock[key] = value,
      removeItem: (key: string) => delete storageMock[key]
    };

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage
    });

    const routerMock = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock }
      ]
    });

    router = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  it('should be created', () => {
    service = TestBed.inject(AuthService);
    expect(service).toBeTruthy();
  });

  it('should initialize isLoggedIn from localStorage', () => {
    storageMock['isLoggedIn'] = 'true';
    service = TestBed.inject(AuthService);
    expect(service.isLoggedIn()).toBe(true);
  });

  describe('login', () => {
    beforeEach(() => {
      service = TestBed.inject(AuthService);
    });

    it('should return true and set isLoggedIn for valid credentials', fakeAsync(() => {
      service.login({ username: 'admin', password: 'admin' }).subscribe(result => {
        expect(result).toBe(true);
        expect(service.isLoggedIn()).toBe(true);
        expect(storageMock['isLoggedIn']).toBe('true');
      });
      tick(1000);
    }));

    it('should return false and not set isLoggedIn for invalid credentials', fakeAsync(() => {
      service.login({ username: 'wrong', password: 'wrong' }).subscribe(result => {
        expect(result).toBe(false);
        expect(service.isLoggedIn()).toBe(false);
        expect(storageMock['isLoggedIn']).toBeUndefined();
      });
      tick(1000);
    }));
  });

  describe('logout', () => {
    beforeEach(() => {
      storageMock['isLoggedIn'] = 'true';
      service = TestBed.inject(AuthService);
      service.isLoggedIn.set(true);
    });

    it('should clear isLoggedIn state', () => {
      service.logout();
      expect(service.isLoggedIn()).toBe(false);
      expect(storageMock['isLoggedIn']).toBeUndefined();
    });

    it('should navigate to login page', () => {
      service.logout();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
