// import React from 'react'
import Table from "./Table";
import { useQuery, gql } from "@apollo/client";

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
];

const GET_EXPENSES = gql`
  query getExpenses {
    expenses {
      rows {
        id
        date
        amount
        description
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
        tag
      }
      count
    }
  }
`;

// eslint-disable-next-line no-unused-vars
const Expense = () => {
  const { loading, error, data } = useQuery(GET_EXPENSES);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  let expenses = data.expenses.rows.map((row) => {
    return {
      id: row.id,
      data: row.date,
      description: row.description,
      amount: row.amount,
      method: row.method.name,
      source: row.source.name,
      first_name: row.user.first_name,
      is_repayed: row.is_repayed ? "Yes" : "No",
      tag: row.tag ? row.tag : "N/A",
    };
  });
  expenses = expenses.map((expense, index) => {
    return { sno: index+1, ...expense}
  })
  return (
    <div>
      <Table headings={headings} data={expenses} />
    </div>
  );
};

export default Expense;
