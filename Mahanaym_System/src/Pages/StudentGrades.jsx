import React, { useState, useEffect } from "react";

const StudentGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user")); // Obtener el usuario almacenado
        if (!user) {
          throw new Error("Usuario no encontrado");
        }

        const response = await fetch(
          `http://localhost:5000/students/grades?studentId=${user.id}`, // Enviar el ID del estudiante en la query
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setGrades(data);
        } else {
          console.error("Error al obtener las calificaciones");
        }
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);

  if (loading) {
    return <p>Cargando calificaciones...</p>;
  }

  return (
    <div>
      <h1>Mis Calificaciones</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Materia</th>
            <th>Tipo de Evaluación</th>
            <th>Nota</th>
            <th>Comentario</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade, index) => (
            <tr key={index}>
              <td>{grade.subjectName}</td>
              <td>{grade.evaluation_type}</td>
              <td>{grade.grade}</td>
              <td>{grade.comment}</td>
              <td>{new Date(grade.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentGrades;
