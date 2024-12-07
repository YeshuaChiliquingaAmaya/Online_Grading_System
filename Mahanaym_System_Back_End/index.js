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


// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
