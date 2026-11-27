import type { CustomGoal } from "../types/Goals";
import closeIcon from "../assets/close-icon.svg";

type Props = {
  goal: Omit<CustomGoal, "id">;
  setGoal: (goal: Omit<CustomGoal, "id">) => void;
  editingId: number | null;
  onSave: () => void;
  onClose: () => void;
};

function CustomGoalForm({ goal, setGoal, editingId, onSave, onClose }: Props) {
  const canSave =
    goal.name.trim() !== "" &&
    (goal.direction === "debt"
      ? goal.targetAmount >= 0 &&
        (goal.startingAmount > 0 || goal.currentAmount < 0)
      : goal.targetAmount > 0 && goal.currentAmount >= 0) &&
    goal.targetDate !== "" &&
    goal.color !== "";

  return (
    <section className="transaction-form-view">
      <div className="transaction-form-card">
        <header className="transaction-form-header">
          <div>
            <p className="form-eyebrow">
              {editingId !== null ? "Update goal" : "New goal"}
            </p>
            <h2>{editingId !== null ? "Edit Goal" : "Add Goal"}</h2>
          </div>
          <button
            className="form-close-button"
            type="button"
            onClick={onClose}
            aria-label="Close goal form"
          >
            <img src={closeIcon} alt="" />
          </button>
        </header>

        <div className="transaction-form-fields">
          <label className="form-field">
            <span>Goal name</span>
            <input
              type="text"
              placeholder="e.g. Emergency fund"
              value={goal.name}
              onChange={(event) =>
                setGoal({ ...goal, name: event.target.value })
              }
            />
          </label>

          <label className="form-field">
            <span>
              {goal.direction === "debt" ? "Target balance" : "Target amount"}
            </span>
            <input
              type="number"
              min="0"
              placeholder={goal.direction === "debt" ? "$0.00" : "0.00"}
              value={goal.direction === "debt" ? 0 : goal.targetAmount || ""}
              disabled={goal.direction === "debt"}
              onChange={(event) =>
                setGoal({
                  ...goal,
                  targetAmount: Number(event.target.value),
                })
              }
            />
          </label>

          <label className="form-field">
            <span>
              {goal.direction === "debt" ? "Starting debt" : "Starting amount"}
            </span>
            <input
              type="number"
              min={goal.direction === "debt" ? "0" : undefined}
              placeholder="0.00"
              value={
                goal.direction === "debt"
                  ? goal.startingAmount || ""
                  : goal.currentAmount || ""
              }
              onChange={(event) =>
                goal.direction === "debt"
                  ? setGoal({
                      ...goal,
                      startingAmount: Number(event.target.value),
                      currentAmount: -Number(event.target.value),
                    })
                  : setGoal({
                      ...goal,
                      startingAmount: Number(event.target.value),
                      currentAmount: Number(event.target.value),
                    })
              }
            />
          </label>

          <fieldset className="goal-direction-group">
            <legend>Goal type</legend>
            <div className="goal-direction-options">
              {(["savings", "debt"] as const).map((direction) => (
                <label className="transaction-type-option" key={direction}>
                  <input
                    type="radio"
                    name="goal-direction"
                    checked={goal.direction === direction}
                    onChange={() =>
                      setGoal({
                        ...goal,
                        direction,
                        targetAmount:
                          direction === "debt" ? 0 : goal.targetAmount,
                        startingAmount:
                          direction === "debt"
                            ? Math.abs(goal.currentAmount)
                            : Math.max(0, goal.currentAmount),
                        currentAmount:
                          direction === "debt"
                            ? -Math.abs(goal.currentAmount)
                            : Math.max(0, goal.currentAmount),
                      })
                    }
                  />
                  <span className="goal-direction-card">
                    <strong>
                      {direction === "savings" ? "Savings" : "Debt paydown"}
                    </strong>
                    <small>
                      {direction === "savings"
                        ? "Grow toward a target"
                        : "Reduce debt toward zero"}
                    </small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="form-field">
            <span>Target date</span>
            <input
              type="date"
              value={goal.targetDate}
              onChange={(event) =>
                setGoal({ ...goal, targetDate: event.target.value })
              }
            />
          </label>

          <label className="form-field color-field">
            <span>Goal color</span>
            <div className="color-entry-row">
              <input
                type="color"
                value={goal.color}
                onChange={(event) =>
                  setGoal({ ...goal, color: event.target.value })
                }
                aria-label="Choose goal color"
              />
            </div>
          </label>
        </div>

        <button
          className="save-transaction-button"
          type="button"
          onClick={onSave}
          disabled={!canSave}
        >
          {editingId !== null ? "Update Goal" : "Add Goal"}
        </button>
      </div>
    </section>
  );
}

export default CustomGoalForm;
