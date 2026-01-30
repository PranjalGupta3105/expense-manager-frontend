// import React from 'react'
import { useQuery, gql, useMutation } from "@apollo/client";
import { useState } from "react";
import EditExpense from "./EditExpense";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

// Keep the existing column mapping, but style and render responsively.
const columnConfig = [
  { key: "sno", heading: "S.No.", show: "lg" },
  { key: "id", heading: "Expense Id", show: "xl" },
  { key: "data", heading: "Date", show: "md" },
  { key: "description", heading: "Description", show: "base" },
  { key: "amount", heading: "Amount", show: "base" },
  { key: "method", heading: "Method", show: "lg" },
  { key: "source", heading: "Source", show: "xl" },
  { key: "first_name", heading: "Created By", show: "xl" },
  { key: "is_repayed", heading: "Is Repayed", show: "lg" },
  { key: "tag", heading: "Tag", show: "xl" },
  { key: "card_name", heading: "Credit Card", show: "xl" },
];

const headings = columnConfig.map((c) => c.heading);

function showAt(show) {
  // tailwind breakpoints: base < sm < md < lg < xl
  if (show === "base") return "";
  if (show === "md") return "hidden md:table-cell";
  if (show === "lg") return "hidden lg:table-cell";
  if (show === "xl") return "hidden xl:table-cell";
  return "";
}

function formatINR(val) {
  const n = Number(val);
  if (Number.isNaN(n)) return String(val ?? "");
  return n.toLocaleString("en-IN");
}

const GET_EXPENSES = gql`
  query getExpenses($fromDate: String, $toDate: String) {
    expenses(from_date: $fromDate, to_date: $toDate) {
      rows {
        id
        date
        amount
        description
        source_id
        method_id
        method {
          name
        }
        source {
          name
        }
        user {
          first_name
          last_name
          username
        }
        is_repayed
        card_name
        tag
      }
      count
    }
  }
`;

const DELETE_EXPENSE_MUTATION = gql`
  mutation deleteExpense($ids: [Int!]!) {
    deleteExpense(ids: $ids) {
      deleted_expenses {
        id
        amount
        description
        is_deleted
      }
      message
    }
  }
`;

