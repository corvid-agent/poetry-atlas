# poetry-atlas

Interactive poetry explorer powered by PoetryDB. Browse classic poetry by poet, title, or lines. Angular 21 standalone app deployed to GitHub Pages.

## API

- PoetryDB: https://poetrydb.org/
- No auth required, CORS enabled
- Endpoints: /author, /title, /lines, /random

## Verification

npx ng build --base-href /poetry-atlas/
npx ng test --no-watch

## Stack

- Angular 21 (standalone components, signals, new control flow)
- TypeScript strict mode
- CSS custom properties for design tokens
- Mobile-first responsive design
