export type Theme = 'light' | 'dark' | 'system';
export type ColorScheme = 'light' | 'dark';

export interface IAuthLoginRequest {
  username: string;
  password: string;
}

export interface IAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface IUser {
  id: string
  email: string
  first_name: string
  last_name: string
  display_name: string
  initials: string
  note: INote
}

export interface INote {
  id: string
  created_at: string
  updated_at: string
  content: string

  isAnon: boolean
}
