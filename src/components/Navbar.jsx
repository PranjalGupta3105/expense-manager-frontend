import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import MonthWiseExpense from "./MonthWiseExpense";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const navigation = [
  { name: "Expenses", href: "/" },
  { name: "Methods", href: "/methods" },
  { name: "Source", href: "/sources" },
  { name: "Calender", href: "/calender" },
  { name: "Add Expense", href: "/add-expense"}
];

const GET_TOTAL_SPENDS = gql`
  query getTotalSpends {
    total_spends
  }
`;

const Navbar = () => {
  const { loading, error, data } = useQuery(GET_TOTAL_SPENDS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;


  return (
    <div>
      <Disclosure as="nav" className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block h-6 w-6 group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden h-6 w-6 group-data-[open]:block"
                />
              </DisclosureButton>
            </div>

            {/* Navbar menu items */}
            <div className="flex items-center justify-center space-x-4 flex-1">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link to={item.href} key={item.name}>
                    <button
                      aria-current={item.current ? "page" : undefined}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md text-lg px-6 py-4 font-medium flex items-center justify-center"
                      )}
                    >
                      {item.name}
                    </button>
                  </Link>
                ))}
              </div>

              {/* White box with total spends */}
              <div className="hidden sm:flex sm:ml-6 sm:mr-4 bg-white text-black p-4 rounded-md shadow-md w-full max-w-[200px] overflow-hidden text-ellipsis">
                <p>
                  Total Spends:{" "}
                  {data
                    ? data.total_spends
                      ? Math.round(data.total_spends)
                      : 0
                    : 0}
                </p>
              </div>
              {/* MonthWiseExpense components */}
                <MonthWiseExpense
                  className="hidden sm:flex sm:ml-6 sm:mr-4 bg-white text-black p-4 rounded-md shadow-md w-full max-w-[200px] overflow-hidden text-ellipsis"
                  month_type="current"
                  month_no={new Date().getMonth() + 1}
                />
                <MonthWiseExpense
                  className="hidden sm:flex sm:ml-6 sm:mr-4 bg-white text-black p-4 rounded-md shadow-md w-full max-w-[200px] overflow-hidden text-ellipsis"
                  month_type="previous"
                  month_no={new Date().getMonth()}
                />
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className={classNames(
                  item.current
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
            {/* <AddExpense /> You can remove this from the mobile menu */}
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
};

export default Navbar;

