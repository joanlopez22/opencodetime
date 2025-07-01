/**
 * @file Definición de tipos e interfaces para OpenCodeTime
 * @author Joan Lopez Ramirez
 * @description Este archivo contiene todas las interfaces y tipos utilizados en la extensión
 */

/**
 * Representa una sesión de codificación individual
 */
export interface CodingSession {
    /** Timestamp de inicio de la sesión en milisegundos */
    startTime: number;
    /** Timestamp de fin de la sesión en milisegundos (null si la sesión está en curso) */
    endTime: number | null;
    /** Lenguaje de programación utilizado durante la sesión */
    language: string;
    /** Nombre del proyecto en el que se trabajó */
    project: string;
    /** Duración de la sesión en milisegundos (calculado al finalizar) */
    duration?: number;
}

/**
 * Estadísticas diarias de codificación
 */
export interface DailyCodingStats {
    /** Fecha en formato YYYY-MM-DD */
    date: string;
    /** Duración total del día en milisegundos */
    totalDuration: number;
    /** Colección de sesiones de codificación del día */
    sessions: CodingSession[];
    /** Desglose de tiempo por lenguaje de programación */
    languageBreakdown: Record<string, number>;
}

/**
 * Configuración de OpenCodeTime
 */
export interface OpenCodeTimeConfig {
    /** Tiempo de inactividad en milisegundos antes de detener el seguimiento */
    inactivityThreshold: number;
}

/**
 * Mensajes del webview al extension host
 */
export type WebviewMessage = {
    /** Comando a ejecutar */
    command: 'getStats' | 'exportData';
    /** Datos opcionales según el comando */
    data?: any;
}

/**
 * Mensajes del extension host al webview
 */
export type ExtensionMessage = {
    /** Comando enviado */
    command: 'statsData' | 'exportComplete';
    /** Datos según el comando */
    data: any;
} 