import { useState } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import MethodPage from "./pages/MethodPage";
import SourcePage from "./pages/SourcePage";
// import NotFoundPage from "./pages/NotFoundPage";
import CalendarPage from "./pages/CalenderPage";
import NewExpensePage from "./pages/NewExpensePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import CardDetails from "./components/CardDetail";
import ExpenseOverview from "./components/ExpenseOverview";
import LoginPage from "./pages/LoginPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="/methods" element={<MethodPage />} />
      <Route path="/sources" element={<SourcePage />} />
      <Route path="/calender" element={<CalendarPage />} />
      <Route path="/add-expense" element={<NewExpensePage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/cards" element={<CardDetails />} />
      <Route path="/expense-overview" element={<ExpenseOverview />} />
      <Route path="/login" element={<LoginPage />} />

      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Route>
  )
);

function App() {
  const [token, setToken] = useState(null);

  const handleLoginSuccess = (token) => {
    // Set token in state and redirect to home
    setToken(token);
  };

  return (
    <div>
      {!token ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <RouterProvider router={router}/>
      )}
    </div>
  );
}

export default App;
