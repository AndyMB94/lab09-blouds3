# Despliegue de CRUD de Productos en AWS EC2 con Docker

Este documento explica paso a paso cómo desplegar el proyecto **CRUD de Productos con Node.js, MySQL y AWS S3** en una instancia EC2 de Amazon Web Services usando Docker y Docker Compose.

---

## ✅ Requisitos previos

* Cuenta en AWS
* Llave PEM de acceso para EC2
* Instancia EC2 con:

  * Ubuntu Server 20.04+ (recomendado)
  * Puerto **3000** abierto en el grupo de seguridad (para acceso web)
  * Puerto **22** abierto (para SSH)
* Git instalado en EC2

---

## 🤖 Paso 1: Conectar a EC2

```bash
ssh -i "tu-clave.pem" ubuntu@<IP-de-tu-instancia>
```

---

## 📦 Paso 2: Instalar Docker y Docker Compose

```bash
# Docker
sudo apt update
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker

# Docker Compose
sudo apt install -y docker-compose
```

---

## 🐶 Paso 3: Clonar el repositorio

```bash
git clone https://github.com/AndyMB94/lab09-blouds3.git
cd lab09-blouds3
```

---

## 🔐 Paso 4: Crear el archivo `.env`

> Este archivo NO está en el repositorio por seguridad. Debes crearlo manualmente.

```bash
nano .env
```

Contenido del `.env` (usa tus propias claves):

```env
AWS_ACCESS_KEY_ID=AKIAxxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_REGION=us-east-2
AWS_BUCKET_NAME=lab09mallcco
```

Guarda con `CTRL + O`, Enter y `CTRL + X` para salir.

---

## 🚀 Paso 5: Ejecutar con Docker Compose

```bash
sudo docker-compose up -d
```

Esto:

* Construye tu app Node.js
* Levanta un contenedor con MySQL
* Inicia la aplicación en el puerto `3000`

---

## 📅 Paso 6: Acceder a la aplicación

Abre tu navegador y visita:

```
http://<IP-de-tu-EC2>:3000
```

Ejemplo:

```
http://54.183.123.45:3000
```

---

## ⚠️ Seguridad recomendada

* Asegúrate de que solo el puerto 3000 y 22 estén abiertos
* Opcional: instala Nginx como proxy para agregar HTTPS
* Nunca publiques tu `.env` con claves en GitHub

---

## 🎉 Proyecto funcional

* Puedes ver, crear, editar y eliminar productos
* Las imágenes se suben a AWS S3 usando `imagen_key`
* El backend y MySQL corren en contenedores Docker independientes

---

## 🌐 Acciones futuras

* Hacer backup entre buckets S3
* Agregar usuarios o roles
* Añadir HTTPS
* Subir el frontend separado si se desea

---

Desarrollado por **Andy Mallcco (@AndyMB94)**
