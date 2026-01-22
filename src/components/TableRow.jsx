// import React from "react";
import EditExpense from './EditExpense';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const TableRow = (props) => {
  let { row_data_object, refetch, checked, onCheckboxChange } = props;
  let keys = Object.keys(row_data_object);
  const displayKeys = keys
    .slice(1) // skip checkbox label column
    .filter((key) => key !== 'source_id' && key !== 'method_id'); // hide ids used for edit
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
        <td className="px-6 py-4">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => onCheckboxChange(row_data_object.id)}
          />
        </td>
        <th
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {row_data_object[keys[0]]}
        </th>
        {
          displayKeys.map((key) => (
            <td className="px-6 py-4" key={key}>
              {row_data_object[key]}
            </td>
          ))
        }
        <td className="px-2 py-2 flex items-center justify-center sm:px-6 sm:py-4" key="action">
          <button onClick={() => setShowEdit(true)} className="p-1 sm:p-0">
            <PencilSquareIcon className="h-6 w-6 text-blue-500 hover:text-blue-700" />
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
