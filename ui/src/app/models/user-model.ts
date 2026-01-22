export type UserModel = {
  id: number;
  user_name: string | null;
  user_password: string | null;
  email: string | null;
  theme: string | null;
  portfolio_id: number | null;
};

// Factory function to create a new PortfolioModel object
export const createNewSymbol = (): UserModel => ({
  id: 0,
  user_name: '',
  user_password: '',
  email: '',
  theme: '',
  portfolio_id: 0,
});
