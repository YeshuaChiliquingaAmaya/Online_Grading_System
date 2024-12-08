import React, { useState, useEffect } from "react";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [editingGrade, setEditingGrade] = useState(null);
  const [newGrade, setNewGrade] = useState("");
  const [newComment, setNewComment] = useState("");

  // Obtener lista de estudiantes al cargar el componente
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:5000/students");
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        } else {
          console.error("Error al obtener estudiantes");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchStudents();
  }, []);

  // Manejar la edición de notas
  const handleEdit = async (gradeId) => {
    try {
      const response = await fetch(`http://localhost:5000/grades/${gradeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grade: newGrade,
          comment: newComment,
        }),
      });

      if (response.ok) {
        alert("Nota actualizada correctamente");
        setEditingGrade(null); // Salir del modo edición
        // Actualizar la lista de estudiantes
        const updatedStudents = students.map((student) =>
          student.gradeId === gradeId
            ? { ...student, grade: newGrade, comment: newComment }
            : student
        );
        setStudents(updatedStudents);
      } else {
        alert("Error al actualizar la nota");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Gestión de Estudiantes</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre del Estudiante</th>
            <th>Materia</th>
            <th>Nota</th>
            <th>Comentario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.gradeId}>
              <td>{student.studentName}</td>
              <td>{student.subjectName}</td>
              <td>
                {editingGrade === student.gradeId ? (
                  <input
                    type="number"
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    min="0"
                    max="100"
                  />
                ) : (
                  student.grade
                )}
              </td>
              <td>
                {editingGrade === student.gradeId ? (
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                ) : (
                  student.comment
                )}
              </td>
              <td>
                {editingGrade === student.gradeId ? (
                  <>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleEdit(student.gradeId)}
                    >
                      Guardar
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditingGrade(null)}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setEditingGrade(student.gradeId);
                      setNewGrade(student.grade);
                      setNewComment(student.comment);
                    }}
                  >
                    Editar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Students;
