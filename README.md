# Full-Stack Real Estate Web Platform (React + FastAPI + PostgreSQL)

> **Note from Cascade (AI Assistant, 2025-05-20):**
>
> This project is architected as a full-stack, production-ready web application suitable for a medium to large real estate business with complex requirements. It features a modern React frontend, a Python FastAPI backend, PostgreSQL database (NeonDB), Prisma ORM, JWT-based authentication, image management via Cloudinary, Docker/Supervisor for deployment, and a modular, scalable codebase. This architecture supports robust multi-user admin, advanced content management, and future scalability (e.g., virtual tours, map search, integrations).
>
> **Complexity Notice:**
> - The stack is intentionally over-engineered for high scalability, maintainability, and security, making it ideal for teams, high-traffic environments, or businesses expecting growth and custom features.
> - For small real estate agencies (e.g., managing 10 properties and 5 blog posts), this setup is likely excessive. A simpler solution (e.g., static site, headless CMS, or a single Next.js app) would be easier to maintain and deploy.
> - This README and codebase are being archived as a reference for advanced, enterprise-grade real estate platforms. For lightweight needs, consider a simplified stack.
>
> ---

## Objetivo del Proyecto

Este proyecto consiste en un sitio web completo para una empresa inmobiliaria en Zaragoza, que permite la gestión y visualización de propiedades inmobiliarias, así como un blog de contenido relacionado con el sector. El sitio cuenta con una parte pública para los visitantes y un panel de administración para la gestión de contenidos.

## Descripción General

El sitio web inmobiliario está diseñado para ofrecer una experiencia completa tanto a potenciales clientes como a los administradores del negocio. Presenta propiedades inmobiliarias con detalle, ofrece contenido de valor a través del blog y facilita el contacto con la agencia.

### Características Principales:

- Catálogo de propiedades con filtros de búsqueda
- Páginas detalladas de cada propiedad con galería de imágenes
- Blog con categorías y artículos relacionados con el sector inmobiliario
- Panel de administración completo para gestionar:
  - Propiedades (crear, editar, eliminar)
  - Blog (crear, editar, eliminar artículos y categorías)
  - Usuarios (gestión de administradores y agentes)
- Certificación energética para cada propiedad
- Diseño responsive para todo tipo de dispositivos
- Paleta de colores corporativa: #252359, #2D3773, #7A8CBF, #8095BF, #0D0D0D

## Tecnologías Utilizadas

### Frontend:
- **React 18**: Biblioteca JavaScript para construir la interfaz de usuario
- **React Router 6**: Gestión de rutas en la aplicación
- **Tailwind CSS 3**: Framework CSS para el diseño y estilizado
- **Fetch API**: Para realizar peticiones al backend
- **LocalStorage**: Para almacenamiento de tokens de autenticación
- **Yarn**: Gestor de paquetes para dependencias JavaScript

### Backend:
- **FastAPI**: Framework Python para crear APIs RESTful
- **Prisma ORM**: ORM para Python que facilita la interacción con la base de datos
- **PostgreSQL**: Sistema de gestión de base de datos (alojado en Neon Cloud)
- **Python 3.11+**: Lenguaje de programación del backend
- **JWT (jose)**: Autenticación basada en tokens para el panel de administración
- **Cloudinary**: Servicio para almacenamiento y gestión de imágenes
- **Bcrypt**: Para encriptación de contraseñas

### Despliegue y Herramientas:
- **Docker**: Contenedorización para desarrollo y despliegue
- **Supervisor**: Gestión de procesos para mantener los servicios en ejecución
- **Uvicorn**: Servidor ASGI para ejecutar la aplicación FastAPI
- **Nginx**: Servidor web para servir la aplicación en producción (opcional)

## Estructura del Proyecto

