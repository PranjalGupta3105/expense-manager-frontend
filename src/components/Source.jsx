// import React from 'react'
import Table from "./Table";
import { useQuery, gql } from "@apollo/client";

const headings = ["S.No.", "Source Id", "Name"];

const GET_SOURCES = gql`
  query getSources {
    sources {
      id
      name
    }
  }
`;

const Source = () => {
  const { loading, error, data } = useQuery(GET_SOURCES);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  const sources = data.sources.map((expense, index) => {
    return { sno: index+1, ...expense}
  })

  return (
    <div>
      <Table headings={headings} data={sources} />
    </div>
  );
};

export default Source;
