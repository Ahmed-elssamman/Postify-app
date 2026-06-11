export interface CreateComment {
  postId: number;
  name: string;
  email: string;
  body: string;
}

export interface AddCommentFormValue {
  postId: string;
  name: string;
  email: string;
  body: string;
}