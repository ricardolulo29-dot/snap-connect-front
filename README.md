# 📸 Snap Connect

**Snap Connect** es una red social moderna donde los usuarios pueden compartir publicaciones con imágenes, interactuar mediante likes y comentarios, seguir a otros usuarios y mantener conversaciones en tiempo real a través de un sistema de mensajería.

Este proyecto ha sido desarrollado como parte del **Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web (DAW)**, utilizando tecnologías modernas del ecosistema JavaScript.

---

## 🚀 Características Principales

- ✅ **Autenticación de usuarios** con JWT (JSON Web Tokens)
- 📝 **Publicaciones con imágenes** - Crear, editar y eliminar posts
- ❤️ **Sistema de likes** en publicaciones
- 💬 **Comentarios** en publicaciones
- 👥 **Sistema de seguimiento** (seguir/dejar de seguir usuarios)
- 💌 **Chat en tiempo real** entre usuarios
- 🔍 **Búsqueda de usuarios**
- 📱 **Diseño responsive** - Compatible con móviles, tablets y escritorio
- 🎨 **Interfaz moderna** con gradientes y efectos visuales

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
│   │   ├── ChatListItem.vue
│   │   ├── CommentsSection.vue
│   │   ├── CreatePostModal.vue
│   │   ├── EditPostModal.vue
│   │   ├── MessageBubble.vue
│   │   ├── PostComponent.vue
│   │   ├── PostGrid.vue
│   │   └── ProfileImage.vue
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

---

## 🎨 Diseño y Estilos

- **TailwindCSS**: Utility-first CSS framework para estilos rápidos y consistentes
- **Gradientes**: Uso extensivo de gradientes para un aspecto moderno
- **Responsive**: Diseño adaptativo con breakpoints de Tailwind
- **Efectos hover**: Transiciones suaves y escalado en elementos interactivos
- **Blur y transparencias**: Efectos de backdrop-blur para modales y overlays

---

## 🐛 Problemas Encontrados y Soluciones

### 1. **Gestión de mensajes no leídos**

- **Problema**: Sincronizar el contador de mensajes no leídos entre diferentes componentes
- **Solución**: Usar Pinia store para mantener un estado global y actualizarlo al marcar mensajes como leídos

### 2. **Actualización en tiempo real del feed**

- **Problema**: Cuando se crea una publicación, no aparece inmediatamente en el feed
- **Solución**: Usar eventos (`emit`) para notificar al componente padre y actualizar la lista localmente

### 3. **Validación de imágenes**

- **Problema**: Usuarios podían enviar publicaciones sin imagen
- **Solución**: Validación en el frontend antes de enviar el formulario

### 4. **Responsive del chat**

- **Problema**: En móvil, mostrar lista de chats y conversación simultáneamente
- **Solución**: Usar clases condicionales de Tailwind para ocultar/mostrar elementos según el breakpoint

---

## 📚 Aprendizajes Clave

Durante el desarrollo de este proyecto he aprendido:

- ✅ Arquitectura de componentes en Vue 3 con Composition API
- ✅ Gestión de estado global con Pinia
- ✅ Autenticación basada en tokens JWT
- ✅ Consumo de APIs REST con Axios e interceptores
- ✅ Routing con protección de rutas
- ✅ Diseño responsive con TailwindCSS
- ✅ Optimización de renders y rendimiento
- ✅ Manejo de formularios y validación

---

## 🚧 Posibles Mejoras Futuras

- [ ] Implementar WebSockets para mensajería en tiempo real
- [ ] Añadir notificaciones push
- [ ] Sistema de historias (stories) tipo Instagram
- [ ] Subida de videos además de imágenes
- [ ] Modo oscuro/claro
- [ ] Internacionalización (i18n)
- [ ] Tests unitarios y de integración
- [ ] PWA (Progressive Web App)

---

## 👨‍💻 Autor

**María del Gado Eiriz**

- GitHub: [@maria-delgado-eiriz](https://github.com/maria-delgado-eiriz)

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---
