// import React from "react";
import EditExpense from './EditExpense';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const TableRow = (props) => {
  let { row_data_object, refetch } = props;
  let keys = Object.keys(row_data_object);
  // Accept both string and number for is_repayed
  const isRepayed = row_data_object.is_repayed === 1 || row_data_object.is_repayed === "Yes";
  const [showEdit, setShowEdit] = useState(false);

  const handleUpdated = () => {
    setShowEdit(false);
    if (refetch) refetch();
  };

  return (
    <>
      <tr className={
        `${isRepayed ? 'bg-green-100 dark:bg-green-800' : 'bg-white dark:bg-gray-800'} border-b dark:border-gray-700`
      }>
        <th
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {row_data_object[keys[0]]}
        </th>
        {
          // eslint-disable-next-line react/prop-types
          keys.slice(1,keys.length).map((key) => {
            // eslint-disable-next-line react/jsx-key
            return <td className="px-6 py-4" key={key}>{row_data_object[key]}</td>
          })
        }
        <td className="px-6 py-4">
          <button onClick={() => setShowEdit(true)}>
            <PencilSquareIcon className="h-5 w-5 text-blue-500 hover:text-blue-700" />
          </button>
        </td>
      </tr>
      {showEdit && (
        <EditExpense expense={row_data_object} onClose={() => setShowEdit(false)} onUpdated={handleUpdated} />
      )}
    </>
  );
};

export default TableRow;
