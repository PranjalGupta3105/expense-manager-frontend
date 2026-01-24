// import React from 'react'
import { useQuery, gql, useMutation } from "@apollo/client";
import Table from "./Table";
import { useState } from "react";

let headings = [
  "S.No.",
  "Expense Id",
  "Date",
  "Description",
  "Amount",
  "Method",
  "Source",
  "Created By",
  "Is Repayed",
  "Tag",
  "Credit Card"
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

// eslint-disable-next-line no-unused-vars
const Expense = () => {
  const { loading, error, data, refetch } = useQuery(GET_EXPENSES);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteExpense, { loading: deleteLoading }] = useMutation(DELETE_EXPENSE_MUTATION);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
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
  })

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

  return (
    <div>
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete the selected expenses?</p>
            <div className="flex items-center justify-between mt-6">
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleDelete} disabled={deleteLoading}>
                {deleteLoading ? "Deleting..." : "Confirm"}
              </button>
              <button className="ml-4 text-gray-500 hover:text-gray-700" onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4"
        disabled={selectedIds.length === 0}
        onClick={() => setShowConfirm(true)}
      >
        Delete Selected
      </button>
      <Table headings={["Select", ...headings]} data={expenses} refetch={refetch} selectedIds={selectedIds} onCheckboxChange={handleCheckboxChange} />
    </div>
  );
};

export default Expense;
