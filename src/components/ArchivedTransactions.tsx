type Props = {
  archivedTotal: number;
  formatCurrency: (amount: number) => string;
  count: number;
  onOpen: () => void;
};

function ArchivedTransactions({
  archivedTotal,
  formatCurrency,
  count,
  onOpen,
}: Props) {
  return (
    <button className="transaction-summary-card" type="button" onClick={onOpen}>
      <span className="summary-eyebrow">31 days to 1 year</span>
      <h2>Archived</h2>
      <strong>{formatCurrency(archivedTotal)}</strong>
      <span className="summary-count">
        {count} {count === 1 ? "transaction" : "transactions"}
      </span>
    </button>
  );
}

export default ArchivedTransactions;
