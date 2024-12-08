import React, { useState, useEffect } from "react";

const ParentGrades = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          throw new Error("Usuario no encontrado");
        }

        const response = await fetch(
          `http://localhost:5000/parents/students?parentId=${user.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setChildren(data);
        } else {
          console.error("Error al obtener los hijos");
        }
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, []);

  // Obtener las calificaciones del hijo seleccionado
  const fetchGrades = async (studentId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/parents/grades?studentId=${studentId}`,
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
      console.error("Error:", error);
    }
  };

  const handleChildSelect = (e) => {
    const studentId = e.target.value;
    setSelectedChild(studentId);
    if (studentId) {
      fetchGrades(studentId);
    } else {
      setGrades([]);
    }
  };

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div>
      <h1>Mis Hijos y Sus Calificaciones</h1>

      <div className="form-group">
        <label htmlFor="childSelect">Seleccionar Hijo</label>
        <select
          className="form-control"
          id="childSelect"
          value={selectedChild}
          onChange={handleChildSelect}
        >
          <option value="">Seleccione un hijo</option>
          {children.map((child) => (
            <option key={child.studentId} value={child.studentId}>
              {child.studentName}
            </option>
          ))}
        </select>
      </div>

      {grades.length > 0 && (
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
      )}
    </div>
  );
};

export default ParentGrades;
