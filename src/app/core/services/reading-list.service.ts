import { Injectable, signal } from '@angular/core';
import { Poem } from '../models/poem.model';

const STORAGE_KEY = 'poetry-atlas-reading-list';

@Injectable({ providedIn: 'root' })
export class ReadingListService {
  readonly items = signal<Poem[]>(this.load());

  toggle(poem: Poem): void {
    if (this.isInList(poem)) {
      this.items.update(list => list.filter(p => p.title !== poem.title || p.author !== poem.author));
    } else {
      this.items.update(list => [...list, poem]);
    }
    this.save();
  }

  isInList(poem: Poem): boolean {
    return this.items().some(p => p.title === poem.title && p.author === poem.author);
  }

  getAll(): Poem[] {
    return this.items();
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items()));
  }
}
