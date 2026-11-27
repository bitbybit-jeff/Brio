type Props = {
  upcomingTotal: number;
  formatCurrency: (amount: number) => string;
  count: number;
  onOpen: () => void;
};

function UpcomingTransactions({
  upcomingTotal,
  formatCurrency,
  count,
  onOpen,
}: Props) {
  return (
    <button className="transaction-summary-card" type="button" onClick={onOpen}>
      <span className="summary-eyebrow">Scheduled</span>
      <h2>Upcoming</h2>
      <strong>{formatCurrency(upcomingTotal)}</strong>
      <span className="summary-count">
        {count} {count === 1 ? "transaction" : "transactions"}
      </span>
    </button>
  );
}

export default UpcomingTransactions;
