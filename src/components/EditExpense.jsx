import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import moment from "moment";

const UPDATE_EXPENSE_MUTATION = gql`
  mutation updateExpense(
    $id: Int!
    $amount: Float
    $description: String
    $tag: String
    $is_repayed: Int
    $date: String
    $source_id: Int
    $method_id: Int
  ) {
    updateExpense(
      id: $id
      amount: $amount
      description: $description
      tag: $tag
      is_repayed: $is_repayed
      date: $date
      source_id: $source_id
      method_id: $method_id
    ) {
      id
      amount
      description
      tag
      is_repayed
      date
      source_id
      method_id
      created_by
      updated_by
    }
  }
`;

const EditExpense = ({ expense, onClose, onUpdated }) => {
  const [amount, setAmount] = useState(expense.amount);
  const [description, setDescription] = useState(expense.description);
  const [tag, setTag] = useState(expense.tag);
  const [isRepayed, setIsRepayed] = useState(expense.is_repayed === 1 || expense.is_repayed === "Yes");

  // Helper to extract id from possible nested object or direct value
  function getId(val) {
    if (!val) return "";
    if (typeof val === "string" || typeof val === "number") return String(val);
    if (val.id) return String(val.id);
    if (val.value) return String(val.value);
    return "";
  }

  const [method_id, setMethod] = useState(getId(expense.method_id || expense.method));
  const [source_id, setSource] = useState(getId(expense.source_id || expense.source));
  // Always use YYYY-MM-DD for input type="date". If missing, use today's date.
  function getValidDate(val) {
    if (!val) return moment().format("YYYY-MM-DD");
    // Try to parse and format
    const d = moment(val, ["YYYY-MM-DD", "DD-MM-YYYY", moment.ISO_8601], true);
    if (d.isValid()) return d.format("YYYY-MM-DD");
    return moment().format("YYYY-MM-DD");
  }
  const [date, setDate] = useState(getValidDate(expense.date));

  const [updateExpense, { loading, error }] = useMutation(UPDATE_EXPENSE_MUTATION);

  const methodOptions = [
    { value: "2", label: "In-Cash" },
    { value: "3", label: "Debit Card" },
    { value: "4", label: "Credit Card" },
    { value: "5", label: "UPI" },
    { value: "6", label: "AC to AC" },
  ];
  const sourceOptions = [
    { value: "1", label: "KOTAK MAHINDRA BANK" },
    { value: "2", label: "ICICI BANK" },
    { value: "3", label: "SBI BANK" },
    { value: "7", label: "HSBC BANK" },
    { value: "8", label: "HDFC BANK" },
    { value: "9", label: "CASH" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateExpense({
      variables: {
        id: expense.id,
        amount: parseFloat(amount),
        description,
        tag,
        is_repayed: isRepayed ? 1 : 0,
        date,
        source_id: parseInt(source_id),
        method_id: parseInt(method_id),
      },
    });
    if (onUpdated) onUpdated();
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md sm:p-8 p-2 mx-2 overflow-y-auto max-h-screen" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Edit Expense</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">Amount</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" type="text" value={description} onChange={e => setDescription(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tag">Tag</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="tag" type="text" value={tag} onChange={e => setTag(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="isRepayed">Is Repayed</label>
            <select id="isRepayed" value={isRepayed ? "Yes" : "No"} onChange={e => setIsRepayed(e.target.value === "Yes")}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="method_id">Method</label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="method_id"
              value={method_id}
              onChange={e => setMethod(e.target.value)}
              required
            >
              <option value="">Select Method</option>
              {methodOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="source_id">Source</label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="source_id"
              value={source_id}
              onChange={e => setSource(e.target.value)}
              required
            >
              <option value="">Select Source</option>
              {sourceOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">Date</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Submit"}
            </button>
            <button type="button" className="ml-0 sm:ml-4 text-gray-500 hover:text-gray-700 w-full sm:w-auto" onClick={onClose}>Cancel</button>
          </div>
          {error && <p className="text-red-500 mt-2">{error.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditExpense;
