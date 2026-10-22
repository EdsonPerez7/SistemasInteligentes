# Sistema de Inferencia Difusa Mamdani — Clasificación Socioeconómica y ODS 1 (Fin de la Pobreza)

Este repositorio contiene la implementación integral del **Sistema de Inferencia Difusa tipo Mamdani** para la evaluación multidimensional de la pobreza y la priorización de subsidios sociales (SISFOH / ENAHO 2025), alineado al **ODS 1: Fin de la Pobreza** de la Agenda 2030.

---

## 📁 Estructura del Proyecto

* **[sistema_difuso_pobreza_ods1.ipynb](file:///home/ed/edson/EdsonDev/4.%20Personal/Sistema%20Difuso/sistema_difuso_pobreza_ods1.ipynb)**: Cuaderno Jupyter completo para **Google Colab** estructurado con todos los acápites académicos solicitados por el docente (1. Introducción, 2. Variables de Entrada y Salida, 3. Matriz de 27 Reglas, 4. Operadores Mamdani, 5. Implementación en Python, 7. Las 4 Corridas Experimentales con gráficas de centroide y superficie 3D, 8. Conclusiones y 9. Referencias bibliográficas).
* **[index.html](file:///home/ed/edson/EdsonDev/4.%20Personal/Sistema%20Difuso/index.html)**: Interfaz de usuario moderna, semántica y responsiva lista para desplegar.
* **[style.css](file:///home/ed/edson/EdsonDev/4.%20Personal/Sistema%20Difuso/style.css)**: Hoja de estilos con estética *glassmorphism*, modo oscuro de alta gama y diseño responsivo sin dependencias pesadas.
* **[app.js](file:///home/ed/edson/EdsonDev/4.%20Personal/Sistema%20Difuso/app.js)**: Motor de inferencia difusa Mamdani 100% *client-side* en JavaScript puro, con generador dinámico de gráficos SVG en tiempo real (fusificación, activación de reglas, agregación y cálculo del centroide).
* **[cse_sistema_experto.clp](file:///home/ed/edson/EdsonDev/4.%20Personal/Sistema%20Difuso/cse_sistema_experto.clp)**: Archivo original de reglas CLIPS conservado como referencia comparativa entre la lógica clásica/binaria y la lógica difusa.

---

## 🚀 Despliegue en Cloudflare Pages (Gratis y en 2 minutos)

La aplicación web está diseñada para correr **100% en el frontend del navegador sin necesidad de servidores ni backends**. Toda la matemática difusa corre instantáneamente en JavaScript.

### Opción A: Carga Directa (Direct Upload - La más rápida)
1. Inicia sesión en tu cuenta de [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. En el menú lateral, dirígete a **Workers & Pages** > **Create application** > pestaña **Pages**.
3. Selecciona **Upload assets** (Subir activos).
4. Asigna un nombre al proyecto (por ejemplo: `sistema-difuso-ods1`).
5. Arrastra directamente esta carpeta o selecciona los archivos `index.html`, `style.css`, `app.js` y `sistema_difuso_pobreza_ods1.ipynb`.
6. Haz clic en **Deploy site**.
7. ¡Listo! Cloudflare te generará un enlace público inmediato con HTTPS (ejemplo: `https://sistema-difuso-ods1.pages.dev`).

### Opción B: Conectando un repositorio de GitHub
1. Sube este directorio a tu repositorio de GitHub.
2. En Cloudflare Pages, selecciona **Connect to Git**.
3. Elige el repositorio y deja el campo *Build command* vacío y el directorio de salida en `./`.
4. Cloudflare lo compilará y actualizará automáticamente con cada `git push`.

---

## 💻 Vista Previa Local

Para probar la aplicación en tu máquina local:
```bash
python3 -m http.server 8080
```
Luego abre en tu navegador:
[http://localhost:8080](http://localhost:8080)

---

## 📊 Ejecución en Google Colab

1. Ingresa a [Google Colab](https://colab.research.google.com/).
2. Selecciona la pestaña **Subir** (*Upload*) y carga el archivo `sistema_difuso_pobreza_ods1.ipynb`.
3. Ve a **Entorno de ejecución** > **Ejecutar todas**.
4. Verás todas las gráficas de pertenencia, la tabla de las 4 corridas, las curvas de centroide y la superficie 3D de control generadas al instante con NumPy y Matplotlib.
