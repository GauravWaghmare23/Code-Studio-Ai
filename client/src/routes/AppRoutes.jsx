import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "../context/ProtectedRoute";
import Home from "../pages/Home";
import Project from "../pages/Project";

import Landing from "../pages/Landing";
import Docs from "../pages/Docs";

const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/project" element={
          <ProtectedRoute>
            <Project />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/docs" element={<Docs />} />
      </Routes>
  );
};


export default AppRoutes;
