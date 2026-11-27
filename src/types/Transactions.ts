export type Transaction = {
  id: number;
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense" | "savings";
  date: string;
  color: string | null;
  goalId?: number | null;
};
