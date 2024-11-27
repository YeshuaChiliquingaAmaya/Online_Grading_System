import React from "react";
import "./Navbar.css";

const menuItems = [
  { name: "Inicio", path: "/", icon: "img/imagen.jpg" },
  { name: "Profesores", path: "/profesor" },
  { name: "Estudiantes", path: "/estudiantes" },
  { name: "Padres", path: "/padres" },
  { name: "Reportes", path: "/reportes" },
];

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        {menuItems.map((item, index) => (
          <li key={index}>
            <a href={item.path}>
              {item.icon ? (
                <img src={item.icon} alt={item.name} />
              ) : (
                item.name
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
