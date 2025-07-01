/**
 * @file Gestor de sesiones de codificación
 * @author Joan Lopez Ramirez
 * @description Maneja el inicio, detención y seguimiento de sesiones de codificación
 */

import * as vscode from 'vscode';
import { CodingSession } from '../models/types';
import { saveSession } from '../utils/storageUtils';

/**
 * Clase para gestionar sesiones de codificación
 */
export class SessionManager {
    /** Sesión de codificación actual o null si no hay una activa */
    private currentSession: CodingSession | null = null;
    /** Timer para actualizar la barra de estado */
    private statusBarTimer: NodeJS.Timeout | null = null;
    /** Elemento de la barra de estado */
    private statusBarItem: vscode.StatusBarItem;
    /** Ruta del directorio de almacenamiento */
    private storagePath: string;
    /** Tiempo del último registro de actividad */
    private lastActivity: number = Date.now();
    /** Umbral de inactividad en milisegundos */
    private inactivityThreshold: number;

    /**
     * Constructor del gestor de sesiones
     * @param context Contexto de la extensión
     * @param statusBarItem Elemento de la barra de estado
     */
    constructor(context: vscode.ExtensionContext, statusBarItem: vscode.StatusBarItem) {
        this.statusBarItem = statusBarItem;
        this.storagePath = context.globalStoragePath;
        
        // Obtener configuración
        const config = vscode.workspace.getConfiguration('opencodetime');
        // Convertir segundos a milisegundos (valor predeterminado: 5 minutos)
        this.inactivityThreshold = (config.get('inactivityThreshold') as number || 300) * 1000;
        
        // Escuchar cambios en la configuración
        context.subscriptions.push(
            vscode.workspace.onDidChangeConfiguration(e => {
                if (e.affectsConfiguration('opencodetime.inactivityThreshold')) {
                    const newConfig = vscode.workspace.getConfiguration('opencodetime');
                    this.inactivityThreshold = (newConfig.get('inactivityThreshold') as number || 300) * 1000;
                }
            })
        );
    }

    /**
     * Inicia una nueva sesión de codificación
     */
    public startTracking(): void {
        if (!this.currentSession) {
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor) {
                const language = activeEditor.document.languageId;
                const workspaceFolder = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);
                const project = workspaceFolder ? workspaceFolder.name : 'sin-proyecto';
                
                this.currentSession = {
                    startTime: Date.now(),
                    endTime: null,
                    language,
                    project
                };
                
                this.updateActivity();
                this.updateStatusBar();
                this.startStatusBarTimer();
            }
        }
    }

    /**
     * Detiene la sesión de codificación actual
     */
    public stopTracking(): void {
        if (this.currentSession) {
            this.currentSession.endTime = Date.now();
            this.currentSession.duration = this.currentSession.endTime - this.currentSession.startTime;
            
            // Solo guardar si la duración es significativa (más de 5 segundos)
            if (this.currentSession.duration > 5000) {
                saveSession(this.currentSession, this.storagePath);
            }
            
            this.currentSession = null;
            if (this.statusBarTimer) {
                clearInterval(this.statusBarTimer);
                this.statusBarTimer = null;
            }
            this.updateStatusBar();
        }
    }

    /**
     * Actualiza el momento de la última actividad
     */
    public updateActivity(): void {
        this.lastActivity = Date.now();
    }

    /**
     * Verifica si hay inactividad y detiene el seguimiento si es necesario
     */
    public checkInactivity(): void {
        if (this.currentSession && Date.now() - this.lastActivity > this.inactivityThreshold) {
            this.stopTracking();
        }
    }

    /**
     * Actualiza la barra de estado con la información actual
     */
    private updateStatusBar(): void {
        if (this.currentSession) {
            const durationMs = Date.now() - this.currentSession.startTime;
            const minutes = Math.floor(durationMs / 60000);
            const seconds = Math.floor((durationMs % 60000) / 1000);
            this.statusBarItem.text = `$(clock) Codificando: ${minutes}m ${seconds}s`;
            this.statusBarItem.tooltip = `Lenguaje: ${this.currentSession.language} | Proyecto: ${this.currentSession.project}`;
            this.statusBarItem.show();
        } else {
            this.statusBarItem.text = '$(clock) Iniciar Codificación';
            this.statusBarItem.tooltip = 'Haz clic para ver el dashboard de OpenCodeTime';
            this.statusBarItem.show();
        }
    }

    /**
     * Inicia el temporizador para actualizar la barra de estado
     */
    private startStatusBarTimer(): void {
        if (this.statusBarTimer) {
            clearInterval(this.statusBarTimer);
        }
        this.statusBarTimer = setInterval(() => this.updateStatusBar(), 1000);
    }

    /**
     * Obtiene la sesión actual
     * @returns La sesión actual o null si no hay una activa
     */
    public getCurrentSession(): CodingSession | null {
        return this.currentSession;
    }
} 