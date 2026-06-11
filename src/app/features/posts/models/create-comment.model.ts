export interface CreateComment {
  postId: number;
  name: string;
  email: string;
  body: string;
}

export interface AddCommentFormValue {
  name: string;
  email: string;
  body: string;
}