### Frontend (/app/frontend)
- **src/**: Código fuente de React
  - **components/**: Componentes reutilizables
  - **pages/**: Páginas principales y del admin
  - **utils/**: Utilidades, incluida la API
  - **App.js**: Componente principal y definición de rutas
- **public/**: Activos estáticos

### Backend (/app/backend)
- **server.py**: Aplicación principal FastAPI
- **prisma/**: Configuración y modelos de Prisma
  - **schema.prisma**: Definición del esquema de la base de datos
- **seed.py**: Script para crear datos iniciales

## Estructura de la Base de Datos

### Tablas Principales:
- **User**: Usuarios del sistema (administradores y agentes)
- **Property**: Propiedades inmobiliarias
- **Image**: Imágenes asociadas a propiedades
- **Feature**: Características de propiedades
- **Post**: Artículos del blog
- **Category**: Categorías para el blog
- **CategoryOnPost**: Relación muchos a muchos entre categorías y posts

## Instalación y Configuración

### Requisitos Previos
- Node.js 16+ y Yarn
- Python 3.11+
- PostgreSQL (o una instancia en la nube como Neon)
- Cuenta en Cloudinary (opcional, para almacenamiento de imágenes)

### Variables de Entorno

#### Frontend (.env)
```
REACT_APP_BACKEND_URL=http://localhost:8001/api
```

#### Backend (.env)
```
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_TIME=3600
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Instalación de Dependencias

#### Frontend
```bash
cd /app/frontend
yarn install
```

#### Backend
```bash
cd /app/backend
pip install -r requirements.txt
python -m prisma generate
```

### Inicialización de la Base de Datos
```bash
cd /app/backend
python seed.py
```

## Ejecución del Proyecto

### Modo Desarrollo

#### Backend
```bash
cd /app/backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

#### Frontend
```bash
cd /app/frontend
yarn start
```

### Usando Supervisor (Entorno de Producción/Desarrollo)
```bash
sudo supervisorctl start backend
sudo supervisorctl start frontend
```

Para reiniciar los servicios:
```bash
sudo supervisorctl restart all
```

### Construcción para Producción

#### Frontend
```bash
cd /app/frontend
yarn build
```

Esto generará una carpeta `build` con los archivos estáticos listos para producción.

## Acceso al Sistema

### Sitio Web Público
- **URL**: `http://localhost:3000`

### Panel de Administración
- **URL**: `http://localhost:3000/admin`
- **Email**: admin@inmobiliariazaragoza.com
- **Contraseña**: adminpassword

## API Endpoints Principales

### Autenticación
- `POST /api/token`: Obtener token de autenticación

### Propiedades
- `GET /api/properties`: Listar propiedades
- `POST /api/properties`: Crear propiedad
- `GET /api/properties/{id}`: Obtener detalles de propiedad
- `PATCH /api/properties/{id}`: Actualizar propiedad
- `DELETE /api/properties/{id}`: Eliminar propiedad

### Blog
- `GET /api/posts`: Listar posts
- `POST /api/posts`: Crear post
- `GET /api/posts/{id}`: Obtener detalles de post
- `PUT /api/posts/{id}`: Actualizar post
- `DELETE /api/posts/{id}`: Eliminar post

### Categorías
- `GET /api/categories`: Listar categorías
- `POST /api/categories`: Crear categoría
- `PUT /api/categories/{id}`: Actualizar categoría
- `DELETE /api/categories/{id}`: Eliminar categoría

### Usuarios
- `GET /api/users`: Listar usuarios
- `POST /api/users`: Crear usuario
- `PUT /api/users/{id}`: Actualizar usuario
- `DELETE /api/users/{id}`: Eliminar usuario

## Estado Actual y Próximos Pasos

### Funcionando:
- Frontend completo con React
- Backend con FastAPI y PostgreSQL
- Panel de administración funcional
- Gestión de propiedades, blog y usuarios

### Próximas Mejoras:
1. Migración a Next.js para mejorar SEO
2. Implementación de tours virtuales para propiedades
3. Búsqueda por mapa
4. Sistema de alertas para nuevas propiedades
5. Integración completa con Cloudinary y Google Maps

## Solución de Problemas Comunes

1. **Error de conexión con la base de datos**: Verifica que las credenciales en el archivo `.env` sean correctas y que la base de datos esté accesible.

2. **Error generando el cliente Prisma**: Ejecuta `python -m prisma generate` para regenerar el cliente.

3. **Problemas con CORS**: Si hay problemas de CORS al hacer peticiones desde el frontend al backend, verifica la configuración de CORS en `server.py`.

4. **Errores de autenticación**: Asegúrate de que el token JWT esté configurado correctamente y que los endpoints protegidos estén recibiendo el token en el encabezado `Authorization`.

## Contribuciones

Para contribuir al proyecto:

1. Haz un fork del repositorio
2. Crea una rama para tu contribución (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza tus cambios y haz commit (`git commit -m 'Añade nueva funcionalidad'`)
4. Sube tus cambios a tu fork (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.
