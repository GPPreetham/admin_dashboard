import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import NotFound from "./components/NotFound";
import Login from "./components/LoginScreen/login";
import Register from "./components/RegisterScreen/register";
import Dashboard from "./components/Dashboard/dashboard";
import MemberManage from "./components/Dashboard/MemberManage";
import Transaction from "./components/Dashboard/Transaction";
import AccountDetails from "./components/Dashboard/AccountDetails";
import PointsManage from "./components/Dashboard/PointsManage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/membermanage" element={<MemberManage />} />
      <Route path="/transaction" element={<Transaction />} />
      <Route path="/accountdetails" element={<AccountDetails />} />
      <Route path="/pointsmanage" element={<PointsManage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
