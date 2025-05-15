const mysql = require('mysql2');
const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, // ← aquí usamos el puerto del .env
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

conn.connect((err) => {
  if (err) throw err;
  console.log('Conectado a MySQL');
});

module.exports = conn;