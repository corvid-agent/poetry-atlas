import { Component, inject, OnInit, OnDestroy, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PoetryService } from "../../core/services/poetry.service";
import { FavoritesService } from "../../core/services/favorites.service";
import { ReadingListService } from "../../core/services/reading-list.service";
import { Poem } from "../../core/models/poem.model";
import { LoadingSpinnerComponent } from "../../shared/components/loading-spinner.component";

@Component({
  selector: "app-poem",
  standalone: true,
  imports: [LoadingSpinnerComponent],
  template: `
    <button class="back-btn" (click)="goBack()">← Back</button>

    @if (loading()) {
      <app-loading-spinner />
    } @else if (poem()) {
      <article class="poem-reading">
        <header class="poem-header">
          <h1 class="poem-title">{{ poem()!.title }}</h1>
          <p class="poem-author">by {{ poem()!.author }}</p>
          <span class="poem-linecount">{{ poem()!.linecount }} lines</span>
        </header>

        <div class="poem-actions">
          <button class="action-btn" (click)="toggleFavorite()"
            [class.active]="favService.isFavorite(poem()!)">
            {{ favService.isFavorite(poem()!) ? "♥ Favorited" : "♡ Favorite" }}
          </button>
          <button class="action-btn" (click)="toggleReadingList()"
            [class.active]="readingListService.isInList(poem()!)">
            {{ readingListService.isInList(poem()!) ? "✓ In Reading List" : "+ Reading List" }}
          </button>
          <button class="action-btn" (click)="toggleSpeech()"
            [class.active]="isSpeaking()">
            {{ isSpeaking() ? (isPaused() ? '▶ Resume' : '■ Stop') : '♪ Read Aloud' }}
          </button>
        </div>

        <div class="poem-body">
          @for (line of poem()!.lines; track $index) {
            @if (line === "") {
              <div class="stanza-break"></div>
            } @else {
              <p class="poem-line">{{ line }}</p>
            }
          }
        </div>
      </article>
    } @else {
      <p class="not-found">Poem not found.</p>
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
    .poem-reading {
      max-width: 640px;
      margin: 0 auto;
    }
    .poem-header {
      text-align: center;
      margin-bottom: var(--space-xl);
    }
    .poem-title {
      font-family: var(--font-serif);
      font-size: var(--fs-2xl);
      margin-bottom: var(--space-xs);
    }
    .poem-author {
      color: var(--text-secondary);
      font-size: var(--fs-md);
      margin-bottom: var(--space-sm);
    }
    .poem-linecount {
      font-size: var(--fs-xs);
      color: var(--text-tertiary);
      background: var(--bg-raised);
      padding: 2px 8px;
      border-radius: var(--radius-sm);
    }
    .poem-actions {
      display: flex;
      gap: var(--space-sm);
      justify-content: center;
      margin-bottom: var(--space-2xl);
    }
    .action-btn {
      padding: var(--space-sm) var(--space-md);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--bg-surface);
      color: var(--text-secondary);
      font-size: var(--fs-sm);
      transition: all 0.2s;
    }
    .action-btn:hover {
      border-color: var(--accent);
      color: var(--accent);
    }
    .action-btn.active {
      background: var(--accent);
      color: white;
      border-color: var(--accent);
    }
    .poem-body {
      font-family: var(--font-serif);
      font-size: var(--fs-md);
      line-height: 1.8;
    }
    .poem-line {
      margin: 0;
      padding: 2px 0;
    }
    .stanza-break {
      height: var(--space-lg);
    }
    .not-found {
      text-align: center;
      color: var(--text-tertiary);
      padding: var(--space-2xl);
    }
  `]
})
export class PoemComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly poetryService = inject(PoetryService);
  readonly favService = inject(FavoritesService);
  readonly readingListService = inject(ReadingListService);

  readonly poem = signal<Poem | null>(null);
  readonly loading = signal(true);
  readonly isSpeaking = signal(false);
  readonly isPaused = signal(false);
  private utterance: SpeechSynthesisUtterance | null = null;

  ngOnInit(): void {
    const title = this.route.snapshot.queryParamMap.get("title") ?? "";
    const author = this.route.snapshot.queryParamMap.get("author") ?? "";

    if (title) {
      this.poetryService.getByTitle(title).subscribe(poems => {
        const match = poems.find(p => p.author === author) ?? poems[0] ?? null;
        this.poem.set(match);
        this.loading.set(false);
      });
    } else {
      this.loading.set(false);
    }
  }

  goBack(): void {
    history.back();
  }

  toggleFavorite(): void {
    const p = this.poem();
    if (p) this.favService.toggle(p);
  }

  toggleReadingList(): void {
    const p = this.poem();
    if (p) this.readingListService.toggle(p);
  }

  toggleSpeech(): void {
    const synth = window.speechSynthesis;
    if (this.isSpeaking()) {
      synth.cancel();
      this.isSpeaking.set(false);
      this.isPaused.set(false);
      return;
    }
    const p = this.poem();
    if (!p) return;
    const text = `${p.title}, by ${p.author}.\n\n${p.lines.join('\n')}`;
    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.rate = 0.9;
    this.utterance.onend = () => {
      this.isSpeaking.set(false);
      this.isPaused.set(false);
    };
    this.isSpeaking.set(true);
    synth.speak(this.utterance);
  }

  ngOnDestroy(): void {
    window.speechSynthesis.cancel();
  }
}
