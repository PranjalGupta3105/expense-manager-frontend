// import React from 'react'
import { useQuery, gql, useMutation } from "@apollo/client";
import { useState } from "react";
import EditExpense from './EditExpense';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

// Define column configuration with visibility rules
const columnConfig = [
  { key: "sno", heading: "S.No.", mobile: false, tablet: true },
  { key: "id", heading: "Expense Id", mobile: false, tablet: false },
  { key: "data", heading: "Date", mobile: true, tablet: true },
  { key: "description", heading: "Description", mobile: true, tablet: true },
  { key: "amount", heading: "Amount", mobile: true, tablet: true },
  { key: "method", heading: "Method", mobile: false, tablet: true },
  { key: "source", heading: "Source", mobile: false, tablet: true },
  { key: "first_name", heading: "Created By", mobile: false, tablet: false },
  { key: "is_repayed", heading: "Is Repayed", mobile: false, tablet: true },
  { key: "tag", heading: "Tag", mobile: false, tablet: false },
  { key: "card_name", heading: "Credit Card", mobile: false, tablet: false },
];

const GET_EXPENSES = gql`
  query getExpenses {
    expenses {
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

// Mobile Card Component
const ExpenseCard = ({ expense, checked, onCheckboxChange, onEdit, isRepayed }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border-l-4 ${
      isRepayed ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-blue-500'
    } p-4 mb-4 transition-all hover:shadow-lg`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => onCheckboxChange(expense.id)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {expense.description}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {expense.data}
            </p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          aria-label="Edit expense"
        >
          <PencilSquareIcon className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            ₹{parseFloat(expense.amount).toLocaleString('en-IN')}
          </p>
        </div>
        {isRepayed && (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">
            Repaid
          </span>
        )}
      </div>
    </div>
  );
};

// Desktop Table Row Component
const DesktopTableRow = ({ expense, checked, onCheckboxChange, onEdit, columnConfig, isRepayed }) => {
  const displayKeys = columnConfig 
    ? columnConfig.map(col => col.key).filter(key => key !== 'source_id' && key !== 'method_id')
    : Object.keys(expense).filter((key) => key !== 'source_id' && key !== 'method_id');

  const getCellVisibility = (key) => {
    const config = columnConfig?.find(col => col.key === key);
    if (!config) return "";
    if (!config.mobile) {
      return "hidden md:table-cell";
    }
    return "";
  };

  return (
    <tr className={`${
      isRepayed 
        ? 'bg-green-50 dark:bg-green-900/10 border-l-4 border-l-green-500' 
        : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
    } transition-colors`}>
      <td className="px-4 py-4">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onCheckboxChange(expense.id)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
      </td>
      {displayKeys.map((key) => {
        const isDescription = key === "description";
        const isAmount = key === "amount";
        const cellContent = expense[key];
        
        return (
          <td 
            className={`px-4 py-4 text-sm ${isDescription ? 'max-w-xs' : 'whitespace-nowrap'} ${getCellVisibility(key)}`}
            key={key}
          >
            {isAmount ? (
              <span className="font-semibold text-gray-900 dark:text-white">
                ₹{parseFloat(cellContent).toLocaleString('en-IN')}
              </span>
            ) : isDescription ? (
              <div className="truncate" title={cellContent}>
                <span className="text-gray-900 dark:text-white">{cellContent}</span>
              </div>
            ) : (
              <span className="text-gray-700 dark:text-gray-300">{cellContent}</span>
            )}
          </td>
        );
      })}
      <td className="px-4 py-4">
        <button
          onClick={onEdit}
          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          aria-label="Edit expense"
        >
          <PencilSquareIcon className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
};

// eslint-disable-next-line no-unused-vars
const Expense = () => {
  const { loading, error, data, refetch } = useQuery(GET_EXPENSES);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deleteExpense, { loading: deleteLoading }] = useMutation(DELETE_EXPENSE_MUTATION);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading expenses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-200">Error: {error.message}</p>
      </div>
    );
  }

  let expenses = data.expenses.rows.map((row) => {
    return {
      id: row.id,
      data: new Date(Number(row.date)).toISOString().split('T')[0],
      description: row.description,
      amount: row.amount,
      method: row.method.name,
      source: row.source.name,
      first_name: row.user.first_name,
      is_repayed: row.is_repayed ? "Yes" : "No",
      tag: row.tag ? row.tag : "N/A",
      source_id: row.source_id,
      method_id: row.method_id,
      card_name: row.card_name ? row.card_name : "N/A"
    };
  });
  
  expenses = expenses.map((expense, index) => {
    return { sno: index+1, ...expense}
  });

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    await deleteExpense({ variables: { ids: selectedIds } });
    setSelectedIds([]);
    setShowConfirm(false);
    refetch();
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
  };

  const handleEditClose = () => {
    setEditingExpense(null);
  };

  const handleEditUpdated = () => {
    setEditingExpense(null);
    refetch();
  };

  const headings = columnConfig.map(col => col.heading);

  return (
    <div className="w-full">
      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Confirm Delete</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete {selectedIds.length} selected expense{selectedIds.length > 1 ? 's' : ''}? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                <TrashIcon className="h-4 w-4" />
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Expense Modal */}
      {editingExpense && (
        <EditExpense
          expense={editingExpense}
          onClose={handleEditClose}
          onUpdated={handleEditUpdated}
        />
      )}

      {/* Header Section */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          {/* <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Expense List
          </h1> */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {expenses.length} expense{expenses.length !== 1 ? 's' : ''} found
          </p>
        </div>
        {selectedIds.length > 0 && (
          <button
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-md"
            onClick={() => setShowConfirm(true)}
          >
            <TrashIcon className="h-5 w-5" />
            Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      {/* Mobile View - Cards */}
      <div className="block md:hidden">
        {expenses.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <p className="text-gray-500 dark:text-gray-400">No expenses found</p>
          </div>
        ) : (
          expenses.map((expense) => {
            const isRepayed = expense.is_repayed === 1 || expense.is_repayed === "Yes";
            return (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                checked={selectedIds.includes(expense.id)}
                onCheckboxChange={handleCheckboxChange}
                onEdit={() => handleEdit(expense)}
                isRepayed={isRepayed}
              />
            );
          })
        )}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === expenses.length && expenses.length > 0}
                    onChange={() => {
                      if (selectedIds.length === expenses.length) {
                        setSelectedIds([]);
                      } else {
                        setSelectedIds(expenses.map(e => e.id));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </th>
                {headings.map((heading) => {
                  const config = columnConfig.find(col => col.heading === heading);
                  const isVisible = !config || config.mobile || config.tablet;
                  
                  return (
                    <th
                      key={heading}
                      scope="col"
                      className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider ${
                        !isVisible ? 'hidden lg:table-cell' : ''
                      }`}
                    >
                      {heading}
                    </th>
                  );
                })}
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={headings.length + 2} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No expenses found
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => {
                  const isRepayed = expense.is_repayed === 1 || expense.is_repayed === "Yes";
                  return (
                    <DesktopTableRow
                      key={expense.id}
                      expense={expense}
                      checked={selectedIds.includes(expense.id)}
                      onCheckboxChange={handleCheckboxChange}
                      onEdit={() => handleEdit(expense)}
                      columnConfig={columnConfig}
                      isRepayed={isRepayed}
                    />
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Expense;
