import type { CSSProperties } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Props = {
  incomeAllocationData: {
    name: string;
    value: number;
    color: string;
  }[];
  categoryTotals: Record<string, number>;
  categoryColors: Record<string, string>;
  formatCurrency: (amount: number) => string;
  hasTransactions: boolean;
  onAddTransaction: () => void;
};

function SpendingChart({
  incomeAllocationData,
  formatCurrency,
  categoryTotals,
  categoryColors,
  hasTransactions,
  onAddTransaction,
}: Props) {
  if (!hasTransactions) {
    return (
      <section className="chart-card chart-empty-state">
        <div>
          <p className="form-eyebrow">Spending insights</p>
          <h2>See where your money goes</h2>
          <p>
            Add a transaction to create a spending breakdown by category and
            visualize your income allocation.
          </p>
          <button className="empty-chart-button" onClick={onAddTransaction}>
            Add Your First Transaction
          </button>
        </div>
      </section>
    );
  }
  return (
    <section className="chart-card">
      <header className="chart-card-header">
        <div>
          <p className="form-eyebrow">Spending insights</p>
          <h2>Spending Breakdown</h2>
        </div>
      </header>

      <div className="chart-card-body">
        <div className="spending-chart-panel">
          <div className="spending-chart-frame">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incomeAllocationData}
                  cx="50%"
                  cy="46%"
                  labelLine={false}
                  outerRadius="68%"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                  }
                >
                  {incomeAllocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  align="center"
                  verticalAlign="bottom"
                  layout="horizontal"
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <aside className="chart-category-panel">
          <p className="chart-category-title">Categories</p>
          <ul>
            {Object.entries(categoryTotals).map(([category, total]) => (
              <li
                key={category}
                style={
                  {
                    "--category-color":
                      categoryColors[category] || "var(--text-muted)",
                  } as CSSProperties
                }
              >
                <span>{category}</span>
                <strong>{formatCurrency(total)}</strong>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}

export default SpendingChart;
