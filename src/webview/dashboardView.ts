/**
 * @file Gestión del webview del dashboard
 * @author Joan Lopez Ramirez
 * @description Gestiona la creación y actualización del dashboard
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { getAllStats } from '../utils/storageUtils';

/**
 * Crea y muestra el panel del dashboard
 * @param context Contexto de la extensión
 * @returns Panel webview creado
 */
export function createDashboardPanel(context: vscode.ExtensionContext): vscode.WebviewPanel {
    // Crear el panel webview
    const panel = vscode.window.createWebviewPanel(
        'openCodeTimeDashboard',
        'OpenCodeTime Dashboard',
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [
                vscode.Uri.file(path.join(context.extensionPath, 'resources'))
            ]
        }
    );
    
    // Cargar el HTML del dashboard
    panel.webview.html = getDashboardHtml(context);
    
    // Configurar la comunicación entre el webview y la extensión
    panel.webview.onDidReceiveMessage(
        message => {
            switch (message.command) {
                case 'getStats':
                    // Obtener y enviar las estadísticas
                    const stats = getAllStats(context.globalStoragePath);
                    panel.webview.postMessage({ command: 'statsData', data: stats });
                    break;
                case 'exportData':
                    // Permitir exportar datos (implementación futura)
                    vscode.window.showInformationMessage('Exportación de datos disponible próximamente');
                    break;
            }
        },
        undefined,
        context.subscriptions
    );
    
    return panel;
}

/**
 * Genera el HTML para el dashboard
 * @param context Contexto de la extensión
 * @returns HTML para el dashboard
 */
