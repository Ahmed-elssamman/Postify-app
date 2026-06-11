import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PostsService } from '../../services/posts.service';
import { AddCommentComponent } from './add-comment.component';

describe('AddCommentComponent', () => {
  let fixture: ComponentFixture<AddCommentComponent>;
  let component: AddCommentComponent;

  const postsServiceStub = {
    createComment: vi.fn(),
  };

  const toastrStub = {
    success: vi.fn(),
  };

  beforeEach(async () => {
    postsServiceStub.createComment.mockReset();
    toastrStub.success.mockReset();

    await TestBed.configureTestingModule({
      imports: [AddCommentComponent],
      providers: [
        { provide: PostsService, useValue: postsServiceStub },
        { provide: ToastrService, useValue: toastrStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCommentComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('posts', [
      { id: 1, userId: 1, title: 'First post', body: 'Alpha' },
      { id: 2, userId: 1, title: 'Second post', body: 'Beta' },
    ]);
    fixture.componentRef.setInput('currentPostId', 2);
    fixture.detectChanges();
  });

  it('preselects the current post id in the dropdown model', () => {
    expect(component.commentModel().postId).toBe('2');
  });

  it('submits the selected post id and clears only text fields', async () => {
    postsServiceStub.createComment.mockReturnValue(
      of({
        id: 99,
        postId: 1,
        name: 'Jamie',
        email: 'jamie@example.com',
        body: 'Great post',
      }),
    );

    component.commentModel.set({
      postId: '1',
      name: 'Jamie',
      email: 'jamie@example.com',
      body: 'Great post',
    });

    const emitted: number[] = [];
    component.commentCreated.subscribe((comment) => emitted.push(comment.postId));

    component.submitComment(new Event('submit'));

    expect(postsServiceStub.createComment).toHaveBeenCalledWith({
      postId: 1,
      name: 'Jamie',
      email: 'jamie@example.com',
      body: 'Great post',
    });
    expect(component.commentModel()).toEqual({
      postId: '1',
      name: '',
      email: '',
      body: '',
    });
    expect(emitted).toEqual([1]);
    expect(toastrStub.success).toHaveBeenCalled();
  });
});
