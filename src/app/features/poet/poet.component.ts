import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PoetryService } from "../../core/services/poetry.service";
import { Poem } from "../../core/models/poem.model";
import { PoemCardComponent } from "../../shared/components/poem-card.component";
import { LoadingSpinnerComponent } from "../../shared/components/loading-spinner.component";

@Component({
  selector: "app-poet",
  standalone: true,
  imports: [PoemCardComponent, LoadingSpinnerComponent],
  template: `
    <button class="back-btn" (click)="goBack()">← Back to Poets</button>
    <h1 class="page-title">{{ poetName() }}</h1>

    @if (loading()) {
      <app-loading-spinner />
    } @else {
      <p class="poem-count">{{ poems().length }} poems</p>
      <div class="poems-list">
        @for (poem of poems(); track poem.title) {
          <app-poem-card [poem]="poem" />
        }
      </div>
    }
  `,
  styles: [`
    .back-btn {
      background: none;
      border: none;
      color: var(--accent);
      font-size: var(--fs-sm);
      padding: var(--space-xs) var(--space-sm);
      min-height: 44px;
      margin-bottom: var(--space-lg);
      cursor: pointer;
    }
    .back-btn:hover { color: var(--accent-hover); }
    .page-title {
      font-family: var(--font-serif);
      font-size: var(--fs-2xl);
      margin-bottom: var(--space-sm);
    }
    .poem-count {
      color: var(--text-tertiary);
      font-size: var(--fs-sm);
      margin-bottom: var(--space-xl);
    }
    .poems-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
  `]
})
export class PoetComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly poetryService = inject(PoetryService);

  readonly poetName = signal("");
  readonly poems = signal<Poem[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get("name") ?? "";
    this.poetName.set(decodeURIComponent(name));
    this.poetryService.getByAuthor(this.poetName()).subscribe(poems => {
      this.poems.set(poems);
      this.loading.set(false);
    });
  }

  goBack(): void {
    this.router.navigate(["/poets"]);
  }
}
