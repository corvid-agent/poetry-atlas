import { Page } from '@playwright/test';

export async function mockPoetryAPI(page: Page) {
  await page.route('**/poetrydb.org/author', route =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ authors: ['William Shakespeare', 'Emily Dickinson', 'Robert Frost', 'Edgar Allan Poe', 'Walt Whitman', 'William Blake', 'John Keats', 'Percy Bysshe Shelley'] }),
    })
  );

  await page.route('**/poetrydb.org/author/**', route =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([
        { title: 'Sonnet 18', author: 'William Shakespeare', lines: ['Shall I compare thee to a summer\'s day?', 'Thou art more lovely and more temperate.', 'Rough winds do shake the darling buds of May,', 'And summer\'s lease hath all too short a date.'], linecount: '14' },
        { title: 'Sonnet 116', author: 'William Shakespeare', lines: ['Let me not to the marriage of true minds', 'Admit impediments. Love is not love', 'Which alters when it alteration finds,'], linecount: '14' },
      ]),
    })
  );

  await page.route('**/poetrydb.org/random/**', route =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([
        { title: 'The Road Not Taken', author: 'Robert Frost', lines: ['Two roads diverged in a yellow wood,', 'And sorry I could not travel both', 'And be one traveler, long I stood'], linecount: '20' },
      ]),
    })
  );

  await page.route('**/poetrydb.org/title/**', route =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([
        { title: 'The Raven', author: 'Edgar Allan Poe', lines: ['Once upon a midnight dreary, while I pondered, weak and weary,'], linecount: '108' },
      ]),
    })
  );

  await page.route('**/poetrydb.org/lines/**', route =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([
        { title: 'Sonnet 18', author: 'William Shakespeare', lines: ['Shall I compare thee to a summer\'s day?'], linecount: '14' },
      ]),
    })
  );
}
