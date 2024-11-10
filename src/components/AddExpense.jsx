import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import moment from "moment";

const AddExpense = () => {
  const [amount, setAmount] = useState(0.0);
  const [description, setDescription] = useState("");
  const [method_id, setMethod] = useState(0);
  const [source_id, setSource] = useState(0);
  const [exp_date, setDate] = useState(moment(new Date()).format("YYYY-MM-DD"));

  const ADD_EXPENSE_MUTATION = gql`
    mutation addExpense($amount: Float!, $description: String!, $method_id: Int!,  $source_id: Int!, $exp_date: String!) 
    {
        expense: createExpense(amount: $amount, description: $description, method_id: $method_id, source_id: $source_id, date: $exp_date) 
        {
            id,
            amount,
            description,
            method_id,
            method {
              name
            }
            source_id,
            source {
              name
            }
            date,
            created_by,
            updated_by
        }
    }`;

  // eslint-disable-next-line no-unused-vars
  const [createExpense, { data, loading, error }] = useMutation(ADD_EXPENSE_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    try {
      // Execute the GraphQL mutation with the form data
      await createExpense({ variables: { amount: parseFloat(amount), description, method_id: parseInt(method_id), source_id: parseInt(source_id), exp_date } });

      // Reset form state after submission
      setAmount(0.0);
      setDescription('');
      setMethod(0);
      setSource(0);
      setDate(moment(new Date()).format("YYYY-MM-DD"));
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  return (
    <div className="w-full max-w-xs">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
            Amount
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="amount"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="method_id">
            Method Id
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="method_id"
            type="text"
            placeholder="Method Id"
            value={method_id}
            onChange={(e) => setMethod(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="source_id">
            Source Id
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="source_id"
            type="text"
            placeholder="Source Id"
            value={source_id}
            onChange={(e) => setSource(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="doe">
            Date of Expense
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="doe"
            type="text"
            placeholder="Date of Expense"
            value={exp_date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;
