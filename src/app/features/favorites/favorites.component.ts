import { Component, inject } from "@angular/core";
import { FavoritesService } from "../../core/services/favorites.service";
import { PoemCardComponent } from "../../shared/components/poem-card.component";

@Component({
  selector: "app-favorites",
  standalone: true,
  imports: [PoemCardComponent],
  template: `
    <h1 class="page-title">Favorites</h1>

    @if (favService.favorites().length > 0) {
      <div class="poems-list">
        @for (poem of favService.favorites(); track poem.title + poem.author) {
          <app-poem-card [poem]="poem" />
        }
      </div>
    } @else {
      <div class="empty-state">
        <p class="empty-icon">♡</p>
        <p class="empty-text">No favorites yet</p>
        <p class="empty-hint">Click the heart on any poem to save it here.</p>
      </div>
    }
  `,
  styles: [`
    .page-title {
      font-family: var(--font-serif);
      font-size: var(--fs-2xl);
      margin-bottom: var(--space-xl);
    }
    .poems-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .empty-state {
      text-align: center;
      padding: var(--space-2xl);
    }
    .empty-icon {
      font-size: 3rem;
      color: var(--text-tertiary);
      margin-bottom: var(--space-md);
    }
    .empty-text {
      font-family: var(--font-serif);
      font-size: var(--fs-xl);
      color: var(--text-secondary);
      margin-bottom: var(--space-sm);
    }
    .empty-hint {
      font-size: var(--fs-sm);
      color: var(--text-tertiary);
    }
  `]
})
export class FavoritesComponent {
  readonly favService = inject(FavoritesService);
}
