import type { Transaction } from "../types/Transactions";
import type { CSSProperties } from "react";
import closeIcon from "../assets/close-icon.svg";

type Props = {
  title: string;
  subtitle: string;
  transactions: Transaction[];
  total: number;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  onClose: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
};

function TransactionDetailView({
  title,
  subtitle,
  transactions,
  total,
  formatCurrency,
  formatDate,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  return (
    <section className="transaction-detail-view">
      <header className="transaction-detail-header">
        <div>
          <p className="form-eyebrow">{subtitle}</p>
          <h1>{title}</h1>
        </div>
        <button
          className="form-close-button"
          type="button"
          onClick={onClose}
          aria-label="Back to transaction overview"
        >
          <img src={closeIcon} alt="" />
        </button>
      </header>

      <div className="transaction-detail-total">
        <span>Total</span>
        <strong>{formatCurrency(total)}</strong>
      </div>

      {transactions.length > 0 ? (
        <ul className="transaction-detail-list">
          {[...transactions]
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((transaction) => (
              <li
                key={transaction.id}
                className="transaction-detail-item"
                style={
                  {
                    "--entry-color":
                      transaction.color || "var(--accent-positive)",
                  } as CSSProperties
                }
              >
                <div className="transaction-list-main">
                  <div>
                    <strong>{transaction.description}</strong>
                    <span>{transaction.category}</span>
                  </div>
                  <time>{formatDate(transaction.date)}</time>
                </div>
                <div className="transaction-list-actions">
                  <strong
                    className={
                      transaction.type === "income" ? "income" : "expense"
                    }
                  >
                    {formatCurrency(
                      transaction.type === "income"
                        ? Math.abs(transaction.amount)
                        : -Math.abs(transaction.amount),
                    )}
                  </strong>
                  <button
                    className="action-button edit-button"
                    type="button"
                    onClick={() => onEdit(transaction)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-button delete-button"
                    type="button"
                    onClick={() => onDelete(transaction.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
        </ul>
      ) : (
        <div className="transaction-detail-empty">
          <h2>No transactions here</h2>
          <p>Transactions in this date range will appear here.</p>
        </div>
      )}
    </section>
  );
}

export default TransactionDetailView;
