/**
 * @file Punto de entrada principal de la extensión OpenCodeTime
 * @author Joan Lopez Ramirez
 * @description Gestiona el ciclo de vida de la extensión y coordina los diferentes módulos
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { SessionManager } from './core/sessionManager';
import { initializeStorage } from './utils/storageUtils';
import { createDashboardPanel } from './webview/dashboardView';

/**
 * Activación de la extensión
 * @param context Contexto de la extensión proporcionado por VS Code
 */
export function activate(context: vscode.ExtensionContext) {
    // Mostrar mensaje de activación en la consola
    console.log('OpenCodeTime está activo!');

    // Inicializar el directorio de almacenamiento
    initializeStorage(context.globalStoragePath);
    
    // Crear y configurar el elemento de la barra de estado
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    statusBarItem.command = 'opencodetime.showDashboard';
    context.subscriptions.push(statusBarItem);
    
    // Inicializar el gestor de sesiones
    const sessionManager = new SessionManager(context, statusBarItem);
    
    // Comando para mostrar el dashboard
    const dashboardCommand = vscode.commands.registerCommand('opencodetime.showDashboard', () => {
        createDashboardPanel(context);
    });
    
    // Comando para iniciar/detener seguimiento manualmente
    const toggleTrackingCommand = vscode.commands.registerCommand('opencodetime.toggleTracking', () => {
        if (sessionManager.getCurrentSession()) {
            sessionManager.stopTracking();
            vscode.window.showInformationMessage('Seguimiento de tiempo detenido.');
        } else {
            sessionManager.startTracking();
            vscode.window.showInformationMessage('Seguimiento de tiempo iniciado.');
        }
    });
    
    // Registrar eventos para detectar actividad y gestionar sesiones
    
    // Detectar cambios en el editor activo
    const onTextEditorChange = vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            if (!sessionManager.getCurrentSession()) {
                sessionManager.startTracking();
            }
        }
    });
    
    // Detectar cambios en documentos para registrar actividad
    const onTextDocumentChange = vscode.workspace.onDidChangeTextDocument(() => {
        sessionManager.updateActivity();
        if (!sessionManager.getCurrentSession()) {
            sessionManager.startTracking();
        }
    });
    
    // Verificar inactividad periódicamente
    const inactivityTimer = setInterval(() => {
        sessionManager.checkInactivity();
    }, 60000); // Comprobar cada minuto
    
    // Iniciar el seguimiento si hay un editor activo al activar la extensión
    if (vscode.window.activeTextEditor) {
        sessionManager.startTracking();
    }
    
    // Registrar todos los suscriptores en el contexto de la extensión
    context.subscriptions.push(
        dashboardCommand,
        toggleTrackingCommand,
        onTextEditorChange,
        onTextDocumentChange,
        { dispose: () => clearInterval(inactivityTimer) } // Asegurar que el timer se limpia al desactivar la extensión
    );
}

/**
 * Desactivación de la extensión
 * Esta función se llama cuando la extensión se desactiva
 */
export function deactivate() {
    // No es necesario hacer nada especial aquí, ya que los suscriptores
    // se limpian automáticamente al desactivar la extensión
    console.log('OpenCodeTime se ha desactivado');
} 