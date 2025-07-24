import React from 'react'
import MonthlyExpenses from '../assets/MonthlyExpenses.png';

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[200px] mt-10 sm:mt-20">
      <img src={MonthlyExpenses} alt="Monthly Expenses" className="max-w-full h-auto" />
    </div>
  );
}

export default Dashboard
