type Props = {
  todaysTotal: number;
  formatCurrency: (amount: number) => string;
  count: number;
  onOpen: () => void;
};

function TodaysTransactions({
  todaysTotal,
  formatCurrency,
  count,
  onOpen,
}: Props) {
  return (
    <button className="transaction-summary-card" type="button" onClick={onOpen}>
      <span className="summary-eyebrow">Current</span>
      <h2>Today</h2>
      <strong>{formatCurrency(todaysTotal)}</strong>
      <span className="summary-count">
        {count} {count === 1 ? "transaction" : "transactions"}
      </span>
    </button>
  );
}

export default TodaysTransactions;
