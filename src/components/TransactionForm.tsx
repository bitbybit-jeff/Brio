import type { CSSProperties } from "react";
import type { CustomGoal } from "../types/Goals";
import closeIcon from "../assets/close-icon.svg";

type Props = {
  description: string;
  setDescription: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  transactionType: "income" | "expense" | "savings";
  setTransactionType: (value: "income" | "expense" | "savings") => void;
  date: string;
  setDate: (value: string) => void;
  editingId: number | null;
  saveTransaction: () => void;
  onClose: () => void;
  color: string;
  setColor: (value: string) => void;
  recentColors: string[];
  customGoals: CustomGoal[];
  selectedGoalId: number | null;
  setSelectedGoalId: (value: number | null) => void;
};

function TransactionForm({
  description,
  setDescription,
  amount,
  setAmount,
  category,
  setCategory,
  transactionType,
  setTransactionType,
  date,
  setDate,
  editingId,
  saveTransaction,
  onClose,
  color,
  setColor,
  recentColors = [],
  customGoals,
  selectedGoalId,
  setSelectedGoalId,
}: Props) {
  return (
    <section className="transaction-form-view">
      <div className="transaction-form-card">
        <header className="transaction-form-header">
          <div>
            <p className="form-eyebrow">
              {editingId !== null ? "Update entry" : "New entry"}
            </p>
            <h2>
              {editingId !== null ? "Edit Transaction" : "Add Transaction"}
            </h2>
          </div>
          <button
            className="form-close-button"
            type="button"
            onClick={onClose}
            aria-label="Close transaction form"
          >
            <img src={closeIcon} alt="" />
          </button>
        </header>

        <div className="transaction-form-fields">
          <label className="form-field">
            <span>Description</span>
            <input
              type="text"
              placeholder="e.g. Weekly groceries"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <label className="form-field">
            <span>Amount</span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>

          <label className="form-field">
            <span>Category</span>
            <input
              type="text"
              placeholder="e.g. Housing"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </label>

          <label className="form-field">
            <span>Date</span>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>

          <label className="form-field color-field">
            <span>Entry color</span>
            <div className="color-entry-row">
              <input
                type="color"
                value={color || "#69a88b"}
                onChange={(e) => setColor(e.target.value)}
                aria-label="Choose transaction entry color"
              />
              {recentColors.length > 0 && (
                <div className="recent-colors" aria-label="Recent colors">
                  {recentColors.map((recentColor) => (
                    <button
                      key={recentColor}
                      className="recent-color"
                      type="button"
                      style={{ "--recent-color": recentColor } as CSSProperties}
                      onClick={() => setColor(recentColor)}
                      aria-label={`Use recent color ${recentColor}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </label>
        </div>

        <fieldset className="transaction-type-group">
          <legend>Transaction type</legend>
          <div className="transaction-type-options">
            {(["income", "expense", "savings"] as const).map((type) => (
              <label className="transaction-type-option" key={type}>
                <input
                  type="radio"
                  name="transaction-type"
                  value={type}
                  checked={transactionType === type}
                  onChange={() => {
                    setTransactionType(type);
                    if (type === "income") setSelectedGoalId(null);
                  }}
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {customGoals.length > 0 && (
          <fieldset className="transaction-type-group goal-assignment-group">
            <legend>Add to a goal</legend>
            <div className="transaction-type-options goal-radio-options">
              <label className="transaction-type-option">
                <input
                  type="radio"
                  name="transaction-goal"
                  checked={selectedGoalId === null}
                  onChange={() => setSelectedGoalId(null)}
                />
                <span>None</span>
              </label>
              {customGoals.map((goal) => (
                <label className="transaction-type-option" key={goal.id}>
                  <input
                    type="radio"
                    name="transaction-goal"
                    checked={selectedGoalId === goal.id}
                    onChange={() => {
                      setSelectedGoalId(goal.id);
                      setTransactionType("expense");
                    }}
                  />
                  <span>{goal.name}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <button
          className="save-transaction-button"
          onClick={saveTransaction}
          disabled={
            !color ||
            !description.trim() ||
            !date ||
            !amount.trim() ||
            !Number.isFinite(Number(amount)) ||
            Number(amount) <= 0
          }
        >
          {editingId !== null ? "Update Transaction" : "Add Transaction"}
        </button>
      </div>
    </section>
  );
}

export default TransactionForm;
