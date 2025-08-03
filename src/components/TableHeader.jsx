// import React from 'react'

const TableHeader = (props) => {
  // eslint-disable-next-line react/prop-types
  let { headings } = props;
  return (
    <tr>
      {headings.map((heading, idx) => (
        <th scope="col" className="px-6 py-3" key={heading}>
          {heading}
        </th>
      ))}
      <th scope="col" className="px-6 py-3" key="action">Action</th>
    </tr>
  );
};

export default TableHeader;
