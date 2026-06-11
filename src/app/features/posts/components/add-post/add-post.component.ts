import { NgTemplateOutlet } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { FormField, form, minLength, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { CreatePostFormValue } from '../../models/create-post.model';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-add-post',
  imports: [RouterLink, FormsModule, FormField, NgTemplateOutlet],
  templateUrl: './add-post.component.html',
})
export class AddPostComponent {
  private readonly postsService = inject(PostsService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  readonly postModel = signal<CreatePostFormValue>({
    title: '',
    body: '',
  });
  readonly isSubmitting = signal(false);

  readonly postForm = form(this.postModel, (path) => {
    required(path.title, { message: 'Title is required.' });
    minLength(path.title, 3, { message: 'Title must be at least 3 characters.' });
    required(path.body, { message: 'Body is required.' });
  });

  submitPost(): void {
    if (this.postForm().invalid() || this.isSubmitting()) {
      this.postForm().markAsTouched();
      return;
    }

    const value = this.postModel();
    this.isSubmitting.set(true);

    this.postsService
      .createPost({
        userId: 1,
        title: value.title.trim(),
        body: value.body.trim(),
      })
      .pipe(
        finalize(() => this.isSubmitting.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.toastr.success('Post created successfully', 'Postify');
          this.postForm().reset({ title: '', body: '' });
          void this.router.navigateByUrl('/');
        },
        error: () => {},
      });
  }
}
