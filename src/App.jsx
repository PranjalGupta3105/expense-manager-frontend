// import React from 'react'
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="/methods" element={<MethodPage />} />
      <Route path="/sources" element={<SourcePage />} />
      <Route path="/calender" element={<CalendarPage />} />
      <Route path="/add-expense" element={<NewExpensePage />} />

      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
