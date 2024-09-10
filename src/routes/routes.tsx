import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import QuoteList from "../pages/QuoteList";
import Login from "../pages/Login";
import CreateQuote from "../pages/CreateQuote";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/quotes" element={<QuoteList />} />
        <Route path="/create-quote" element={<CreateQuote />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
