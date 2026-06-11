# Postify

Postify is a small Angular application that reads and creates posts using JSONPlaceholder.

## Features

- Browse the first 50 posts with client-side pagination
- Search posts by title
- View post details and comments
- Create posts and add comments with Signal Forms validation
- Show global loading feedback and error notifications

## Run

```bash
npm install
npm start
```

Open `http://localhost:4200/`.

## Notes

- JSONPlaceholder simulates write requests, so new posts and comments are not persisted.
- The application uses standalone components, Signals, zoneless change detection, Tailwind CSS, and functional HTTP interceptors.
