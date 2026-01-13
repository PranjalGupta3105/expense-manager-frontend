import React from 'react'

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[200px] mt-10 sm:mt-20">
      <iframe
        src="http://localhost:8501/"
        title="Expense Dashboard"
        className="w-full h-[600px] border rounded"
        allow="clipboard-write"
      ></iframe>
    </div>
  );
}

export default Dashboard
