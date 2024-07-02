import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2'; 
import dotenv from 'dotenv'; // Importamos dotenv para cargar variables de entorno
import axios from 'axios'; // Importamos axios para realizar peticiones HTTP

dotenv.config(); // Cargamos las variables de entorno

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de la conexión a la base de datos MySQL con mysql2
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost', // Host de tu servidor MySQL
  user: process.env.DB_USER || 'root', // Usuario de la base de datos
  password: process.env.DB_PASSWORD || 'root', // Contraseña de la base de datos
  database: process.env.DB_NAME || 'ovi_users', // Nombre de tu base de datos
  port: process.env.DB_PORT || 3306,
  // Añadimos la opción para soportar autenticación con el método 'mysql_native_password'
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from(process.env.DB_PASSWORD + '\0')
  }
});

// Conectar a la base de datos con mysql2
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    throw err;
  }
  console.log('Conexión a la base de datos MySQL establecida.');
});

// Ruta para el registro de usuarios
app.post('/register', async (req, res) => {
  const { name, surname, dni, email, password } = req.body;

  try {
    // Validar datos de entrada (opcional)
    // ... Validaciones para email, password, etc.

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos
    const insertQuery = 'INSERT INTO Users (Username, Password, Email, DNI) VALUES (?, ?, ?, ?)';
    connection.query(
      insertQuery,
      [`${name} ${surname}`, hashedPassword, email, dni],
      (err, result) => {
        if (err) {
          // Manejo de errores específicos de la base de datos
          switch (err.sqlState) {
            case '23000': // Error de clave duplicada (email ya existe)
              res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
              break;
            default:
              console.error('Error al registrar usuario:', err);
              res.status(500).json({ message: 'Error interno al registrar usuario.' });
          }
        } else {
          console.log('Usuario registrado correctamente.');
          res.status(201).json({ message: 'Usuario registrado correctamente.' });
        }
      }
    );
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error interno al registrar usuario.' });
  }
});


// Ruta para el login de usuarios
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validar datos de entrada (opcional)
    // ... Validaciones para email, password, etc.

    // Buscar al usuario en la base de datos
    const query = 'SELECT * FROM Users WHERE Email = ?';
    connection.query(query, [email], async (err, results) => {
      if (err) {
        console.error('Error al buscar usuario:', err);
        return res.status(500).json({ message: 'Error interno al buscar usuario.' });
      }

      if (results.length === 0) {
        return res.status(400).send('No se encontró ningún usuario con ese correo electrónico.');
      }

      const user = results[0];

      // Verificar la contraseña
      const isMatch = await bcrypt.compare(password, user.Password);
      if (!isMatch) {
        return res.status(400).send('La contraseña es incorrecta.');
      }

      // Generar un token JWT
      const token = jwt.sign({ id: user.ID }, process.env.JWT_SECRET || 'tokenJWT');

// Enviar el token al cliente
res.json({ token });
    });
  } catch (error) {
    console.error('Error al verificar la contraseña:', error);
    res.status(500).json({ message: 'Error interno al verificar la contraseña.' });
  }
});

// Ruta para obtener los datos del clima desde OpenWeatherMap
app.get('/api/clima', async (req, res) => {
  try {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY || '59cba2883985703ac6a7eadc32602ab5'; // Reemplaza con tu clave API de OpenWeatherMap
    const city = req.query.city || 'Mendoza'; // Reemplaza con la ciudad de la que deseas obtener el clima

    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);

    // Formatea los datos que necesitas
    const climaData = {
      temperatura: response.data.main.temp,
      condicion: response.data.weather[0].description,
    };

    res.json(climaData);
  } catch (error) {
    console.error('Error al obtener los datos del clima:', error);
    res.status(500).json({ error: 'Error al obtener los datos del clima' });
  }
});

// Iniciar el servidor en un puerto diferente para evitar conflictos
const port = process.env.PORT || 5173;
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));
