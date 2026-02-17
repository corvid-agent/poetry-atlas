import { Component, inject, OnInit, signal, computed } from "@angular/core";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { PoetryService } from "../../core/services/poetry.service";
import { LoadingSpinnerComponent } from "../../shared/components/loading-spinner.component";

@Component({
  selector: "app-poets",
  standalone: true,
  imports: [RouterLink, FormsModule, LoadingSpinnerComponent],
  template: `
    <h1 class="page-title">Poets</h1>
    <div class="filter-bar">
      <input
        type="text"
        class="filter-input"
        placeholder="Filter poets..."
        [ngModel]="filterText()"
        (ngModelChange)="filterText.set($event)"
      />
    </div>

    @if (loading()) {
      <app-loading-spinner />
    } @else {
      <div class="poets-grid">
        @for (author of filteredAuthors(); track author) {
          <a [routerLink]="[\x27/poet\x27, author]" class="poet-item">{{ author }}</a>
        }
      </div>
      @if (filteredAuthors().length === 0) {
        <p class="no-results">No poets match your filter.</p>
      }
    }
  `,
  styles: [`
    .page-title {
      font-family: var(--font-serif);
      font-size: var(--fs-2xl);
      margin-bottom: var(--space-lg);
    }
    .filter-bar {
      margin-bottom: var(--space-xl);
    }
    .filter-input {
      width: 100%;
      padding: var(--space-sm) var(--space-md);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--bg-surface);
      font-size: var(--fs-base);
      color: var(--text-primary);
      outline: none;
      transition: border-color 0.2s;
    }
    .filter-input:focus {
      border-color: var(--accent);
    }
    .poets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--space-sm);
    }
    .poet-item {
      padding: var(--space-sm) var(--space-md);
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text-primary);
      font-size: var(--fs-sm);
      transition: background 0.2s;
    }
    .poet-item:hover {
      background: var(--bg-raised);
    }
    .no-results {
      text-align: center;
      color: var(--text-tertiary);
      padding: var(--space-2xl);
    }
  `]
})
export class PoetsComponent implements OnInit {
  private readonly poetryService = inject(PoetryService);
  readonly authors = signal<string[]>([]);
  readonly filterText = signal("");
  readonly loading = signal(true);

  readonly filteredAuthors = computed(() => {
    const filter = this.filterText().toLowerCase();
    if (!filter) return this.authors();
    return this.authors().filter(a => a.toLowerCase().includes(filter));
  });

  ngOnInit(): void {
    this.poetryService.getAuthors().subscribe(authors => {
      this.authors.set(authors);
      this.loading.set(false);
    });
  }
}
