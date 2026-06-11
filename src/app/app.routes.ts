import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/posts/routes/posts.routes').then((module) => module.postsRoutes),
  },
];
