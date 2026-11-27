import type { Transaction } from "../types/Transactions";
import { useState } from "react";
import type { CSSProperties } from "react";
import { createPortal } from "react-dom";

type Props = {
  transactions: Transaction[];
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
};

function CalendarWidget({
  transactions,
  formatCurrency,
  formatDate,
  onEdit,
  onDelete,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = currentDate.getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const blankDays = Array(firstDayOfMonth).fill(null);
  const monthName = currentDate.toLocaleString("en-US", {
    month: "long",
  });
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  const selectedTransactions = selectedDate
    ? transactions.filter((transaction) => transaction.date === selectedDate)
    : [];
  return (
    <>
      <div className="calendar-widget">
        <h3>
          {monthName} {year}
        </h3>
        <div className="calendar-weekdays">
          <span>Su</span>
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
        </div>
        <div className="calendar-grid">
          {blankDays.map((_, index) => (
            <div key={`blank-${index}`} className="calendar-empty" />
          ))}
          {days.map((day) => {
            const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const transactionsOnDay = transactions.filter(
              (transaction) => transaction.date === formattedDate,
            );

            return (
              <button
                key={day}
                className={`calendar-day${selectedDate === formattedDate ? " selected" : ""}${day === today ? " today" : ""}`}
                aria-label={`Open transactions for ${monthName} ${day}, ${year}`}
                aria-pressed={selectedDate === formattedDate}
                onClick={() => setSelectedDate(formattedDate)}
              >
                {day}
                {transactionsOnDay.length > 0 && (
                  <span className="calendar-dot" />
                )}
              </button>
            );
          })}
        </div>
        {selectedDate &&
          createPortal(
            <div
              className="modal-overlay"
              role="presentation"
              aria-modal="true"
            >
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button
                  className="modal-close-button"
                  type="button"
                  onClick={() => setSelectedDate(null)}
                  aria-label="Close calendar details"
                >
                  ×
                </button>
                <h3>{formatDate(selectedDate)}</h3>
                {selectedTransactions.length > 0 ? (
                  <ul className="calendar-modal-list">
                    {selectedTransactions.map((transaction) => (
                      <li
                        key={transaction.id}
                        style={
                          {
                            "--entry-color":
                              transaction.color || "var(--accent-positive)",
                          } as CSSProperties
                        }
                      >
                        <div className="calendar-modal-entry">
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
                                transaction.type === "income"
                                  ? "income"
                                  : "expense"
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
                              onClick={() => {
                                setSelectedDate(null);
                                onEdit(transaction);
                              }}
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
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No Transactions on this date.</p>
                )}
              </div>
            </div>,
            document.body,
          )}
      </div>
    </>
  );
}

export default CalendarWidget;
