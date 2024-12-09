Aquí tienes el contenido formateado como archivo **README.md** listo para copiar y pegar:

```markdown
# **Online Grading System**

Este proyecto es un sistema de gestión de calificaciones diseñado para una unidad educativa. Permite a diferentes tipos de usuarios (administradores, profesores, estudiantes y padres) interactuar con la plataforma según sus roles.

---

## **Manual de Configuración e Inicialización del Proyecto**

### **Requisitos Previos**

Antes de comenzar, asegúrate de tener instaladas las siguientes herramientas:

1. **Node.js**  
   - Descárgalo desde [https://nodejs.org/](https://nodejs.org/).
   - Durante la instalación, selecciona la opción para añadir Node.js al PATH.
   - Verifica la instalación abriendo una terminal y ejecutando:
     ```bash
     node -v
     npm -v
     ```

2. **Git**  
   - Descárgalo desde [https://git-scm.com/](https://git-scm.com/).
   - Verifica la instalación con:
     ```bash
     git --version
     ```

3. **Editor de texto recomendado**  
   - Utiliza [Visual Studio Code](https://code.visualstudio.com/) para trabajar cómodamente con el proyecto.

---

## **Configuración del Proyecto**

### **1. Clonar el repositorio**

1. Abre una terminal (Git Bash, CMD o PowerShell).  
2. Clona el repositorio con el siguiente comando:
   ```bash
   git clone https://github.com/YeshuaChiliquingaAmaya/Online_Grading_System.git
   ```
3. Accede al directorio del proyecto:
   ```bash
   cd Online_Grading_System
   ```

---

### **2. Configuración del Backend**

El backend está construido con **Node.js** y utiliza **Express** para manejar peticiones HTTP y **MySQL** como base de datos.

1. **Navegar al directorio del backend**:
   ```bash
   cd backend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   - Crea un archivo `.env` en la carpeta `backend` con el siguiente contenido:
     ```
     DB_HOST=localhost
     DB_USER=tu_usuario
     DB_PASSWORD=tu_contraseña
     DB_NAME=nombre_de_la_base_de_datos
     DB_PORT=3306
     SECRET_KEY=tu_clave_secreta
     ```
   - Asegúrate de reemplazar `tu_usuario`, `tu_contraseña` y `nombre_de_la_base_de_datos` con los valores correspondientes de tu base de datos.

4. **Iniciar el servidor backend**:
   ```bash
   node index.js
   ```
   El backend debería ejecutarse en el puerto 5000. Si todo está correcto, deberías ver un mensaje como:
   ```
   Servidor corriendo en el puerto 5000
   Conectado a la base de datos MySQL
   ```

---

### **3. Configuración del Frontend**

El frontend está construido con **React** y utiliza **Vite** como herramienta de desarrollo.

1. **Navegar al directorio del frontend**:
   ```bash
   cd frontend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno (opcional)**:
   - Crea un archivo `.env` en la carpeta `frontend` con el siguiente contenido:
     ```
     VITE_API_URL=http://localhost:5000
     ```
   - Esto asegura que el frontend puede comunicarse con el backend localmente.

4. **Iniciar el servidor de desarrollo del frontend**:
   ```bash
   npm run dev
   ```
   Esto debería iniciar el servidor en el puerto 5173. Abre tu navegador y accede a la URL proporcionada en la terminal, como:  
   ```
   http://localhost:5173
   ```

---

## **Estructura del Proyecto**

```
Online_Grading_System/
│
├── backend/
│   ├── index.js              # Archivo principal del servidor backend
│   ├── package.json          # Configuración de dependencias del backend
│   ├── .env                  # Archivo para configurar las variables de entorno del backend
│   └── ...                   # Otros archivos relacionados al backend
│
├── frontend/
│   ├── src/                  # Código fuente del frontend
│   ├── package.json          # Configuración de dependencias del frontend
│   ├── vite.config.js        # Configuración de Vite
│   └── .env                  # Archivo para configurar las variables de entorno del frontend
│
└── README.md                 # Instrucciones del proyecto
```

---

## **Resumen de Comandos**

### **Para el Backend**:
```bash
# Navegar al directorio del backend
cd backend

# Instalar dependencias
npm install

# Iniciar el servidor backend
node index.js
```

### **Para el Frontend**:
```bash
# Navegar al directorio del frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo del frontend
npm run dev
```

---

## **Solución de Problemas Comunes**

### **Error: La base de datos no se conecta**
1. Asegúrate de que los valores en el archivo `.env` del backend sean correctos.
2. Verifica que el servidor de MySQL esté en funcionamiento.

### **Error: npm no está reconocido**
- Asegúrate de haber instalado Node.js correctamente y de que esté en el PATH del sistema.

### **Error: Puerto ocupado**
- Cambia el puerto en la configuración del backend o frontend. Por ejemplo, en el backend:
  - Edita el archivo `index.js` y cambia el puerto predeterminado (5000).

---

## **Contacto**

Si tienes preguntas o necesitas ayuda adicional, puedes contactarme en [yeshua@example.com](mailto:yeshua@example.com). 😊
```

Este archivo **README.md** está formateado correctamente y se puede usar directamente en tu repositorio. Proporciona una guía completa para que cualquier persona pueda clonar, configurar e iniciar tu proyecto. 🚀
