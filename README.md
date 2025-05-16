# CRUD de Productos con Node.js, MySQL y AWS S3

Este proyecto es una aplicación web completa que permite realizar un CRUD de productos, almacenar sus imágenes en AWS S3, y mantener la base de datos desacoplada del bucket, facilitando futuros cambios de almacenamiento.

---

## Tecnologías utilizadas

* **Node.js** + **Express**
* **MySQL**
* **EJS** para vistas HTML
* **AWS S3** para almacenamiento de imágenes
* **Multer** para manejo de archivos
* **dotenv** para configuraciones

---

## Estructura del proyecto

```
productos-app/
├── backend/
│   ├── app.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── productoController.js
│   ├── models/
│   │   └── productoModel.js
│   ├── routes/
│   │   └── productoRoutes.js
│   └── services/
│       └── s3Service.js
├── public/
│   ├── css/estilos.css
│   └── js/scripts.js
├── views/
│   ├── layout.ejs
│   ├── index.ejs
│   └── editar.ejs
├── .env
├── Dockerfile
├── docker-compose.yml
├── package.json
├── README-DEPLOY.md
├── README-ERRORES.md
```

---

## Variables de entorno (`.env`)

```env
PORT=3000
DB_HOST=db
DB_PORT=3306
DB_USER=root
DB_PASSWORD=123456
DB_NAME=productos_db

AWS_ACCESS_KEY_ID=xxxxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxx
AWS_REGION=us-east-2
AWS_BUCKET_NAME=lab09mallcco
```

---

## Base de datos MySQL

```sql
CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  imagen_key TEXT,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Lógica de almacenamiento

* Las imágenes se suben a S3 bajo la carpeta `productos/` con un nombre basado en timestamp.
* Ejemplo de `imagen_key` almacenada:

  ```
  productos/1747277755557-Coca cola.png
  ```
* No se almacena la URL completa en la base de datos.

La URL final para mostrar la imagen se construye así:

```js
`https://${bucket}.s3.${region}.amazonaws.com/${imagen_key}`
```

Esto permite cambiar de bucket o región sin afectar la base de datos.

---

## Vistas EJS

* `index.ejs` muestra la lista de productos y un formulario para agregar
* `editar.ejs` permite actualizar un producto existente

Ambas vistas usan `imagen_key` para construir el `src` de la imagen.

---

## Buenas prácticas aplicadas

* Las rutas S3 se almacenan como claves relativas (`imagen_key`) y **no** como URLs absolutas
* Estructura modular en carpetas (`controllers`, `models`, `routes`, `services`)
* Uso de variables de entorno para cambiar bucket o región sin alterar el código fuente
* Listo para futuras mejoras como: backup entre buckets, soporte multi-categoría, subidas privadas, etc.

---

## Ejemplo de datos en base de datos

```sql
SELECT * FROM productos;

# id | nombre     | descripcion      | precio | imagen_key                                | creado_en
---- | ---------- | ---------------- | ------ | ----------------------------------------- | ---------------------
1   | Pepsi      | gaseosa lata     | 3.00   | productos/1747277773406-pepsi.jpg         | 2025-05-13 12:00:34
2   | Coca Cola  | gaseosa lata roja| 6.00   | productos/1747277755557-Coca cola.png     | 2025-05-14 21:55:56
```

---

## Ejecución local

```bash
node backend/app.js
```

Luego abre tu navegador en:

```
http://localhost:3000
```

---

## Despliegue en producción

Ver el archivo [`README-DEPLOY.md`](./README-DEPLOY.md) para una guía completa sobre cómo desplegar el proyecto en AWS EC2 usando Docker y Docker Compose.

---

## Registro de errores y soluciones

Consulta [`README-ERRORES.md`](./README-ERRORES.md) para revisar casos reales de fallos durante el despliegue, incluyendo errores comunes de Docker y base de datos.

---

## Estado final: ✅ FUNCIONAL

Proyecto desplegado y operativo tanto en entorno local como en servidor EC2.
