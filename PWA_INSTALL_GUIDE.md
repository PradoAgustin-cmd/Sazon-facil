# 📱 Sazón Fácil - Guía de Instalación PWA

## ✅ ¡Tu app ya es una PWA instalable!

### 🎉 ¿Qué es una PWA?
Una Progressive Web App (PWA) es una aplicación web que funciona como app nativa:
- ✅ Se instala en el dispositivo
- ✅ Funciona offline
- ✅ Tiene ícono en la pantalla de inicio
- ✅ Se abre en pantalla completa (sin barra del navegador)
- ✅ Recibe notificaciones push (opcional)

---

## 📲 Cómo instalar en Android

### Opción 1: Desde Chrome
1. Abre tu app en Chrome: `http://localhost:3000` o tu URL de producción
2. Toca el menú (⋮) en la esquina superior derecha
3. Selecciona **"Agregar a pantalla de inicio"** o **"Instalar aplicación"**
4. Confirma la instalación
5. ¡Listo! Verás el ícono "Sazón Fácil" en tu pantalla de inicio

### Opción 2: Banner automático
- Chrome mostrará un banner automático después de algunas visitas
- Solo toca "Instalar" cuando aparezca

---

## 🍎 Cómo instalar en iOS (iPhone/iPad)

1. Abre tu app en Safari
2. Toca el botón de compartir (icono de cuadrado con flecha ↑)
3. Desplázate y selecciona **"Agregar a pantalla de inicio"**
4. Edita el nombre si quieres y toca "Agregar"
5. ¡Listo! La app aparecerá en tu pantalla de inicio

---

## 💻 Cómo instalar en Desktop (Windows/Mac/Linux)

### Chrome/Edge:
1. Abre tu app en el navegador
2. Busca el ícono de instalación (➕) en la barra de direcciones
3. Haz clic en **"Instalar Sazón Fácil"**
4. La app se abrirá en su propia ventana

---

## 🚀 Cómo probar localmente

1. **Inicia el servidor de desarrollo:**
   ```powershell
   npm run dev
   ```

2. **O en producción:**
   ```powershell
   npm run build
   npm start
   ```

3. **Abre en Chrome:** `http://localhost:3000`

4. **Verifica PWA:**
   - Abre DevTools (F12)
   - Ve a la pestaña "Application" o "Aplicación"
   - En el menú izquierdo, ve a "Manifest"
   - Deberías ver la información de tu PWA
   - También ve a "Service Workers" para verificar que está registrado

---

## 🌐 Para desplegar en producción

### Opción 1: Vercel (Recomendado - Gratis)
```powershell
npm install -g vercel
vercel
```
- Sigue las instrucciones
- Tu app estará en: `https://tu-app.vercel.app`
- Los usuarios podrán instalarla desde esa URL

### Opción 2: Netlify
```powershell
npm install -g netlify-cli
netlify deploy --prod
```

### Opción 3: Firebase Hosting
```powershell
npm install -g firebase-tools
firebase init hosting
npm run build
firebase deploy
```

---

## 🎨 Personalizar los íconos

Actualmente usas íconos temporales (SVG con "SF"). Para personalizarlos:

1. **Crea tus íconos:**
   - 192x192 píxeles
   - 512x512 píxeles
   - Formato PNG o SVG

2. **Reemplaza los archivos:**
   - `public/icon-192.svg` → tu ícono pequeño
   - `public/icon-512.svg` → tu ícono grande

3. **Herramientas recomendadas:**
   - [Realfavicongenerator.net](https://realfavicongenerator.net/)
   - [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)

---

## ✨ Características PWA implementadas

- ✅ Service Worker (funciona offline)
- ✅ Web App Manifest
- ✅ Instalable en todos los dispositivos
- ✅ Tema color naranja (#f97316)
- ✅ Pantalla completa (sin barra del navegador)
- ✅ Atajos de app:
  - Buscar Recetas
  - Subir Receta
- ✅ Compatible con iOS (Apple)
- ✅ Compatible con Android
- ✅ Compatible con Desktop

---

## 📋 Checklist de verificación

Antes de desplegar a producción:

- [ ] Reemplaza los íconos temporales con tu logo
- [ ] Prueba la instalación en Chrome Android
- [ ] Prueba la instalación en Safari iOS
- [ ] Verifica que funciona offline
- [ ] Configura tu dominio personalizado
- [ ] (Opcional) Configura notificaciones push
- [ ] (Opcional) Agrega screenshot para manifest

---

## 🆘 Solución de problemas

### La opción "Instalar" no aparece
- Asegúrate de usar HTTPS (o localhost)
- Verifica que el manifest.json es accesible
- Revisa la consola de DevTools por errores

### Service Worker no se registra
- Verifica que el archivo `public/sw.js` existe
- En desarrollo, el SW está deshabilitado por defecto
- Usa `npm run build` y `npm start` para probarlo

### Los íconos no se ven
- Verifica que los archivos SVG/PNG existen en `public/`
- Revisa el manifest.json
- Limpia el caché del navegador

---

## 🎯 Próximos pasos opcionales

1. **Agregar notificaciones push** con Firebase Cloud Messaging
2. **Mejorar offline** con estrategias de caché avanzadas
3. **Agregar shortcuts** a funcionalidades populares
4. **Implementar share target** para compartir recetas desde otras apps
5. **Optimizar Performance** con Lighthouse

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Ve a Application > Manifest en DevTools
3. Verifica que Service Worker está activo

---

¡Tu app Sazón Fácil ya es una PWA lista para instalar! 🎉
