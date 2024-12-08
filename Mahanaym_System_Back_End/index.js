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

// Verificar conexión
db.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err.message);
    process.exit(1); // Salir si no hay conexión a la base de datos
  }
  console.log("Conectado a la base de datos MySQL");
});

// ENDPOINTS DEL BACKEND

// Endpoint de inicio de sesión
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = `
      SELECT users.id, users.name, users.email, users.role_id
      FROM users
      WHERE users.email = ? AND users.password = ?
  `;
  
  db.query(query, [email, password], (err, results) => {
      if (err) {
          console.error("Error al consultar el usuario:", err.message);
          return res.status(500).send("Error al autenticar usuario");
      }

      if (results.length === 0) {
          return res.status(401).send("Usuario o contraseña incorrectos");
      }

      const user = results[0];
      const roles = {
          1: "Administrator",
          2: "Teacher",
          3: "Student",
          4: "Parent",
      };

      const userRole = roles[user.role_id]; // Asignar rol basado en role_id
      console.log("Usuario encontrado:", user); // Log completo del usuario
      console.log("Rol asignado:", userRole); // Log del rol asignado

      res.json({
          user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: userRole, // Devolver el rol
          },
      });
  });
});

//ENDPOINTS PARA LOS ESTUDIANTES
app.get("/subjects/:subjectId/students", (req, res) => {
  const { subjectId } = req.params;

  const query = `
    SELECT 
      users.id AS studentId,
      users.name AS studentName,
      grades.grade,
      grades.comments,
      grades.evaluation_type,
      grades.created_at,
      subjects.name AS subjectName
    FROM grades
    JOIN users ON grades.student_id = users.id
    JOIN subjects ON grades.subject_id = subjects.id
    WHERE grades.subject_id = ? AND users.role_id = 3 -- Solo estudiantes
    ORDER BY users.name;
  `;

  db.query(query, [subjectId], (err, results) => {
    if (err) {
      console.error("Error al obtener estudiantes por materia:", err.message);
      return res.status(500).send("Error al obtener estudiantes por materia");
    }
    res.json(results);
  });
});

app.get("/subjects", (req, res) => {
  const query = `
    SELECT id AS subjectId, name AS subjectName FROM subjects ORDER BY name;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener materias:", err.message);
      return res.status(500).send("Error al obtener materias");
    }
    res.json(results);
  });
});


app.post("/grades", (req, res) => {
  const { studentId, subjectId, evaluationType, grade, comment } = req.body;

  if (!studentId || !subjectId || !evaluationType || !grade) {
    return res.status(400).send("Todos los campos son obligatorios");
  }

  // Mapeo de tipos de evaluación de inglés a español
  const evaluationTypeMap = {
    exam: "Examen",
    homework: "Tarea",
    project: "Proyecto",
  };

  const evaluationTypeSpanish = evaluationTypeMap[evaluationType] || evaluationType;

  const query = `
    INSERT INTO grades (student_id, subject_id, evaluation_type, grade, comments)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [studentId, subjectId, evaluationTypeSpanish, grade, comment || ""],
    (err, results) => {
      if (err) {
        console.error("Error al registrar la nota:", err.message);
        return res.status(500).send("Error al registrar la nota");
      }
      res.status(201).send("Nota registrada con éxito");
    }
  );
});

app.get("/grades", (req, res) => {
  const query = `
    SELECT 
      grades.id, 
      grades.grade, 
      grades.comment, 
      grades.evaluation_type, 
      users.name AS studentName, 
      subjects.name AS subjectName
    FROM grades
    JOIN users ON grades.student_id = users.id
    JOIN subjects ON grades.subject_id = subjects.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener notas:", err.message);
      return res.status(500).send("Error al obtener notas");
    }

    // Convertir tipos de evaluación de inglés a español
    const evaluationTypeMap = {
      exam: "Examen",
      homework: "Tarea",
      project: "Proyecto",
    };

    const processedResults = results.map((row) => ({
      ...row,
      evaluation_type: evaluationTypeMap[row.evaluation_type] || row.evaluation_type,
    }));

    res.json(processedResults);
  });
});

app.get("/students/:studentId/subjects", (req, res) => {
  const { studentId } = req.params;

  const query = `
    SELECT 
      subjects.id AS subjectId, 
      subjects.name AS subjectName
    FROM grades
    JOIN subjects ON grades.subject_id = subjects.id
    WHERE grades.student_id = ?;
  `;

  db.query(query, [studentId], (err, results) => {
    if (err) {
      console.error("Error al obtener materias del estudiante:", err.message);
      return res.status(500).send("Error al obtener materias");
    }
    res.json(results);
  });
});

app.get("/students", (req, res) => {
  const query = `
    SELECT 
      users.id AS studentId, 
      users.name AS studentName, 
      grades.id AS gradeId, 
      grades.grade, 
      subjects.name AS subjectName
    FROM users
    JOIN grades ON users.id = grades.student_id
    JOIN subjects ON grades.subject_id = subjects.id
    WHERE users.role_id = 3; -- 3 corresponde a "Student"
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener estudiantes:", err.message);
      return res.status(500).send("Error al obtener estudiantes");
    }
    res.json(results);
  });
});

app.get("/students/grades", (req, res) => {
  const studentId = req.query.studentId; // Obtener el ID del estudiante de la query

  if (!studentId) {
    return res.status(400).send("ID de estudiante requerido");
  }

  const query = `
    SELECT 
      subjects.name AS subjectName,
      grades.evaluation_type,
      grades.grade,
      grades.comments,
      grades.created_at
    FROM grades
    JOIN subjects ON grades.subject_id = subjects.id
    WHERE grades.student_id = ?;
  `;

  db.query(query, [studentId], (err, results) => {
    if (err) {
      console.error("Error al obtener calificaciones:", err.message);
      return res.status(500).send("Error al obtener calificaciones");
    }
    res.json(results);
  });
});

