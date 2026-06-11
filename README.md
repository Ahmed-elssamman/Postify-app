# Postify

Postify is a production-style Angular 21 social feed application backed by JSONPlaceholder. It uses standalone components, Angular Signals, Signal Forms, functional HTTP interceptors, lazy routes, Tailwind CSS, and `ngx-toastr`.

## Features

- Browse the first 50 posts in a responsive editorial card grid
- Search posts by title with live signal-based filtering
- Open post details and load comments for a selected post
- Create a new post with Signal Forms validation
- Add a comment from the post details page using a post-title dropdown that submits the selected post ID
- See global loading feedback, skeleton states, empty states, and toast notifications

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:4200/` after the dev server starts.

## Scripts

```bash
npm start
npm run build
npm test
```

## Notes

- JSONPlaceholder simulates writes, so created posts and comments do not persist after refresh.
- New comments are appended to the visible thread only when they target the currently open post.
