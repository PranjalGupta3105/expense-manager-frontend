// import React from "react";

const TableRow = (props) => {
  // eslint-disable-next-line react/prop-types
  let { row_data_object } = props;

  let keys = Object.keys(row_data_object)

  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
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
          return <td className="px-6 py-4">{row_data_object[key]}</td>
        })
      }
    </tr>
  );
};

export default TableRow;
