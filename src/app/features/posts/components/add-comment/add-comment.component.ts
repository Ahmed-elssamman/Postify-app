import { NgTemplateOutlet } from '@angular/common';
import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { email, FormField, form, minLength, required } from '@angular/forms/signals';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { Comment } from '../../models/comment.model';
import { AddCommentFormValue, CreateComment } from '../../models/create-comment.model';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-add-comment',
  imports: [FormsModule, FormField, NgTemplateOutlet],
  templateUrl: './add-comment.component.html',
})
export class AddCommentComponent {
  private readonly postsService = inject(PostsService);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  readonly currentPostId = input.required<number>();
  readonly commentCreated = output<Comment>();

  readonly commentModel = signal<AddCommentFormValue>({
    name: '',
    email: '',
    body: '',
  });
  readonly isSubmitting = signal(false);

  readonly commentForm = form(this.commentModel, (path) => {
    required(path.name, { message: 'Name is required.' });
    minLength(path.name, 2, { message: 'Name must be at least 2 characters.' });
    required(path.email, { message: 'Email is required.' });
    email(path.email, { message: 'Enter a valid email address.' });
    required(path.body, { message: 'Comment is required.' });
    minLength(path.body, 5, { message: 'Comment must be at least 5 characters.' });
  });

  submitComment(): void {
    if (this.commentForm().invalid() || this.isSubmitting()) {
      this.commentForm().markAsTouched();
      return;
    }

    const value = this.commentModel();
    const payload: CreateComment = {
      postId: this.currentPostId(),
      name: value.name.trim(),
      email: value.email.trim(),
      body: value.body.trim(),
    };

    this.isSubmitting.set(true);

    this.postsService
      .createComment(payload)
      .pipe(
        finalize(() => this.isSubmitting.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (comment) => {
          this.toastr.success('Comment added successfully', 'Postify');
          this.commentCreated.emit(comment);
          this.commentForm().reset({ name: '', email: '', body: '' });
        },
      });
  }
}