// eslint-disable-next-line no-unused-vars
const Expense = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const { loading, error, data, refetch } = useQuery(GET_EXPENSES);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deleteExpense, { loading: deleteLoading }] = useMutation(DELETE_EXPENSE_MUTATION);

  if (loading) {
    return (
      <div className="w-full">
        <div className="rounded-2xl bg-white/70 dark:bg-gray-800/60 border border-gray-200/70 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Loading expenses…
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full">
        <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6">
          <p className="text-sm text-red-800 dark:text-red-200">
            Error: {error.message}
          </p>
        </div>
      </div>
    );
  }
  let expenses = data.expenses.rows.map((row) => {
    return {
      id: row.id,
      data: new Date(Number(row.date)).toISOString().split("T")[0],
      description: row.description,
      amount: row.amount,
      method: row.method.name,
      source: row.source.name,
      first_name: row.user.first_name,
      is_repayed: row.is_repayed ? "Yes" : "No",
      tag: row.tag ? row.tag : "N/A",
      source_id: row.source_id,
      method_id: row.method_id,
      card_name: row.card_name ? row.card_name : "N/A",
    };
  });
  expenses = expenses.map((expense, index) => {
    return { sno: index + 1, ...expense };
  });

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleDelete = async () => {
    await deleteExpense({ variables: { ids: selectedIds } });
    setSelectedIds([]);
    setShowConfirm(false);
    refetch();
  };

  return (
    <div className="w-full">
      {showConfirm && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowConfirm(false)}
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete selected expenses?
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  This will delete {selectedIds.length} expense
                  {selectedIds.length === 1 ? "" : "s"}.
                </p>
                <div className="mt-6 flex items-center justify-end gap-3">
                  <button
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setShowConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold inline-flex items-center gap-2 disabled:opacity-60"
                    onClick={handleDelete}
                    disabled={deleteLoading}
                  >
                    <TrashIcon className="h-4 w-4" />
                    {deleteLoading ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingExpense && (
        <EditExpense
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onUpdated={() => {
            setEditingExpense(null);
            refetch();
          }}
        />
      )}

      <div className="mb-6 flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-4">
        {/* Total Expenses */}
        <div className="flex flex-col w-full sm:w-auto items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Total Expenses
          </h1>
          <span className="mt-1 inline-flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 px-3 py-0.5 text-sm font-semibold text-gray-800 dark:text-gray-100">
            {expenses.length}
          </span>
        </div>

        {/* From Date */}
        <div className="flex flex-col w-full sm:w-auto">
          <label className="text-sm font-bold mb-1 text-gray-700">
            From Date
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-40"
          />
        </div>

        {/* To Date */}
        <div className="flex flex-col w-full sm:w-auto">
          <label className="text-sm font-bold mb-1 text-gray-700">
            To Date
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-40"
          />
        </div>

        {/* Apply Filter */}
        <button
          onClick={() => refetch({ fromDate, toDate })}
          className="w-full sm:w-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          Apply Date Filter
        </button>

        {/* Clear Filter */}
        <button
          onClick={() => {
            setFromDate(null);
            setToDate(null);
            refetch({ fromDate: null, toDate: null });
          }}
          className="w-full sm:w-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-500 hover:bg-gray-600 text-white font-semibold"
          disabled={!fromDate && !toDate}
        >
          Clear
        </button>

        {/* Delete Selected */}
        <button
          disabled={selectedIds.length === 0}
          onClick={() => setShowConfirm(true)}
          className="w-full sm:w-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50"
        >
          <TrashIcon className="h-5 w-5" />
          Delete Selected{selectedIds.length > 0 && ` (${selectedIds.length})`}
        </button>
      </div>

      {/* Mobile: card list (no horizontal scrolling) */}
      <div className="md:hidden space-y-3">
        {expenses.map((expense) => {
          const repayed =
            expense.is_repayed === 1 || expense.is_repayed === "Yes";
          return (
            <div
              key={expense.id}
              className={[
                "rounded-2xl border shadow-sm bg-white dark:bg-gray-800",
                repayed
                  ? "border-green-200 dark:border-green-900/50 bg-green-50/60 dark:bg-green-900/10"
                  : "border-gray-200 dark:border-gray-700",
              ].join(" ")}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(expense.id)}
                    onChange={() => handleCheckboxChange(expense.id)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {expense.data}
                        </p>
                        <p
                          className="mt-1 font-semibold text-gray-900 dark:text-white truncate"
                          title={expense.description}
                        >
                          {expense.description}
                        </p>
                      </div>
                      <button
                        onClick={() => setEditingExpense(expense)}
                        className="shrink-0 p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600"
                        aria-label="Edit expense"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Amount
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ₹{formatINR(expense.amount)}
                        </p>
                      </div>
                      <div className="text-right">
                        {repayed ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-800/40 px-3 py-1 text-xs font-semibold text-green-800 dark:text-green-200">
                            Repaid
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-200">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-gray-600 dark:text-gray-300 grid grid-cols-2 gap-2">
                      <div className="truncate">
                        <span className="text-gray-500 dark:text-gray-400">
                          Method:
                        </span>{" "}
                        {expense.method}
                      </div>
                      <div className="truncate">
                        <span className="text-gray-500 dark:text-gray-400">
                          Source:
                        </span>{" "}
                        {expense.source}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/60">
              <tr className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-300">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      expenses.length > 0 &&
                      selectedIds.length === expenses.length
                    }
                    onChange={() => {
                      if (selectedIds.length === expenses.length)
                        setSelectedIds([]);
                      else setSelectedIds(expenses.map((e) => e.id));
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    aria-label="Select all"
                  />
                </th>
                {columnConfig.map((c) => (
                  <th
                    key={c.key}
                    className={`px-4 py-3 text-left ${showAt(c.show)}`}
                  >
                    {c.heading}
                  </th>
                ))}
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {expenses.map((expense) => {
                const repayed =
                  expense.is_repayed === 1 || expense.is_repayed === "Yes";
                return (
                  <tr
                    key={expense.id}
                    className={[
                      "hover:bg-gray-50 dark:hover:bg-gray-700/40",
                      repayed ? "bg-green-50/50 dark:bg-green-900/10" : "",
                    ].join(" ")}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(expense.id)}
                        onChange={() => handleCheckboxChange(expense.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                      />
                    </td>
                    {columnConfig.map((c) => {
                      const v = expense[c.key];
                      if (c.key === "amount") {
                        return (
                          <td
                            key={c.key}
                            className={`px-4 py-3 font-semibold text-gray-900 dark:text-white ${showAt(c.show)}`}
                          >
                            ₹{formatINR(v)}
                          </td>
                        );
                      }
                      if (c.key === "description") {
                        return (
                          <td
                            key={c.key}
                            className={`px-4 py-3 max-w-[360px] ${showAt(c.show)}`}
                          >
                            <span
                              className="block truncate text-gray-900 dark:text-white"
                              title={String(v ?? "")}
                            >
                              {v}
                            </span>
                          </td>
                        );
                      }
                      if (c.key === "is_repayed") {
                        return (
                          <td
                            key={c.key}
                            className={`px-4 py-3 ${showAt(c.show)}`}
                          >
                            <span
                              className={[
                                "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                                repayed
                                  ? "bg-green-100 dark:bg-green-800/40 text-green-800 dark:text-green-200"
                                  : "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200",
                              ].join(" ")}
                            >
                              {repayed ? "Yes" : "N/A"}
                            </span>
                          </td>
                        );
                      }
                      return (
                        <td
                          key={c.key}
                          className={`px-4 py-3 text-gray-700 dark:text-gray-200 whitespace-nowrap ${showAt(c.show)}`}
                        >
                          {v}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setEditingExpense(expense)}
                        className="p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600"
                        aria-label="Edit expense"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Expense;
