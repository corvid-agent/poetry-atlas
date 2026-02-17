import { Component, input, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Poem } from "../../core/models/poem.model";
import { FavoritesService } from "../../core/services/favorites.service";

@Component({
  selector: "app-poem-card",
  standalone: true,
  template: `
    <article class="poem-card" (click)="openPoem()">
      <div class="poem-card-header">
        <h3 class="poem-card-title">{{ poem().title }}</h3>
        <button class="fav-btn" (click)="toggleFav(\$event)"
          [attr.aria-label]="favService.isFavorite(poem()) ? \x27Remove from favorites\x27 : \x27Add to favorites\x27"
          [class.active]="favService.isFavorite(poem())">
          <span class="heart">{{ favService.isFavorite(poem()) ? \x27\u2665\x27 : \x27\u2661\x27 }}</span>
        </button>
      </div>
      <p class="poem-card-author">{{ poem().author }}</p>
      <div class="poem-card-preview">
        @for (line of previewLines(); track \$index) {
          <p class="preview-line">{{ line }}</p>
        }
        @if (poem().lines.length > 4) {
          <p class="preview-more">...</p>
        }
      </div>
      <span class="poem-card-linecount">{{ poem().linecount }} lines</span>
    </article>
  `,
  styles: [`
    .poem-card {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: var(--space-lg);
      cursor: pointer;
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .poem-card:hover {
      box-shadow: var(--shadow);
      transform: translateY(-2px);
    }
    .poem-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--space-sm);
    }
    .poem-card-title {
      font-family: var(--font-serif);
      font-size: var(--fs-lg);
      color: var(--text-primary);
      margin: 0;
    }
    .fav-btn {
      background: none;
      border: none;
      font-size: var(--fs-xl);
      color: var(--accent);
      cursor: pointer;
      padding: 0;
      line-height: 1;
      flex-shrink: 0;
    }
    .fav-btn:hover, .fav-btn.active { color: var(--accent-hover); }
    .poem-card-author {
      font-size: var(--fs-sm);
      color: var(--text-secondary);
      margin: var(--space-xs) 0 var(--space-md);
    }
    .poem-card-preview {
      font-family: var(--font-serif);
      font-size: var(--fs-sm);
      color: var(--text-tertiary);
      line-height: 1.6;
    }
    .preview-line { margin: 0; }
    .preview-more {
      margin: var(--space-xs) 0 0;
      color: var(--text-tertiary);
    }
    .poem-card-linecount {
      display: inline-block;
      margin-top: var(--space-md);
      font-size: var(--fs-xs);
      color: var(--text-tertiary);
      background: var(--bg-raised);
      padding: 2px 8px;
      border-radius: var(--radius-sm);
    }
  `]
})
export class PoemCardComponent {
  readonly poem = input.required<Poem>();
  readonly favService = inject(FavoritesService);
  private readonly router = inject(Router);

  previewLines(): string[] {
    return this.poem().lines.slice(0, 4);
  }

  openPoem(): void {
    this.router.navigate(["/poem"], {
      queryParams: { title: this.poem().title, author: this.poem().author }
    });
  }

  toggleFav(event: Event): void {
    event.stopPropagation();
    this.favService.toggle(this.poem());
  }
}
