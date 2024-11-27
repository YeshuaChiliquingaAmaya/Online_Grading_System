import React from "react";
import "./Professor.css";

const professors = [
  { id: 1, name: "Juan Pérez", subject: "Matemáticas", email: "juan@school.com" },
  { id: 2, name: "María López", subject: "Física", email: "maria@school.com" },
  { id: 3, name: "Carlos Sánchez", subject: "Química", email: "carlos@school.com" },
];

const Professor = () => {
  return (
    <div className="professor-container">
      <h1>Profesores</h1>
      <table className="professor-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Materia</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {professors.map((professor) => (
            <tr key={professor.id}>
              <td>{professor.id}</td>
              <td>{professor.name}</td>
              <td>{professor.subject}</td>
              <td>{professor.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Professor;
