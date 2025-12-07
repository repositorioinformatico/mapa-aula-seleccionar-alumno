# Organizador de Clase - Selector Aleatorio

Aplicación web estática para organizar la distribución de alumnos en una clase y seleccionar estudiantes de forma aleatoria.

## 🌐 Acceso a la Aplicación

**URL:** https://repositorioinformatico.github.io/mapa-aula-seleccionar-alumno/

La aplicación está disponible online, no requiere instalación ni dependencias. Simplemente abre la URL en tu navegador.

## Características

- **Carga de alumnos**: Introduce nombres manualmente o carga un archivo .txt
- **Dos modos de configuración**:
  - **Modo simple**: Lista de nombres + configuración manual de filas/columnas
  - **Modo automático**: Usa líneas en blanco para separar filas (configuración automática)
- **Mesas vacías**: Escribe "vacío", "vacía", "VACIO", "mesa vacía", etc. (todas las variaciones)
- **Drag & Drop**: Arrastra y suelta alumnos para reorganizar las mesas
- **Visualización intuitiva**: Ve la distribución completa de la clase en blanco y negro
- **Selección aleatoria mejorada**: Utiliza movimiento del ratón para mayor aleatoriedad
- **Guardado y carga**: Descarga y reutiliza configuraciones
- **Animaciones**: Efectos visuales al seleccionar alumnos
- **Responsive**: Funciona en dispositivos móviles y tablets

## Cómo usar

### Modo Simple (Configuración Manual)
1. **Carga los alumnos**: Escribe nombres, uno por línea
   ```
   Juan Pérez
   María García
   vacío
   Carlos López
   ```
2. **Configura filas y columnas**: Define el layout manualmente
3. **Genera la distribución**: Haz clic en "Generar Distribución"

### Modo Automático (Con Líneas en Blanco) ⚡
1. **Carga los alumnos**: Usa líneas en blanco para separar filas
   ```
   Juan Pérez
   María García
   Carlos López

   Ana Martínez
   mesa vacía
   Pedro Ruiz

   Laura Torres
   David Silva
   ```
2. **¡Listo!**: La distribución se genera automáticamente al cargar los alumnos
   - No necesitas configurar filas/columnas
   - No necesitas hacer clic en "Generar Distribución"
   - Se desplaza automáticamente para mostrarte el resultado

### Mesas Vacías
Escribe cualquiera de estas variaciones (con o sin acentos, mayúsculas/minúsculas):
- `vacío` / `vacio` / `VACIO` / `Vacío`
- `vacía` / `vacia` / `VACIA` / `Vacía`
- `mesa vacía` / `MESA VACIA` / `Mesa Vacío`

### Otras Funciones
- **Reorganizar**: Arrastra y suelta alumnos entre mesas
- **Seleccionar aleatorio**: Haz clic en "Seleccionar Alumno Aleatorio"
- **Guardar/Cargar**: Descarga la configuración para reutilizarla

## Estructura de archivos

```
class-layout-randomizer/
├── index.html                    # Estructura principal
├── styles.css                    # Estilos y diseño (blanco y negro)
├── randomizer.js                 # Clase de aleatoriedad mejorada
├── app.js                        # Lógica de la aplicación
├── README.md                     # Este archivo
├── ejemplo-alumnos.txt           # Ejemplo lista simple
├── ejemplo-con-filas.txt         # Ejemplo con líneas en blanco
└── ejemplo-variaciones-vacio.txt # Ejemplo de todas las variaciones de "vacío"
```

## Tecnologías utilizadas

- **HTML5**: Estructura de la aplicación
- **CSS3**: Diseño responsive en blanco y negro con animaciones
- **JavaScript ES6+**: Lógica de la aplicación (clases, async/await)
- **GitHub Pages**: Hosting estático gratuito
- **Sin dependencias externas**: No requiere npm, Node.js ni frameworks

## Aleatoriedad mejorada

La aplicación utiliza una clase personalizada `EnhancedRandomizer` que:
- Captura el movimiento del ratón para generar entropía
- Combina múltiples fuentes de aleatoriedad
- Implementa el algoritmo Fisher-Yates para mezclar arrays
- Proporciona selección super-aleatoria con múltiples iteraciones

## Desarrollo Local

Si quieres modificar la aplicación localmente:

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/repositorioinformatico/class-layout-randomizer.git
   cd class-layout-randomizer
   ```

2. **Abre directamente en el navegador:**
   - Simplemente abre `index.html` en tu navegador
   - O usa un servidor local para mejor experiencia:

   ```bash
   # Con Python 3
   python3 -m http.server 8000

   # Con PHP
   php -S localhost:8000
   ```

3. **Haz cambios y prueba:**
   - Edita los archivos HTML, CSS o JS
   - Recarga el navegador para ver los cambios

4. **Sube cambios a GitHub:**
   ```bash
   git add .
   git commit -m "Descripción de cambios"
   git push origin main
   ```

   Los cambios se publicarán automáticamente en GitHub Pages en 1-2 minutos.

## Licencia

Este proyecto es de código abierto y está disponible para uso educativo.
