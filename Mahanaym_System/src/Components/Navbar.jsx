import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user }) => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/home">Inicio</Link>
        </li>
        {user.role === "Administrator" && (
          <>
            <li>
              <Link to="/professor">Gestionar Profesores</Link>
            </li>
            <li>
              <Link to="/student">Gestionar Estudiantes</Link>
            </li>
          </>
        )}
        <li>
          <span>{user.name}</span>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
