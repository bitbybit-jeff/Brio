type Props = {
  savings: number;
  savingsGoal: number;
  savingsProgress: number;
  savingsStatus: string;
  setSavingsGoal: (value: number) => void;
  formatCurrency: (amount: number) => string;
};

function SavingsTracker({
  savings,
  savingsGoal,
  savingsProgress,
  savingsStatus,
  setSavingsGoal,
  formatCurrency,
}: Props) {
  return (
    <section className="goal-view savings-view">
      <header className="goal-view-header">
        <div>
          <p className="form-eyebrow">Savings planning</p>
          <h2>Savings Goal</h2>
        </div>
      </header>
      <label className="goal-input">
        <span>Savings goal</span>
        <input
          type="number"
          value={savingsGoal}
          onChange={(e) => setSavingsGoal(Number(e.target.value))}
        />
      </label>
      <div className="savings-goal-card">
        <div className="goal-card-heading">
          <h3>Current Savings</h3>
          <strong>{formatCurrency(savings)}</strong>
        </div>
        <div className="goal-card-values">
          <p>
            <span>Goal</span>
            {formatCurrency(savingsGoal)}
          </p>
          <p>
            <span>Progress</span>
            {savingsProgress.toFixed(1)}%
          </p>
        </div>
        <p className="goal-status" style={{ color: "var(--accent-warning)" }}>
          {savingsStatus}
        </p>
        <progress value={savings} max={savingsGoal} />
      </div>
    </section>
  );
}

export default SavingsTracker;
