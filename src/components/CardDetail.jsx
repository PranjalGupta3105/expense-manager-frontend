import { useQuery, gql } from "@apollo/client";

const GET_CARDS = gql`
  query {
    activePaymentCardsDetails {
      id
      name
      source_name
      renewal_date
      statement_date
      renewal_amount
    }
  }
`;

const headings = [
  "Name of the card",
  "Bank Associated With",
  "Renewal Date",
  "Statement Generation Date",
  "Statement Amount   (Inc. GST)",
];

const CardDetails = () => {
  const { loading, error, data } = useQuery(GET_CARDS);

  const cards = data?.activePaymentCardsDetails || [];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6 mx-auto max-w-4xl">
      <h2 className="text-2xl font-semibold text-center mb-6">Card Details</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              {headings.map((heading) => (
                <th
                  key={heading}
                  className="px-6 py-3 text-left text-base font-semibold text-gray-700"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={headings.length} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={headings.length} className="text-center py-6 text-red-500">
                  Error: {error.message}
                </td>
              </tr>
            ) : cards.length > 0 ? (
              cards.map((card) => (
                <tr key={card.id} className="border-b">
                  <td className="px-6 py-4">{card.name}</td>
                  <td className="px-6 py-4">{card.source_name}</td>
                  <td className="px-6 py-4">{card.renewal_date}</td>
                  <td className="px-6 py-4">{card.statement_date}</td>
                  <td className="px-6 py-4">{card.renewal_amount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headings.length} className="text-center py-6 text-gray-500">
                  No card data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CardDetails;