/**
 * @file Utilidades para manejo y formateo de tiempo
 * @author Joan Lopez Ramirez
 * @description Funciones auxiliares para trabajar con tiempo y fechas
 */

/**
 * Formatea milisegundos a un formato legible de horas:minutos:segundos
 * @param ms Tiempo en milisegundos
 * @returns Tiempo formateado como HH:MM:SS
 */
export function formatTimeHMS(ms: number): string {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Formatea milisegundos a un formato de horas y minutos
 * @param ms Tiempo en milisegundos
 * @returns Tiempo formateado como "X h Y min"
 */
export function formatHoursAndMinutes(ms: number): string {
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    
    if (hours === 0) {
        return `${minutes} min`;
    } else if (minutes === 0) {
        return `${hours} h`;
    } else {
        return `${hours} h ${minutes} min`;
    }
}

/**
 * Convierte milisegundos a horas con un decimal de precisión
 * @param ms Tiempo en milisegundos
 * @returns Tiempo en horas (con un decimal)
 */
export function formatHours(ms: number): string {
    return (ms / (1000 * 60 * 60)).toFixed(1);
}

/**
 * Formatea una fecha ISO a un formato más legible
 * @param dateString Fecha en formato YYYY-MM-DD
 * @returns Fecha formateada como "D MMM" (ej. "15 Ene")
 */
export function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD
 * @returns Fecha actual formateada
 */
export function getCurrentDateString(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/**
 * Convierte una duración en formato legible para mostrar en tooltips
 * @param hours Horas (puede incluir decimales)
 * @param minutes Minutos
 * @returns Formato legible para tooltips
 */
export function formatTooltipTime(hours: number, minutes: number): string {
    if (hours === 0) {
        return `${minutes} minutos`;
    } else if (minutes === 0) {
        return `${hours} horas`;
    } else {
        return `${hours} h ${minutes} min`;
    }
} 