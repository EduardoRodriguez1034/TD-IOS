# Truval Dental

Aplicación móvil para la gestión de una clínica dental, desarrollada con React Native y Expo.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu sistema:

1. [Node.js](https://nodejs.org/) (versión 14.0 o superior)
2. [npm](https://www.npmjs.com/) (normalmente viene con Node.js)
3. [Git](https://git-scm.com/)
4. [Expo Go](https://expo.dev/client) en tu dispositivo móvil

## Instalación

Sigue estos pasos para configurar el proyecto en tu entorno local:

1. Clona el repositorio:
```bash
git clone https://github.com/EduardoRodriguez1034/TruvalDental.git
cd TruvalDental
```

2. Instala las dependencias del proyecto:
```bash
npm install
```

3. Instala Expo CLI globalmente (si no lo tienes instalado):
```bash
npm install -g expo-cli
```

## Ejecución del Proyecto

1. Inicia el servidor de desarrollo:
```bash
npx expo start
```

2. Escanea el código QR:
   - Para iOS: Usa la cámara del iPhone
   - Para Android: Usa la app Expo Go y escanea el código QR

## Estructura del Proyecto

```
TruvalDental/
├── app/                   # Archivos principales de la aplicación
│   ├── (auth)/            # Pantallas de autenticación
│   ├── (tabs)/            # Pantallas principales con navegación por pestañas
│   └── components/        # Componentes reutilizables
├── assets/                # Recursos estáticos (imágenes, fuentes, etc.)
├── constants/             # Constantes y configuración
└── hooks/                 # Hooks personalizados
```

## Solución de Problemas Comunes

1. Si encuentras errores al instalar las dependencias:
```bash
rm -rf node_modules
npm cache clean --force
npm install
```

2. Si la app no se conecta al servidor de desarrollo:
   - Asegúrate de que tu dispositivo móvil y computadora estén en la misma red WiFi
   - Intenta usar el modo de túnel en Expo: Presiona 't' en la terminal donde está corriendo el servidor

3. Para problemas con Expo:
```bash
npx expo-doctor
```

## Tecnologías Utilizadas

- React Native
- Expo
- React Navigation
- React Native Paper
- TypeScript

## Contacto

Para preguntas o soporte, contacta a [eduardo.rodriguez193@tectijuana.edu.mx] 
