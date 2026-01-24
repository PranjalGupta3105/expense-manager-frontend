// import React from 'react'
import TableRow from "./TableRow";
import TableHeader from "./TableHeader";

const Table = (props) => {
  let { headings, data, refetch, selectedIds = [], onCheckboxChange, columnConfig } = props;
  return (
    <div className="relative w-full">
      <table className="w-full text-xs sm:text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <TableHeader headings={headings} columnConfig={columnConfig} />
        </thead>
        <tbody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              row_data_object={row}
              refetch={refetch}
              checked={selectedIds.includes(row.id)}
              onCheckboxChange={onCheckboxChange}
              columnConfig={columnConfig}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
