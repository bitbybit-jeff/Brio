import { lazy, Suspense, useEffect, useState } from "react";
import type { Transaction } from "./types/Transactions";
import DashboardCards from "./components/DashboardCards";
import TransactionForm from "./components/TransactionForm";
import TodaysTransactions from "./components/TodaysTransactions";
import UpcomingTransactions from "./components/UpcomingTransactions";
import PastTransactions from "./components/PastTransactions";
import ArchivedTransactions from "./components/ArchivedTransactions";
import BudgetTracker from "./components/BudgetTracker";
import SavingsTracker from "./components/SavingsTracker";
import CalendarWidget from "./components/CalendarWidget";
import addIcon from "./assets/add-icon.svg";
import DashboardIcon from "./assets/dashboard-icon.svg";
import TransactionsIcon from "./assets/transactions-icon.svg";
import GoalIcon from "./assets/goal-icon.svg";
import TransactionDetailView from "./components/TransactionDetailView";
import type { CustomGoal } from "./types/Goals";
import CustomGoalForm from "./components/CustomGoalForm";
import CustomGoalsView from "./components/CustomGoalsView";

import "./App.css";

const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const SpendingChart = lazy(() => import("./components/SpendingChart"));

function App() {
  /** Transaction Details */
  const [activeView, setActiveView] = useState("dashboard");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState<
    "income" | "expense" | "savings"
  >("income");
  const [date, setDate] = useState(() => toDateKey(new Date()));
  const [category, setCategory] = useState("Other");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [transactionColor, setTransactionColor] = useState("");
  const [recentColors, setRecentColors] = useState<string[]>(() => {
    const savedColors = localStorage.getItem("recentTransactionColors");
    return savedColors ? (JSON.parse(savedColors) as string[]) : [];
  });
  const [customGoals, setCustomGoals] = useState<CustomGoal[]>(() => {
    const savedGoals = localStorage.getItem("customGoals");
    if (!savedGoals) return [];
    return (JSON.parse(savedGoals) as CustomGoal[]).map((goal) => ({
      ...goal,
      direction: goal.direction || "savings",
      startingAmount:
        goal.startingAmount ||
        (goal.direction === "debt" ? Math.abs(goal.currentAmount) : 0),
    }));
  });
  const [editingGoalId, setEditingGoalId] = useState<number | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);
  const [customGoal, setCustomGoal] = useState<Omit<CustomGoal, "id">>({
    name: "",
    targetAmount: 0,
    currentAmount: 0,
    targetDate: "",
    color: "#69a88b",
    direction: "savings",
    startingAmount: 0,
  });

  /** Retrieve locally saved data */
  const [budgetGoal, setBudgetGoal] = useState(() => {
    const savedGoal = localStorage.getItem("budgetGoal");
    return savedGoal ? Number(savedGoal) : 2000;
  });
  const [savingsGoal, setSavingsGoal] = useState(() => {
    const savedGoal = localStorage.getItem("savingsGoal");
    return savedGoal ? Number(savedGoal) : 5000;
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem("transactions");
    if (!savedTransactions) return [];
    return JSON.parse(savedTransactions) as Transaction[];
  });

  /** useEffect(s) for retrieved locally saved data */
  useEffect(() => {
    localStorage.setItem("savingsGoal", savingsGoal.toString());
  }, [savingsGoal]);
  useEffect(() => {
    localStorage.setItem("budgetGoal", budgetGoal.toString());
  }, [budgetGoal]);
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);
  useEffect(() => {
    localStorage.setItem(
      "recentTransactionColors",
      JSON.stringify(recentColors),
    );
  }, [recentColors]);
  useEffect(() => {
    localStorage.setItem("customGoals", JSON.stringify(customGoals));
  }, [customGoals]);

  const todayDate = new Date();
  const today = toDateKey(todayDate);

  /** Algorithms */
  const balance = transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );
  const savings = transactions
    .filter((transaction) => transaction.type === "savings")
    .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
  const savingsProgress =
    savingsGoal > 0 ? Math.min((savings / savingsGoal) * 100, 100) : 0;
  const categoryTotals = transactions.reduce(
    (totals, transaction) => {
      if (transaction.type === "expense") {
        totals[transaction.category] =
          (totals[transaction.category] || 0) + Math.abs(transaction.amount);
      }
      return totals;
    },
    {} as Record<string, number>,
  );
  const categoryColors = transactions.reduce(
    (colors, transaction) => {
      if (transaction.type === "expense" && transaction.color) {
        colors[transaction.category] = transaction.color;
      }
      return colors;
    },
    {} as Record<string, string>,
  );

  /** Calculations */
  const income = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((total, transaction) => total + transaction.amount, 0);
  const expenses = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((total, transaction) => total + transaction.amount, 0);
  const totalExpenses = Math.abs(expenses);
  const currentMonth = today.slice(0, 7);
  const currentMonthExpenses = transactions
    .filter(
      (transaction) =>
        transaction.amount < 0 && transaction.date.slice(0, 7) === currentMonth,
    )
    .reduce((total, transaction) => total + transaction.amount, 0);
  const spent = Math.abs(currentMonthExpenses);
  const remaining = Math.max(0, income - totalExpenses);
  const remainingBudget = budgetGoal - spent;
  const budgetPercentUsed =
    budgetGoal > 0 ? Math.min((spent / budgetGoal) * 100, 100) : 0;
  const incomeAllocationData = [
    ...Object.entries(categoryTotals).map(([category, total]) => ({
      name: category,
      value: total,
      color: categoryColors[category] || "#7f8a84",
    })),
    ...(remaining > 0
      ? [
          {
            name: "Remaining",
            value: remaining,
            color: "#7f8a84",
          },
        ]
      : []),
  ];

  /** Saving a transaction to local storage */
  const saveTransaction = () => {
    if (
      !description.trim() ||
      !amount.trim() ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) <= 0 ||
      !date ||
      !transactionColor
    ) {
      return;
    }
    setRecentColors((currentColors) =>
      [
        transactionColor,
        ...currentColors.filter((color) => color !== transactionColor),
      ].slice(0, 5),
    );
    let finalAmount = Number(amount);
    if (selectedGoalId !== null) {
      finalAmount = -Math.abs(finalAmount);
    }
    if (transactionType === "expense" || transactionType === "savings") {
      finalAmount = -Number(amount);
    }
    if (editingId !== null) {
      const previousTransaction = transactions.find(
        (transaction) => transaction.id === editingId,
      );

      setTransactions(
        transactions.map((transaction) =>
          transaction.id === editingId
            ? {
                ...transaction,
                description,
                amount: finalAmount,
                category,
                type: transactionType,
                date,
                color: transactionColor,
                goalId: selectedGoalId,
              }
            : transaction,
        ),
      );

      setCustomGoals((goals) =>
        goals.map((goal) => {
          let currentAmount = goal.currentAmount;
          if (previousTransaction?.goalId === goal.id) {
            currentAmount =
              goal.direction === "debt"
                ? currentAmount - Math.abs(previousTransaction.amount)
                : Math.max(
                    0,
                    currentAmount - Math.abs(previousTransaction.amount),
                  );
          }
          if (selectedGoalId === goal.id) {
            currentAmount =
              goal.direction === "debt"
                ? Math.min(0, currentAmount + Math.abs(finalAmount))
                : currentAmount + Math.abs(finalAmount);
          }
          return { ...goal, currentAmount };
        }),
      );

      setEditingId(null);

      setDescription("");
      setAmount("");
      setCategory("Other");
      setTransactionType("income");
      setTransactionColor("");
      setSelectedGoalId(null);
      setActiveView("transactions");

      return;
    }

    /** Creating new Transaction (Relies on above) */
    const newTransaction: Transaction = {
      id: Date.now(),
      description,
      amount: finalAmount,
      category,
      type: transactionType,
      date,
      color: transactionColor,
      goalId: selectedGoalId,
    };

    setTransactions([...transactions, newTransaction]);

    setDescription("");
    setAmount("");
    setTransactionType("income");
    setTransactionColor("");
    setSelectedGoalId(null);
    if (selectedGoalId !== null) {
      setCustomGoals((goals) =>
        goals.map((goal) =>
          goal.id === selectedGoalId
            ? {
                ...goal,
                currentAmount:
                  goal.direction === "debt"
                    ? Math.min(0, goal.currentAmount + Math.abs(finalAmount))
                    : goal.currentAmount + Math.abs(finalAmount),
              }
            : goal,
        ),
      );
    }
    setActiveView("transactions");
  };

  /** Progress for savings-budget */
  const budgetStatusColor =
    budgetPercentUsed >= 100
      ? "var(--accent-negative)"
      : budgetPercentUsed >= 80
        ? "var(--accent-warning)"
        : "var(--accent-positive)";

  const savingsStatus =
    savingsProgress >= 100
      ? "Goal Achieved!"
      : savingsProgress >= 75
        ? "Almost There!"
        : savingsProgress >= 50
          ? "Making Progress"
          : "Getting Started";

  /** Edit-Delete Existing Transactions */
  const editTransaction = (transaction: Transaction) => {
    setEditingId(transaction.id);

    setDescription(transaction.description);
    setAmount(Math.abs(transaction.amount).toString());
    setCategory(transaction.category);
    setTransactionType(transaction.type);
    setDate(transaction.date);
    setTransactionColor(transaction.color || "");
    setSelectedGoalId(transaction.goalId ?? null);
    setActiveView("transaction-form");
  };

  const closeTransactionForm = () => {
    setEditingId(null);
    setDescription("");
    setAmount("");
    setCategory("Other");
    setTransactionType("income");
    setDate(toDateKey(new Date()));
    setTransactionColor("");
    setSelectedGoalId(null);
    setActiveView("transactions");
  };

  const deleteTransaction = (id: number) => {
    const transaction = transactions.find((item) => item.id === id);
    if (transaction?.goalId) {
      setCustomGoals((goals) =>
        goals.map((goal) =>
          goal.id === transaction.goalId
            ? {
                ...goal,
                currentAmount:
                  goal.direction === "debt"
                    ? goal.currentAmount - Math.abs(transaction.amount)
                    : Math.max(
                        0,
                        goal.currentAmount - Math.abs(transaction.amount),
                      ),
              }
            : goal,
        ),
      );
    }
    setTransactions(
      transactions.filter((transaction) => transaction.id !== id),
    );
  };

  const resetCustomGoal = () => {
    setEditingGoalId(null);
    setCustomGoal({
      name: "",
      targetAmount: 0,
      currentAmount: 0,
      targetDate: "",
      color: "#69a88b",
      direction: "savings",
      startingAmount: 0,
    });
  };

  const closeGoalForm = () => {
    resetCustomGoal();
    setActiveView("goals");
  };

  const saveCustomGoal = () => {
    if (
      customGoal.name.trim() === "" ||
      customGoal.targetDate === "" ||
      (customGoal.direction === "savings" && customGoal.targetAmount <= 0) ||
      (customGoal.direction === "debt" && customGoal.startingAmount <= 0)
    ) {
      return;
    }

    if (editingGoalId !== null) {
      setCustomGoals((goals) =>
        goals.map((goal) =>
          goal.id === editingGoalId
            ? { ...customGoal, id: editingGoalId }
            : goal,
        ),
      );
    } else {
      setCustomGoals((goals) => [...goals, { ...customGoal, id: Date.now() }]);
    }

    closeGoalForm();
  };

  const editCustomGoal = (goal: CustomGoal) => {
    setEditingGoalId(goal.id);
    setCustomGoal({
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      targetDate: goal.targetDate,
      color: goal.color,
      direction: goal.direction,
      startingAmount:
        goal.startingAmount ||
        (goal.direction === "debt" ? Math.abs(goal.currentAmount) : 0),
    });
    setActiveView("goal-form");
  };

  const deleteCustomGoal = (id: number) => {
    setCustomGoals((goals) => goals.filter((goal) => goal.id !== id));
    setTransactions((items) =>
      items.map((item) =>
        item.goalId === id ? { ...item, goalId: null } : item,
      ),
    );
  };

  /** Date - Time formatting */
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const pastStartDate = new Date(todayDate);
  pastStartDate.setDate(pastStartDate.getDate() - 30);
  const pastStart = toDateKey(pastStartDate);
  const archivedStartDate = new Date(todayDate);
  archivedStartDate.setDate(archivedStartDate.getDate() - 365);
  const archivedStart = toDateKey(archivedStartDate);

  /** Currency Formatting */
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  /** Buckets for sorting transactions */
  const todaysTransactions = transactions.filter(
    (transaction) => transaction.date === today,
  );
  const upcomingTransactions = transactions.filter(
    (transaction) => transaction.date > today,
  );
  const pastTransactions = transactions.filter(
    (transaction) => transaction.date < today && transaction.date >= pastStart,
  );
  const archivedTransactions = transactions.filter(
    (transaction) =>
      transaction.date < pastStart && transaction.date >= archivedStart,
  );

  /** Totals for each bucket */
  const todaysTotal = todaysTransactions.reduce(
    (total, transaction) => total + Math.abs(transaction.amount),
    0,
  );
  const upcomingTotal = upcomingTransactions.reduce(
    (total, transaction) => total + Math.abs(transaction.amount),
    0,
  );
  const pastTotal = pastTransactions.reduce(
    (total, transaction) => total + Math.abs(transaction.amount),
    0,
  );
  const archivedTotal = archivedTransactions.reduce(
    (total, transaction) => total + Math.abs(transaction.amount),
    0,
  );

  /** Export data */
  const exportToCSV = () => {
    const headers = ["Description", "Amount", "Category", "Type", "Date"];
    const escapeCsvValue = (value: string | number) =>
      `"${String(value).replace(/"/g, '""')}"`;
    const rows = transactions.map((transaction) => [
      transaction.description,
      transaction.amount,
      transaction.category,
      transaction.type,
      transaction.date,
    ]);
    const csvContent = [
      headers.map(escapeCsvValue).join(","),
      ...rows.map((row) => row.map(escapeCsvValue).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "brio-transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h1 className="sidebar-title">Brio Budget</h1>
        <div className="sidebar-spacer" />
        <div className="sidebar-nav">
          <button
            className={`nav-button${activeView === "dashboard" ? " active" : ""}`}
            onClick={() => setActiveView("dashboard")}
            aria-current={activeView === "dashboard" ? "page" : undefined}
          >
            <div className="button-content">
              <img src={DashboardIcon} alt="" />
              <p>Dashboard</p>
            </div>
          </button>
          <button
            className={`nav-button${activeView === "transactions" || activeView === "transaction-form" || activeView === "upcoming" || activeView === "today" || activeView === "past" || activeView === "archived" ? " active" : ""}`}
            onClick={() => setActiveView("transactions")}
            aria-current={
              activeView === "transactions" ||
              activeView === "transaction-form" ||
              activeView === "upcoming" ||
              activeView === "today" ||
              activeView === "past" ||
              activeView === "archived"
                ? "page"
                : undefined
            }
          >
            <div className="button-content">
              <img src={TransactionsIcon} alt="" />
              <p>Transactions</p>
            </div>
          </button>
          <button
            className={`nav-button${activeView === "goals" || activeView === "goal-form" || activeView === "all-goals" ? " active" : ""}`}
            onClick={() => setActiveView("goals")}
            aria-current={
              activeView === "goals" ||
              activeView === "goal-form" ||
              activeView === "all-goals"
                ? "page"
                : undefined
            }
          >
            <div className="button-content">
              <img src={GoalIcon} alt="" />
              <p>Goals</p>
            </div>
          </button>
        </div>

        <CalendarWidget
          transactions={transactions}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          onEdit={editTransaction}
          onDelete={deleteTransaction}
        />
      </aside>
      <main className="content">
        <div className="content-container">
          {activeView === "dashboard" && (
            <>
              <DashboardCards
                balance={balance}
                income={income}
                expenses={expenses}
                savings={savings}
                formatCurrency={formatCurrency}
              />

              <Suspense
                fallback={
                  <section className="chart-card" aria-busy="true">
                    Loading spending insights...
                  </section>
                }
              >
                <SpendingChart
                  incomeAllocationData={incomeAllocationData}
                  formatCurrency={formatCurrency}
                  categoryTotals={categoryTotals}
                  categoryColors={categoryColors}
                  hasTransactions={transactions.length > 0}
                  onAddTransaction={() => setActiveView("transaction-form")}
                />
              </Suspense>
            </>
          )}

          {activeView === "transactions" && (
            <>
              <div className="transactions-view">
                <div className="add-transactions">
                  <h1>Transactions</h1>
                  <div className="transaction-btns">
                    <button onClick={() => setActiveView("transaction-form")}>
                      <img src={addIcon} alt="" />
                    </button>
                    <button onClick={exportToCSV}>Export Transactions</button>
                  </div>
                </div>
                <div className="transaction-container">
                  <div className="section-card">
                    <UpcomingTransactions
                      upcomingTotal={upcomingTotal}
                      formatCurrency={formatCurrency}
                      count={upcomingTransactions.length}
                      onOpen={() => setActiveView("upcoming")}
                    />
                  </div>
                  <div className="section-card">
                    <TodaysTransactions
                      todaysTotal={todaysTotal}
                      formatCurrency={formatCurrency}
                      count={todaysTransactions.length}
                      onOpen={() => setActiveView("today")}
                    />
                  </div>
                  <div className="section-card">
                    <PastTransactions
                      pastTotal={pastTotal}
                      formatCurrency={formatCurrency}
                      count={pastTransactions.length}
                      onOpen={() => setActiveView("past")}
                    />
                  </div>
                  <div className="section-card">
                    <ArchivedTransactions
                      archivedTotal={archivedTotal}
                      formatCurrency={formatCurrency}
                      count={archivedTransactions.length}
                      onOpen={() => setActiveView("archived")}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeView === "transaction-form" && (
            <>
              <TransactionForm
                description={description}
                setDescription={setDescription}
                amount={amount}
                setAmount={setAmount}
                category={category}
                setCategory={setCategory}
                transactionType={transactionType}
                setTransactionType={setTransactionType}
                date={date}
                setDate={setDate}
                editingId={editingId}
                saveTransaction={saveTransaction}
                onClose={closeTransactionForm}
                color={transactionColor}
                setColor={setTransactionColor}
                recentColors={recentColors}
                customGoals={customGoals}
                selectedGoalId={selectedGoalId}
                setSelectedGoalId={setSelectedGoalId}
              />
            </>
          )}

          {activeView === "upcoming" && (
            <TransactionDetailView
              title="Upcoming Transactions"
              subtitle="Scheduled"
              transactions={upcomingTransactions}
              total={upcomingTotal}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              onClose={() => setActiveView("transactions")}
              onEdit={editTransaction}
              onDelete={deleteTransaction}
            />
          )}

          {activeView === "today" && (
            <TransactionDetailView
              title="Today's Transactions"
              subtitle="Current"
              transactions={todaysTransactions}
              total={todaysTotal}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              onClose={() => setActiveView("transactions")}
              onEdit={editTransaction}
              onDelete={deleteTransaction}
            />
          )}

          {activeView === "past" && (
            <TransactionDetailView
              title="Past Transactions"
              subtitle="Last 30 days"
              transactions={pastTransactions}
              total={pastTotal}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              onClose={() => setActiveView("transactions")}
              onEdit={editTransaction}
              onDelete={deleteTransaction}
            />
          )}

          {activeView === "archived" && (
            <TransactionDetailView
              title="Archived Transactions"
              subtitle="31 days to 1 year"
              transactions={archivedTransactions}
              total={archivedTotal}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              onClose={() => setActiveView("transactions")}
              onEdit={editTransaction}
              onDelete={deleteTransaction}
            />
          )}

          {activeView === "goals" && (
            <>
              <div className="goals-actions">
                <div>
                  <p className="form-eyebrow">Financial targets</p>
                  <h1>Goals</h1>
                </div>
                <div className="goals-action-buttons">
                  <button
                    type="button"
                    onClick={() => setActiveView("goal-form")}
                  >
                    Add Goal
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView("all-goals")}
                  >
                    View All Goals
                  </button>
                </div>
              </div>
              <BudgetTracker
                budgetGoal={budgetGoal}
                setBudgetGoal={setBudgetGoal}
                spent={spent}
                remainingBudget={remainingBudget}
                budgetPercentUsed={budgetPercentUsed}
                budgetStatusColor={budgetStatusColor}
                formatCurrency={formatCurrency}
              />

              <SavingsTracker
                savings={savings}
                savingsGoal={savingsGoal}
                setSavingsGoal={setSavingsGoal}
                savingsProgress={savingsProgress}
                savingsStatus={savingsStatus}
                formatCurrency={formatCurrency}
              />
            </>
          )}

          {activeView === "goal-form" && (
            <CustomGoalForm
              goal={customGoal}
              setGoal={setCustomGoal}
              editingId={editingGoalId}
              onSave={saveCustomGoal}
              onClose={closeGoalForm}
            />
          )}

          {activeView === "all-goals" && (
            <CustomGoalsView
              goals={customGoals}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              onClose={() => setActiveView("goals")}
              onEdit={editCustomGoal}
              onDelete={deleteCustomGoal}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
