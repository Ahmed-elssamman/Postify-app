import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormField, FormRoot, form, minLength, required, submit } from '@angular/forms/signals';
import { PostsService } from '../../services/posts.service';
import { CreatePostFormValue } from '../../models/create-post.model';

@Component({
  selector: 'app-add-post',
  imports: [RouterLink, FormField, FormRoot],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPostComponent {
  private readonly postsService = inject(PostsService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  readonly postModel = signal<CreatePostFormValue>({
    title: '',
    body: '',
  });

  readonly postForm = form(this.postModel, (path) => {
    required(path.title, { message: 'Title is required.' });
    minLength(path.title, 5, { message: 'Title must be at least 5 characters.' });
    required(path.body, { message: 'Body is required.' });
    minLength(path.body, 10, { message: 'Body must be at least 10 characters.' });
  });

  submitPost(event: Event): void {
    event.preventDefault();

    void submit(this.postForm, async (formState) => {
      const value = formState().value();

      await firstValueFrom(
        this.postsService.createPost({
          userId: 1,
          title: value.title.trim(),
          body: value.body.trim(),
        }),
      );

      this.toastr.success('Post created successfully', 'Postify');
      this.postForm().reset();
      this.postModel.set({ title: '', body: '' });
      await this.router.navigateByUrl('/');
    });
  }
}
