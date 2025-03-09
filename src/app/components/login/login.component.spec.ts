import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ProgressBarService } from '../../services/progress-bar.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;
  let progressBar: jest.Mocked<ProgressBarService>;

  beforeEach(async () => {
    const authServiceMock = {
      login: jest.fn(),
      isLoggedIn: jest.fn().mockReturnValue(false)
    } as unknown as jest.Mocked<AuthService>;

    const routerMock = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    const progressBarMock = {
      show: jest.fn(),
      hide: jest.fn()
    } as unknown as jest.Mocked<ProgressBarService>;

    await TestBed.configureTestingModule({
      imports: [LoginComponent, BrowserAnimationsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ProgressBarService, useValue: progressBarMock }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    progressBar = TestBed.inject(ProgressBarService) as jest.Mocked<ProgressBarService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should show validation errors when form is submitted empty', () => {
    component.onSubmit();
    expect(component.loginForm.get('username')?.errors?.['required']).toBeTruthy();
    expect(component.loginForm.get('password')?.errors?.['required']).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.hidePassword()).toBe(true);
    component.togglePassword();
    expect(component.hidePassword()).toBe(false);
    component.togglePassword();
    expect(component.hidePassword()).toBe(true);
  });

  it('should reset login error when form values change', () => {
    component.loginError.set(true);
    component.loginForm.get('username')?.setValue('test');
    expect(component.loginError()).toBe(false);
  });

  it('should handle successful login', fakeAsync(() => {
    authService.login.mockReturnValue(of(true));

    component.loginForm.setValue({
      username: '1',
      password: '1'
    });

    component.onSubmit();
    tick(1000);

    expect(progressBar.show).toHaveBeenCalled();
    expect(progressBar.hide).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/list']);
    expect(component.loginError()).toBe(false);
  }));

  it('should handle failed login', fakeAsync(() => {
    authService.login.mockReturnValue(of(false));

    component.loginForm.setValue({
      username: 'wrong',
      password: 'wrong'
    });

    component.onSubmit();
    tick(1000);

    expect(progressBar.show).toHaveBeenCalled();
    expect(progressBar.hide).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.loginError()).toBe(true);
  }));
});
