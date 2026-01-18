import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import moment from "moment";

const AddExpense = () => {
  const [amount, setAmount] = useState(0.0);
  const [description, setDescription] = useState("");
  const [method_id, setMethod] = useState(0);
  const [source_id, setSource] = useState(0);
  const [exp_date, setDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [tag, setTag] = useState("");
  const [card_id, setCardId] = useState(null);

  const GET_CARDS_DATA = gql`
    query getCCSources {
      ccSources {
        id
        issuing_bank
        card_name
        source_id
        method_id
      }
    }
  `;

  const {
    loading: cardsLoading,
    error: cardsError,
    data: cardsData,
  } = useQuery(GET_CARDS_DATA);

  const handleCardChangeDD = (event) => {
    const [cardId, sourceId] = event.target.value.split(",");
    setCardId(cardId);
    setSource(sourceId);
  };

  const ADD_EXPENSE_MUTATION = gql`
    mutation addExpense(
      $amount: Float!
      $description: String!
      $method_id: Int!
      $source_id: Int!
      $exp_date: String!
      $tag: String
      $card_id: Int
    ) {
      expense: createExpense(
        amount: $amount
        description: $description
        method_id: $method_id
        source_id: $source_id
        date: $exp_date
        tag: $tag
        card_id: $card_id
      ) {
        id
        amount
        description
        method_id
        method {
          name
        }
        source_id
        source {
          name
        }
        date
        tag
        created_by
        updated_by,
        card_id
      }
    }
  `;

  // eslint-disable-next-line no-unused-vars
  const [createExpense, { data, loading, error }] =
    useMutation(ADD_EXPENSE_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    try {

      console.log(`Submitting:
      Amount: ${parseFloat(amount)}
      Description: ${description}
      Method ID: ${parseInt(method_id)}
      Source ID: ${parseInt(source_id)}
      Date: ${exp_date}
      Tag: ${tag}
      Card ID: ${parseInt(card_id) || null}`);

      // Execute the GraphQL mutation with the form data
      await createExpense({
        variables: {
          amount: parseFloat(amount),
          description,
          method_id: parseInt(method_id),
          source_id: parseInt(source_id),
          exp_date,
          tag,
          card_id: parseInt(card_id) || null,
        },
      });

      // Reset form state after submission
      setAmount(0.0);
      setDescription("");
      setMethod(0);
      setSource(0);
      setDate(moment(new Date()).format("YYYY-MM-DD"));
      setTag("");
      setCardId(null);
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xs">
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="amount"
            >
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
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
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
          {/*
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="method_id"
          >
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
        </div>*/}
          {/*<div className="mb-4">
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
        </div>*/}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="method_id"
            >
              Method
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="method_id"
              value={method_id}
              onChange={(e) => setMethod(e.target.value)}
              required
            >
              <option value="">Select Method</option>
              {/* Replace these options with your actual method IDs */}
              <option value="2">In-Cash</option>
              <option value="3">Debit Card</option>
              <option value="4">Credit Card</option>
              <option value="5">UPI</option>
              <option value="6">AC to AC</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="source_id"
            >
              Source
            </label>
            {method_id == 4 ? (
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="card_id"
                value={card_id ? card_id + "," + source_id : null}
                onChange={handleCardChangeDD}
                required
              >
                <option value="">Select Card</option>
                {cardsData.ccSources.map((ccoption) => (
                  <option
                    key={ccoption.id}
                    value={ccoption.id + "," + ccoption.source_id}
                  >
                    {ccoption.card_name} - {ccoption.issuing_bank}
                  </option>
                ))}
              </select>
            ) : (
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="source_id"
                value={source_id}
                onChange={(e) => setSource(e.target.value)}
                required
              >
                <option value="">Select Source</option>
                {/* Replace these options with your actual source IDs */}
                <option value="1">KOTAK MAHINDRA BANK</option>
                <option value="2">ICICI BANK</option>
                <option value="3">SBI BANK</option>
                <option value="7">HSBC BANK</option>
                <option value="8">HDFC BANK</option>
                <option value="9">CASH</option>
              </select>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="doe"
            >
              Date of Expense
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="doe"
              type="date"
              value={exp_date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="tag"
            >
              Tag
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="tag"
              type="text"
              placeholder="Tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
