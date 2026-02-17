import { Component, inject, OnInit, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { PoetryService } from "../../core/services/poetry.service";
import { Poem } from "../../core/models/poem.model";
import { PoemCardComponent } from "../../shared/components/poem-card.component";
import { LoadingSpinnerComponent } from "../../shared/components/loading-spinner.component";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [RouterLink, PoemCardComponent, LoadingSpinnerComponent],
  template: `
    <section class="hero">
      <h1 class="hero-title">poetry-atlas</h1>
      <p class="hero-subtitle">Explore classic poetry from across the ages</p>
    </section>

    <section class="potd">
      <h2 class="section-title">Poem of the Day</h2>
      @if (loading()) {
        <app-loading-spinner />
      } @else if (dailyPoem()) {
        <app-poem-card [poem]="dailyPoem()!" />
      }
    </section>

    <section class="quick-links">
      <a routerLink="/poets" class="quick-link">
        <span class="ql-icon">✍</span>
        <span class="ql-title">Browse Poets</span>
        <span class="ql-desc">129 classic authors</span>
      </a>
      <a routerLink="/search" class="quick-link">
        <span class="ql-icon">⌕</span>
        <span class="ql-title">Search</span>
        <span class="ql-desc">Find by title or lines</span>
      </a>
      <a routerLink="/discover" class="quick-link">
        <span class="ql-icon">✨</span>
        <span class="ql-title">Discover</span>
        <span class="ql-desc">Random poetry</span>
      </a>
    </section>
  `,
  styles: [`
    .hero {
      text-align: center;
      padding: var(--space-2xl) 0;
    }
    .hero-title {
      font-family: var(--font-serif);
      font-size: var(--fs-3xl);
      color: var(--accent);
      margin-bottom: var(--space-sm);
      letter-spacing: -1px;
    }
    .hero-subtitle {
      font-size: var(--fs-lg);
      color: var(--text-secondary);
    }
    .section-title {
      font-family: var(--font-serif);
      font-size: var(--fs-xl);
      color: var(--text-primary);
      margin-bottom: var(--space-lg);
    }
    .potd {
      margin-bottom: var(--space-2xl);
    }
    .quick-links {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-md);
    }
    .quick-link {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--space-xl);
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      text-decoration: none;
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .quick-link:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }
    .ql-icon { font-size: 2rem; margin-bottom: var(--space-sm); }
    .ql-title {
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--space-xs);
    }
    .ql-desc {
      font-size: var(--fs-sm);
      color: var(--text-tertiary);
    }
  `]
})
export class HomeComponent implements OnInit {
  private readonly poetryService = inject(PoetryService);
  readonly dailyPoem = signal<Poem | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.poetryService.getRandom(1).subscribe(poems => {
      this.dailyPoem.set(poems[0] ?? null);
      this.loading.set(false);
    });
  }
}