//ENDPOINTS PARA EL APARTADO DE PADRES
app.get("/parents/students", (req, res) => {
  const parentId = req.query.parentId; // Obtener el ID del padre desde la query

  if (!parentId) {
    return res.status(400).send("ID de padre requerido");
  }

  // Consulta para obtener los hijos del padre
  const query = `
    SELECT 
      users.id AS studentId,
      users.name AS studentName
    FROM parents_students
    JOIN users ON parents_students.student_id = users.id
    WHERE parents_students.parent_id = ?;
  `;

  db.query(query, [parentId], (err, results) => {
    if (err) {
      console.error("Error al obtener los estudiantes del padre:", err.message);
      return res.status(500).send("Error al obtener estudiantes");
    }
    res.json(results);  // Enviar los resultados de los estudiantes al frontend
  });
});

app.get("/parents/grades", (req, res) => {
  const studentId = req.query.studentId; // Obtener el ID del estudiante desde la query

  if (!studentId) {
    return res.status(400).send("ID de estudiante requerido");
  }

  // Consulta para obtener las calificaciones del estudiante
  const query = `
    SELECT 
      subjects.name AS subjectName,
      grades.evaluation_type,
      grades.grade,
      grades.comments,
      grades.created_at
    FROM grades
    JOIN subjects ON grades.subject_id = subjects.id
    WHERE grades.student_id = ?;
  `;

  db.query(query, [studentId], (err, results) => {
    if (err) {
      console.error("Error al obtener las calificaciones del estudiante:", err.message);
      return res.status(500).send("Error al obtener las calificaciones");
    }
    res.json(results);
  });
});

app.get("/parents/students", (req, res) => {
  const parentId = req.query.parentId; // Obtener el ID del padre desde la query
  
  if (!parentId) {
    return res.status(400).send("ID de padre requerido");
  }

  // Consulta para obtener los hijos del padre
  const query = `
    SELECT 
      users.id AS studentId,
      users.name AS studentName
    FROM parents_students
    JOIN users ON parents_students.student_id = users.id
    WHERE parents_students.parent_id = ?;
  `;

  db.query(query, [parentId], (err, results) => {
    if (err) {
      console.error("Error al obtener los estudiantes del padre:", err.message);
      return res.status(500).send("Error al obtener estudiantes");
    }

    if (results.length === 0) {
      return res.status(404).send("No se encontraron hijos para este padre");
    }

    res.json(results);  // Enviar los resultados de los estudiantes al frontend
  });
});

//ADMINISTRADOR
app.get("/admin/users", (req, res) => {
  const query = `
    SELECT id, name, email, role_id, created_at FROM users;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener usuarios:", err.message);
      return res.status(500).send("Error al obtener usuarios");
    }
    res.json(results);
  });
});

app.post("/admin/users", (req, res) => {
  const { name, email, password, role_id } = req.body;

  const query = `
    INSERT INTO users (name, email, password, role_id)
    VALUES (?, ?, ?, ?);
  `;

  db.query(query, [name, email, password, role_id], (err, result) => {
    if (err) {
      console.error("Error al agregar usuario:", err.message);
      return res.status(500).send("Error al agregar usuario");
    }
    res.status(201).send("Usuario agregado correctamente");
  });
});

app.put("/admin/users/:id", (req, res) => {
  const { name, email, password, role_id } = req.body;
  const userId = req.params.id;

  const query = `
    UPDATE users
    SET name = ?, email = ?, password = ?, role_id = ?
    WHERE id = ?;
  `;

  db.query(query, [name, email, password, role_id, userId], (err, result) => {
    if (err) {
      console.error("Error al actualizar usuario:", err.message);
      return res.status(500).send("Error al actualizar usuario");
    }
    res.send("Usuario actualizado correctamente");
  });
});

app.delete("/admin/users/:id", (req, res) => {
  const userId = req.params.id;

  const query = `
    DELETE FROM users WHERE id = ?;
  `;

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error al eliminar usuario:", err.message);
      return res.status(500).send("Error al eliminar usuario");
    }
    res.send("Usuario eliminado correctamente");
  });
});

app.get("/admin/parents", (req, res) => {
  const query = `
    SELECT id, name, email FROM users WHERE role_id = 4;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener padres:", err.message);
      return res.status(500).send("Error al obtener padres");
    }
    res.json(results);  // Enviar los resultados al frontend
  });
});

app.get("/admin/students", (req, res) => {
  const query = `
    SELECT id, name, email FROM users WHERE role_id = 3;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener estudiantes:", err.message);
      return res.status(500).send("Error al obtener estudiantes");
    }
    res.json(results);  // Enviar los resultados al frontend
  });
});

app.post("/admin/parents/students", (req, res) => {
  const { parentId, studentIds } = req.body;

  if (!parentId || studentIds.length === 0) {
    return res.status(400).send("Debe seleccionar un padre y al menos un estudiante.");
  }

  const query = `
    INSERT INTO parents_students (parent_id, student_id) VALUES ?
  `;

  const values = studentIds.map(studentId => [parentId, studentId]);

  db.query(query, [values], (err, result) => {
    if (err) {
      console.error("Error al agregar relación padre-estudiante:", err.message);
      return res.status(500).send("Error al agregar relación padre-estudiante");
    }
    res.status(201).send("Relación padre-estudiante agregada correctamente");
  });
});




// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
