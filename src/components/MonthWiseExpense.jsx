// import React from 'react'
import { useQuery, gql } from "@apollo/client";

const MonthWiseExpense = (props) => {
  // eslint-disable-next-line react/prop-types
  const { className, month_no } = props;
  const GET_TOTAL_SPENDS_IN_MON = gql`
  query monExpense {
    total_amount_in_mon(mon_no: ${month_no})
  }
`;
  const { loading, error, data } = useQuery(GET_TOTAL_SPENDS_IN_MON);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div className={className + " flex flex-col items-center justify-center w-full"}>
      <p className="text-center w-full">
        Total {getMonthNameFromIndex(month_no)} Spends:&ensp;
        {Math.round(data ? data.total_amount_in_mon ? Math.round(data.total_amount_in_mon) : 0 : 0)}
      </p>
    </div>
  );
};

const getMonthNameFromIndex = (mon_index) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let mindx = mon_index-1

  return months[ mindx >=0 ? mindx : 11]
}

export default MonthWiseExpense;
