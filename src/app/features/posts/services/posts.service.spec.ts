import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CreateComment } from '../models/create-comment.model';
import { CreatePost } from '../models/create-post.model';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  let service: PostsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostsService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(PostsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('loads posts', () => {
    service.getPosts().subscribe();

    const request = httpTestingController.expectOne(
      'https://jsonplaceholder.typicode.com/posts',
    );

    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('loads a single post by id', () => {
    service.getPostById(7).subscribe();

    const request = httpTestingController.expectOne(
      'https://jsonplaceholder.typicode.com/posts/7',
    );

    expect(request.request.method).toBe('GET');
    request.flush({ id: 7, userId: 1, title: 'A', body: 'B' });
  });

  it('creates a post with the provided payload', () => {
    const payload: CreatePost = { userId: 1, title: 'Title', body: 'Body copy' };

    service.createPost(payload).subscribe();

    const request = httpTestingController.expectOne(
      'https://jsonplaceholder.typicode.com/posts',
    );

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    request.flush({ ...payload, id: 101 });
  });

  it('loads comments for a post', () => {
    service.getCommentsByPostId(3).subscribe();

    const request = httpTestingController.expectOne(
      'https://jsonplaceholder.typicode.com/posts/3/comments',
    );

    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('creates a comment with the selected post id', () => {
    const payload: CreateComment = {
      postId: 3,
      name: 'Taylor',
      email: 'taylor@example.com',
      body: 'Thoughtful comment',
    };

    service.createComment(payload).subscribe();

    const request = httpTestingController.expectOne(
      'https://jsonplaceholder.typicode.com/comments',
    );

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    request.flush({ ...payload, id: 501 });
  });
});
