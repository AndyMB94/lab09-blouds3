# Registro de errores comunes y soluciones - CRUD Productos con Node.js, MySQL y AWS S3

Este documento documenta errores reales encontrados durante el desarrollo y despliegue del proyecto, así como sus causas y soluciones.

---

## ❌ Error 1: `Cannot find module '/app/app.js'`

### 🔍 Causa:

El contenedor Docker intentaba ejecutar `app.js` en la raíz del contenedor (`/app/app.js`), pero el archivo estaba ubicado en `backend/app.js`.

### ✅ Soluciones:

**Opción 1 (recomendada):** Mover `app.js` a la raíz del proyecto y ajustar el `Dockerfile`:

```Dockerfile
CMD ["node", "app.js"]
```

**Opción 2:** Conservar la estructura original y modificar el `Dockerfile`:

```Dockerfile
CMD ["node", "backend/app.js"]
```

---

## ❌ Error 2: `Table 'productos_db.productos' doesn't exist`

### 🔍 Causa:

Aunque MySQL estaba corriendo, la tabla `productos` aún no existía dentro de la base de datos `productos_db`.

### ✅ Solución:

Ingresar al contenedor de MySQL y crear la tabla manualmente:

```bash
sudo docker exec -it mysql-productos mysql -u root -p
# Contraseña: 123456
```

Luego:

```sql
USE productos_db;
CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  imagen_key TEXT,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
EXIT;
```

Reiniciar la app:

```bash
sudo docker-compose restart app
```

---

## ❌ Error 3: Página no carga (`ERR_CONNECTION_REFUSED`)

### 🔍 Causa:

* El contenedor de la app no estaba corriendo.
* O el contenedor no estaba escuchando en el puerto correcto (`3000`).

### ✅ Solución:

1. Asegurar que `app.js` contenga:

```js
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
```

2. Asegurarse de que Docker expone ese puerto:

```Dockerfile
EXPOSE 3000
```

3. Y que `docker-compose.yml` lo redirige correctamente:

```yaml
ports:
  - "3000:3000"
```

---

## ✅ Lecciones aprendidas

* Siempre verifica rutas relativas al usar `COPY` en Docker
* Docker no inicializa base de datos, se necesita `init.sql` o comandos manuales
* Reiniciar una instancia EC2 no reinicia contenedores si no tienen `restart: always`
* IP pública cambia en EC2 al reiniciar: actualizarla en el navegador

---

Este documento resume errores y soluciones reales del despliegue y será útil para futuras referencias y mejoras en producción.
