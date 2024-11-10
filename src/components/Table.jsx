// import React from 'react'
import TableRow from "./TableRow";
import TableHeader from "./TableHeader";

const Table = (props) => {
  // eslint-disable-next-line react/prop-types
  let { headings, data } = props;
  // data = an array of exenses/methods/source
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <TableHeader headings={headings} />
        </thead>
        <tbody>
          {/* eslint-disable-next-line react/prop-types */}
          {data.map((row) =>
            // eslint-disable-next-line react/jsx-key
            <TableRow row_data_object={row} />
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
