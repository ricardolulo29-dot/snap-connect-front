# 📸 Snap Connect

**Snap Connect** es una red social moderna donde los usuarios pueden compartir publicaciones con imágenes, interactuar mediante likes y comentarios, seguir a otros usuarios y mantener conversaciones en tiempo real a través de un sistema de mensajería.

Este proyecto ha sido desarrollado como parte del **Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web (DAW)**, utilizando tecnologías modernas del ecosistema JavaScript.

---

## 🚀 Características Principales

- ✅ **Autenticación de usuarios** con JWT (JSON Web Tokens)
- 📝 **Publicaciones con imágenes** - Crear, editar y eliminar posts
- 🏷️ **Sistema de tags** - Filtrar publicaciones por etiquetas
- ❤️ **Sistema de likes** en publicaciones
- 💬 **Comentarios** en publicaciones con funcionalidad completa
- 👥 **Sistema de seguimiento** (seguir/dejar de seguir usuarios)
- 💌 **Chat privado** entre usuarios con mensajes persistentes
- 📧 **Contador de mensajes no leídos** en tiempo real
- 🔍 **Búsqueda de usuarios** por nombre o username
- 👤 **Perfiles de usuario** con tabs (posts, likes, seguidores, seguidos)
- ✏️ **Edición de perfil** completa (nombre, apellidos, email, username)
- 🖼️ **Actualización de foto de perfil** con vista previa
- 📱 **Diseño responsive** - Compatible con móviles, tablets y escritorio
- 🎨 **Interfaz moderna** con gradientes, blur effects y animaciones

---

## 🛠️ Tecnologías Utilizadas

### Frontend

- **Vue 3** - Framework progresivo de JavaScript
- **Vite** - Build tool y servidor de desarrollo rápido
- **Pinia** - Gestión de estado (store)
- **Vue Router** - Navegación entre vistas
- **Axios** - Cliente HTTP para llamadas a la API
- **TailwindCSS** - Framework de CSS utility-first
- **Font Awesome** - Iconos

### Herramientas de Desarrollo

- **ESLint** - Linter para mantener código consistente
- **PostCSS** - Procesamiento de CSS
- **Autoprefixer** - Añade prefijos CSS automáticamente

---

## 📁 Estructura del Proyecto

```
snapconnect-vue/
├── public/              # Archivos estáticos
├── src/
│   ├── api/            # Servicios de API (axios)
│   │   ├── auth.api.js
│   │   ├── chats.api.js
│   │   ├── posts.api.js
│   │   ├── users.api.js
│   │   └── httpClient.js
│   ├── assets/         # Imágenes y recursos
│   ├── components/     # Componentes reutilizables
│   │   ├── ChatListItem.vue         # Item de lista de chats con preview
│   │   ├── CommentsSection.vue      # Sección de comentarios con CRUD
│   │   ├── CreatePostModal.vue      # Modal para crear posts con tags
│   │   ├── EditPostModal.vue        # Modal para editar posts
│   │   ├── EditProfileModal.vue     # Modal para editar perfil de usuario
│   │   ├── EmptyChatState.vue       # Estado vacío para chats
│   │   ├── EmptyState.vue           # Estado vacío genérico
│   │   ├── MessageBubble.vue        # Burbuja de mensaje en chat
│   │   ├── PostComponent.vue        # Componente de post con likes/comentarios
│   │   ├── PostGrid.vue             # Grid de posts
│   │   ├── ProfileImage.vue         # Imagen de perfil reutilizable
│   │   ├── TagsFilter.vue           # Filtro de tags para posts
│   │   └── UserList.vue             # Lista de usuarios (seguidores/seguidos)
│   ├── composables/    # Lógica reutilizable
│   │   └── useChat.js
│   ├── store/          # Estado global (Pinia)
│   │   └── user.store.js
│   ├── utils/          # Funciones auxiliares
│   │   └── formaters.js
│   ├── views/          # Páginas/Vistas
│   │   ├── ChatsView.vue
│   │   ├── HomeView.vue
│   │   ├── LoginView.vue
│   │   ├── ProfileView.vue
│   │   ├── SearchView.vue
│   │   └── SignUpView.vue
│   ├── App.vue         # Componente raíz
│   ├── main.js         # Punto de entrada
│   ├── router.js       # Configuración de rutas
│   └── style.css       # Estilos globales
├── .env                # Variables de entorno
├── package.json        # Dependencias del proyecto
├── vite.config.js      # Configuración de Vite
├── tailwind.config.js  # Configuración de Tailwind
└── eslint.config.js    # Configuración de ESLint
```

---

## ⚙️ Instalación y Configuración

### Requisitos Previos

- **Node.js** (versión 16 o superior)
- **npm** o **yarn**
- Servidor backend corriendo (con la API REST)

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_SERVER_URL=localhost
VITE_SERVER_PORT=3000
```

> **Nota:** Ajusta estos valores según la configuración de tu servidor backend.

### 4. Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 5. Compilar para producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`

---

## 🎯 Funcionalidades por Vista

### 🏠 Home (`/`)

- Feed de publicaciones de usuarios seguidos
- Crear nuevas publicaciones con imagen, título y contenido
- Dar like/unlike a publicaciones
- Comentar en publicaciones
- Editar y eliminar propias publicaciones

### 👤 Perfil (`/profile`)

- Información del usuario actual
- Grid de publicaciones propias
- Lista de seguidores y seguidos
- Editar imagen de perfil

### 💬 Chats (`/chats`)

- Lista de conversaciones activas
- Chat en tiempo real con otros usuarios
- Iniciar conversaciones con usuarios seguidos
- Contador de mensajes no leídos

### 🔍 Búsqueda (`/search`)

- Buscar usuarios por nombre o username
- Ver perfiles de otros usuarios
- Seguir/dejar de seguir usuarios
- Ver publicaciones de otros usuarios

---

## 🔐 Sistema de Autenticación

El proyecto utiliza **JWT (JSON Web Tokens)** para la autenticación:

1. El usuario inicia sesión con email y contraseña
2. El backend devuelve un token JWT
3. El token se almacena en `localStorage`
4. Todas las peticiones incluyen el token en el header `Authorization`
5. El router protege las rutas privadas verificando la existencia del token

---

## 📦 Gestión de Estado con Pinia

Se utiliza **Pinia** para gestionar el estado global de la aplicación:

- **user.store.js**: Almacena información del usuario autenticado, seguidores, seguidos y chats

```javascript
// Ejemplo de uso
import { useUserStore } from '@/store/user.store'

const userStore = useUserStore()
console.log(userStore.fullName) // Getter
userStore.loadFollowers(userId) // Action
```

---

## 🧩 Composables

Los **composables** permiten reutilizar lógica entre componentes:

### `useChat.js`

Gestiona toda la lógica relacionada con el sistema de mensajería:

- Cargar lista de chats
- Seleccionar un chat y cargar mensajes
- Enviar mensajes
- Marcar mensajes como leídos
- Crear nuevas conversaciones

## 🎨 Diseño y Estilos

- **TailwindCSS**: Utility-first CSS framework para estilos rápidos y consistentes
- **Gradientes**: Uso extensivo de gradientes para un aspecto moderno
- **Responsive**: Diseño adaptativo con breakpoints de Tailwind
- **Efectos hover**: Transiciones suaves y escalado en elementos interactivos
- **Blur y transparencias**: Efectos de backdrop-blur para modales y overlays

## 👩‍💻 Autor

Ricardo Luján Lorés
