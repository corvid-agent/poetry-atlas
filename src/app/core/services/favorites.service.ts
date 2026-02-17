import { Injectable, signal, computed } from '@angular/core';
import { Poem } from '../models/poem.model';

const STORAGE_KEY = 'poetry-atlas-favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  readonly favorites = signal<Poem[]>(this.load());

  toggle(poem: Poem): void {
    if (this.isFavorite(poem)) {
      this.favorites.update(list => list.filter(p => p.title !== poem.title || p.author !== poem.author));
    } else {
      this.favorites.update(list => [...list, poem]);
    }
    this.save();
  }

  isFavorite(poem: Poem): boolean {
    return this.favorites().some(p => p.title === poem.title && p.author === poem.author);
  }

  getAll(): Poem[] {
    return this.favorites();
  }

  private load(): Poem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.favorites()));
  }
}
