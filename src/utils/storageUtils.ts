/**
 * @file Utilidades para almacenamiento y manejo de datos
 * @author Joan Lopez Ramirez
 * @description Funciones para gestionar el almacenamiento persistente de datos
 */

import * as fs from 'fs';
import * as path from 'path';
import { CodingSession, DailyCodingStats } from '../models/types';
import { getCurrentDateString } from './timeUtils';

/**
 * Inicializa el directorio de almacenamiento
 * @param storagePath Ruta del directorio de almacenamiento
 */
export function initializeStorage(storagePath: string): void {
    if (!fs.existsSync(storagePath)) {
        fs.mkdirSync(storagePath, { recursive: true });
    }
}

/**
 * Guarda una sesión de codificación en el archivo correspondiente
 * @param session Sesión de codificación a guardar
 * @param storagePath Ruta del directorio de almacenamiento
 */
export function saveSession(session: CodingSession, storagePath: string): void {
    // Calcular la fecha basada en el inicio de la sesión
    const date = new Date(session.startTime);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const filePath = path.join(storagePath, `${dateStr}.json`);
    
    let dailyStats: DailyCodingStats;
    
    try {
        // Si el archivo existe, actualizar las estadísticas
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            dailyStats = JSON.parse(fileContent);
            dailyStats.sessions.push(session);
            dailyStats.totalDuration += session.duration!;
            
            // Actualizar el desglose por lenguaje
            if (!dailyStats.languageBreakdown[session.language]) {
                dailyStats.languageBreakdown[session.language] = 0;
            }
            dailyStats.languageBreakdown[session.language] += session.duration!;
        } else {
            // Si el archivo no existe, crear nuevas estadísticas
            dailyStats = {
                date: dateStr,
                totalDuration: session.duration!,
                sessions: [session],
                languageBreakdown: {
                    [session.language]: session.duration!
                }
            };
        }
        
        // Guardar los datos en formato JSON
        fs.writeFileSync(filePath, JSON.stringify(dailyStats, null, 2));
    } catch (error) {
        console.error('Error al guardar la sesión:', error);
    }
}

/**
 * Obtiene todas las estadísticas almacenadas
 * @param storagePath Ruta del directorio de almacenamiento
 * @returns Colección de estadísticas diarias
 */
export function getAllStats(storagePath: string): DailyCodingStats[] {
    const stats: DailyCodingStats[] = [];
    
    try {
        if (fs.existsSync(storagePath)) {
            const files = fs.readdirSync(storagePath);
            
            files.forEach(file => {
                if (file.endsWith('.json')) {
                    const filePath = path.join(storagePath, file);
                    const content = fs.readFileSync(filePath, 'utf8');
                    stats.push(JSON.parse(content));
                }
            });
        }
    } catch (error) {
        console.error('Error al leer las estadísticas:', error);
    }
    
    return stats;
}

/**
 * Obtiene las estadísticas del día actual
 * @param storagePath Ruta del directorio de almacenamiento
 * @returns Estadísticas del día actual o null si no hay datos
 */
export function getTodayStats(storagePath: string): DailyCodingStats | null {
    const today = getCurrentDateString();
    const filePath = path.join(storagePath, `${today}.json`);
    
    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(content);
        }
    } catch (error) {
        console.error('Error al leer las estadísticas de hoy:', error);
    }
    
    return null;
}

/**
 * Exporta todos los datos a un archivo JSON
 * @param storagePath Ruta del directorio de almacenamiento
 * @param exportPath Ruta donde exportar los datos
 * @returns Promesa que resuelve a true si se exportó correctamente
 */
export async function exportData(storagePath: string, exportPath: string): Promise<boolean> {
    try {
        const stats = getAllStats(storagePath);
        fs.writeFileSync(exportPath, JSON.stringify(stats, null, 2));
        return true;
    } catch (error) {
        console.error('Error al exportar datos:', error);
        return false;
    }
} 