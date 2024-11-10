// import React from 'react'

const TableHeader = (props) => {
  // eslint-disable-next-line react/prop-types
  let { headings } = props;
  return (
    <tr>
      {
        // eslint-disable-next-line react/prop-types
        headings.map((heading) => (
          // eslint-disable-next-line react/jsx-key
          <th scope="col" className="px-6 py-3">
            {heading}
          </th>
        ))
      }
    </tr>
  );
};

export default TableHeader;
