import { Routes } from '@angular/router';

export const postsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../components/post-list/post-list.component').then(
        (module) => module.PostListComponent,
      ),
    title: 'Postify',
  },
  {
    path: 'posts/new',
    loadComponent: () =>
      import('../components/add-post/add-post.component').then(
        (module) => module.AddPostComponent,
      ),
    title: 'Create Post | Postify',
  },
  {
    path: 'posts/:id',
    loadComponent: () =>
      import('../components/post-details/post-details.component').then(
        (module) => module.PostDetailsComponent,
      ),
    title: 'Post Details | Postify',
  },
];
