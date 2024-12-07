// import React from 'react'
import Table from "./Table";
import { useQuery, gql } from "@apollo/client";

let headings = ["S.No.","Method Id", "Name", "Action"];

const GET_METHODS = gql`
  query getMethods {
    methods: method {
      id
      name
    }
  }
`;

const Method = () => {
  const { loading, error, data } = useQuery(GET_METHODS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const methods = data.methods.map((expense, index) => {
    return { sno: index+1, ...expense}
  })
  
  return (
    <div>
      <Table headings={headings} data={methods} />
    </div>
  );
};

export default Method;
