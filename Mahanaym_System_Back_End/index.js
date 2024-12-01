require("dotenv").config(); // Cargar variables de entorno
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Middleware para manejar JSON y habilitar CORS
app.use(express.json());
app.use(cors());

// Conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

db.connect((err) => {
    if (err) {
        console.error("Error al conectar a la base de datos:", err.message);
        return;
    }
    console.log("Conectado a la base de datos MySQL");
});

// ENDPOINTS DEL BACKEND

// Obtener todos los estudiantes y sus calificaciones
app.get("/students", (req, res) => {
    const query = `
        SELECT 
            users.id AS studentId, 
            users.name AS studentName, 
            subjects.name AS subjectName, 
            grades.grade, 
            grades.id AS gradeId
        FROM grades
        JOIN users ON grades.student_id = users.id
        JOIN subjects ON grades.subject_id = subjects.id
        WHERE users.role_id = 3; -- Solo estudiantes
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener estudiantes:", err.message);
            return res.status(500).send("Error al obtener estudiantes");
        }
        res.json(results);
    });
});

// Actualizar una calificación
app.put("/grades/:gradeId", (req, res) => {
    const { grade } = req.body;
    const { gradeId } = req.params;

    const query = `UPDATE grades SET grade = ? WHERE id = ?`;
    db.query(query, [grade, gradeId], (err, results) => {
        if (err) {
            console.error("Error al actualizar calificación:", err.message);
            return res.status(500).send("Error al actualizar calificación");
        }
        res.json({ message: "Calificación actualizada exitosamente" });
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
