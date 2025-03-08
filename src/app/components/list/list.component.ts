import {
  Component,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ScrollingModule,
  CdkVirtualScrollViewport,
  ScrollDispatcher,
} from '@angular/cdk/scrolling';
import { ApiService, FactsDto } from '../../services/api.service';
import { config } from '../../shared/config';
import {
  catchError,
  EMPTY,
  filter,
  Observable,
  retry,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    ScrollingModule,
    CdkVirtualScrollViewport,
    MatProgressBarModule,
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  private readonly apiService = inject(ApiService);
  private readonly scrollDispatcher = inject(ScrollDispatcher);

  viewport = viewChild.required<CdkVirtualScrollViewport>(
    CdkVirtualScrollViewport
  );

  facts = signal<string[]>([]);
  loading = signal<boolean>(false);
  limitReached = signal<boolean>(false);
  retryCount = signal<number>(0);

  readonly factItemHeight = config.factItemHeight;
  readonly retryLimit = config.retryLimit;

  private readonly abortFetching$ = new Subject<void>();

  initializeEffect = effect(() => {
    if (this.viewport()) {
      const initialSize = this.calculateInitialSize();
      this.loadInitialFacts(initialSize);
    }
  });

  private calculateInitialSize(): number {
    const viewportHeight = window.innerHeight;
    return Math.ceil(viewportHeight / (this.factItemHeight));
  }

  private loadInitialFacts(size: number): void {
    this.loading.set(true);
    this.apiService
      .getManyFacts(size)
      .subscribe((response: FactsDto) => {
        this.facts.set(response.data);
        this.loading.set(false);
      });
  }

  private readonly scroll$ = this.scrollDispatcher.scrolled().pipe(
    filter(() => {
      const bottom = this.viewport().measureScrollOffset('bottom');
      return bottom < this.factItemHeight || this.limitReached();
    }),
    takeUntil(this.abortFetching$)
  );

  getFactsStream$ = this.scroll$.pipe(
    tap(() => this.loading.set(true)),
    switchMap(() => this.getNewFact()),
    catchError(() => {
      this.loading.set(false);
      return EMPTY;
    })
  );

  private getNewFact(): Observable<FactsDto | null> {
    return this.apiService.getOneFact().pipe(
      tap((response) => this.handleNewFact(response)),
      retry({
        count: this.retryLimit,
        resetOnSuccess: true,
        delay: 50,
      })
    );
  }

  private handleNewFact(response: FactsDto): void {
    this.loading.set(false);
    const newFact = response.data[0];

    if (this.isDuplicate(newFact)) {
      this.handleDuplicate();
      throw new Error('duplicate fact');
    }

    this.facts.update((facts) => [...facts, newFact]);
    this.retryCount.set(0);
  }

  private isDuplicate(fact: string): boolean {
    return this.facts().includes(fact);
  }

  private handleDuplicate(): void {
    this.retryCount.update((count) => count + 1);

    if (this.retryCount() >= this.retryLimit) {
      this.limitReached.set(true);
      this.abortFetching$.next();
    }
  }

  public trackByFn(index: number, fact: string): string {
    return fact;
  }
}
