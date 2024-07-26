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
app.use(cors({
  origin: 'http://localhost:5173', // Reemplaza con el puerto de tu frontend local
  credentials: true // Permite credenciales en las solicitudes
}));
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
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = 'INSERT INTO Users (Username, Password, Email, DNI) VALUES (?, ?, ?, ?)';
    connection.query(
      insertQuery,
      [`${name} ${surname}`, hashedPassword, email, dni],
      (err, result) => {
        if (err) {
          switch (err.sqlState) {
            case '23000':
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
// Ruta para obtener los datos del usuario
app.get('/api/data/', (req, res) => {
  const query = 'SELECT * FROM Users WHERE ID = ?'; // Ajusta esta consulta según tus necesidades
  const userId = 1; // Aquí puedes usar el ID del usuario que deseas obtener, o ajustarlo según tu lógica

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error al obtener los datos del usuario:', err);
      return res.status(500).json({ message: 'Error interno al obtener los datos del usuario.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontró ningún usuario con ese ID.' });
    }

    const user = results[0];
    res.json({ user });
  });
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = 'SELECT * FROM Users WHERE Email = ?';
    connection.query(query, [email], async (err, results) => {
      if (err) {
        console.error('Error al buscar usuario:', err);
        return res.status(500).json({ message: 'Error interno al buscar usuario.' });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: 'No se encontró ningún usuario con ese correo electrónico.' });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.Password);
      if (!isMatch) {
        return res.status(400).json({ message: 'La contraseña es incorrecta.' });
      }

      const token = jwt.sign({ id: user.ID }, process.env.JWT_SECRET || 'tokenJWT');
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
    // Reemplazar con la forma en que se obtiene la clave API de forma segura (variables de entorno, etc.)
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;

    // Obtener la ciudad del request
    const city = req.query.city || 'Mendoza, Argentina';

    // Construir la URL de la API
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    // Realizar la solicitud a la API
    const response = await axios.get(url);

    // Validar la respuesta
    if (!response || !response.data || response.data.cod !== 200) {
      throw new Error('Error al obtener datos del clima');
    }

    // Formatear los datos del clima
    const climaData = {
      ciudad: response.data.name,
      temperatura: response.data.main.temp,
      condicion: response.data.weather[0].description,
      humedad: response.data.main.humidity,
      presion: response.data.main.pressure,
      viento: {
        velocidad: response.data.wind.speed,
        direccion: response.data.wind.deg
      },
      // ... (Agregar otros datos que te interesen)
    };

    // Enviar la respuesta JSON con los datos del clima
    res.json(climaData);
  } catch (error) {
    console.error('Error al obtener datos del clima:', error);
    res.status(500).json({ error: error.message || 'Error desconocido' });
  }
});


// Ruta para obtener notificaciones
app.get('/api/notificaciones', (req, res) => {
  // Lógica para obtener notificaciones
  res.json({ notificaciones: 'Notificaciones' });
});

// Iniciar el servidor en un puerto diferente para evitar conflictos
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));