function getDashboardHtml(context: vscode.ExtensionContext): string {
    // Recursos para el webview
    const iconPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'icon.png'));
    
    return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OpenCodeTime Dashboard</title>
            <style>
                :root {
                    /* Variables para tema oscuro (default) */
                    --card-bg: #2d2d2d;
                    --card-border: #3d3d3d;
                    --chart-grid: #3d3d3d;
                    --text-primary: #e0e0e0;
                    --text-secondary: #a0a0a0;
                    --accent-color: #4cc9f0;
                    --hover-bg: #3a3a3a;
                    --background-color: var(--vscode-editor-background);
                    --header-border: #3d3d3d;
                    --switch-bg: #3d3d3d;
                    --switch-circle: #e0e0e0;
                }
                
                /* Tema claro */
                [data-theme="light"] {
                    --card-bg: #ffffff;
                    --card-border: #e0e0e0;
                    --chart-grid: #e0e0e0;
                    --text-primary: #333333;
                    --text-secondary: #666666;
                    --accent-color: #0078d4;
                    --hover-bg: #f5f5f5;
                    --background-color: #f9f9f9;
                    --header-border: #e0e0e0;
                    --switch-bg: #0078d4;
                    --switch-circle: #ffffff;
                }
                
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Ubuntu', 'Droid Sans', sans-serif;
                    padding: 0 20px;
                    color: var(--text-primary);
                    background-color: var(--background-color);
                    line-height: 1.5;
                    transition: background-color 0.3s ease, color 0.3s ease;
                }
                
                /* Switch de tema */
                .theme-switch-wrapper {
                    display: flex;
                    align-items: center;
                    position: absolute;
                    top: 20px;
                    right: 20px;
                }
                
                .theme-switch {
                    display: inline-block;
                    height: 24px;
                    position: relative;
                    width: 48px;
                }
                
                .theme-switch input {
                    display: none;
                }
                
                .slider {
                    background-color: var(--switch-bg);
                    bottom: 0;
                    cursor: pointer;
                    left: 0;
                    position: absolute;
                    right: 0;
                    top: 0;
                    transition: .4s;
                    border-radius: 34px;
                }
                
                .slider:before {
                    background-color: var(--switch-circle);
                    bottom: 4px;
                    content: "";
                    height: 16px;
                    left: 4px;
                    position: absolute;
                    transition: .4s;
                    width: 16px;
                    border-radius: 50%;
                }
                
                input:checked + .slider {
                    background-color: var(--accent-color);
                }
                
                input:checked + .slider:before {
                    transform: translateX(24px);
                }
                
                .theme-icon {
                    margin-right: 8px;
                    font-size: 16px;
                }
                
                .container {
                    max-width: 1000px;
                    margin: 0 auto;
                }
                .header {
                    text-align: center;
                    margin-bottom: 2rem;
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--header-border);
                    position: relative;
                }
                .header h1 {
                    margin: 0;
                    font-size: 2.2rem;
                    color: var(--accent-color);
                }
                .header p {
                    margin: 0.5rem 0 0;
                    opacity: 0.8;
                }
                .card {
                    background-color: var(--card-bg);
                    border-radius: 8px;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    border: 1px solid var(--card-border);
                }
                .card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                    gap: 1.2rem;
                    margin-bottom: 2rem;
                }
                .chart-container {
                    height: 320px;
                    margin-bottom: 2rem;
                    position: relative;
                    overflow: hidden; /* Prevent content from overflowing */
                }
                .language-chart-container {
                    display: flex;
                    flex-direction: column;
                    height: 400px; /* Aumentar más la altura para dar más espacio */
                    position: relative; /* Asegurar que el contenedor sea relativo */
                    overflow: visible; /* Permitir que la leyenda sea visible */
                }
                .language-chart-container canvas {
                    max-height: 340px; /* Ensure chart doesn't overflow */
                    width: 100% !important;
                    height: 100% !important;
                    margin: 0 auto; /* Centrar el canvas */
                }
                h2 {
                    color: var(--text-primary);
                    margin-top: 0;
                    margin-bottom: 0;
                    font-size: 1.3rem;
                    padding-bottom: 0;
                }
                .stat-value {
                    font-size: 2.2rem;
                    font-weight: bold;
                    color: var(--accent-color);
                    margin: 0.5rem 0;
                }
                .stat-label {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-weight: 500;
                }
                .stat-icon {
                    float: right;
                    font-size: 1.5rem;
                    opacity: 0.7;
                }
                .stat-trend {
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    margin-top: 0.5rem;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.95rem;
                }
                thead {
                    border-bottom: 2px solid var(--card-border);
                }
                th, td {
                    padding: 12px 8px;
                    text-align: left;
                }
                tbody tr {
                    border-bottom: 1px solid var(--card-border);
                }
                tbody tr:hover {
                    background-color: var(--hover-bg);
                }
                th {
                    font-weight: 600;
                    color: var(--text-primary);
                }
                .language-badge {
                    display: inline-block;
                    padding: 3px 8px;
                    border-radius: 12px;
                    font-size: 0.85rem;
                    background-color: var(--hover-bg);
                }
                .footer {
                    text-align: center;
                    padding: 1rem;
                    margin-top: 2rem;
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    border-top: 1px solid var(--card-border);
                }
                .footer a {
                    color: var(--accent-color);
                    text-decoration: none;
                }
                .footer a:hover {
                    text-decoration: underline;
                }
                .chart-tabs {
                    display: flex;
                    margin-bottom: 1rem;
                }
                .chart-tab {
                    padding: 0.5rem 1rem;
                    cursor: pointer;
                    border-bottom: 2px solid transparent;
                    margin-right: 1rem;
                }
                .chart-tab.active {
                    border-bottom: 2px solid var(--accent-color);
                    color: var(--accent-color);
                }
                .btn {
                    background-color: var(--accent-color);
                    color: #111;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    margin-top: 1rem;
                }
                .btn:hover {
                    background-color: #3ab5db;
                }
                .btn-outline {
                    background-color: transparent;
                    color: var(--accent-color);
                    border: 1px solid var(--accent-color);
                }
                .btn-outline:hover {
                    background-color: rgba(76, 201, 240, 0.1);
                }
                .actions {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    margin-top: 1rem;
                }
                .no-data {
                    text-align: center;
                    padding: 3rem;
                    color: var(--text-secondary);
                }
                .no-data p {
                    margin-bottom: 2rem;
                }
                
                /* Estilos para tarjetas mejoradas */
                .filter-container {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                }
                
                .filter-button {
                    background-color: var(--card-bg);
                    color: var(--text-secondary);
                    border: 1px solid var(--card-border);
                    padding: 6px 14px;
                    margin: 0 5px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: all 0.2s ease;
                }
                
                .filter-button:hover {
                    background-color: var(--hover-bg);
                }
                
                .filter-button.active {
                    background-color: var(--accent-color);
                    color: #111;
                    border-color: var(--accent-color);
                }
                
                /* Estilos para tarjetas mejoradas */
                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.8rem;
                }
                
                .card-title {
                    margin: 0;
                    font-size: 1.2rem;
                    font-weight: 600;
                }
                
                .card-icon {
                    font-size: 1.5rem;
                    opacity: 0.7;
                }
                
                /* Estilos para tooltips personalizados */
                .tooltip {
                    position: relative;
                    display: inline-block;
                    cursor: help;
                }
                
                .tooltip .tooltip-text {
                    visibility: hidden;
                    width: 200px;
                    background-color: var(--card-bg);
                    color: var(--text-primary);
                    text-align: center;
                    border-radius: 6px;
                    padding: 8px;
                    position: absolute;
                    z-index: 1;
                    bottom: 125%;
                    left: 50%;
                    margin-left: -100px;
                    opacity: 0;
                    transition: opacity 0.3s;
                    font-size: 0.85rem;
                    border: 1px solid var(--card-border);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }
                
                .tooltip:hover .tooltip-text {
                    visibility: visible;
                    opacity: 1;
                }
            </style>
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="theme-switch-wrapper">
                        <span class="theme-icon">🌙</span>
                        <label class="theme-switch">
                            <input type="checkbox" id="theme-toggle">
                            <span class="slider"></span>
                        </label>
                        <span class="theme-icon">☀️</span>
                    </div>
                    <h1>OpenCodeTime Dashboard</h1>
                    <p>Seguimiento de tu tiempo de programación</p>
                </div>
                
                <div id="content">
                    <!-- Se mostrará el contenido según haya datos o no -->
                    <div id="loading" style="text-align: center; padding: 3rem;">
                        <p>Cargando datos...</p>
                    </div>
                </div>

                <div class="footer">
                    <p>OpenCodeTime &copy; 2025 | Desarrollado por <a href="https://github.com/joanlopez22" target="_blank">Joan Lopez Ramirez</a></p>
                </div>
            </div>
            
            <script>
                const vscode = acquireVsCodeApi();
                
                // Gestión del tema
                const themeToggle = document.getElementById('theme-toggle');
                
                // Cargar preferencia de tema guardada
                const savedTheme = localStorage.getItem('theme') || 'dark';
                if (savedTheme === 'light') {
                    document.documentElement.setAttribute('data-theme', 'light');
                    themeToggle.checked = true;
                }
                
                // Cambiar tema cuando se hace clic en el switch
                themeToggle.addEventListener('change', function() {
                    if (this.checked) {
                        document.documentElement.setAttribute('data-theme', 'light');
                        localStorage.setItem('theme', 'light');
                    } else {
                        document.documentElement.setAttribute('data-theme', 'dark');
                        localStorage.setItem('theme', 'dark');
                    }
                    
                    // Actualizar colores de los gráficos si existen
                    updateChartsTheme();
                });
                
                // Función para actualizar los colores de los gráficos según el tema
                function updateChartsTheme() {
                    const isDarkTheme = document.documentElement.getAttribute('data-theme') !== 'light';
                    
                    // Actualizar configuración de Chart.js
                    Chart.defaults.color = isDarkTheme ? '#a0a0a0' : '#666666';
                    Chart.defaults.borderColor = isDarkTheme ? '#3d3d3d' : '#e0e0e0';
                    
                    // Actualizar gráficos existentes
                    const charts = Object.values(Chart.instances || {});
                    charts.forEach(chart => {
                        chart.update();
                    });
                }

                // Variables para filtrado
                let allStatsData = [];
                let currentPeriod = 'all'; // 'all', 'week', 'month', 'year'
                
                // Solicitar estadísticas al cargar la página
                vscode.postMessage({ command: 'getStats' });
                
                // Procesar estadísticas cuando llegan
                window.addEventListener('message', event => {
                    const message = event.data;
                    
                    if (message.command === 'statsData') {
                        allStatsData = message.data;
                        filterAndRenderData();
                    }
                });

                // Función para filtrar datos según el periodo seleccionado
                function filterAndRenderData() {
                    if (!allStatsData || allStatsData.length === 0) {
                        renderNoData();
                        return;
                    }

                    let filteredData = [...allStatsData];
                    
                    // Filtrar datos según el periodo seleccionado
                    if (currentPeriod !== 'all') {
                        const today = new Date();
                        let cutoffDate = new Date();
                        
                        switch (currentPeriod) {
                            case 'week':
                                cutoffDate.setDate(today.getDate() - 7);
                                break;
                            case 'month':
                                cutoffDate.setMonth(today.getMonth() - 1);
                                break;
                            case 'year':
                                cutoffDate.setFullYear(today.getFullYear() - 1);
                                break;
                        }
                        
                        filteredData = filteredData.filter(day => {
                            const dayDate = new Date(day.date);
                            return dayDate >= cutoffDate;
                        });
                    }
                    
                    renderDashboard(filteredData);
                }

                // Formatear tiempo en milisegundos a formato legible
                function formatTime(ms) {
                    const seconds = Math.floor((ms / 1000) % 60);
                    const minutes = Math.floor((ms / (1000 * 60)) % 60);
                    const hours = Math.floor(ms / (1000 * 60 * 60));
                    
                    return \`\${hours.toString().padStart(2, '0')}:\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
                }

                // Formatear tiempo en horas y minutos
                function formatHoursAndMinutes(ms) {
                    const minutes = Math.floor((ms / (1000 * 60)) % 60);
                    const hours = Math.floor(ms / (1000 * 60 * 60));
                    
                    if (hours === 0) {
                        return \`\${minutes} min\`;
                    } else if (minutes === 0) {
                        return \`\${hours} h\`;
                    } else {
                        return \`\${hours} h \${minutes} min\`;
                    }
                }
                
                // Formatear tiempo en horas con un decimal
                function formatHours(ms) {
                    return (ms / (1000 * 60 * 60)).toFixed(1);
                }
                
                // Formatear fecha en formato legible
                function formatDate(dateString) {
                    const options = { day: 'numeric', month: 'short' };
                    return new Date(dateString).toLocaleDateString('es-ES', options);
                }

                // Renderizar el contenido cuando no hay datos
                function renderNoData() {
                    const contentDiv = document.getElementById('content');
                    contentDiv.innerHTML = \`
                        <div class="no-data">
                            <p>No hay datos de codificación disponibles todavía. Empieza a programar y vuelve más tarde.</p>
                            <button class="btn" onclick="location.reload()">Refrescar</button>
                        </div>
                    \`;
                }
                
                // Renderizar el dashboard con los datos
                function renderDashboard(stats) {
                    if (!stats || stats.length === 0) {
                        renderNoData();
                        return;
                    }

                    // Limpiar el contenedor de carga
                    const contentDiv = document.getElementById('content');
                    
                    // Calcular estadísticas
                    let totalTime = 0;
                    let todayTime = 0;
                    const languageStats = {};
                    const today = new Date().toISOString().split('T')[0];
                    
                    // Procesar datos
                    stats.forEach(day => {
                        totalTime += day.totalDuration;
                        
                        if (day.date === today) {
                            todayTime = day.totalDuration;
                        }
                        
                        // Sumar estadísticas por lenguaje
                        Object.entries(day.languageBreakdown).forEach(([lang, time]) => {
                            languageStats[lang] = (languageStats[lang] || 0) + time;
                        });
                    });
                    
                    // Calcular promedio diario
                    const avgTime = totalTime / stats.length;
                    
                    // Encontrar el lenguaje más usado
                    let topLang = 'N/A';
                    let topTime = 0;
                    Object.entries(languageStats).forEach(([lang, time]) => {
                        if (time > topTime) {
                            topLang = lang;
                            topTime = time;
                        }
                    });

                    // Construir HTML para el dashboard
                    contentDiv.innerHTML = \`
                        <div class="filter-container">
                            <button class="filter-button \${currentPeriod === 'all' ? 'active' : ''}" data-period="all">Todo</button>
                            <button class="filter-button \${currentPeriod === 'year' ? 'active' : ''}" data-period="year">Último año</button>
                            <button class="filter-button \${currentPeriod === 'month' ? 'active' : ''}" data-period="month">Último mes</button>
                            <button class="filter-button \${currentPeriod === 'week' ? 'active' : ''}" data-period="week">Última semana</button>
                        </div>

                        <div class="stats-grid">
                            <div class="card">
                                <div class="card-header">
                                    <div>
                                        <div class="stat-label">Tiempo total</div>
                                        <div class="stat-value" id="total-time">\${formatTime(totalTime)}</div>
                                    </div>
                                    <div class="card-icon tooltip">⏱️
                                        <span class="tooltip-text">Tiempo total de codificación en el periodo seleccionado</span>
                                    </div>
                                </div>
                                <div class="stat-trend">Periodo seleccionado</div>
                            </div>
                            <div class="card">
                                <div class="card-header">
                                    <div>
                                        <div class="stat-label">Tiempo hoy</div>
                                        <div class="stat-value" id="today-time">\${formatTime(todayTime)}</div>
                                    </div>
                                    <div class="card-icon tooltip">📅
                                        <span class="tooltip-text">Tiempo de codificación del día de hoy</span>
                                    </div>
                                </div>
                                <div class="stat-trend" id="today-date">\${formatDate(today)}</div>
                            </div>
                            <div class="card">
                                <div class="card-header">
                                    <div>
                                        <div class="stat-label">Promedio diario</div>
                                        <div class="stat-value" id="avg-time">\${formatTime(avgTime)}</div>
                                    </div>
                                    <div class="card-icon tooltip">📊
                                        <span class="tooltip-text">Promedio diario de tiempo de codificación</span>
                                    </div>
                                </div>
                                <div class="stat-trend" id="days-tracked">\${stats.length} días registrados</div>
                            </div>
                            <div class="card">
                                <div class="card-header">
                                    <div>
                                        <div class="stat-label">Lenguaje más usado</div>
                                        <div class="stat-value" id="top-lang">\${topLang}</div>
                                    </div>
                                    <div class="card-icon tooltip">💻
                                        <span class="tooltip-text">Lenguaje en el que has pasado más tiempo</span>
                                    </div>
                                </div>
                                <div class="stat-trend" id="top-lang-time">\${formatHoursAndMinutes(topTime)}</div>
                            </div>
                        </div>
                        
                        <div class="card chart-container">
                            <div class="card-header">
                                <h2>Tiempo de codificación por día</h2>
                                <div class="tooltip">ℹ️
                                    <span class="tooltip-text">Muestra las horas dedicadas a programar cada día</span>
                                </div>
                            </div>
                            <canvas id="daily-chart"></canvas>
                        </div>
                        
                        <div class="card chart-container language-chart-container">
                            <div class="card-header">
                                <h2>Desglose por lenguaje</h2>
                                <div class="tooltip">ℹ️
                                    <span class="tooltip-text">Distribución del tiempo por lenguaje de programación</span>
                                </div>
                            </div>
                            <div style="position: relative; height: 340px;">
                                <canvas id="lang-chart"></canvas>
                            </div>
                        </div>
                        
                        <div class="card">
                            <div class="card-header">
                                <h2>Actividad reciente</h2>
                                <div class="tooltip">ℹ️
                                    <span class="tooltip-text">Últimas sesiones de codificación registradas</span>
                                </div>
                            </div>
                            <table id="recent-activity">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Duración</th>
                                        <th>Lenguaje</th>
                                        <th>Proyecto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Se llenará con JavaScript -->
                                </tbody>
                            </table>
                        </div>

                        <div class="actions">
                            <button class="btn btn-outline" onclick="exportStats()">Exportar datos</button>
                            <button class="btn" onclick="location.reload()">Refrescar</button>
                        </div>
                        
                        <div class="footer-info" style="text-align: center; margin-top: 2rem; font-size: 0.9rem; color: var(--text-secondary);">
                            <p>Selecciona un periodo de tiempo para filtrar los datos o cambia entre tema claro y oscuro con el interruptor en la parte superior.</p>
                        </div>
                    \`;
                    
                    // Añadir manejadores de eventos para los botones de filtro
                    document.querySelectorAll('.filter-button').forEach(button => {
                        button.addEventListener('click', function() {
                            const period = this.getAttribute('data-period');
                            if (period !== currentPeriod) {
                                currentPeriod = period;
                                filterAndRenderData();
                            }
                        });
                    });
                    
                    // Preparar datos para gráficos
                    const sortedDays = [...stats].sort((a, b) => new Date(a.date) - new Date(b.date));
                    const dates = sortedDays.map(day => formatDate(day.date));
                    const durations = sortedDays.map(day => {
                        const ms = day.totalDuration;
                        const hours = Math.floor(ms / (1000 * 60 * 60));
                        const minutes = Math.floor((ms / (1000 * 60)) % 60);
                        return {
                            hours,
                            minutes,
                            totalHours: ms / (1000 * 60 * 60)
                        };
                    });
                    
                    // Configuración de colores para el tema oscuro
                    Chart.defaults.color = '#a0a0a0';
                    Chart.defaults.borderColor = '#3d3d3d';
                    
                    // Gráfico de tiempo por día
                    const dailyCtx = document.getElementById('daily-chart').getContext('2d');
                    new Chart(dailyCtx, {
                        type: 'bar',
                        data: {
                            labels: dates,
                            datasets: [{
                                label: 'Horas de codificación',
                                data: durations.map(d => d.totalHours),
                                backgroundColor: document.documentElement.getAttribute('data-theme') === 'light' 
                                    ? 'rgba(0, 120, 212, 0.6)' 
                                    : 'rgba(76, 201, 240, 0.6)',
                                borderColor: document.documentElement.getAttribute('data-theme') === 'light' 
                                    ? 'rgba(0, 120, 212, 1)' 
                                    : 'rgba(76, 201, 240, 1)',
                                borderWidth: 1,
                                borderRadius: 6,
                                maxBarThickness: 50
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false
                                },
                                tooltip: {
                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                    titleColor: '#ffffff',
                                    bodyColor: '#ffffff',
                                    callbacks: {
                                        label: function(context) {
                                            const data = durations[context.dataIndex];
                                            if (data.hours === 0) {
                                                return \`\${data.minutes} minutos\`;
                                            } else if (data.minutes === 0) {
                                                return \`\${data.hours} horas\`;
                                            } else {
                                                return \`\${data.hours} h \${data.minutes} min\`;
                                            }
                                        }
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    grid: {
                                        display: false,
                                        color: 'rgba(255, 255, 255, 0.1)'
                                    },
                                    ticks: {
                                        color: '#a0a0a0'
                                    }
                                },
                                y: {
                                    beginAtZero: true,
                                    grid: {
                                        color: 'rgba(255, 255, 255, 0.1)',
                                        borderDash: [2, 2]
                                    },
                                    ticks: {
                                        color: '#a0a0a0',
                                        callback: function(value) {
                                            return value + ' h';
                                        }
                                    },
                                    title: {
                                        display: true,
                                        text: 'Horas',
                                        color: '#a0a0a0'
                                    }
                                }
                            }
                        }
                    });
                    
                    // Crear un contenedor para el gráfico de lenguajes que controle mejor el tamaño
                    const langChartContainer = document.getElementById('lang-chart').parentElement;
                    langChartContainer.style.position = 'relative';
                    
                    const langLabels = Object.keys(languageStats);
                    const langData = Object.values(languageStats).map(time => time / (1000 * 60 * 60)); // Convertir a horas
                    
                    const langColors = [
                        'rgba(76, 201, 240, 0.8)',
                        'rgba(94, 129, 172, 0.8)',
                        'rgba(235, 203, 139, 0.8)',
                        'rgba(163, 190, 140, 0.8)',
                        'rgba(180, 142, 173, 0.8)',
                        'rgba(208, 135, 112, 0.8)',
                        'rgba(129, 161, 193, 0.8)',
                        'rgba(191, 97, 106, 0.8)',
                        'rgba(143, 188, 187, 0.8)',
                        'rgba(235, 203, 139, 0.8)'
                    ];
                    
                    const langCtx = document.getElementById('lang-chart').getContext('2d');
                    new Chart(langCtx, {
                        type: 'doughnut', // Usar doughnut para mejor visualización
                        data: {
                            labels: langLabels,
                            datasets: [{
                                label: 'Horas por lenguaje',
                                data: langData,
                                backgroundColor: langColors,
                                borderColor: 'rgba(0, 0, 0, 0.3)',
                                borderWidth: 1,
                                hoverOffset: 10
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            layout: {
                                padding: {
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    bottom: 0
                                }
                            },
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'bottom',
                                    align: 'center',
                                    labels: {
                                        boxWidth: 12,
                                        padding: 10,
                                        color: '#a0a0a0',
                                        font: {
                                            size: 10 // Reducir tamaño de fuente para leyendas
                                        },
                                        generateLabels: function(chart) {
                                            // Personalizar las etiquetas para que sean más cortas si es necesario
                                            const original = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                                            return original.map(label => {
                                                // Limitar longitud de etiquetas muy largas
                                                if (label.text && label.text.length > 10) {
                                                    label.text = label.text.substring(0, 10) + '...';
                                                }
                                                return label;
                                            });
                                        }
                                    }
                                },
                                tooltip: {
                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                    titleColor: '#ffffff',
                                    bodyColor: '#ffffff',
                                    callbacks: {
                                        label: function(context) {
                                            const value = context.parsed;
                                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                            const percentage = Math.round((value / total) * 100);
                                            
                                            // Convertir horas a formato horas y minutos
                                            const hours = Math.floor(value);
                                            const minutes = Math.round((value - hours) * 60);
                                            let timeStr;
                                            
                                            if (hours === 0) {
                                                timeStr = \`\${minutes} min\`;
                                            } else if (minutes === 0) {
                                                timeStr = \`\${hours} h\`;
                                            } else {
                                                timeStr = \`\${hours} h \${minutes} min\`;
                                            }
                                            
                                            return \`\${context.label}: \${timeStr} (\${percentage}%)\`;
                                        }
                                    }
                                }
                            }
                        }
                    });
                    
                    // Mostrar actividad reciente
                    const recentActivityTable = document.getElementById('recent-activity').getElementsByTagName('tbody')[0];
                    recentActivityTable.innerHTML = '';
                    
                    // Obtener las sesiones más recientes
                    const allSessions = [];
                    stats.forEach(day => {
                        day.sessions.forEach(session => {
                            allSessions.push({
                                date: day.date,
                                duration: session.duration,
                                language: session.language,
                                project: session.project
                            });
                        });
                    });
                    
                    // Ordenar por fecha y mostrar las 10 más recientes
                    allSessions
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 10)
                        .forEach(session => {
                            const row = recentActivityTable.insertRow();
                            
                            const dateCell = row.insertCell(0);
                            dateCell.textContent = formatDate(session.date);
                            
                            const durationCell = row.insertCell(1);
                            durationCell.textContent = formatTime(session.duration);
                            
                            const langCell = row.insertCell(2);
                            const langBadge = document.createElement('span');
                            langBadge.className = 'language-badge';
                            langBadge.textContent = session.language;
                            langCell.appendChild(langBadge);
                            
                            const projectCell = row.insertCell(3);
                            projectCell.textContent = session.project;
                        });
                }

                // Función para exportar estadísticas
                function exportStats() {
                    vscode.postMessage({ command: 'exportData' });
                }
            </script>
        </body>
        </html>
    `;
} 