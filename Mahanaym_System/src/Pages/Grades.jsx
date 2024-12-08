import React, { useState, useEffect } from "react";

const Grades = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [evaluationType, setEvaluationType] = useState("");
  const [grade, setGrade] = useState("");
  const [comment, setComment] = useState("");

  // Cargar estudiantes al iniciar el componente
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:5000/students");
        if (response.ok) {
          const data = await response.json();
          // Filtrar duplicados basándonos en el ID del estudiante
          const uniqueStudents = Array.from(
            new Map(data.map((item) => [item.studentId, item])).values()
          );
          setStudents(uniqueStudents);
        } else {
          console.error("Error al obtener estudiantes");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchStudents();
  }, []);

  // Cargar materias del estudiante seleccionado
  useEffect(() => {
    if (selectedStudent) {
      const fetchSubjects = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/students/${selectedStudent}/subjects`
          );
          if (response.ok) {
            const data = await response.json();
            setSubjects(data);
          } else {
            console.error("Error al obtener materias del estudiante");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };
      fetchSubjects();
    } else {
      setSubjects([]); // Resetear materias si no hay estudiante seleccionado
    }
  }, [selectedStudent]);

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/grades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: selectedStudent,
          subjectId: selectedSubject,
          evaluationType,
          grade,
          comment,
        }),
      });

      if (response.ok) {
        alert("Nota registrada con éxito");
        setSelectedStudent("");
        setSelectedSubject("");
        setEvaluationType("");
        setGrade("");
        setComment("");
      } else {
        alert("Error al registrar la nota");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Gestión de Notas</h1>
      <form onSubmit={handleSubmit}>
        {/* Seleccionar estudiante */}
        <div className="form-group">
          <label htmlFor="studentId">Seleccionar Estudiante</label>
          <select
            className="form-control"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            required
          >
            <option value="">Seleccione un estudiante</option>
            {students.map((student) => (
              <option key={student.studentId} value={student.studentId}>
                {student.studentName}
              </option>
            ))}
          </select>
        </div>

        {/* Seleccionar materia (solo si hay estudiante seleccionado) */}
        {selectedStudent && (
          <div className="form-group">
            <label htmlFor="subjectId">Seleccionar Materia</label>
            <select
              className="form-control"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              required
            >
              <option value="">Seleccione una materia</option>
              {subjects.map((subject) => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.subjectName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Seleccionar tipo de evaluación */}
        <div className="form-group">
          <label htmlFor="evaluationType">Tipo de Evaluación</label>
          <select
            className="form-control"
            value={evaluationType}
            onChange={(e) => setEvaluationType(e.target.value)}
            required
          >
            <option value="">Seleccione</option>
            <option value="exam">Examen</option>
            <option value="homework">Tarea</option>
            <option value="project">Proyecto</option>
          </select>
        </div>

        {/* Introducir la nota */}
        <div className="form-group">
          <label htmlFor="grade">Nota</label>
          <input
            type="number"
            className="form-control"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
            min="0"
            max="100"
          />
        </div>

        {/* Comentario opcional */}
        <div className="form-group">
          <label htmlFor="comment">Comentario</label>
          <textarea
            className="form-control"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* Botón de enviar */}
        <button type="submit" className="btn btn-primary">
          Registrar Nota
        </button>
      </form>
    </div>
  );
};

export default Grades;
