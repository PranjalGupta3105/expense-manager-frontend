import React from 'react'

const Analytics = () => {
  const ANALYTICS_URL = import.meta.env.VITE_ANALYTICS_URL ?? "http://localhost:8501/";
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[200px] mt-10 sm:mt-20">
      <iframe
        src={ANALYTICS_URL}
        title="Expense Analytics"
        className="w-full h-[600px] border rounded"
        allow="clipboard-write"
      ></iframe>
    </div>
  );
}

export default Analytics
