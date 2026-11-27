export type CustomGoal = {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  startingAmount: number;
  targetDate: string;
  color: string;
  direction: "savings" | "debt";
};
