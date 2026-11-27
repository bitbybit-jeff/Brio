type Props = {
  balance: number;
  income: number;
  expenses: number;
  savings: number;
  formatCurrency: (amount: number) => string;
};

function DashboardCards({
  balance,
  income,
  expenses,
  savings,
  formatCurrency,
}: Props) {
  return (
    <section className="dashboard-view">
      <div className="greeting">
        <h2>Welcome</h2>
      </div>
      <div className="dashboard">
        <div className="card balance-card">
          <h3>Balance</h3>
          <p>{formatCurrency(balance)}</p>
        </div>

        <div className="card income-card">
          <h3>Income</h3>
          <p>{formatCurrency(income)}</p>
        </div>

        <div className="card expense-card">
          <h3>Expenses</h3>
          <p>{formatCurrency(Math.abs(expenses))}</p>
        </div>

        <div className="card savings-card">
          <h3>Savings</h3>
          <p>{formatCurrency(savings)}</p>
        </div>
      </div>
    </section>
  );
}

export default DashboardCards;
