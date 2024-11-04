import { User } from "./user";

export interface Post {
  post_id: string;
  user_id: string;
  text: string;
  postdate: Date;
}

export interface PostWithUser extends Post, User {}
