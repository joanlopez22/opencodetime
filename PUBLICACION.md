# 📦 Guía de publicación de OpenCodeTime en VS Code Marketplace

Este documento detalla paso a paso el proceso para publicar y actualizar la extensión OpenCodeTime en el Visual Studio Code Marketplace.

## 📋 Requisitos previos

1. **Node.js y npm**: Asegúrate de tener Node.js instalado (versión 14 o superior)
2. **Cuenta en GitHub**: Para alojar el código fuente y gestionar versiones
3. **Cuenta en Microsoft**: Para acceder al Visual Studio Marketplace
4. **Visual Studio Code Extension Manager (vsce)**: Herramienta para empaquetar y publicar extensiones
5. **Git**: Para gestionar el control de versiones

## 🚀 Proceso de publicación

### 1. Preparar el proyecto

Antes de publicar, asegúrate de que:

- El código está correctamente versionado en Git
- La estructura del proyecto es correcta
- Las dependencias están actualizadas (`npm install`)
- La extensión compila sin errores (`npm run compile`)
- Los lints pasan correctamente (`npm run lint`)
- La versión en `package.json` es la adecuada para la publicación

### 2. Crear un Personal Access Token (PAT) en Azure DevOps

1. Inicia sesión en [Azure DevOps](https://dev.azure.com/)
2. Haz clic en tu perfil en la esquina superior derecha
3. Selecciona "Personal access tokens"
4. Haz clic en "New Token"
5. Configura el token:
   - **Nombre**: `vsce-opencodetime`
   - **Organización**: All accessible organizations
   - **Expiración**: 1 año (o tu preferencia)
   - **Scopes**: Custom defined → Marketplace → Manage
6. Haz clic en "Create" y guarda el token generado en un lugar seguro (no volverás a verlo)

### 3. Instalar la herramienta vsce globalmente

```bash
npm install -g @vscode/vsce
```

### 4. Iniciar sesión con tu token

```bash
vsce login joanlopez22
```

Cuando se te solicite, ingresa el Personal Access Token que generaste en el paso 2.

### 5. Actualizar el CHANGELOG.md

Es importante mantener un registro de cambios para que los usuarios sepan qué hay de nuevo en cada versión:

```markdown
# Registro de cambios

## [0.1.0] - 2023-07-01
### Añadido
- Característica 1
- Característica 2

### Corregido
- Bug 1
- Bug 2

## [0.0.1] - 2023-06-01
- Versión inicial
```

### 6. Empaquetar la extensión (opcional, para pruebas)

Este paso permite generar el archivo `.vsix` para pruebas locales antes de publicar:

```bash
vsce package
```

Esto generará un archivo como `opencodetime-0.1.0.vsix` que puedes instalar manualmente en VS Code:
- En VS Code, haz clic en la pestaña de extensiones
- Haz clic en "..." en la esquina superior derecha
- Selecciona "Instalar desde VSIX..."
- Navega hasta el archivo .vsix y selecciónalo

### 7. Publicar la extensión

Cuando estés listo para publicar:

```bash
vsce publish
```

También puedes especificar un incremento automático de versión:

```bash
vsce publish [major|minor|patch]
```

Por ejemplo:
- `vsce publish major` - Incrementa la primera cifra (1.0.0 → 2.0.0)
- `vsce publish minor` - Incrementa la segunda cifra (1.0.0 → 1.1.0)
- `vsce publish patch` - Incrementa la tercera cifra (1.0.0 → 1.0.1)

Para la primera publicación, se recomienda:

```bash
vsce publish patch
```

### 8. Verificar la publicación

Después de la publicación:

1. Visita [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/)
2. Busca "OpenCodeTime" o navega directamente a `https://marketplace.visualstudio.com/items?itemName=joanlopez22.opencodetime`
3. Verifica que toda la información se muestra correctamente
4. Comprueba que las imágenes y formatos se ven bien

> ⚠️ **Nota**: La publicación puede tardar unos minutos en propagarse completamente.

## 🔄 Actualizar la extensión

Para publicar actualizaciones cuando desarrolles nuevas características o corrijas bugs:

1. Implementa los cambios en el código
2. Actualiza la versión en `package.json` (o usa `vsce publish` con `major/minor/patch`)
3. Actualiza el `CHANGELOG.md` con las novedades
4. Asegúrate de que todo compila correctamente: `npm run compile`
5. Ejecuta `vsce publish`
6. Crea un tag de versión en Git:
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```

## ⚠️ Resolución de problemas comunes

### Error de token expirado
Si aparece un error como "Failed to publish: Authentication failed", probablemente tu token ha expirado. Genera uno nuevo siguiendo los pasos del apartado 2 y vuelve a iniciar sesión.

### Error de nombre de publicador
Asegúrate de que el campo `publisher` en `package.json` coincide exactamente con tu nombre de usuario en el marketplace. Si aparece "The publisher 'xxx' does not exist", verifica este campo.

### Imágenes no visibles en Marketplace
- Asegúrate de que todas las imágenes referenciadas en el README.md están incluidas en el paquete 
- Comprueba que las rutas son correctas (relativas al proyecto)
- Verifica que las imágenes no están excluidas en `.vscodeignore`
- Las imágenes deben estar en formato PNG o GIF

### Error "Missing mandatory field"
Si aparece un error de campo obligatorio, verifica que en tu `package.json` tienes todos estos campos:
- `name`
- `displayName`
- `description`
- `version`
- `publisher`
- `engines.vscode`
- `categories`
- `repository`

## 📌 Consejos adicionales

### Optimizar imágenes
Optimiza el tamaño de las imágenes antes de publicar para mejorar la experiencia de los usuarios:
```bash
# Instalar herramienta de optimización de imágenes
npm install -g imagemin-cli
# Optimizar imágenes
imagemin resources/screenshots/* --out-dir=resources/screenshots/
```

### Solicitar valoraciones
Anima a los usuarios a valorar tu extensión. Las valoraciones positivas aumentan la visibilidad:
```markdown
¿Te gusta OpenCodeTime? Por favor [deja una valoración](https://marketplace.visualstudio.com/items?itemName=joanlopez22.opencodetime&ssr=false#review-details) en el Marketplace.
```

### Actualizar README antes de publicar
Asegúrate de que el README.md incluye capturas de pantalla actualizadas y ejemplos de uso de las nuevas características antes de cada publicación. 