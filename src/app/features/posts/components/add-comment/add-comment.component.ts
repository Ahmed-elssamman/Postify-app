import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  email,
  FormField,
  FormRoot,
  form,
  minLength,
  required,
  submit,
} from '@angular/forms/signals';
import { Comment } from '../../models/comment.model';
import { AddCommentFormValue, CreateComment } from '../../models/create-comment.model';
import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';



@Component({
  selector: 'app-add-comment',
  imports: [FormField, FormRoot],
  templateUrl: './add-comment.component.html',
  styleUrl: './add-comment.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCommentComponent {
  private readonly postsService = inject(PostsService);
  private readonly toastr = inject(ToastrService);

  readonly posts = input.required<Post[]>();
  readonly currentPostId = input.required<number>();
  readonly commentCreated = output<Comment>();

  readonly commentModel = signal<AddCommentFormValue>({
    postId: '',
    name: '',
    email: '',
    body: '',
  });

  readonly commentForm = form(this.commentModel, (path) => {
    required(path.postId, { message: 'Please select a post.' });
    required(path.name, { message: 'Name is required.' });
    minLength(path.name, 2, { message: 'Name must be at least 2 characters.' });
    required(path.email, { message: 'Email is required.' });
    email(path.email, { message: 'Enter a valid email address.' });
    required(path.body, { message: 'Comment is required.' });
    minLength(path.body, 5, { message: 'Comment must be at least 5 characters.' });
  });

  constructor() {
    effect(() => {
      const routePostId = this.currentPostId();

      this.commentModel.update((model) => ({
        ...model,
        postId: String(routePostId),
      }));
    });
  }

  submitComment(event: Event): void {
    event.preventDefault();

    void submit(this.commentForm, async (formState) => {
      const value = formState().value();
      const payload: CreateComment = {
        postId: Number(value.postId),
        name: value.name.trim(),
        email: value.email.trim(),
        body: value.body.trim(),
      };

      const comment = await firstValueFrom(this.postsService.createComment(payload));

      this.toastr.success('Comment added successfully', 'Postify');
      this.commentCreated.emit(comment);
      this.commentForm().reset();
      this.commentModel.set({
        postId: value.postId,
        name: '',
        email: '',
        body: '',
      });
    });
  }
}
