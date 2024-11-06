export interface User {
  user_id: number;
  username: string;
  email: string;
}

export interface UserWithPassword extends User {
  password: string;
}
