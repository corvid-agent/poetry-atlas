import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { PoetryService } from "../../core/services/poetry.service";
import { Poem } from "../../core/models/poem.model";
import { PoemCardComponent } from "../../shared/components/poem-card.component";
import { LoadingSpinnerComponent } from "../../shared/components/loading-spinner.component";

@Component({
  selector: "app-search",
  standalone: true,
  imports: [FormsModule, PoemCardComponent, LoadingSpinnerComponent],
  template: `
    <h1 class="page-title">Search</h1>

    <div class="search-bar">
      <select class="search-type" [ngModel]="searchType()" (ngModelChange)="searchType.set($event)">
        <option value="title">Title</option>
        <option value="author">Author</option>
        <option value="lines">Lines</option>
      </select>
      <input
        type="text"
        class="search-input"
        [placeholder]="\x27Search by \x27 + searchType() + \x27...\x27"
        [ngModel]="query()"
        (ngModelChange)="query.set($event)"
        (keydown.enter)="search()"
      />
      <button class="search-btn" (click)="search()" [disabled]="!query()">Search</button>
    </div>

    @if (loading()) {
      <app-loading-spinner />
    } @else if (hasSearched()) {
      @if (results().length > 0) {
        <p class="result-count">{{ results().length }} results</p>
        <div class="results-list">
          @for (poem of results(); track poem.title + poem.author) {
            <app-poem-card [poem]="poem" />
          }
        </div>
      } @else {
        <p class="no-results">No poems found. Try a different search.</p>
      }
    }
  `,
  styles: [`
    .page-title {
      font-family: var(--font-serif);
      font-size: var(--fs-2xl);
      margin-bottom: var(--space-lg);
    }
    .search-bar {
      display: flex;
      gap: var(--space-sm);
      margin-bottom: var(--space-xl);
    }
    .search-type {
      padding: var(--space-sm) var(--space-md);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--bg-surface);
      color: var(--text-primary);
      font-size: var(--fs-sm);
    }
    .search-input {
      flex: 1;
      padding: var(--space-sm) var(--space-md);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--bg-surface);
      color: var(--text-primary);
      outline: none;
    }
    .search-input:focus { border-color: var(--accent); }
    .search-btn {
      padding: var(--space-sm) var(--space-lg);
      background: var(--accent);
      color: white;
      border: none;
      border-radius: var(--radius-sm);
      font-size: var(--fs-sm);
      transition: background 0.2s;
    }
    .search-btn:hover:not(:disabled) { background: var(--accent-hover); }
    .search-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .result-count {
      color: var(--text-tertiary);
      font-size: var(--fs-sm);
      margin-bottom: var(--space-md);
    }
    .results-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .no-results {
      text-align: center;
      color: var(--text-tertiary);
      padding: var(--space-2xl);
    }
    @media (max-width: 640px) {
      .search-bar { flex-wrap: wrap; }
      .search-type { width: 100%; }
      .search-input { min-width: 0; }
    }
  `]
})
export class SearchComponent {
  private readonly poetryService = inject(PoetryService);
  readonly searchType = signal<"title" | "author" | "lines">("title");
  readonly query = signal("");
  readonly results = signal<Poem[]>([]);
  readonly loading = signal(false);
  readonly hasSearched = signal(false);

  search(): void {
    const q = this.query().trim();
    if (!q) return;

    this.loading.set(true);
    this.hasSearched.set(true);

    let obs;
    switch (this.searchType()) {
      case "author":
        obs = this.poetryService.getByAuthor(q);
        break;
      case "lines":
        obs = this.poetryService.searchLines(q);
        break;
      default:
        obs = this.poetryService.getByTitle(q);
    }

    obs.subscribe(poems => {
      this.results.set(poems);
      this.loading.set(false);
    });
  }
}
