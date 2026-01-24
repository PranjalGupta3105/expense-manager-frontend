// import React from "react";
import EditExpense from './EditExpense';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const TableRow = (props) => {
  let { row_data_object, refetch, checked, onCheckboxChange, columnConfig } = props;
  
  // Use columnConfig to determine order, filter out internal IDs
  const displayKeys = columnConfig 
    ? columnConfig.map(col => col.key).filter(key => key !== 'source_id' && key !== 'method_id')
    : Object.keys(row_data_object).filter((key) => key !== 'source_id' && key !== 'method_id');
  
  // Accept both string and number for is_repayed
  const isRepayed = row_data_object.is_repayed === 1 || row_data_object.is_repayed === "Yes";
  const [showEdit, setShowEdit] = useState(false);

  const handleUpdated = () => {
    setShowEdit(false);
    if (refetch) refetch();
  };

  const getCellVisibility = (key) => {
    const config = columnConfig?.find(col => col.key === key);
    if (!config) return ""; // Show by default if no config
    
    // Hide on mobile, show on tablet and up
    if (!config.mobile) {
      return "hidden md:table-cell";
    }
    return "";
  };

  return (
    <>
      <tr className={
        `${isRepayed ? 'bg-green-100 dark:bg-green-800' : 'bg-white dark:bg-gray-800'} border-b dark:border-gray-700`
      }>
        <td className="px-1 sm:px-2 md:px-4 lg:px-6 py-2 sm:py-4">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => onCheckboxChange(row_data_object.id)}
            className="w-3 h-3 sm:w-4 sm:h-4"
          />
        </td>
        {
          displayKeys.map((key) => {
            const isDescription = key === "description";
            const cellContent = row_data_object[key];
            
            return (
              <td 
                className={`px-1 sm:px-2 md:px-4 lg:px-6 py-2 sm:py-4 ${isDescription ? '' : 'whitespace-nowrap'} ${getCellVisibility(key)}`} 
                key={key}
              >
                {isDescription ? (
                  <div className="truncate max-w-[120px] sm:max-w-none" title={cellContent}>
                    {cellContent}
                  </div>
                ) : (
                  cellContent
                )}
              </td>
            );
          })
        }
        <td className="px-1 py-1 sm:px-2 sm:py-2 md:px-4 md:py-4 lg:px-6 lg:py-4 flex items-center justify-center" key="action">
          <button onClick={() => setShowEdit(true)} className="p-0.5 sm:p-1">
            <PencilSquareIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-500 hover:text-blue-700" />
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
