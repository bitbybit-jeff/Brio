import type { CSSProperties } from "react";
import type { CustomGoal } from "../types/Goals";
import closeIcon from "../assets/close-icon.svg";

type Props = {
  goals: CustomGoal[];
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  onClose: () => void;
  onEdit: (goal: CustomGoal) => void;
  onDelete: (id: number) => void;
};

function CustomGoalsView({
  goals,
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
          <p className="form-eyebrow">Your goals</p>
          <h1>All Goals</h1>
        </div>
        <button
          className="form-close-button"
          type="button"
          onClick={onClose}
          aria-label="Back to goals"
        >
          <img src={closeIcon} alt="" />
        </button>
      </header>

      {goals.length > 0 ? (
        <div className="custom-goals-list">
          {goals.map((goal) => {
            const progress =
              goal.direction === "debt"
                ? goal.startingAmount > 0
                  ? Math.max(
                      0,
                      Math.min(
                        ((goal.startingAmount - Math.abs(goal.currentAmount)) /
                          goal.startingAmount) *
                          100,
                        100,
                      ),
                    )
                  : 0
                : goal.targetAmount > 0
                  ? Math.max(
                      0,
                      Math.min(
                        (goal.currentAmount / goal.targetAmount) * 100,
                        100,
                      ),
                    )
                  : 0;

            return (
              <article
                className="custom-goal-card"
                key={goal.id}
                style={{ "--goal-color": goal.color } as CSSProperties}
              >
                <div className="custom-goal-heading">
                  <div>
                    <p>{goal.targetDate ? formatDate(goal.targetDate) : ""}</p>
                    <h2>{goal.name}</h2>
                  </div>
                  <strong>{progress.toFixed(1)}%</strong>
                </div>
                <div className="goal-card-values">
                  <p>
                    <span>Current</span>
                    {formatCurrency(goal.currentAmount)}
                  </p>
                  <p>
                    <span>Target</span>
                    {formatCurrency(goal.targetAmount)}
                  </p>
                </div>
                <progress
                  value={
                    goal.direction === "debt"
                      ? Math.max(
                          0,
                          goal.startingAmount - Math.abs(goal.currentAmount),
                        )
                      : goal.currentAmount
                  }
                  max={
                    goal.direction === "debt"
                      ? goal.startingAmount
                      : goal.targetAmount
                  }
                />
                <div className="custom-goal-actions">
                  <button
                    className="action-button edit-button"
                    type="button"
                    onClick={() => onEdit(goal)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-button delete-button"
                    type="button"
                    onClick={() => onDelete(goal.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="transaction-detail-empty">
          <h2>No custom goals yet</h2>
          <p>Create a goal to start tracking it here.</p>
        </div>
      )}
    </section>
  );
}

export default CustomGoalsView;
