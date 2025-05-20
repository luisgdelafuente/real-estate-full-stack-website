# Sitio Web Inmobiliario - Zaragoza

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
- **React**: Biblioteca JavaScript para construir la interfaz de usuario
- **React Router**: Gestión de rutas en la aplicación
- **Tailwind CSS**: Framework CSS para el diseño y estilizado
- **Fetch API**: Para realizar peticiones al backend

### Backend:
- **FastAPI**: Framework Python para crear APIs RESTful
- **Prisma ORM**: ORM para Python que facilita la interacción con la base de datos
- **PostgreSQL**: Sistema de gestión de base de datos (alojado en Neon Cloud)
- **JWT**: Autenticación basada en tokens para el panel de administración
- **Cloudinary**: Servicio para almacenamiento y gestión de imágenes

### Despliegue y Herramientas:
- **Docker**: Contenedorización para desarrollo y despliegue
- **Supervisor**: Gestión de procesos para mantener los servicios en ejecución

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

## Funcionalidades Implementadas

### Páginas Públicas:
- **Inicio**: Presentación de la empresa, propiedades destacadas y ventajas
- **Propiedades**: Listado con filtros y búsqueda
- **Detalle de Propiedad**: Información completa, galería, características
- **Blog**: Artículos organizados por categorías
- **Contacto**: Formulario y mapa con información

### Panel de Administración:
- **Dashboard**: Resumen de estadísticas (propiedades, posts, usuarios)
- **Propiedades**: Gestión completa CRUD con carga de imágenes
- **Blog**: Gestión de artículos y categorías
- **Usuarios**: Administración de cuentas de usuario
- **Configuración**: Ajustes del sistema

## Cómo Iniciar el Proyecto

### Requisitos Previos
- Docker y Docker Compose (para desarrollo)
- Node.js y npm (para desarrollo frontend)
- Python 3.9+ (para desarrollo backend)

### Pasos para Ejecutar
1. Clonar el repositorio
2. Configurar variables de entorno:
   - Frontend: REACT_APP_BACKEND_URL
   - Backend: MONGO_URL, JWT_SECRET, etc.
3. Iniciar servicios:
   ```bash
   sudo supervisorctl start all
   ```

### Acceso al Panel de Administración
- **URL**: `/admin`
- **Email**: admin@inmobiliariazaragoza.com
- **Contraseña**: adminpassword

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

## Notas Técnicas

- El proyecto está diseñado para ser fácilmente migrado a Next.js para mejorar SEO
- La API sigue principios RESTful con endpoints bien definidos
- Se implementa autenticación JWT para la seguridad del panel de administración
- El diseño responsive garantiza una buena experiencia en todos los dispositivos
