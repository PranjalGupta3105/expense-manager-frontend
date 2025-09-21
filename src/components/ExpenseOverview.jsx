import { useQuery, gql } from "@apollo/client";
import { useState } from "react";

function convertToINR(amount) {
  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
}

const QUERY_EXPENSE_MONTH = gql`
  query expensePerMonInCurYear($tag_value: String) {
    expensePerMonInCurYear(tag_value: $tag_value) {
      transactions_count
      total_amount
      month_name
    }
  }
`;

const QUERY_EXPENSE_DAY = gql`
  query expenseEachDayInCurWeek($tag_value: String) {
    expenseEachDayInCurWeek(tag_value: $tag_value) {
      transactions_count
      amount
      date
      day_name
    }
  }
`;

const QUERY_EXPENSE_WEEK = gql`
  query expensePerWeekInCurMon($tag_value: String) {
    expensePerWeekInCurMon(tag_value: $tag_value) {
      transactions_count
      total_amount
      week_start
      week_end
    }
  }
`;

const ExpenseOverview = () => {
  const [searchDay, setSearchDay] = useState("");
  const [searchWeek, setSearchWeek] = useState("");
  const [searchMonth, setSearchMonth] = useState("");

  const {
    loading: loadingMonth,
    error: errorMonth,
    data: dataMonth,
    refetch: refetchMonth,
  } = useQuery(QUERY_EXPENSE_MONTH, {
    variables: { tag_value: searchMonth || null },
  });
  const {
    loading: loadingDay,
    error: errorDay,
    data: dataDay,
    refetch: refetchDay,
  } = useQuery(QUERY_EXPENSE_DAY, {
    variables: { tag_value: searchDay || null },
  });
  const {
    loading: loadingWeek,
    error: errorWeek,
    data: dataWeek,
    refetch: refetchWeek,
  } = useQuery(QUERY_EXPENSE_WEEK, {
    variables: { tag_value: searchWeek || null },
  });

  const monthHeadings = [
    { key_name: "transactions_count", header_name: "Total Transactions" },
    { key_name: "total_amount", header_name: "Spent Amount" },
    // {  key_name: 'month_start', header_name: "Month Start" },
    { key_name: "month_name", header_name: "Month" },
  ];
  const dayHeadings = [
    { key_name: "transactions_count", header_name: "Total Transactions" },
    { key_name: "amount", header_name: "Spent Amount" },
    { key_name: "date", header_name: "Date" },
    { key_name: "day_name", header_name: "Day" },
  ];
  const weekHeadings = [
    { key_name: "transactions_count", header_name: "Total Transactions" },
    { key_name: "total_amount", header_name: "Spent Amount" },
    { key_name: "week_start", header_name: "Week Start" },
    { key_name: "week_end", header_name: "Week End" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6 mx-auto max-w-6xl">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Expense Overview
      </h2>
      {/* Expense Each Day Table */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">
          Expense Each Day In Current Week
        </h3>
        <div className="mb-2 flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by tag..."
            value={searchDay}
            onChange={(e) => setSearchDay(e.target.value)}
            className="border rounded px-3 py-1 w-64"
          />
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => refetchDay({ tag_value: searchDay || null })}
          >
            Search
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                {dayHeadings.map((heading) => (
                  <th
                    key={heading.key_name}
                    className="px-6 py-3 text-left text-base font-semibold text-gray-700"
                  >
                    {heading.header_name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingDay ? (
                <tr>
                  <td colSpan={dayHeadings.length} className="text-center py-6">
                    Loading...
                  </td>
                </tr>
              ) : errorDay ? (
                <tr>
                  <td
                    colSpan={dayHeadings.length}
                    className="text-center py-6 text-red-500"
                  >
                    Error: {errorDay.message}
                  </td>
                </tr>
              ) : dataDay && dataDay.expenseEachDayInCurWeek.length > 0 ? (
                dataDay.expenseEachDayInCurWeek.map((row, idx) => (
                  <tr key={idx} className="border-b">
                    {dayHeadings.map((h) => (
                      <td key={h.key_name} className="px-6 py-4">
                        {h.key_name.includes("amount")
                          ? convertToINR(row[h.key_name])
                          : row[h.key_name]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={dayHeadings.length}
                    className="text-center py-6 text-gray-500"
                  >
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Expense Per Week Table */}
      <div>
        <h3 className="text-xl font-bold mb-4">
          Expense Per Week In Current Month
        </h3>
        <div className="mb-2 flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by tag..."
            value={searchWeek}
            onChange={(e) => setSearchWeek(e.target.value)}
            className="border rounded px-3 py-1 w-64"
          />
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => refetchWeek({ tag_value: searchWeek || null })}
          >
            Search
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                {weekHeadings.map((heading) => (
                  <th
                    key={heading.key_name}
                    className="px-6 py-3 text-left text-base font-semibold text-gray-700"
                  >
                    {heading.header_name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingWeek ? (
                <tr>
                  <td
                    colSpan={weekHeadings.length}
                    className="text-center py-6"
                  >
                    Loading...
                  </td>
                </tr>
              ) : errorWeek ? (
                <tr>
                  <td
                    colSpan={weekHeadings.length}
                    className="text-center py-6 text-red-500"
                  >
                    Error: {errorWeek.message}
                  </td>
                </tr>
              ) : dataWeek && dataWeek.expensePerWeekInCurMon.length > 0 ? (
                dataWeek.expensePerWeekInCurMon.map((row, idx) => (
                  <tr key={idx} className="border-b">
                    {weekHeadings.map((h) => (
                      <td key={h.key_name} className="px-6 py-4">
                        {h.key_name.includes("amount")
                          ? convertToINR(row[h.key_name])
                          : row[h.key_name]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={weekHeadings.length}
                    className="text-center py-6 text-gray-500"
                  >
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Expense Per Month Table */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">
          Expense Per Month In Current Year
        </h3>
        <div className="mb-2 flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by tag..."
            value={searchMonth}
            onChange={(e) => setSearchMonth(e.target.value)}
            className="border rounded px-3 py-1 w-64"
          />
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => refetchMonth({ tag_value: searchMonth || null })}
          >
            Search
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                {monthHeadings.map((heading) => (
                  <th
                    key={heading.key_name}
                    className="px-6 py-3 text-left text-base font-semibold text-gray-700"
                  >
                    {heading.header_name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingMonth ? (
                <tr>
                  <td
                    colSpan={monthHeadings.length}
                    className="text-center py-6"
                  >
                    Loading...
                  </td>
                </tr>
              ) : errorMonth ? (
                <tr>
                  <td
                    colSpan={monthHeadings.length}
                    className="text-center py-6 text-red-500"
                  >
                    Error: {errorMonth.message}
                  </td>
                </tr>
              ) : dataMonth && dataMonth.expensePerMonInCurYear.length > 0 ? (
                dataMonth.expensePerMonInCurYear.map((row, idx) => (
                  <tr key={idx} className="border-b">
                    {monthHeadings.map((h) => (
                      <td key={h.key_name} className="px-6 py-4">
                        {h.key_name.includes("amount")
                          ? convertToINR(row[h.key_name])
                          : row[h.key_name]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={monthHeadings.length}
                    className="text-center py-6 text-gray-500"
                  >
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseOverview;
