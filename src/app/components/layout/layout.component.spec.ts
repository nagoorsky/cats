import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { AuthService } from '../../services/auth.service';
import { ProgressBarService } from '../../services/progress-bar.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let authService: jest.Mocked<AuthService>;
  let progressBar: jest.Mocked<ProgressBarService>;

  beforeEach(async () => {
    const authServiceMock = {
      logout: jest.fn(),
      isLoggedIn: jest.fn().mockReturnValue(false)
    } as unknown as jest.Mocked<AuthService>;

    const progressBarMock = {
      loading: signal(false)
    } as unknown as jest.Mocked<ProgressBarService>;

    await TestBed.configureTestingModule({
      imports: [
        LayoutComponent,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ProgressBarService, useValue: progressBarMock }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    progressBar = TestBed.inject(ProgressBarService) as jest.Mocked<ProgressBarService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show progress bar when service indicates loading', () => {
    Object.defineProperty(progressBar, 'loading', {
      value: signal(true)
    });
    fixture.detectChanges();

    const progressBarElement = fixture.nativeElement.querySelector('mat-progress-bar');
    expect(progressBarElement).toBeTruthy();
  });

  it('should not show progress bar by default', () => {
    const progressBarElement = fixture.nativeElement.querySelector('mat-progress-bar');
    expect(progressBarElement).toBeFalsy();
  });

  it('should show logout button when user is logged in', () => {
    Object.defineProperty(authService, 'isLoggedIn', {
      value: jest.fn().mockReturnValue(true)
    });
    fixture.detectChanges();

    const logoutButton = fixture.nativeElement.querySelector('button');
    expect(logoutButton).toBeTruthy();
  });

  it('should not show logout button when user is not logged in', () => {
    const logoutButton = fixture.nativeElement.querySelector('button');
    expect(logoutButton).toBeFalsy();
  });

  it('should call logout when logout button is clicked', () => {
    Object.defineProperty(authService, 'isLoggedIn', {
      value: jest.fn().mockReturnValue(true)
    });
    fixture.detectChanges();

    const logoutButton = fixture.nativeElement.querySelector('button');
    logoutButton.click();

    expect(authService.logout).toHaveBeenCalled();
  });
});
