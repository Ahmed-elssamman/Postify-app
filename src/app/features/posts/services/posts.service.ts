import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateComment } from '../models/create-comment.model';
import { CreatePost } from '../models/create-post.model';
import { Comment } from '../models/comment.model';
import { Post } from '../models/post.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = environment.baseUrl;

  getPosts(): Observable<Post[]> {
    return this.httpClient.get<Post[]>(`${this.apiUrl}/posts`);
  }

  getPostById(id: number): Observable<Post> {
    return this.httpClient.get<Post>(`${this.apiUrl}/posts/${id}`);
  }

  createPost(payload: CreatePost): Observable<Post> {
    return this.httpClient.post<Post>(`${this.apiUrl}/posts`, payload);
  }

  getCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.httpClient.get<Comment[]>(`${this.apiUrl}/posts/${postId}/comments`);
  }

  createComment(payload: CreateComment): Observable<Comment> {
    return this.httpClient.post<Comment>(`${this.apiUrl}/comments`, payload);
  }
}
