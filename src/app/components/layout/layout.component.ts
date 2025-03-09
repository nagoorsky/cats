import { Component, computed, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProgressBarService } from '../../services/progress-bar.service';
import { AuthService } from '../../services/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, MatProgressBarModule, MatButtonModule, MatIconModule],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  protected readonly progressBar = inject(ProgressBarService);
  protected readonly authService = inject(AuthService);
  private readonly title = inject(Title);

  pageTitle = computed(() =>
    this.authService.isLoggedIn() ? 'Cat facts list' : 'Login page'
  );

  setMetaTitle = effect(() => {
    const prefix = 'Cats | ';
    const title = this.authService.isLoggedIn() ? 'Facts list' : 'Login';
    this.title.setTitle(prefix + title);
  });

  logout(): void {
    this.authService.logout();
  }
}
