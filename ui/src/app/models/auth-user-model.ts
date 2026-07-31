// Password-free user shape returned by POST /auth/login and GET /auth/me.
// Deliberately distinct from UserModel, which still carries user_password
// for the legacy get_users/update_users endpoints.
export type AuthUserModel = {
  user_id: number;
  user_name: string;
  email: string;
  theme: string;
  portfolio_name: string;
  user_photo: string | null;
}

export type LoginResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: AuthUserModel;
}
