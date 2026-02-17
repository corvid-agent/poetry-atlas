import { Component } from "@angular/core";

@Component({
  selector: "app-loading-spinner",
  standalone: true,
  template: `<div class="spinner-container"><div class="spinner"></div></div>`,
  styles: [`
    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: var(--space-2xl);
    }
    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid var(--border);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoadingSpinnerComponent {}
