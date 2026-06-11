import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-post-list',
  imports: [RouterLink, FormsModule],
  templateUrl: './post-list.component.html',
})
export class PostListComponent {
  private readonly postsService = inject(PostsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly posts = signal<Post[]>([]);
  readonly searchTerm = signal('');
  readonly currentPage = signal(1);
  readonly pageSize = 9;

  readonly filteredPosts = computed(() => {
    const normalizedTerm = this.searchTerm().trim().toLowerCase();

    if (!normalizedTerm) {
      return this.posts();
    }

    return this.posts().filter((post) => post.title.toLowerCase().includes(normalizedTerm));
  });

  readonly totalPages = computed(() => Math.ceil(this.filteredPosts().length / this.pageSize));

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1),
  );

  readonly visiblePosts = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize;
    return this.filteredPosts().slice(startIndex, startIndex + this.pageSize);
  });

  constructor() {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postsService
      .getPosts()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (posts) => {
          this.posts.set(posts);
          this.currentPage.set(1);
        },
        error: () => {
          this.posts.set([]);
        },
      });
  }

  updateSearchTerm(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  previousPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  formatPostNumber(index: number): string {
    const postNumber = (this.currentPage() - 1) * this.pageSize + index + 1;
    return String(postNumber).padStart(2, '0');
  }
}
