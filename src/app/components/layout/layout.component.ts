import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProgressBarService } from '../../services/progress-bar.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './layout.component.html'
})
export class LayoutComponent {
  protected readonly progressBar = inject(ProgressBarService);
  protected readonly authService = inject(AuthService);

  title = computed(() => this.authService.isLoggedIn() ? 'Cat facts list' : 'Login page');

  logout() {
    this.authService.logout();
  }
}
