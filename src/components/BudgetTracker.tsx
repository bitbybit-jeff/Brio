type Props = {
  budgetGoal: number;
  setBudgetGoal: (value: number) => void;
  spent: number;
  remainingBudget: number;
  budgetPercentUsed: number;
  budgetStatusColor: string;
  formatCurrency: (amount: number) => string;
};

function BudgetTracker({
  budgetGoal,
  setBudgetGoal,
  spent,
  remainingBudget,
  budgetPercentUsed,
  budgetStatusColor,
  formatCurrency,
}: Props) {
  return (
    <section className="goal-view">
      <header className="goal-view-header">
        <div>
          <p className="form-eyebrow">Monthly planning</p>
          <h2>Monthly Budget Goal</h2>
        </div>
      </header>
      <label className="goal-input">
        <span>Budget goal</span>
        <input
          type="number"
          value={budgetGoal}
          onChange={(e) => setBudgetGoal(Number(e.target.value))}
        />
      </label>
      <div className="budget-card">
        <div className="goal-card-heading">
          <h3>Budget Progress</h3>
          <strong style={{ color: budgetStatusColor }}>
            {budgetPercentUsed.toFixed(1)}%
          </strong>
        </div>
        <div className="goal-card-values">
          <p>
            <span>Spent</span>
            {formatCurrency(spent)}
          </p>
          <p>
            <span>Remaining</span>
            {formatCurrency(remainingBudget)}
          </p>
        </div>
        <p className="goal-status" style={{ color: budgetStatusColor }}>
          {budgetPercentUsed >= 100
            ? "Budget Exceeded"
            : budgetPercentUsed >= 80
              ? "Budget Warning"
              : "Healthy Budget"}
        </p>
        <progress value={spent} max={budgetGoal} />
      </div>
    </section>
  );
}

export default BudgetTracker;
