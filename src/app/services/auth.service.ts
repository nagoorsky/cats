import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly VALID_USERNAME = '1';
  private readonly VALID_PASSWORD = '1';

  isLoggedIn = signal<boolean>(false);

  login(username: string, password: string): Observable<boolean> {
    const isValid =
      username === this.VALID_USERNAME && password === this.VALID_PASSWORD;
    return of(isValid).pipe(
      delay(1000), // Simulate API delay
      tap(() => this.isLoggedIn.set(isValid))
    );
  }

  logout(): void {
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }
}
