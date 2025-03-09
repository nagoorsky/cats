import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { ApiService } from '../../services/api.service';
import { ProgressBarService } from '../../services/progress-bar.service';
import { ScrollDispatcher, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { of, Subject } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let apiService: jest.Mocked<ApiService>;
  let progressBar: jest.Mocked<ProgressBarService>;
  let scrolled$: Subject<void>;

  beforeEach(async () => {
    scrolled$ = new Subject<void>();
    const apiServiceMock = {
      getManyFacts: jest.fn().mockReturnValue(of({ data: ['initial fact'] })),
      getOneFact: jest.fn().mockReturnValue(of({ data: ['new fact'] }))
    } as unknown as jest.Mocked<ApiService>;

    const progressBarMock = {
      show: jest.fn(),
      hide: jest.fn()
    } as unknown as jest.Mocked<ProgressBarService>;

    const scrollDispatcherMock = {
      scrolled: jest.fn().mockReturnValue(scrolled$),
      register: jest.fn(),
      deregister: jest.fn()
    } as unknown as jest.Mocked<ScrollDispatcher>;

    await TestBed.configureTestingModule({
      imports: [ListComponent, BrowserAnimationsModule],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: ProgressBarService, useValue: progressBarMock },
        { provide: ScrollDispatcher, useValue: scrollDispatcherMock }
      ]
    }).compileComponents();

    apiService = TestBed.inject(ApiService) as jest.Mocked<ApiService>;
    progressBar = TestBed.inject(ProgressBarService) as jest.Mocked<ProgressBarService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;

    const mockViewport = {
      measureScrollOffset: jest.fn().mockReturnValue(0),
      getElementRef: jest.fn().mockReturnValue({ nativeElement: document.createElement('div') }),
      elementScrolled: jest.fn().mockReturnValue(of(null))
    } as unknown as CdkVirtualScrollViewport;

    Object.defineProperty(component, 'viewport', {
      value: signal(mockViewport)
    });

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with facts', fakeAsync(() => {
    const mockFacts = { data: ['initial fact'] };
    apiService.getManyFacts.mockReturnValueOnce(of(mockFacts));

    fixture.detectChanges();
    tick();

    expect(progressBar.show).toHaveBeenCalled();
    expect(progressBar.hide).toHaveBeenCalled();
    expect(component.facts()).toEqual(mockFacts.data);
  }));

  it('should handle new fact', fakeAsync(() => {
    const mockFact = { data: ['new fact'] };
    apiService.getOneFact.mockReturnValue(of(mockFact));

    component.facts.set(['existing fact']);
    fixture.detectChanges();
    scrolled$.next();
    tick(1000);

    expect(component.facts()).toContain('new fact');
    expect(progressBar.show).toHaveBeenCalled();
    expect(progressBar.hide).toHaveBeenCalled();
  }));

  it('should detect duplicate facts', () => {
    const fact = 'duplicate fact';
    component.facts.set([fact]);
    expect((component as any).isDuplicate(fact)).toBe(true);
  });

  it('should handle duplicate fact error', fakeAsync(() => {
    const mockFact = { data: ['existing fact'] };
    apiService.getOneFact.mockReturnValue(of(mockFact));

    component.facts.set(['existing fact']);
    fixture.detectChanges();
    scrolled$.next();
    tick(1000);

    expect(component.limitReached()).toBe(true);
    expect(progressBar.hide).toHaveBeenCalled();
  }));

  it('should reset state on startOver', fakeAsync(() => {
    const mockFacts = { data: ['new fact'] };
    apiService.getManyFacts.mockReturnValue(of(mockFacts));

    component.facts.set(['old fact']);
    component.limitReached.set(true);

    component.startOver();
    tick();

    expect(component.facts()).toEqual(mockFacts.data);
    expect(component.limitReached()).toBe(false);
    expect(progressBar.show).toHaveBeenCalled();
    expect(progressBar.hide).toHaveBeenCalled();
  }));

  it('should track facts by their content', () => {
    const fact = 'test fact';
    expect(component.trackByFn(0, fact)).toBe(fact);
  });
});
