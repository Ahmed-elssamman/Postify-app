import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { distinctUntilChanged, forkJoin, map } from 'rxjs';
import { Comment } from '../../models/comment.model';
import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';
import { AddCommentComponent } from '../add-comment/add-comment.component';

@Component({
  selector: 'app-post-details',
  imports: [RouterLink, AddCommentComponent],
  templateUrl: './post-details.component.html',
})
export class PostDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly selectedPost = signal<Post | null>(null);
  readonly comments = signal<Comment[]>([]);
  readonly currentPostId = signal(0);
  readonly hasError = signal(false);

  constructor() {
    this.route.paramMap
      .pipe(
        map((params) => Number(params.get('id'))),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((postId) => {
        if (!Number.isInteger(postId) || postId <= 0) {
          this.selectedPost.set(null);
          this.comments.set([]);
          this.currentPostId.set(0);
          this.hasError.set(true);
          return;
        }

        this.loadPost(postId);
      });
  }

  loadPost(postId: number): void {
    this.hasError.set(false);
    this.currentPostId.set(postId);
    forkJoin({
      post: this.postsService.getPostById(postId),
      comments: this.postsService.getCommentsByPostId(postId),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ post, comments }) => {
          this.selectedPost.set(post);
          this.comments.set(comments);
        },
        error: () => {
          this.hasError.set(true);
        },
      });
  }

  handleCommentCreated(comment: Comment): void {
    if (comment.postId === this.currentPostId()) {
      this.postsService.createComment(comment).subscribe({
        next: () => {
          this.comments.update((comments) => [comment, ...comments]);
        }
      });
    }
  }
}
