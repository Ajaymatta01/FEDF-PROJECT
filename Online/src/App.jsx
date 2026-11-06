import { useState } from "react";
import "./App.css";

export default function App() {
  const [page, setPage] = useState(
    localStorage.getItem("loggedIn") === "true"
      ? "home"
      : "register"
  );

  const [balance, setBalance] = useState(50000);
  const [transactions, setTransactions] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const money = (amount) =>
    "₹" + amount.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  function register(e) {
    e.preventDefault();

    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);

    setMessage("Registration successful!");
    setPage("login");
  }

  function login(e) {
    e.preventDefault();

    if (
      email === localStorage.getItem("userEmail") &&
      password === localStorage.getItem("userPassword")
    ) {
      localStorage.setItem("loggedIn", "true");
      setName(localStorage.getItem("userName") || "");
      setMessage("");
      setPage("home");
    } else {
      setMessage("Invalid email or password.");
    }
  }

  function logout() {
    localStorage.removeItem("loggedIn");
    setPage("login");
    setMessage("You have logged out successfully.");
  }

  function transfer(e) {
    e.preventDefault();

    const form = e.currentTarget;
    const receiver = form.receiver.value.trim();
    const account = form.account.value.trim();
    const amount = Number(form.amount.value);

    if (account.length < 10) {
      setMessage("Enter a valid account number.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setMessage("Enter a valid transfer amount.");
      return;
    }

    if (amount > balance) {
      setMessage("Insufficient balance!");
      return;
    }

    setBalance((previous) => previous - amount);

    setTransactions((previous) => [
      {
        description: "Transfer to " + receiver,
        amount: -amount,
        date: new Date().toLocaleDateString(),
      },
      ...previous,
    ]);

    setMessage("Transfer completed successfully.");
    form.reset();
  }

  function payBill(e) {
    e.preventDefault();

    const form = e.currentTarget;
    const type = form.billType.value;
    const amount = Number(form.billAmount.value);

    if (!type || !Number.isFinite(amount) || amount <= 0) {
      setMessage("Select a bill and enter a valid amount.");
      return;
    }

    if (amount > balance) {
      setMessage("Insufficient balance!");
      return;
    }

    setBalance((previous) => previous - amount);

    setTransactions((previous) => [
      {
        description: type + " Bill",
        amount: -amount,
        date: new Date().toLocaleDateString(),
      },
      ...previous,
    ]);

    setMessage("Bill paid successfully.");
    form.reset();
  }

  function requestLoan(e) {
    e.preventDefault();

    const form = e.currentTarget;
    const loanType = form.loanType.value;
    const amount = Number(form.loanAmount.value);

    if (!Number.isFinite(amount) || amount <= 0) {
      setMessage("Enter a valid loan amount.");
      return;
    }

    setMessage(
      loanType + " request submitted for " + money(amount) +
      ". Awaiting approval."
    );

    form.reset();
  }

  function addExpense(e) {
    e.preventDefault();

    const form = e.currentTarget;
    const description = form.description.value.trim();
    const amount = Number(form.expenseAmount.value);
    const category = form.category.value;

    if (
      !description ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !category
    ) {
      setMessage("Enter valid expense details.");
      return;
    }

    setExpenses((previous) => [
      ...previous,
      { description, amount, category },
    ]);

    form.reset();
    setMessage("Expense added successfully.");
  }

  const totalExpense = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const highestExpense = expenses.reduce(
    (highest, expense) => Math.max(highest, expense.amount),
    0
  );

  const categoryTotals = expenses.reduce((totals, expense) => {
    totals[expense.category] =
      (totals[expense.category] || 0) + expense.amount;

    return totals;
  }, {});

  const highestCategory = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const percentage = highestCategory
    ? (highestCategory[1] / totalExpense) * 100
    : 0;

  if (page === "register") {
    return (
      <div className="auth">
        <h1>Online Banking System</h1>
        <h2>Create Account</h2>

        <form onSubmit={register}>
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password (minimum 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          <button type="submit">Register</button>
        </form>

        <p>{message}</p>

        <button onClick={() => {
          setMessage("");
          setPage("login");
        }}>
          Already registered? Login
        </button>
      </div>
    );
  }

  if (page === "login") {
    return (
      <div className="auth">
        <h1>Online Banking System</h1>
        <h2>Login</h2>

        <form onSubmit={login}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        <p>{message}</p>

        <button onClick={() => {
          setMessage("");
          setPage("register");
        }}>
          Create Account
        </button>
      </div>
    );
  }

  return (
    <>
      <header>
        <h1>Online Banking System</h1>

        <nav>
          <button onClick={() => setPage("home")}>Home</button>
          <a href="#account">Account</a>
          <a href="#transfer">Transfer</a>
          <a href="#bills">Bills</a>
          <a href="#loan">Loans</a>
          <a href="#expense">Expenses</a>
          <button onClick={logout}>Logout</button>
        </nav>
      </header>

      <section className="welcome">
        <h2>Welcome, {localStorage.getItem("userName") || name}!</h2>
        <p>Manage your banking activities in one place.</p>
      </section>

      <section id="account" className="container">
        <h2>Account Details</h2>

        <div className="cards">
          <div className="card">
            <h3>Account Balance</h3>
            <p>{money(balance)}</p>
          </div>

          <div className="card">
            <h3>Account Number</h3>
            <p>XXXX XXXX 1234</p>
          </div>

          <div className="card">
            <h3>Account Type</h3>
            <p>Savings Account</p>
          </div>
        </div>

        <h3>Transaction History</h3>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.date}</td>
                <td>{transaction.description}</td>
                <td className={transaction.amount < 0 ? "debit" : "credit"}>
                  {transaction.amount < 0 ? "-" : "+"}
                  {money(Math.abs(transaction.amount))}
                </td>
              </tr>
            ))}

            {transactions.length === 0 && (
              <tr>
                <td colSpan="3">No transactions yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section id="transfer" className="container">
        <h2>Fund Transfer</h2>

        <form onSubmit={transfer}>
          <input name="receiver" placeholder="Receiver Name" required />
          <input
            name="account"
            placeholder="Receiver Account Number"
            minLength={10}
            maxLength={16}
            pattern="[0-9]{10,16}"
            required
          />
          <input
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Amount"
            required
          />
          <button type="submit">Transfer Money</button>
        </form>
      </section>

      <section id="bills" className="container">
        <h2>Bill Payments</h2>

        <form onSubmit={payBill}>
          <select name="billType" required defaultValue="">
            <option value="">Select Bill</option>
            <option>Electricity</option>
            <option>Water</option>
            <option>Internet</option>
            <option>Mobile</option>
          </select>

          <input
            name="billAmount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Bill Amount"
            required
          />

          <button type="submit">Pay Bill</button>
        </form>
      </section>

      <section id="loan" className="container">
        <h2>Loan Request</h2>

        <form onSubmit={requestLoan}>
          <select name="loanType" required defaultValue="">
            <option value="">Select Loan Type</option>
            <option>Personal Loan</option>
            <option>Education Loan</option>
            <option>Home Loan</option>
            <option>Vehicle Loan</option>
          </select>

          <input
            name="loanAmount"
            type="number"
            min="1"
            placeholder="Loan Amount"
            required
          />

          <button type="submit">Request Loan</button>
        </form>
      </section>

      <section id="expense" className="container">
        <h2>Smart Expense Analyzer</h2>

        <form onSubmit={addExpense}>
          <input
            name="description"
            placeholder="Expense Description"
            required
          />

          <input
            name="expenseAmount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Expense Amount"
            required
          />

          <select name="category" required defaultValue="">
            <option value="">Select Category</option>
            <option>Food</option>
            <option>Shopping</option>
            <option>Travel</option>
            <option>Bills</option>
            <option>Education</option>
            <option>Entertainment</option>
            <option>Other</option>
          </select>

          <button type="submit">Add Expense</button>
        </form>

        <div className="cards">
          <div className="card">
            <h3>Total Expenses</h3>
            <p>{money(totalExpense)}</p>
          </div>

          <div className="card">
            <h3>Highest Expense</h3>
            <p>{money(highestExpense)}</p>
          </div>

          <div className="card">
            <h3>Transactions</h3>
            <p>{expenses.length}</p>
          </div>
        </div>

        <div className="analysis">
          <h3>Smart Analysis</h3>

          <p>
            {highestCategory
              ? `Your highest spending category is ${highestCategory[0]}, 
                 totaling ${money(highestCategory[1])} 
                 (${percentage.toFixed(1)}% of your expenses). ${
                   percentage >= 50
                     ? "Consider reducing spending in this category."
                     : percentage >= 30
                     ? "Monitor your spending in this category."
                     : "Your spending is distributed across categories."
                 }`
              : "Add expenses to receive spending advice."}
          </p>
        </div>

        <h3>Expense History</h3>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((expense, index) => (
              <tr key={index}>
                <td>{expense.description}</td>
                <td>{expense.category}</td>
                <td className="debit">{money(expense.amount)}</td>
              </tr>
            ))}

            {expenses.length === 0 && (
              <tr>
                <td colSpan="3">No expenses added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {message && (
        <p className="message" role="status">{message}</p>
      )}

      <footer>
        <p>© 2026 Online Banking System</p>
        <p>Banking demonstration project</p>
      </footer>
    </>
  );
}
