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