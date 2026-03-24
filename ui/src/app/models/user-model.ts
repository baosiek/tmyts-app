export type UserModel = {
  user_id: number;
  user_name: string | null;
  user_password: string | null;
  email: string | null;
  theme: string | null;
  portfolio_name: string;
}

// Factory function to create a new PortfolioModel object
export const createNewUser = (): UserModel => ({
  user_id: 0,
  user_name: '',
  user_password: '',
  email: '',
  theme: '',
  portfolio_name: '',
});
