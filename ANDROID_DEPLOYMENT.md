# 📱 Guía: Generar APK Offline para Android

## ✅ Configuración completada

Tu app ya está lista para generar una APK que funcione sin conexión. Los cambios implementados:

1. ✅ Rutas convertidas a query parameters (sin rutas dinámicas)
2. ✅ Next.js configurado para `output: 'export'` (archivos estáticos)
3. ✅ Capacitor apuntando a carpeta `out`
4. ✅ Build exitoso generando archivos estáticos
5. ✅ Archivos sincronizados con el proyecto Android

---

## 📋 Requisitos previos

Para generar la APK necesitas instalar:

### 1. **Java JDK 17 (requerido)**
Descarga e instala:
- https://adoptium.net/ (recomendado)
- O Oracle JDK: https://www.oracle.com/java/technologies/downloads/

Verifica la instalación:
```powershell
java -version
```

### 2. **Android Studio**
Descarga e instala:
- https://developer.android.com/studio

Durante la instalación, asegúrate de instalar:
- Android SDK
- Android SDK Platform
- Android Virtual Device (opcional, para emulador)

---

## 🔧 Configurar Android Studio

### Opción A: Abrir con Android Studio instalado

1. **Abre Android Studio manualmente**
2. **File → Open**
3. **Selecciona la carpeta:**
   ```
   C:\Users\herna\Saved Games\Diseño de interfaz\Sazon-facil\android
   ```
4. **Espera** a que Gradle termine de sincronizar (primera vez puede tardar varios minutos)

### Opción B: Desde línea de comandos

Si Android Studio está instalado pero no se detecta:

```powershell
# Configurar variable de entorno
$env:CAPACITOR_ANDROID_STUDIO_PATH="C:\Program Files\Android\Android Studio\bin\studio64.exe"

# Abrir proyecto
cd "C:\Users\herna\Saved Games\Diseño de interfaz\Sazon-facil"
npx cap open android
```

---

## 📦 Generar la APK

### Desde Android Studio (recomendado):

1. **Abre el proyecto** (carpeta `android`)
2. **Build → Build Bundle(s) / APK(s) → Build APK(s)**
3. **Espera** a que compile (puede tardar 5-10 minutos la primera vez)
4. **Locate** el APK cuando termine:
   ```
   android\app\build\outputs\apk\debug\app-debug.apk
   ```

### Desde línea de comandos (alternativa):

```powershell
cd "C:\Users\herna\Saved Games\Diseño de interfaz\Sazon-facil\android"

# En Windows (usando gradlew.bat incluido en el proyecto):
.\gradlew.bat assembleDebug

# El APK estará en:
# android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 📱 Instalar la APK en tu dispositivo

### Android (USB):

1. **Habilita el modo desarrollador** en tu Android:
   - Ajustes → Acerca del teléfono
   - Toca 7 veces en "Número de compilación"
   - Vuelve a Ajustes → Opciones de desarrollador
   - Activa "Depuración USB"

2. **Conecta tu teléfono por USB**

3. **Instala desde Android Studio:**
   - Run → Run 'app'
   - Selecciona tu dispositivo

4. **O copia el APK manualmente:**
   ```powershell
   # Instalar con adb
   adb install "android\app\build\outputs\apk\debug\app-debug.apk"
   ```

### Compartir el APK:

Comparte el archivo:
```
android\app\build\outputs\apk\debug\app-debug.apk
```

Cualquier persona puede instalarlo en Android:
- Transferir por cable/Bluetooth/Drive
- En el teléfono: Archivos → app-debug.apk → Instalar
- (Puede pedir permitir "Instalar de fuentes desconocidas")

---

## 🚀 Características de la APK offline

✅ **Funciona sin internet:**
- La UI completa está empaquetada
- Las recetas guardadas en localStorage persisten
- Firebase Auth requiere conexión solo para login inicial

✅ **Instalable sin Google Play**

✅ **Tamaño aproximado:** 5-10 MB

---

## 🔄 Actualizar la APK después de cambios

Cada vez que cambies código:

```powershell
# 1. Rebuild de Next.js
npm run build

# 2. Sincronizar con Android
npx cap sync android

# 3. Recompilar APK
cd android
.\gradlew.bat assembleDebug
```

---

## 🎯 Para generar APK firmada (producción)

### 1. Crear keystore:

```powershell
keytool -genkey -v -keystore sazon-facil.keystore -alias sazon -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configurar en `android/app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            storeFile file("../../sazon-facil.keystore")
            storePassword "tu_password"
            keyAlias "sazon"
            keyPassword "tu_password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

### 3. Generar APK release:

```powershell
cd android
.\gradlew.bat assembleRelease
```

La APK firmada estará en:
```
android\app\build\outputs\apk\release\app-release.apk
```

---

## 🆘 Solución de problemas

### Error: "Android Studio not found"
- Instala Android Studio desde https://developer.android.com/studio
- O configura la ruta manualmente (ver Opción B arriba)

### Error: "SDK location not found"
- Abre Android Studio → Tools → SDK Manager
- Verifica que Android SDK esté instalado
- Crea `android/local.properties`:
  ```
  sdk.dir=C\:\\Users\\TU_USUARIO\\AppData\\Local\\Android\\Sdk
  ```

### Gradle build falla:
- Asegúrate de tener Java JDK 17 instalado
- Verifica conectividad para descargar dependencias
- Elimina `android\.gradle` y `android\app\build` y reintenta

### APK no instala en el dispositivo:
- Habilita "Instalar de fuentes desconocidas"
- Verifica que sea compatible (Android 5.0+)
- Desinstala versión anterior si existe

---

## 📞 Siguiente paso

Si aún no tienes Android Studio instalado:

1. **Descarga Android Studio:** https://developer.android.com/studio
2. **Instala con opciones por defecto**
3. **Abre el proyecto:** `Diseño de interfaz\Sazon-facil\android`
4. **Build → Build APK**

¿Necesitas ayuda con algún paso específico?
