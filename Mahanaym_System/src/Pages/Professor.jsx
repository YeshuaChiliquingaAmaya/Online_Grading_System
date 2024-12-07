import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Professor.css";

const Professor = () => {
    const [students, setStudents] = useState([]);
    const [editingGrade, setEditingGrade] = useState(null);
    const [newGrade, setNewGrade] = useState("");

    // Obtener estudiantes y sus calificaciones desde el backend
    useEffect(() => {
        axios.get("http://localhost:5000/students")
            .then(response => setStudents(response.data))
            .catch(error => console.error("Error al obtener estudiantes:", error));
    }, []);

    // Manejar la edición de calificaciones
    const handleEditGrade = (gradeId) => {
        setEditingGrade(gradeId);
    };

    // Guardar la nueva calificación
    const handleSaveGrade = (gradeId) => {
        axios.put(`http://localhost:5000/grades/${gradeId}`, { grade: newGrade })
            .then(() => {
                setStudents(students.map(student => 
                    student.gradeId === gradeId ? { ...student, grade: newGrade } : student
                ));
                setEditingGrade(null);
                setNewGrade("");
            })
            .catch(error => console.error("Error al actualizar calificación:", error));
    };

    return (
        <div className="professor-container">
            <h1>Estudiantes y Calificaciones</h1>
            <table className="professor-table">
                <thead>
                    <tr>
                        <th>ID Estudiante</th>
                        <th>Nombre</th>
                        <th>Materia</th>
                        <th>Calificación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.gradeId}>
                            <td>{student.studentId}</td>
                            <td>{student.studentName}</td>
                            <td>{student.subjectName}</td>
                            <td>
                                {editingGrade === student.gradeId ? (
                                    <input
                                        type="number"
                                        value={newGrade}
                                        onChange={(e) => setNewGrade(e.target.value)}
                                    />
                                ) : (
                                    student.grade
                                )}
                            </td>
                            <td>
                                {editingGrade === student.gradeId ? (
                                    <button onClick={() => handleSaveGrade(student.gradeId)}>Guardar</button>
                                ) : (
                                    <button onClick={() => handleEditGrade(student.gradeId)}>Editar</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Professor;
