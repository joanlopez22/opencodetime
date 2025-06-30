// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface CodingSession {
	startTime: number;
	endTime: number | null;
	language: string;
	project: string;
	duration?: number;
}

interface DailyCodingStats {
	date: string;
	totalDuration: number;
	sessions: CodingSession[];
	languageBreakdown: Record<string, number>;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('OpenCodeTime está activo!');

	// Estado de la sesión actual
	let currentSession: CodingSession | null = null;
	let statusBarItem: vscode.StatusBarItem;
	let timer: NodeJS.Timeout | null = null;
	const storageDir = path.join(context.globalStoragePath);
	
	// Asegurar que el directorio de almacenamiento existe
	if (!fs.existsSync(storageDir)) {
		fs.mkdirSync(storageDir, { recursive: true });
	}

	// Inicializar el elemento de la barra de estado
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	statusBarItem.command = 'opencodetime.showDashboard';
	context.subscriptions.push(statusBarItem);
	
	// Iniciar seguimiento cuando se abre un documento
	function startTracking() {
		if (!currentSession) {
			const activeEditor = vscode.window.activeTextEditor;
			if (activeEditor) {
				const language = activeEditor.document.languageId;
				const workspaceFolder = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);
				const project = workspaceFolder ? workspaceFolder.name : 'sin-proyecto';
				
				currentSession = {
					startTime: Date.now(),
					endTime: null,
					language,
					project
				};
				
				updateStatusBar();
				startStatusBarTimer();
			}
		}
	}

	// Función para detener el seguimiento
	function stopTracking() {
		if (currentSession) {
			currentSession.endTime = Date.now();
			currentSession.duration = currentSession.endTime - currentSession.startTime;
			
			// Solo guardar si la duración es significativa (más de 5 segundos)
			if (currentSession.duration > 5000) {
				saveSession(currentSession);
			}
			
			currentSession = null;
			if (timer) {
				clearInterval(timer);
				timer = null;
			}
			updateStatusBar();
		}
	}

	// Actualizar la barra de estado
	function updateStatusBar() {
		if (currentSession) {
			const durationMs = Date.now() - currentSession.startTime;
			const minutes = Math.floor(durationMs / 60000);
			const seconds = Math.floor((durationMs % 60000) / 1000);
			statusBarItem.text = `$(clock) Codificando: ${minutes}m ${seconds}s`;
			statusBarItem.show();
		} else {
			statusBarItem.text = '$(clock) Iniciar Codificación';
			statusBarItem.show();
		}
	}
	
	function startStatusBarTimer() {
		if (timer) {
			clearInterval(timer);
		}
		timer = setInterval(updateStatusBar, 1000);
	}

	// Guardar la sesión en el archivo correspondiente
	function saveSession(session: CodingSession) {
		const date = new Date(session.startTime);
		const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
		const filePath = path.join(storageDir, `${dateStr}.json`);
		
		let dailyStats: DailyCodingStats;
		
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
			dailyStats = {
				date: dateStr,
				totalDuration: session.duration!,
				sessions: [session],
				languageBreakdown: {
					[session.language]: session.duration!
				}
			};
		}
		
		fs.writeFileSync(filePath, JSON.stringify(dailyStats, null, 2));
	}

	// Mostrar el dashboard
	const showDashboard = async () => {
		const panel = vscode.window.createWebviewPanel(
			'openCodeTimeDashboard',
			'OpenCodeTime Dashboard',
			vscode.ViewColumn.One,
			{
				enableScripts: true
			}
		);
		
		panel.webview.html = await getDashboardHtml(context);
		
		// Manejar mensajes desde el webview
		panel.webview.onDidReceiveMessage(
			message => {
				if (message.command === 'getStats') {
					const stats = getAllStats();
					panel.webview.postMessage({ command: 'statsData', data: stats });
				}
			},
			undefined,
			context.subscriptions
		);
	};

	// Obtener estadísticas de todos los días
	function getAllStats() {
		const stats: DailyCodingStats[] = [];
		
		if (fs.existsSync(storageDir)) {
			const files = fs.readdirSync(storageDir);
			
			files.forEach(file => {
				if (file.endsWith('.json')) {
					const filePath = path.join(storageDir, file);
					const content = fs.readFileSync(filePath, 'utf8');
					stats.push(JSON.parse(content));
				}
			});
		}
		
		return stats;
	}

	// Generar el HTML para el dashboard
	async function getDashboardHtml(context: vscode.ExtensionContext) {
		return `
			<!DOCTYPE html>
			<html lang="es">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>OpenCodeTime Dashboard</title>
				<style>
					body {
						font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Ubuntu', 'Droid Sans', sans-serif;
						padding: 0 20px;
						color: var(--vscode-foreground);
						background-color: var(--vscode-editor-background);
					}
					.container {
						max-width: 1000px;
						margin: 0 auto;
					}
					.header {
						text-align: center;
						margin-bottom: 2rem;
					}
					.card {
						background-color: var(--vscode-editor-inactiveSelectionBackground);
						border-radius: 4px;
						padding: 1rem;
						margin-bottom: 1rem;
						box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
					}
					.stats-grid {
						display: grid;
						grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
						gap: 1rem;
					}
					.chart-container {
						height: 300px;
						margin-bottom: 2rem;
					}
					h2 {
						color: var(--vscode-editor-foreground);
					}
					.stat-value {
						font-size: 2rem;
						font-weight: bold;
						color: var(--vscode-textLink-foreground);
					}
					.stat-label {
						font-size: 0.9rem;
						color: var(--vscode-descriptionForeground);
					}
					table {
						width: 100%;
						border-collapse: collapse;
					}
					th, td {
						padding: 8px;
						text-align: left;
						border-bottom: 1px solid var(--vscode-widget-shadow);
					}
					th {
						background-color: var(--vscode-editor-selectionBackground);
						color: var(--vscode-editor-foreground);
					}
				</style>
				<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
			</head>
			<body>
				<div class="container">
					<div class="header">
						<h1>OpenCodeTime Dashboard</h1>
						<p>Seguimiento de tu tiempo de programación</p>
					</div>
					
					<div class="stats-grid">
						<div class="card">
							<div class="stat-label">Tiempo total de codificación</div>
							<div class="stat-value" id="total-time">--:--:--</div>
						</div>
						<div class="card">
							<div class="stat-label">Tiempo hoy</div>
							<div class="stat-value" id="today-time">--:--:--</div>
						</div>
						<div class="card">
							<div class="stat-label">Promedio diario</div>
							<div class="stat-value" id="avg-time">--:--:--</div>
						</div>
						<div class="card">
							<div class="stat-label">Lenguaje más usado</div>
							<div class="stat-value" id="top-lang">--</div>
						</div>
					</div>
					
					<div class="card chart-container">
						<h2>Tiempo de codificación por día</h2>
						<canvas id="daily-chart"></canvas>
					</div>
					
					<div class="card chart-container">
						<h2>Desglose por lenguaje</h2>
						<canvas id="lang-chart"></canvas>
					</div>
					
					<div class="card">
						<h2>Actividad reciente</h2>
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
				</div>
				
				<script>
					const vscode = acquireVsCodeApi();
					
					// Solicitar estadísticas al cargar la página
					vscode.postMessage({ command: 'getStats' });
					
					// Procesar estadísticas cuando llegan
					window.addEventListener('message', event => {
						const message = event.data;
						
						if (message.command === 'statsData') {
							renderDashboard(message.data);
						}
					});
					
					// Formatear tiempo en milisegundos a formato legible
					function formatTime(ms) {
						const seconds = Math.floor((ms / 1000) % 60);
						const minutes = Math.floor((ms / (1000 * 60)) % 60);
						const hours = Math.floor(ms / (1000 * 60 * 60));
						
						return \`\${hours.toString().padStart(2, '0')}:\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
					}
					
					// Renderizar el dashboard con los datos
					function renderDashboard(stats) {
						if (!stats || stats.length === 0) {
							document.getElementById('total-time').textContent = '00:00:00';
							document.getElementById('today-time').textContent = '00:00:00';
							document.getElementById('avg-time').textContent = '00:00:00';
							document.getElementById('top-lang').textContent = 'N/A';
							return;
						}
						
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
						
						// Actualizar estadísticas generales
						document.getElementById('total-time').textContent = formatTime(totalTime);
						document.getElementById('today-time').textContent = formatTime(todayTime);
						document.getElementById('avg-time').textContent = formatTime(avgTime);
						document.getElementById('top-lang').textContent = topLang;
						
						// Preparar datos para gráficos
						const sortedDays = [...stats].sort((a, b) => new Date(a.date) - new Date(b.date));
						const dates = sortedDays.map(day => day.date);
						const durations = sortedDays.map(day => day.totalDuration / (1000 * 60 * 60)); // Convertir a horas
						
						// Gráfico de tiempo por día
						const dailyCtx = document.getElementById('daily-chart').getContext('2d');
						new Chart(dailyCtx, {
							type: 'bar',
							data: {
								labels: dates,
								datasets: [{
									label: 'Horas de codificación',
									data: durations,
									backgroundColor: 'rgba(75, 192, 192, 0.6)',
									borderColor: 'rgba(75, 192, 192, 1)',
									borderWidth: 1
								}]
							},
							options: {
								responsive: true,
								maintainAspectRatio: false,
								scales: {
									y: {
										beginAtZero: true,
										title: {
											display: true,
											text: 'Horas'
										}
									}
								}
							}
						});
						
						// Gráfico de desglose por lenguaje
						const langLabels = Object.keys(languageStats);
						const langData = Object.values(languageStats).map(time => time / (1000 * 60 * 60)); // Convertir a horas
						
						const langCtx = document.getElementById('lang-chart').getContext('2d');
						new Chart(langCtx, {
							type: 'pie',
							data: {
								labels: langLabels,
								datasets: [{
									label: 'Horas por lenguaje',
									data: langData,
									backgroundColor: [
										'rgba(255, 99, 132, 0.6)',
										'rgba(54, 162, 235, 0.6)',
										'rgba(255, 206, 86, 0.6)',
										'rgba(75, 192, 192, 0.6)',
										'rgba(153, 102, 255, 0.6)',
										'rgba(255, 159, 64, 0.6)',
										'rgba(255, 99, 132, 0.6)',
										'rgba(54, 162, 235, 0.6)',
										'rgba(255, 206, 86, 0.6)',
										'rgba(75, 192, 192, 0.6)'
									]
								}]
							},
							options: {
								responsive: true,
								maintainAspectRatio: false
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
								dateCell.textContent = session.date;
								
								const durationCell = row.insertCell(1);
								durationCell.textContent = formatTime(session.duration);
								
								const langCell = row.insertCell(2);
								langCell.textContent = session.language;
								
								const projectCell = row.insertCell(3);
								projectCell.textContent = session.project;
							});
					}
				</script>
			</body>
			</html>
		`;
	}

	// Registrar comando para mostrar el dashboard
	const dashboardCommand = vscode.commands.registerCommand('opencodetime.showDashboard', showDashboard);

	// Registrar comando para iniciar/detener seguimiento manualmente
	const toggleTrackingCommand = vscode.commands.registerCommand('opencodetime.toggleTracking', () => {
		if (currentSession) {
			stopTracking();
			vscode.window.showInformationMessage('Seguimiento de tiempo detenido.');
		} else {
			startTracking();
			vscode.window.showInformationMessage('Seguimiento de tiempo iniciado.');
		}
	});

	// Eventos para iniciar y detener el seguimiento
	const onTextEditorChange = vscode.window.onDidChangeActiveTextEditor(editor => {
		if (editor) {
			if (!currentSession) {
				startTracking();
			}
		}
	});

	// Detectar cuando se deja de codificar (inactividad)
	let lastActivity = Date.now();
	const INACTIVITY_THRESHOLD = 5 * 60 * 1000; // 5 minutos
	
	const onTextDocumentChange = vscode.workspace.onDidChangeTextDocument(() => {
		lastActivity = Date.now();
		if (!currentSession) {
			startTracking();
		}
	});
	
	// Verificar inactividad periódicamente
	setInterval(() => {
		if (currentSession && Date.now() - lastActivity > INACTIVITY_THRESHOLD) {
			stopTracking();
		}
	}, 60000);

	// Iniciar el seguimiento si hay un editor activo al activar la extensión
	if (vscode.window.activeTextEditor) {
		startTracking();
	}

	// Agregar todos los disposables al contexto
	context.subscriptions.push(
		dashboardCommand,
		toggleTrackingCommand,
		onTextEditorChange,
		onTextDocumentChange
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
