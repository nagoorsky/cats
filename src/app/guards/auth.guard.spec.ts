import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authGuard, loginGuard } from './auth.guard';

describe('Auth Guards', () => {
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    const authServiceMock = {
      isLoggedIn: jest.fn()
    } as unknown as jest.Mocked<AuthService>;

    const routerMock = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/test' } as RouterStateSnapshot;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  describe('authGuard', () => {
    it('should allow access when user is logged in', () => {
      authService.isLoggedIn.mockReturnValue(true);

      const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(result).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should redirect to login when user is not logged in', () => {
      authService.isLoggedIn.mockReturnValue(false);

      const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('loginGuard', () => {
    it('should allow access when user is not logged in', () => {
      authService.isLoggedIn.mockReturnValue(false);

      const result = TestBed.runInInjectionContext(() => loginGuard(mockRoute, mockState));

      expect(result).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should redirect to list when user is logged in', () => {
      authService.isLoggedIn.mockReturnValue(true);

      const result = TestBed.runInInjectionContext(() => loginGuard(mockRoute, mockState));

      expect(router.navigate).toHaveBeenCalledWith(['/list']);
    });
  });
});
