# Postify

Postify is a small Angular application that reads and creates posts using JSONPlaceholder.

## Features

- Browse the  posts in a responsive editorial card grid
- Search posts by title with live signal-based filtering
- Open post details and load comments for a selected post
- Create a new post with Signal Forms validation
- Add a comment from the post details page using a post-title dropdown that submits the selected post ID
- See global loading feedback, skeleton states, empty states, and toast notifications

## Run

```bash
npm install
npm start
```

Open `http://localhost:4200/`.

## Notes

- JSONPlaceholder simulates write requests, so new posts and comments are not persisted.
- The application uses standalone components, Signals, zoneless change detection, Tailwind CSS, and functional HTTP interceptors.
