import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { distinctUntilChanged, forkJoin, map } from 'rxjs';
import { Comment } from '../../models/comment.model';
import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';
import { AddCommentComponent } from '../add-comment/add-comment.component';
import { ErrorService } from '../../../../core/services/error.service';

@Component({
  selector: 'app-post-details',
  imports: [RouterLink, AddCommentComponent],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly errorService = inject(ErrorService);

  selectedPost = signal<Post | null>(null);
  comments = signal<Comment[]>([]);
  currentPostId = signal(0);
  hasError = signal(this.errorService.hasError());

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
          return;
        }

        this.loadPost(postId);
      });
  }

  loadPost(postId: number): void {
    this.currentPostId.set(postId);

    forkJoin({
      post: this.postsService.getPostById(postId),
      comments: this.postsService.getCommentsByPostId(postId),
    })
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: ({ post, comments }) => {
          this.selectedPost.set(post);
          this.comments.set(comments);
        },
      });
  }

  handleCommentCreated(comment: Comment): void {
    if (comment.postId === this.currentPostId()) {
      this.comments.update((comments) => [comment, ...comments]);
    }
  }
}
