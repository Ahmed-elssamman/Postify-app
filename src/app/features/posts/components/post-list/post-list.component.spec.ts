import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PostsService } from '../../services/posts.service';
import { PostListComponent } from './post-list.component';

describe('PostListComponent', () => {
  let fixture: ComponentFixture<PostListComponent>;
  let component: PostListComponent;

  const postsServiceStub = {
    getPosts: vi.fn(),
  };

  beforeEach(async () => {
    postsServiceStub.getPosts.mockReset();

    await TestBed.configureTestingModule({
      imports: [PostListComponent],
      providers: [provideRouter([]), { provide: PostsService, useValue: postsServiceStub }],
    }).compileComponents();
  });

  it('loads the first 50 posts and filters them by title', () => {
    postsServiceStub.getPosts.mockReturnValue(
      of(
        Array.from({ length: 55 }, (_, index) => ({
          id: index + 1,
          userId: 1,
          title: `Post ${index + 1}`,
          body: 'Body',
        })),
      ),
    );

    fixture = TestBed.createComponent(PostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component['posts']().length).toBe(50);

    component['updateSearchTerm']('Post 3');
    expect(component['filteredPosts']().every((post) => post.title.includes('3'))).toBe(true);
  });

  it('shows an error state when loading fails', () => {
    postsServiceStub.getPosts.mockReturnValue(throwError(() => new Error('boom')));

    fixture = TestBed.createComponent(PostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component['hasError']()).toBe(true);
    expect(component['posts']()).toEqual([]);
  });
});
