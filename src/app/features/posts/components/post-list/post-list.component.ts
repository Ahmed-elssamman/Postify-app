import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-post-list',
  imports: [RouterLink],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListComponent {
  private readonly postsService = inject(PostsService);
  private readonly destroyRef = inject(DestroyRef);

  posts = signal<Post[]>([]);
  searchTerm = signal('');
  hasError = signal(false);

  filteredPosts = computed(() => {
    const normalizedTerm = this.searchTerm().trim().toLowerCase();
    const posts = this.posts();
    if (!normalizedTerm) {
      return posts;
    }
    return posts.filter((post) => post.title.toLowerCase().includes(normalizedTerm));
  });

  constructor() {
    this.loadPosts();
  }

  loadPosts(): void {
    this.hasError.set(false);

    this.postsService
      .getPosts()
      .pipe(
        map((posts) => posts.slice(0, 50)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (posts) => {
          this.posts.set(posts);
        },
        error: () => {
          this.posts.set([]);
          this.hasError.set(true);
        },
      });
  }

  updateSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }

  formatPostNumber(index: number): string {
    return String(index + 1).padStart(2, '0');
  }
}
