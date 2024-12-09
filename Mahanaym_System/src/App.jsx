import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import Students from "./Pages/Students";
import Grades from "./Pages/Grades";
import StudentGrades from "./Pages/StudentGrades";
import ParentGrades from "./Pages/ParentGrades";
import AdminPanel from "./Pages/AdminPanel";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = async (e, email, password) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { user } = data;
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
      } else {
        console.error("Error al iniciar sesión");
      }
    } catch (err) {
      console.error("Error al conectar con el servidor:", err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      {user && <Navbar user={user} onLogout={handleLogout} />}
      <div className="container mt-5">
      <Routes>
        {/* Página principal */}
        <Route
          path="/home"
          element={user ? <Home user={user} /> : <Navigate to="/" />}
        />
        {/* Inicio de sesión */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/home" />
            ) : (
              <Login handleLogin={handleLogin} />
            )
          }
        />
        {/* Gestión de notas - Profesores */}
        <Route
          path="/grades"
          element={user && user.role === "Teacher" ? <Grades /> : <Navigate to="/" />}
        />
        {/* Gestión de estudiantes - Profesores */}
        <Route
          path="/students"
          element={user && user.role === "Teacher" ? <Students /> : <Navigate to="/" />}
        />
        {/* Calificaciones - Estudiantes */}
        <Route
          path="/student-grades"
          element={
            user && user.role === "Student" ? <StudentGrades /> : <Navigate to="/" />
          }
        />
        <Route
          path="/parent-grades"
          element={
            user && user.role === "Parent" ? <ParentGrades /> : <Navigate to="/" />
          }
        />
        <Route
          path="/manage-users"
          element={
            user && user.role === "Administrator" ? <AdminPanel /> : <Navigate to="/" />
          }
        />
      </Routes>
      </div>
    </Router>
  );
};

export default App;
