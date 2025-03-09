import { Component, effect, inject, signal, viewChild } from '@angular/core';
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
import { ProgressBarService } from '../../services/progress-bar.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, ScrollingModule, CdkVirtualScrollViewport],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  private readonly apiService = inject(ApiService);
  private readonly scrollDispatcher = inject(ScrollDispatcher);
  private readonly progressBar = inject(ProgressBarService);

  viewport = viewChild.required<CdkVirtualScrollViewport>(
    CdkVirtualScrollViewport
  );

  facts = signal<string[]>([]);
  limitReached = signal<boolean>(false);

  readonly factItemHeight = config.factItemHeight;
  readonly retryLimit = config.retryLimit;
  readonly viewportOffsetTrigger = config.viewportOffsetTrigger;

  private abortFetching$ = new Subject<void>();

  initializeEffect = effect(() => {
    if (this.viewport()) {
      const initialSize = this.calculateInitialSize();
      this.loadInitialFacts(initialSize);
    }
  });

  private calculateInitialSize(): number {
    const viewportHeight = window.innerHeight;
    return Math.ceil(viewportHeight / this.factItemHeight);
  }

  private loadInitialFacts(size: number): void {
    this.progressBar.show();
    this.apiService.getManyFacts(size).subscribe((response: FactsDto) => {
      this.facts.set(response.data);
      this.progressBar.hide();
    });
  }

  private get scroll$() {
    return this.scrollDispatcher.scrolled().pipe(
      filter(() => {
        const bottom = this.viewport().measureScrollOffset('bottom');
        return bottom < this.viewportOffsetTrigger && !this.limitReached();
      }),
      takeUntil(this.abortFetching$)
    );
  }

  getFactsStream$ = this.scroll$.pipe(
    tap(() => this.progressBar.show()),
    switchMap(() => this.getNewFact()),
    catchError((error: any) => this.handleError(error))
  );

  private getNewFact(): Observable<FactsDto | null> {
    return this.apiService.getOneFact().pipe(
      tap((response) => this.handleNewFact(response)),
      retry(this.retryLimit)
    );
  }

  private handleNewFact(response: FactsDto): void {
    this.progressBar.hide();
    const newFact = response.data[0];

    if (this.isDuplicate(newFact)) {
      this.handleDuplicate();
    }

    this.facts.update((facts) => [...facts, newFact]);
  }

  private isDuplicate(fact: string): boolean {
    return this.facts().includes(fact);
  }

  private handleDuplicate(): void {
    throw new Error('duplicate fact');
  }

  private handleError(error: any) {
    if (error.message === 'duplicate fact') {
      this.abortFetching$.next();
      this.progressBar.hide();
      this.limitReached.set(true);
    }
    return EMPTY;
  }

  public startOver() {
    this.abortFetching$.next();
    this.abortFetching$.complete();
    this.abortFetching$ = new Subject<void>();
    this.facts.set([]);
    this.limitReached.set(false);
    this.loadInitialFacts(this.calculateInitialSize());

    this.getFactsStream$ = this.scroll$.pipe(
      tap(() => this.progressBar.show()),
      switchMap(() => this.getNewFact()),
      catchError((error: any) => this.handleError(error))
    );
  }

  public trackByFn(index: number, fact: string): string {
    return fact;
  }
}
