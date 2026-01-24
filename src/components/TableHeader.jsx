// import React from 'react'

const TableHeader = (props) => {
  // eslint-disable-next-line react/prop-types
  let { headings, columnConfig } = props;
  
  const getColumnVisibility = (heading, idx) => {
    if (heading === "Select") return ""; // Always show Select
    if (idx === 0) return ""; // First column (Select) is always visible
    
    // Find matching column config
    const config = columnConfig?.find(col => col.heading === heading);
    if (!config) return ""; // Show by default if no config
    
    // Hide on mobile, show on tablet and up
    if (!config.mobile) {
      return "hidden md:table-cell";
    }
    return "";
  };
  
  return (
    <tr>
      {headings.map((heading, idx) => {
        const isDescription = heading === "Description";
        
        return (
          <th 
            scope="col" 
            className={`px-1 sm:px-2 md:px-4 lg:px-6 py-2 sm:py-3 ${isDescription ? '' : 'whitespace-nowrap'} ${getColumnVisibility(heading, idx)}`} 
            key={heading}
          >
            {heading}
          </th>
        );
      })}
      <th scope="col" className="px-1 sm:px-2 md:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap" key="action">Action</th>
    </tr>
  );
};

export default TableHeader;
