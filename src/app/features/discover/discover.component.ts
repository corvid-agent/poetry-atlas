import { Component, inject, OnInit, signal } from "@angular/core";
import { PoetryService } from "../../core/services/poetry.service";
import { Poem } from "../../core/models/poem.model";
import { PoemCardComponent } from "../../shared/components/poem-card.component";
import { LoadingSpinnerComponent } from "../../shared/components/loading-spinner.component";

@Component({
  selector: "app-discover",
  standalone: true,
  imports: [PoemCardComponent, LoadingSpinnerComponent],
  template: `
    <div class="discover-header">
      <h1 class="page-title">Discover</h1>
      <button class="refresh-btn" (click)="loadRandom()" [disabled]="loading()">
        Show me more
      </button>
    </div>

    @if (loading()) {
      <app-loading-spinner />
    } @else {
      <div class="poems-list">
        @for (poem of poems(); track poem.title + poem.author) {
          <app-poem-card [poem]="poem" />
        }
      </div>
    }
  `,
  styles: [`
    .discover-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xl);
    }
    .page-title {
      font-family: var(--font-serif);
      font-size: var(--fs-2xl);
      margin: 0;
    }
    .refresh-btn {
      padding: var(--space-sm) var(--space-lg);
      background: var(--accent);
      color: white;
      border: none;
      border-radius: var(--radius-sm);
      font-size: var(--fs-sm);
      transition: background 0.2s;
    }
    .refresh-btn:hover:not(:disabled) { background: var(--accent-hover); }
    .refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .poems-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
  `]
})
export class DiscoverComponent implements OnInit {
  private readonly poetryService = inject(PoetryService);
  readonly poems = signal<Poem[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.loadRandom();
  }

  loadRandom(): void {
    this.loading.set(true);
    this.poetryService.getRandom(5).subscribe(poems => {
      this.poems.set(poems);
      this.loading.set(false);
    });
  }
}
