import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Poem } from '../models/poem.model';

const API = 'https://poetrydb.org';

@Injectable({ providedIn: 'root' })
export class PoetryService {
  private readonly http = inject(HttpClient);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  getAuthors(): Observable<string[]> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<{ authors: string[] }>(`${API}/author`).pipe(
      map(res => {
        this.loading.set(false);
        return res.authors;
      }),
      catchError(err => {
        this.loading.set(false);
        this.error.set('Failed to load authors');
        return of([]);
      })
    );
  }

  getByAuthor(author: string): Observable<Poem[]> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<Poem[]>(`${API}/author/${encodeURIComponent(author)}`).pipe(
      map(res => {
        this.loading.set(false);
        return Array.isArray(res) ? res : [];
      }),
      catchError(err => {
        this.loading.set(false);
        this.error.set('Failed to load poems');
        return of([]);
      })
    );
  }

  getByTitle(title: string): Observable<Poem[]> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<Poem[]>(`${API}/title/${encodeURIComponent(title)}`).pipe(
      map(res => {
        this.loading.set(false);
        return Array.isArray(res) ? res : [];
      }),
      catchError(err => {
        this.loading.set(false);
        this.error.set('Failed to search by title');
        return of([]);
      })
    );
  }

  searchLines(text: string): Observable<Poem[]> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<Poem[]>(`${API}/lines/${encodeURIComponent(text)}`).pipe(
      map(res => {
        this.loading.set(false);
        return Array.isArray(res) ? res : [];
      }),
      catchError(err => {
        this.loading.set(false);
        this.error.set('Failed to search lines');
        return of([]);
      })
    );
  }

  getRandom(count: number): Observable<Poem[]> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<Poem[]>(`${API}/random/${count}`).pipe(
      map(res => {
        this.loading.set(false);
        return Array.isArray(res) ? res : [];
      }),
      catchError(err => {
        this.loading.set(false);
        this.error.set('Failed to load random poems');
        return of([]);
      })
    );
  }
}
