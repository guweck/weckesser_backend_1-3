
# Ecommerce Weckesser (Entrega Final - Backend Coderhouse)

Proyecto desarrollado como entrega final del curso **Backend 2** de **Coderhouse**, implementando una arquitectura profesional de servidor con Express y MongoDB, incluyendo autenticación con JWT, políticas de autorización por roles, sistema de tickets de compra y manejo robusto de errores.

---

## 🚀 Funcionalidades Implementadas

### 📦 Productos (`/api/products`)
- Listado con paginación, filtros y orden (`GET /api/products`)
- Creación de productos (requiere rol `ADMIN`) (`POST /api/products`)
- Modificación de productos por ID (requiere rol `ADMIN`) (`PUT /api/products/:pid`)
- Eliminación de productos por ID (requiere rol `ADMIN`) (`DELETE /api/products/:pid`)
- Obtención de producto por ID (`GET /api/products/:pid`)
- Validación de campos con `express-validator`
- Manejo centralizado de errores

### 🛒 Carrito de Compras (`/api/carts`)
- Creación de un carrito nuevo (`POST /api/carts`)
- Agregar productos al carrito (`POST /api/carts/:cid/products/:pid`)
- Eliminar productos individuales (`DELETE /api/carts/:cid/products/:pid`)
- Vaciar carrito completo (`DELETE /api/carts/:cid`)
- Obtener carrito por ID (`GET /api/carts/:cid`)
- Reemplazo total de productos (`PUT /api/carts/:cid`)
- Actualización de cantidad de producto (`PUT /api/carts/:cid/products/:pid`)
- **Compra** (`POST /api/carts/:cid/purchase`):
  - Verificación de stock
  - Generación de ticket persistido con modelo `Ticket`
  - Separación de productos comprados y sin stock
  - Actualización del carrito post-compra

### 👤 Autenticación y Autorización (`/api/sessions`)
- Registro con `Passport` (`POST /api/sessions/register`)
- Login con generación de `JWT` y almacenamiento en `jwtCookieToken` (`POST /api/sessions/login`)
- Middleware de autorización por roles (`handlePolicies`)
- Protecciones por token en rutas sensibles (`passport.authenticate('jwt', ...)`)

### 💌 Mensajería
- Envío de emails con `Nodemailer` (`POST /api/email`)
- Envío de SMS con `Twilio` (`POST /api/sms`)

### 🛠️ Otros
- Motor de vistas con `Handlebars` y helpers personalizados
- WebSocket básico habilitado con `Socket.IO`
- Arquitectura profesional: separación por capas (`controllers`, `services`, `repositories`, `dtos`)
- Validaciones robustas con `express-validator`
- Middleware centralizado de errores (`error.middleware.js`)

---

## 🛠️ Tecnologías Utilizadas

- **Node.js**
- **Express**
- **MongoDB + Mongoose**
- **Handlebars**
- **Passport + JWT**
- **Nodemailer**
- **Twilio**
- **Socket.IO**
- **express-validator**
- **dotenv**
- **uuid**

---


## 📄 Archivo `.env` Requerido

Este archivo debe estar en la raíz del proyecto y **no está incluido en el repositorio por seguridad**. Contiene variables sensibles como la URL de la base de datos, credenciales de correo y Twilio.


### 📌 Para el Profesor:

> Por favor solicite el archivo `.env` al alumno **Gustavo Weckesser** por privado. Este archivo será compartido exclusivamente con fines de evaluación y no debe compartirse públicamente.

---

## 📫 Contacto

Desarrollado por Gustavo Weckesser  
**Licenciado en Química Farmacéutica | Estudiante de Desarrollo Full Stack**  
Email: guweck@gmail.com  
GitHub: [guweck](https://github.com/guweck)

---

## ✅ Estado del Proyecto

> Proyecto completado según las consignas de la **Entrega Final** del curso Backend 2 Coderhouse. Listo para revisión, validación y testeo con Postman.
