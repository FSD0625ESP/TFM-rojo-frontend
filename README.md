# 🎨 TFM Grupo Rojo - Fullstack App - Frontend

Interfaz de usuario para la aplicación web desarrollada como parte del proyecto TFM. Este frontend está construido con React y Vite, y se conecta al backend en Node.js + Express + MongoDB.

## 📦 Estructura del proyecto

```bash
TFM-rojo-frontend/
├── node_modules/           # Packages instalados con npm
├── public/                 # Archivos estáticos
├── src/
│   ├── assets/             # Imágenes y recursos
│   ├── components/         # Componentes reutilizables
│   ├── context/            # Contextos del proyecto
│   ├── layout/             # Layouts
│   ├── pages/              # Vistas principales
│   ├── routes/             # Rutas
│   ├── services/           # Llamadas a la API
│   ├── utils/              # Utilidades varias
│   ├── index.css           # Archivo CSS principal
│   ├── App.jsx             # Componente raíz
│   └── main.jsx            # Punto de entrada
├── .env                    # Variables de entorno
├── .gitignore              # Ignorar archivos innecesarios
├── index.html              # HTML base
├── package.json            # Dependencias del frontend
├── vite.config.json        # Configuraciones de vite
├── eslint.config.json      # Configuraciones de eslint
├── CONTRIBUTING.md         # Guía interna para el equipo
└── README.md               # Documentación del proyecto
```

## 🚀 Tecnologías utilizadas

### Frontend

- React
- Vite
- Axios (para consumir la API)
- React Router DOM
- dotenv (para configuración de entorno)
- Tailwind CSS y Material UI

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone git@github.com:FSD0625ESP/TFM-rojo-frontend.git
cd TFM-rojo-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
VITE_API_URL=http://localhost:5000/api
```

> Asegúrate de que el backend esté corriendo en el puerto 5000 o ajusta el valor según corresponda.

### 4. Ejecutar en modo desarrollo

```bash
npm run dev
```

> La aplicación estará disponible en http://localhost:5173

### 🔀 Comunicación con el backend

Las llamadas a la API se realizan a través de `Axios`, utilizando la URL definida en `VITE_API_URL`. Esto permite cambiar fácilmente entre entornos (desarrollo, staging, producción).

## 🧑‍💻 Autores

- Aimón Pérez
- José Hernández
- Mariano Luna [GitHub](https://github.com/marianorluna)

## 📄 Licencia

Este proyecto está bajo la licencia MIT.
