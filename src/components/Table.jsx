// import React from 'react'
import TableRow from "./TableRow";
import TableHeader from "./TableHeader";

const Table = (props) => {
  let { headings, data, refetch } = props;
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <TableHeader headings={headings} />
        </thead>
        <tbody>
          {data.map((row) =>
            <TableRow row_data_object={row} refetch={refetch} />
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
