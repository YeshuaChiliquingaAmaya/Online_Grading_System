import React, { useState, useEffect } from "react";

const Students = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState([]);
  const [editingGradeId, setEditingGradeId] = useState(null); // ID de la nota en edición
  const [newGrade, setNewGrade] = useState("");
  const [newComment, setNewComment] = useState("");

  // Obtener materias al cargar el componente
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch("http://localhost:5000/subjects");
        if (response.ok) {
          const data = await response.json();
          setSubjects(data);
        } else {
          console.error("Error al obtener materias");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchSubjects();
  }, []);

  // Obtener estudiantes por materia
  const fetchStudents = async (subjectId) => {
    try {
      const response = await fetch(`http://localhost:5000/subjects/${subjectId}/students`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        console.error("Error al obtener estudiantes por materia");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Manejar la selección de una materia
  const handleSubjectSelect = (e) => {
    const subjectId = e.target.value;
    setSelectedSubject(subjectId);
    if (subjectId) {
      fetchStudents(subjectId);
    } else {
      setStudents([]);
    }
  };

  // Manejar la edición de notas
  const handleEdit = (gradeId, currentGrade, currentComment) => {
    setEditingGradeId(gradeId); // Establecer el ID de la nota en edición
    setNewGrade(currentGrade);
    setNewComment(currentComment);
  };

  // Guardar los cambios de edición
  const handleSave = async (gradeId) => {
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
        setEditingGradeId(null); // Salir del modo edición
        fetchStudents(selectedSubject); // Recargar estudiantes
      } else {
        alert("Error al actualizar la nota");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Cancelar la edición
  const handleCancel = () => {
    setEditingGradeId(null);
    setNewGrade("");
    setNewComment("");
  };

  return (
    <div>
      <h1>Gestión de Estudiantes</h1>

      {/* Formulario para seleccionar materia */}
      <div className="form-group">
        <label htmlFor="subjectSelect">Seleccionar Materia</label>
        <select
          className="form-control"
          id="subjectSelect"
          value={selectedSubject}
          onChange={handleSubjectSelect}
        >
          <option value="">Seleccione una materia</option>
          {subjects.map((subject) => (
            <option key={subject.subjectId} value={subject.subjectId}>
              {subject.subjectName}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de estudiantes */}
      {students.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Nombre del Estudiante</th>
              <th>Nota</th>
              <th>Tipo de Evaluación</th>
              <th>Comentario</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.gradeId}>
                <td>{student.studentName}</td>
                <td>
                  {editingGradeId === student.gradeId ? (
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
                <td>{student.evaluation_type}</td>
                <td>
                  {editingGradeId === student.gradeId ? (
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                  ) : (
                    student.comment
                  )}
                </td>
                <td>{new Date(student.created_at).toLocaleDateString()}</td>
                <td>
                  {editingGradeId === student.gradeId ? (
                    <>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleSave(student.gradeId)}
                      >
                        Guardar
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={handleCancel}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        handleEdit(student.gradeId, student.grade, student.comment)
                      }
                    >
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Students;
