import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PostsService } from '../../services/posts.service';
import { AddPostComponent } from './add-post.component';

describe('AddPostComponent', () => {
  let fixture: ComponentFixture<AddPostComponent>;
  let component: AddPostComponent;
  let router: Router;

  const postsServiceStub = {
    createPost: vi.fn(),
  };

  const toastrStub = {
    success: vi.fn(),
  };

  beforeEach(async () => {
    postsServiceStub.createPost.mockReset();
    toastrStub.success.mockReset();

    await TestBed.configureTestingModule({
      imports: [AddPostComponent],
      providers: [
        provideRouter([]),
        { provide: PostsService, useValue: postsServiceStub },
        { provide: ToastrService, useValue: toastrStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPostComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('creates a post with user id 1 and redirects home', async () => {
    postsServiceStub.createPost.mockReturnValue(
      of({
        id: 101,
        userId: 1,
        title: 'A stronger title',
        body: 'Enough body copy for the validator',
      }),
    );

    component.postModel.set({
      title: 'A stronger title',
      body: 'Enough body copy for the validator',
    });

    component.submitPost(new Event('submit'));

    expect(postsServiceStub.createPost).toHaveBeenCalledWith({
      userId: 1,
      title: 'A stronger title',
      body: 'Enough body copy for the validator',
    });
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
    expect(toastrStub.success).toHaveBeenCalled();
  });
});
