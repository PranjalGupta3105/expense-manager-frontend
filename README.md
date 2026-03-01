## Expense Manager Frontend

**Expense Manager Frontend** is a modern, responsive web application that lets you record, browse, and analyze your day‑to‑day expenses.  
It is built with **React + Vite**, styled with **Tailwind CSS**, and talks to a **GraphQL** backend via **Apollo Client**.

---

## 🚀 Overview

The app focuses on fast data entry and at‑a‑glance visibility into where your money goes. It provides:

- **Expense listing** with sorting-friendly columns (date, amount, method, source, tag, credit card, etc.)
- **CRUD operations** for expenses (create, edit, soft-delete via GraphQL mutations)
- **Source & method management** (banks, cards, cash, UPI, and more)
- **Analytics & overview pages** for weekly/monthly rollups and trends
- **Card details view** for tracking credit card spends
- **Calendar view** to visualize expenses over time

The frontend is optimized for both **desktop** and **mobile** screens.

---

## 📦 Key Features

- **Expense Management**
  - Add, edit, and delete expenses
  - Category and subcategory selection (Add and Edit)
  - Method (In-Cash, Debit Card, Credit Card, UPI, AC to AC) and Source; when method is Credit Card, a “Select Card” dropdown is used
  - Edit form pre-fills from the listing (including source, method, and card) and stays in sync when switching expenses
  - Mark expenses as repaid / pending
  - Attach metadata like tag, source, method, and card name

- **Rich Listing & Navigation**
  - Tabular listing for desktop, card-style layout for mobile
  - Navigation for Expenses, Methods, Sources, Calendar, Analytics, Card Details, and Expense Overview
  - Row highlighting based on repayment status

- **Analytics & Insights**
  - Month-wise / week-wise / day-wise breakdown (in `Analytics` / `ExpenseOverview`)
  - Total spends summary in the navbar (via GraphQL)

- **Technical**
  - Apollo Client for GraphQL queries/mutations
  - Tailwind CSS utility-first styling
  - ESLint for consistent code quality

---

## 📝 Add & Edit Expense Components

### Add Expense (`AddExpense.jsx`)

- **Form fields:** Amount, Description, Category, Subcategory, Method, Source, Date, Tag.
- **Category & subcategory:** Loaded from `getAllTransactionCategories`; subcategory options depend on the selected category and reset when category changes.
- **Method:** In-Cash, Debit Card, Credit Card, UPI, AC to AC.
- **Source:**
  - When **Credit Card** is selected, the Source field shows a **Select Card** dropdown (from `ccSources`), which sets both card and source.
  - Otherwise, a bank/source dropdown is shown (KOTAK, ICICI, SBI, HSBC, HDFC, CASH).
- **Submission:** Uses `createExpense` mutation with `amount`, `description`, `method_id`, `source_id`, `exp_date`, `tag`, optional `card_id`, and optional `sub_category_id`. Form resets after success.

### Edit Expense (`EditExpense.jsx`)

- **Usage:** Opened from the expense listing (e.g. edit icon on a row). Receives `expense`, `onClose`, and `onUpdated` as props. Renders as a modal overlay.
- **Pre-filled data:** All fields are initialized from the passed `expense` object (amount, description, tag, date, category, subcategory, method, source, card when applicable, is repayed). Values stay in sync when the `expense` prop changes (e.g. opening a different expense).
- **Source & method:** Resolved from the listing using `source_id` and `method_id`, with fallbacks for `source.id` / `method.id` when the API returns nested objects. Display names (e.g. bank name string) are never used as dropdown values so the correct option is selected.
- **Credit Card:** When method is Credit Card, the Source field shows the **Select Card** dropdown. The current card is shown when the listing provides `card_id` (and `source_id`) in the expense; the expenses query must include `card_id` in the response for this to work.
- **Category / subcategory:** Initialized and synced from `expense.category_id` / `expense.subcategory_id` (or nested `category` / `subcategory`). Subcategory list is derived from the selected category with safe handling when `subCategories` is missing.
- **Submission:** Uses `updateExpense` mutation with `id`, `amount`, `description`, `tag`, `is_repayed`, `date`, `source_id`, `method_id`, and optional `card_id`. Calls `onUpdated()` and `onClose()` on success.

---

## 🛠️ Technologies

- **React + Vite** – SPA architecture and dev tooling  
- **Apollo Client + GraphQL** – typed data operations and caching  
- **Tailwind CSS** – styling and layout system  
- **Heroicons** – modern icon set  
- **ESLint** – linting and best-practices enforcement  

---

## 🧩 Getting Started

### Prerequisites

- Node.js **v16+** (recommended)
- npm or Yarn
- A running GraphQL backend with the expected schema

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/PranjalGupta3105/expense-manager-frontend.git
cd expense-manager-frontend
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Configure environment**

Create a `.env` file in the project root:

```bash
VITE_GRAPHQL_ENDPOINT=<your_graphql_api_url>
```

4. **Run the application**

```bash
npm run dev
# or
yarn dev
```

By default Vite runs on `http://localhost:5173` (check your terminal output).

---

## 📁 Project Structure (high level)

```text
expense-manager-frontend/
├── public/
├── src/
│   ├── components/      # Reusable UI components (tables, forms, analytics, etc.)
│   ├── helpers/         # Apollo client and helper utilities
│   ├── layouts/         # Layout components (e.g. main layout + navbar)
│   ├── pages/           # Route-level pages (Expenses, Analytics, Methods, Sources, etc.)
│   ├── assets/          # Static assets (images, icons)
│   ├── App.jsx
│   └── main.jsx
├── eslint.config.js
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 📌 Available Scripts

```bash
npm run dev      # Start the development server
npm run build    # Create a production build
npm run lint     # Run ESLint checks
```

---

## 🤝 Contributing

Contributions are welcome:

- **Fork** this repository  
- **Create** a feature branch  
- **Commit** your changes with clear messages  
- **Open** a Pull Request describing the change and reasoning  

Issues and feature requests are also appreciated.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👤 Author

- **Pranjal Gupta**  
- GitHub: `@PranjalGupta3105`