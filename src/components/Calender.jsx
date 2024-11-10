// import React from 'react'
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { capitalizeFirstLetter } from "../utils/functions";
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import moment from "moment";

const Calender = () => {
  const today = startOfToday();
  const [selectedMonNo, setCurrMonthNo] = useState(() => format(today, "MM"));

  const GET_EXPENSE_DATE_WISE = gql`
    query dateWiseExpense {
      date_wise_expenses(mon_no: ${selectedMonNo}) {
        date
        amount
        total_expenses
      }
    }`;

  const [date_wise_data, setDateWiseData] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const { loading, error, data } = useQuery(GET_EXPENSE_DATE_WISE, {
    onCompleted: setDateWiseData,
  });
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const colStartClasses = [
    "col-start-1",
    "col-start-2",
    "col-start-3",
    "col-start-4",
    "col-start-5",
    "col-start-6",
    "col-start-7",
  ];

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [currMonth, setCurrMonth] = useState(() => format(today, "MMM-yyyy"));
  let firstDayOfMonth = parse(currMonth, "MMM-yyyy", new Date());

  const [hoveredDay, setHoveredDay] = useState(null);

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(firstDayOfMonth),
    end: endOfWeek(endOfMonth(firstDayOfMonth)),
  });

  const getPrevMonth = (event) => {
    event.preventDefault();
    const firstDayOfPrevMonth = add(firstDayOfMonth, { months: -1 });
    setCurrMonth(format(firstDayOfPrevMonth, "MMM-yyyy"));
    setCurrMonthNo(format(firstDayOfPrevMonth, "MM"));
  };

  const getNextMonth = (event) => {
    event.preventDefault();
    const firstDayOfNextMonth = add(firstDayOfMonth, { months: 1 });
    setCurrMonth(format(firstDayOfNextMonth, "MMM-yyyy"));
    setCurrMonthNo(format(firstDayOfNextMonth, "MM"));
  };

  const [expense, setExpense] = useState(null);

  const handleMouseEnter = (day) => {
    setHoveredDay(day);
    setCurrMonthNo(moment(day).format("MM"));
    setExpense(
      date_wise_data.date_wise_expenses.filter((expense) => {
        if (
          moment(expense.date).format("YYYY-MM-DD") ==
          moment(day).format("YYYY-MM-DD")
        ) {
          return expense;
        }
      })[0]
    );
    // setExpense(item); // Set the hovered item
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
    setExpense(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div className="p-8 w-screen h-screen flex items-center justify-center">
      <div className="w-[900px] h-[600px]">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-xl">
            {format(firstDayOfMonth, "MMMM yyyy")}
          </p>
          <div className="flex items-center justify-evenly gap-6 sm:gap-12">
            <ChevronLeftIcon
              className="w-6 h-6 cursor-pointer"
              onClick={getPrevMonth}
            />
            <ChevronRightIcon
              className="w-6 h-6 cursor-pointer"
              onClick={getNextMonth}
            />
          </div>
        </div>
        <hr className="my-6" />
        <div className="grid grid-cols-7 gap-6 sm:gap-12 place-items-center">
          {days.map((day, idx) => {
            return (
              <div key={idx} className="font-semibold">
                {capitalizeFirstLetter(day)}
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-7 gap-6 sm:gap-12 mt-8 place-items-center">
          {daysInMonth.map((day, idx) => {
            return (
              <div key={idx} className={colStartClasses[getDay(day)]}>
                <p
                  className={`cursor-pointer flex items-center justify-center font-semibold h-8 w-8 rounded-full  hover:text-white ${
                    isSameMonth(day, today) ? "text-gray-900" : "text-gray-400"
                  } ${!isToday(day) && "hover:bg-blue-500"} ${
                    isToday(day) && "bg-red-500 text-white"
                  }`}
                  onMouseEnter={() => handleMouseEnter(day)}
                  onMouseLeave={() => handleMouseLeave}
                >
                  {format(day, "d")}
                </p>
              </div>
            );
          })}
        </div>
      </div >
      {/* Conditionally render the box when hovering over an item */}
      {expense && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 p-4 bg-gray-200 text-black rounded-md shadow-lg transition-opacity duration-300"
        style={{
          left: `${(getDay(hoveredDay) + 1) * 12}%`, // Adjust based on the hovered day position
        }}>
          <p className="font-bold text-black">Date:</p>
          <p className="text-green-500">{expense.date}</p>
          <p className="font-bold text-black">Amount spend:</p>
          <p className="text-green-500">{expense.amount}</p>
          <p className="font-bold text-black">No. of Expenses:</p>
          <p className="text-green-500">{expense.total_expenses}</p>
        </div>
      )}
    </div>
  );
};

export default Calender;
