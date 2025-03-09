import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {
  private readonly isLoading = signal(false);

  show(): void {
    this.isLoading.set(true);
  }

  hide(): void {
    this.isLoading.set(false);
  }

  get loading() {
    return this.isLoading;
  }
}
