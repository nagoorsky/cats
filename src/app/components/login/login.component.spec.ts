import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { User } from '@app/shared/interfaces/user.interface';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;

  const mockValidUser: User = {
    username: '1',
    password: '1'
  };

  const mockInvalidUser: User = {
    username: 'wrong',
    password: 'wrong'
  };

  beforeEach(async () => {
    const authServiceMock = {
      login: jest.fn()
    };

    const routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatButtonModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should show validation errors when form is invalid', () => {
    component.loginForm.controls.username.markAsTouched();
    component.loginForm.controls.password.markAsTouched();
    fixture.detectChanges();

    const usernameError = fixture.nativeElement.querySelector('mat-error');
    const passwordError = fixture.nativeElement.querySelector('mat-error');

    expect(usernameError).toBeTruthy();
    expect(passwordError).toBeTruthy();
  });

  it('should call login with valid credentials and navigate on success', () => {
    authService.login.mockReturnValue(of(true));

    component.loginForm.setValue(mockValidUser);
    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith(mockValidUser);
    expect(router.navigate).toHaveBeenCalledWith(['/list']);
  });

  it('should show error message on login failure', () => {
    authService.login.mockReturnValue(throwError(() => new Error('Login failed')));

    component.loginForm.setValue(mockInvalidUser);
    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith(mockInvalidUser);
    expect(component.loginError()).toBe(true);
  });

  it('should toggle password visibility', () => {
    expect(component.hidePassword()).toBe(true);

    const toggleButton = fixture.nativeElement.querySelector('button[type="button"]');
    toggleButton.click();
    expect(component.hidePassword()).toBe(false);

    toggleButton.click();
    expect(component.hidePassword()).toBe(true);
  });
});
