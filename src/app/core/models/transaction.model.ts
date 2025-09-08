export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  isCreditCard: boolean;
  createdAt: Date;
}

