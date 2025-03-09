import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { ProgressBarService } from '../../services/progress-bar.service';
import { User } from '@app/shared/interfaces/user.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly progressBar = inject(ProgressBarService);

  private readonly destroy$ = new Subject<void>();
  readonly loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  loginError = signal(false);
  hidePassword = signal(true);

  ngOnInit(): void {
    this.loginForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.loginError()) {
          this.loginError.set(false);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onSubmit(): void {
    if (this.loginForm.valid) {
      this.progressBar.show();
      this.loginError.set(false);

      const credentials: User = this.loginForm.value as User;
      this.authService.login(credentials).subscribe({
        next: (isValid) => {
          this.progressBar.hide();
          if (!isValid) {
            this.loginError.set(true);
          } else {
            this.router.navigate(['/list']);
          }
        },
        error: () => {
          this.progressBar.hide();
          this.loginError.set(true);
        }
      });
    }
  }

  public togglePassword(): void {
    this.hidePassword.set(!this.hidePassword());
  }
}
