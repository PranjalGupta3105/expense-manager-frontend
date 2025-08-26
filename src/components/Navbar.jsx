import React from "react";
import { Disclosure } from "@headlessui/react";
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
  { name: "Add Expense", href: "/add-expense" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Card Details", href: "/cards" },
];

const GET_TOTAL_SPENDS = gql`
  query getTotalSpends {
    total_spends
  }
`;

const Navbar = () => {
  const { loading, error, data } = useQuery(GET_TOTAL_SPENDS);

  const [sideNavOpen, setSideNavOpen] = React.useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {/* Overlay for side nav on mobile */}
      {sideNavOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 sm:hidden"
          onClick={() => setSideNavOpen(false)}
        />
      )}
      <Disclosure as="nav" className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSideNavOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className={sideNavOpen ? "hidden h-6 w-6" : "block h-6 w-6"} />
                <XMarkIcon aria-hidden="true" className={sideNavOpen ? "block h-6 w-6" : "hidden h-6 w-6"} />
              </button>
            </div>
            {/* Navbar menu items */}
            <div className="flex items-center justify-center space-x-4 flex-1">
              <div className="hidden sm:flex space-x-4">
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
                  Total Spends: {data ? data.total_spends ? Math.round(data.total_spends) : 0 : 0}
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
        {/* Mobile Side Nav */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-gray-800 z-50 transform ${sideNavOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 sm:hidden flex flex-col`}
        >
          <div className="flex flex-col h-full p-4 space-y-4 overflow-y-auto">
            <button
              className="self-end text-gray-400 hover:text-white"
              onClick={() => setSideNavOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            {/* Navigation links */}
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link to={item.href} key={item.name} onClick={() => setSideNavOpen(false)}>
                  <button
                    aria-current={item.current ? "page" : undefined}
                    className={classNames(
                      item.current
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md text-lg px-4 py-3 font-medium w-full text-left"
                    )}
                  >
                    {item.name}
                  </button>
                </Link>
              ))}
            </div>
            {/* Info boxes - keep inside the blue nav bar */}
            <div className="flex flex-col space-y-2 mt-4">
              <div className="bg-white text-black p-3 rounded-md shadow-md">
                <p>
                  Total Spends: {data ? data.total_spends ? Math.round(data.total_spends) : 0 : 0}
                </p>
              </div>
              <MonthWiseExpense
                month_type="current"
                month_no={new Date().getMonth() + 1}
              />
              <MonthWiseExpense
                month_type="previous"
                month_no={new Date().getMonth()}
              />
            </div>
          </div>
        </div>
      </Disclosure>
    </div>
  );
};

export default Navbar;

