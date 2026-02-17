import { Routes } from "@angular/router";

export const routes: Routes = [
  { path: "", loadComponent: () => import("./features/home/home.component").then(m => m.HomeComponent) },
  { path: "poets", loadComponent: () => import("./features/poets/poets.component").then(m => m.PoetsComponent) },
  { path: "poet/:name", loadComponent: () => import("./features/poet/poet.component").then(m => m.PoetComponent) },
  { path: "poem", loadComponent: () => import("./features/poem/poem.component").then(m => m.PoemComponent) },
  { path: "search", loadComponent: () => import("./features/search/search.component").then(m => m.SearchComponent) },
  { path: "discover", loadComponent: () => import("./features/discover/discover.component").then(m => m.DiscoverComponent) },
  { path: "favorites", loadComponent: () => import("./features/favorites/favorites.component").then(m => m.FavoritesComponent) },
  { path: "**", redirectTo: "" },
];
