# OpenCodeTime 🕒

[![Version](https://img.shields.io/visual-studio-marketplace/v/joanlopez22.opencodetime.svg)](https://marketplace.visualstudio.com/items?itemName=joanlopez22.opencodetime)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/joanlopez22.opencodetime.svg)](https://marketplace.visualstudio.com/items?itemName=joanlopez22.opencodetime)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/joanlopez22.opencodetime.svg)](https://marketplace.visualstudio.com/items?itemName=joanlopez22.opencodetime)
[![License](https://img.shields.io/github/license/joanlopez22/opencodetime.svg)](https://github.com/joanlopez22/opencodetime/blob/main/LICENSE)

<p align="center">
  <img src="resources/icon.png" alt="OpenCodeTime Logo" width="150" />
</p>

**OpenCodeTime** es una extensión gratuita y open source para Visual Studio Code que realiza un seguimiento detallado del tiempo que dedicas a programar, ofreciendo un dashboard local interactivo con estadísticas detalladas y visualizaciones.

<p align="center">
  <img src="resources/screenshots/dashboard.png" alt="OpenCodeTime Dashboard" width="800" />
</p>

## ✨ Características principales

- **✅ Seguimiento automático**: Registra automáticamente el tiempo que pasas programando sin interrumpir tu flujo de trabajo
- **📊 Dashboard interactivo**: Visualiza tus estadísticas de codificación con gráficos claros y atractivos
- **🔍 Desglose por lenguaje**: Analiza qué lenguajes de programación utilizas más
- **📅 Estadísticas diarias**: Visualiza tu progreso día a día para identificar patrones de productividad
- **🔄 Detección de inactividad**: Pausa automáticamente cuando dejas de codificar para estadísticas precisas
- **💾 Datos locales**: Toda tu información se almacena localmente para máxima privacidad

## 🚀 Instalación

Puedes instalar la extensión directamente desde el Visual Studio Code Marketplace:

1. Abre VS Code
2. Ve a la pestaña de Extensiones (Ctrl+Shift+X)
3. Busca "OpenCodeTime"
4. Haz clic en "Instalar"

Alternativamente, puedes instalar la extensión mediante el Command Palette:
1. Abre el Command Palette (Ctrl+Shift+P)
2. Escribe `ext install joanlopez22.opencodetime`

## 🎮 Uso

La extensión comienza a registrar automáticamente tu tiempo de codificación cuando empiezas a trabajar en Visual Studio Code. No necesitas realizar ninguna acción especial para empezar a utilizarla.

### Barra de estado

En la barra de estado inferior de VS Code, verás un indicador que muestra:
- 🟢 Cuando estás codificando activamente: `Codificando: Xm Ys`
- ⚪ Cuando no hay sesión activa: `Iniciar Codificación`

Puedes hacer clic en este indicador para abrir el dashboard.

### Comandos

OpenCodeTime añade los siguientes comandos a VS Code (accesibles desde el Command Palette con Ctrl+Shift+P):

- **OpenCodeTime: Mostrar Dashboard** - Abre el dashboard con todas tus estadísticas
- **OpenCodeTime: Iniciar/Detener Seguimiento** - Inicia o detiene manualmente el seguimiento

## ⚙️ Configuración

Puedes personalizar el comportamiento de OpenCodeTime a través de la configuración de VS Code:

- **Tiempo de inactividad**: Configura cuánto tiempo de inactividad debe pasar antes de que se detenga automáticamente el seguimiento (por defecto: 5 minutos)

```json
"opencodetime.inactivityThreshold": 300
```

Para modificar la configuración:
1. Abre la configuración de VS Code (Archivo > Preferencias > Configuración)
2. Busca "OpenCodeTime"
3. Ajusta los valores según tus preferencias

## 🔧 Características del dashboard

El dashboard de OpenCodeTime proporciona varias visualizaciones para ayudarte a entender tus patrones de codificación:

### Resumen de estadísticas
- **Tiempo total**: Cantidad total de tiempo que has dedicado a programar
- **Tiempo hoy**: Tiempo de codificación del día actual
- **Promedio diario**: Tiempo promedio de codificación por día
- **Lenguaje más usado**: El lenguaje de programación en el que pasas más tiempo

### Gráficos
- **Tiempo de codificación por día**: Gráfico de barras que muestra tu actividad diaria
- **Desglose por lenguaje**: Gráfico circular que muestra la distribución de tiempo por lenguaje

### Actividad reciente
- Tabla con tus sesiones de codificación más recientes, incluyendo fecha, duración, lenguaje y proyecto

## 💻 Funcionamiento interno

OpenCodeTime está desarrollado utilizando las siguientes tecnologías:

- **TypeScript**: El lenguaje principal para la implementación de la extensión
- **VS Code API**: Para la integración con Visual Studio Code
- **Chart.js**: Para la visualización de gráficos en el dashboard
- **Sistema de archivos local**: Para almacenar los datos de tiempo (en formato JSON)

La arquitectura de la extensión está organizada en los siguientes módulos:

- **Core**: Gestión de sesiones y lógica principal
- **Utils**: Funciones de utilidad para manejo de tiempo y almacenamiento
- **Webview**: Visualización del dashboard
- **Models**: Definición de tipos e interfaces

### Estructura de datos

La extensión registra sesiones de codificación con la siguiente estructura:

```typescript
interface CodingSession {
  startTime: number; // Timestamp de inicio
  endTime: number;   // Timestamp de fin
  language: string;  // Lenguaje del editor activo
  project: string;   // Nombre del proyecto
  duration: number;  // Duración en milisegundos
}
```

Los datos se almacenan por día en archivos JSON en el directorio de almacenamiento global de la extensión:

```typescript
interface DailyCodingStats {
  date: string;                        // Fecha en formato YYYY-MM-DD
  totalDuration: number;               // Duración total del día
  sessions: CodingSession[];           // Sesiones individuales
  languageBreakdown: Record<string, number>; // Desglose por lenguaje
}
```

## 🤝 Contribuir

Este proyecto es open source y las contribuciones son bienvenidas. Puedes contribuir de las siguientes maneras:

1. **Reportar bugs**: Si encuentras algún error, por favor crea un issue en el [repositorio](https://github.com/joanlopez22/opencodetime)
2. **Solicitar funcionalidades**: ¿Tienes ideas para mejorar la extensión? ¡Compártelas en un issue!
3. **Enviar pull requests**: ¿Quieres arreglar un bug o añadir una nueva funcionalidad? Los pull requests son bienvenidos
4. **Mejorar la documentación**: Ayúdanos a mantener la documentación clara y actualizada
5. **Compartir la extensión**: Si te gusta la extensión, compártela con otros desarrolladores

### Pasos para contribuir con código:

1. Haz un fork del repositorio
2. Clona tu fork localmente: `git clone https://github.com/TU_USUARIO/opencodetime.git`
3. Crea una rama para tu cambio: `git checkout -b mi-funcionalidad`
4. Realiza tus cambios y haz commit: `git commit -m "Añadir nueva funcionalidad"`
5. Sube los cambios a tu fork: `git push origin mi-funcionalidad`
6. Crea un Pull Request desde tu fork al repositorio original

## 🗺️ Roadmap

Estas son algunas de las funcionalidades que planeamos implementar en el futuro:

- [ ] **Sincronización en la nube**: Opción para sincronizar tus estadísticas entre diferentes dispositivos
- [ ] **Más visualizaciones y gráficos**: Análisis más detallados de tus patrones de codificación
- [ ] **Exportación de datos**: Exportar tus estadísticas en diferentes formatos (CSV, JSON, PDF)
- [ ] **Metas de productividad**: Establecer objetivos de tiempo de codificación y recibir notificaciones
- [ ] **Integración con GitHub**: Conectar tu actividad de codificación con tus contribuciones en GitHub
- [ ] **Modo equipo**: Seguimiento y análisis para equipos de desarrollo
- [ ] **Personalización del dashboard**: Opciones para personalizar las visualizaciones según tus preferencias

## 🔍 Solución de problemas

### Problemas comunes:

- **La extensión no registra tiempo**: Asegúrate de que estás editando archivos en un proyecto de VS Code y que no hay otra instancia de VS Code abierta.
- **El dashboard no muestra datos**: Si acabas de instalar la extensión, necesitas codificar un poco para generar estadísticas.
- **Error al cargar el dashboard**: Reinicia VS Code y vuelve a intentarlo.

Si encuentras otros problemas, por favor reporta un issue en el [repositorio del proyecto](https://github.com/joanlopez22/opencodetime/issues).

## 📝 Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).

## 👨‍💻 Créditos

Desarrollado con ❤️ por [Joan Lopez Ramirez](https://github.com/joanlopez22)
