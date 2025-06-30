# Instrucciones para publicar OpenCodeTime en VS Code Marketplace

Este documento detalla los pasos necesarios para publicar la extensión OpenCodeTime en el Visual Studio Code Marketplace.

## Requisitos previos

1. **Node.js y npm**: Asegúrate de tener Node.js instalado (versión 14 o superior)
2. **Cuenta en GitHub**: Para alojar el código fuente
3. **Cuenta en Microsoft**: Para acceder al Visual Studio Marketplace
4. **Visual Studio Code Extension Manager (vsce)**: Herramienta para empaquetar y publicar extensiones

## Pasos para publicar

### 1. Crear un Personal Access Token (PAT)

1. Inicia sesión en [Azure DevOps](https://dev.azure.com/)
2. Haz clic en tu perfil en la esquina superior derecha
3. Selecciona "Personal access tokens"
4. Haz clic en "New Token"
5. Configura el token:
   - Nombre: `vsce-opencodetime`
   - Organización: All accessible organizations
   - Expiración: 1 año (o tu preferencia)
   - Scopes: Custom defined → Marketplace → Manage
6. Haz clic en "Create" y guarda el token generado en un lugar seguro

### 2. Instalar la herramienta vsce

```bash
npm install -g @vscode/vsce
```

### 3. Iniciar sesión con el token

```bash
vsce login joanlopez22
```

Cuando se te solicite, ingresa el Personal Access Token que generaste en el paso 1.

### 4. Empaquetar la extensión (opcional, para probar)

```bash
vsce package
```

Esto generará un archivo `.vsix` que puedes instalar localmente para probar.

### 5. Publicar la extensión

```bash
vsce publish
```

O si quieres especificar una versión concreta:

```bash
vsce publish [major|minor|patch]
```

Por ejemplo, para la primera versión:

```bash
vsce publish patch
```

### 6. Verificar la publicación

Después de la publicación, tu extensión aparecerá en el [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/). Puede tardar unos minutos en propagarse.

## Actualizar la extensión

Para publicar actualizaciones:

1. Haz los cambios necesarios en el código
2. Actualiza la versión en `package.json` (o usa vsce publish con major/minor/patch)
3. Actualiza el `CHANGELOG.md` con las novedades
4. Ejecuta `vsce publish`

## Resolución de problemas comunes

### Error de token expirado
Si tu token expira, necesitarás generar uno nuevo siguiendo los primeros pasos.

### Error de nombre de publicador
Asegúrate de que el campo `publisher` en `package.json` coincide exactamente con tu nombre de usuario en el marketplace.

### Imágenes no visibles
Asegúrate de que todas las imágenes referenciadas en el README.md están incluidas en el paquete y no están excluidas en `.vscodeignore`. 