# OpenCodeTime

[![Version](https://img.shields.io/visual-studio-marketplace/v/joanlopez22.opencodetime.svg)](https://marketplace.visualstudio.com/items?itemName=joanlopez22.opencodetime)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/joanlopez22.opencodetime.svg)](https://marketplace.visualstudio.com/items?itemName=joanlopez22.opencodetime)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/joanlopez22.opencodetime.svg)](https://marketplace.visualstudio.com/items?itemName=joanlopez22.opencodetime)
[![License](https://img.shields.io/github/license/joanlopez22/opencodetime.svg)](https://github.com/joanlopez22/opencodetime/blob/main/LICENSE)

OpenCodeTime es una extensión gratuita y open source para Visual Studio Code que realiza un seguimiento del tiempo que dedicas a programar, ofreciendo un dashboard local con estadísticas detalladas.

<!-- La imagen del dashboard se mostrará cuando la extensión esté publicada en el repositorio -->

## Características

- ✅ **Seguimiento automático**: Registra automáticamente el tiempo que pasas programando
- 📊 **Dashboard interactivo**: Visualiza tus estadísticas de codificación
- 🔍 **Desglose por lenguaje**: Analiza qué lenguajes utilizas más
- 📅 **Estadísticas diarias**: Ve tu progreso día a día
- 🔄 **Detección de inactividad**: Pausa automáticamente cuando dejas de codificar
- 💾 **Datos locales**: Toda tu información se almacena localmente para máxima privacidad

## Uso

La extensión comienza a registrar automáticamente tu tiempo de codificación cuando empiezas a trabajar en Visual Studio Code. Puedes ver tu tiempo de codificación actual en la barra de estado.

### Comandos

- **OpenCodeTime: Mostrar Dashboard**: Abre el dashboard con todas tus estadísticas
- **OpenCodeTime: Iniciar/Detener Seguimiento**: Inicia o detiene manualmente el seguimiento

## Configuración

- **Tiempo de inactividad**: Configura cuánto tiempo de inactividad debe pasar antes de que se detenga automáticamente el seguimiento (por defecto: 5 minutos)

```json
"opencodetime.inactivityThreshold": 300
```

## Funcionamiento interno

OpenCodeTime está desarrollado utilizando las siguientes tecnologías:

- **TypeScript**: El lenguaje principal para la implementación de la extensión
- **VS Code API**: Para la integración con Visual Studio Code
- **Chart.js**: Para la visualización de gráficos en el dashboard
- **Sistema de archivos local**: Para almacenar los datos de tiempo (en formato JSON)

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

## Contribuir

Este proyecto es open source y las contribuciones son bienvenidas. Puedes contribuir de las siguientes maneras:

1. Reportando bugs o solicitando funcionalidades a través de issues
2. Enviando pull requests con correcciones o nuevas características
3. Mejorando la documentación
4. Compartiendo la extensión con otros desarrolladores

## Roadmap

- [ ] Sincronización con la nube (opcional)
- [ ] Más visualizaciones y gráficos
- [ ] Exportación de datos en diferentes formatos
- [ ] Metas de productividad y notificaciones
- [ ] Soporte para equipos

## Créditos

Desarrollado por [Joan Lopez Ramirez](https://github.com/joanlopez22)

## Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE)
