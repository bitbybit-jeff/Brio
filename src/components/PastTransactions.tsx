type Props = {
  pastTotal: number;
  formatCurrency: (amount: number) => string;
  count: number;
  onOpen: () => void;
};

function PastTransactions({ pastTotal, formatCurrency, count, onOpen }: Props) {
  return (
    <button className="transaction-summary-card" type="button" onClick={onOpen}>
      <span className="summary-eyebrow">Last 30 days</span>
      <h2>Past</h2>
      <strong>{formatCurrency(pastTotal)}</strong>
      <span className="summary-count">
        {count} {count === 1 ? "transaction" : "transactions"}
      </span>
    </button>
  );
}

export default PastTransactions;
