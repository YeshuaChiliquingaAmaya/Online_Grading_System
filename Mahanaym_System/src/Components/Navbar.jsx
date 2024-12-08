import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/home">
          {user.role === "Administrator"
            ? "Panel de Administración"
            : user.role === "Teacher"
            ? "Panel del Profesor"
            : user.role === "Student"
            ? "Panel del Estudiante"
            : "Panel de Padres"}
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/home">
                Inicio
              </Link>
            </li>
            {user.role === "Administrator" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/manage-users">
                    Gestionar Usuarios
                  </Link>
                </li>
              </>
            )}
            {user.role === "Teacher" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/grades">
                    Gestión de Notas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/students">
                    Gestión de Estudiantes
                  </Link>
                </li>
              </>
            )}
            {user.role === "Student" && (
              <li className="nav-item">
                <Link className="nav-link" to="/student-grades">
                  Mis Calificaciones
                </Link>
              </li>
            )}
            {user.role === "Parent" && (
              <li className="nav-item">
                <Link className="nav-link" to="/parent-grades">
                 Mis Hijos y Sus Calificaciones
                </Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <span className="nav-link">Hola, {user.name}</span>
            </li>
            <li className="nav-item">
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
