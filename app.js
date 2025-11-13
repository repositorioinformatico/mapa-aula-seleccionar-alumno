/**
 * Clase principal para gestionar el organizador de clase
 */
class ClassroomManager {
    constructor() {
        this.students = [];
        this.rows = 4;
        this.cols = 6;
        this.layout = [];
        this.selectedStudentIndex = null;

        this.initializeElements();
        this.attachEventListeners();
    }

    /**
     * Inicializa las referencias a los elementos del DOM
     */
    initializeElements() {
        // Elementos de configuración de alumnos
        this.studentTextarea = document.getElementById('student-textarea');
        this.studentFile = document.getElementById('student-file');
        this.loadStudentsBtn = document.getElementById('load-students-btn');
        this.studentCount = document.getElementById('student-count');

        // Elementos de configuración de layout
        this.rowsInput = document.getElementById('rows-input');
        this.colsInput = document.getElementById('cols-input');
        this.generateLayoutBtn = document.getElementById('generate-layout-btn');

        // Elementos de visualización de clase
        this.classroomSection = document.getElementById('classroom-section');
        this.classroomGrid = document.getElementById('classroom-grid');
        this.randomStudentBtn = document.getElementById('random-student-btn');
        this.downloadLayoutBtn = document.getElementById('download-layout-btn');
        this.loadLayoutBtn = document.getElementById('load-layout-btn');
        this.layoutFile = document.getElementById('layout-file');
        this.selectedStudentDisplay = document.getElementById('selected-student-display');
        this.selectedStudentName = document.getElementById('selected-student-name');
    }

    /**
     * Adjunta event listeners a los elementos
     */
    attachEventListeners() {
        // Cargar alumnos
        this.loadStudentsBtn.addEventListener('click', () => this.loadStudents());
        this.studentFile.addEventListener('change', (e) => this.handleStudentFileUpload(e));

        // Generar layout
        this.generateLayoutBtn.addEventListener('click', () => this.generateLayout());

        // Selección aleatoria
        this.randomStudentBtn.addEventListener('click', () => this.selectRandomStudent());

        // Descargar configuración
        this.downloadLayoutBtn.addEventListener('click', () => this.downloadLayout());

        // Cargar configuración
        this.loadLayoutBtn.addEventListener('click', () => this.layoutFile.click());
        this.layoutFile.addEventListener('change', (e) => this.handleLayoutFileUpload(e));
    }

    /**
     * Carga los alumnos desde el textarea
     */
    loadStudents() {
        const text = this.studentTextarea.value;

        if (!text.trim()) {
            alert('Por favor, introduce los nombres de los alumnos');
            return;
        }

        // Detectar si hay líneas en blanco (indica estructura por filas)
        const lines = text.split('\n');
        const hasBlankLines = lines.some((line, index) =>
            index > 0 && index < lines.length - 1 && line.trim() === ''
        );

        if (hasBlankLines) {
            // Modo estructura por filas
            this.parseStudentsWithRows(text);
        } else {
            // Modo lista simple
            this.parseStudentsSimple(text);
        }

        const studentCount = this.students.filter(s => s !== null).length;
        const emptyCount = this.students.filter(s => s === null).length;

        this.updateStudentCount();

        let message = `${studentCount} alumnos cargados`;
        if (emptyCount > 0) {
            message += ` y ${emptyCount} mesa(s) vacía(s)`;
        }
        if (this.autoLayout) {
            message += ` | Layout: ${this.rows} filas × ${this.cols} columnas`;

            // Auto-generar distribución si hay estructura de filas
            setTimeout(() => {
                this.generateLayout();
            }, 100);
        }
        this.showNotification(message);
    }

    /**
     * Verifica si un nombre representa una mesa vacía
     */
    isEmptyDesk(name) {
        const normalized = name.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, ''); // Eliminar acentos

        const emptyKeywords = [
            'vacio',
            'vacia',
            'mesa vacia',
            'mesa vacio',
            'vacio mesa',
            'vacia mesa',
            'empty',
            'vacia ',
            'vacio ',
            ' vacia',
            ' vacio'
        ];

        return emptyKeywords.some(keyword => normalized.trim() === keyword.trim());
    }

    /**
     * Parsea alumnos en modo simple (sin estructura de filas)
     */
    parseStudentsSimple(text) {
        this.autoLayout = false;
        this.students = text.split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0)
            .map(name => {
                // Verificar si es una mesa vacía
                if (this.isEmptyDesk(name)) {
                    return null;
                }
                return name;
            });
    }

    /**
     * Parsea alumnos con estructura de filas (líneas en blanco separan filas)
     */
    parseStudentsWithRows(text) {
        this.autoLayout = true;
        const lines = text.split('\n');
        const rowsData = [];
        let currentRow = [];

        lines.forEach((line) => {
            const trimmedLine = line.trim();

            if (trimmedLine === '') {
                // Línea en blanco = nueva fila
                if (currentRow.length > 0) {
                    rowsData.push(currentRow);
                    currentRow = [];
                }
            } else {
                // Procesar nombre o vacío
                if (this.isEmptyDesk(trimmedLine)) {
                    currentRow.push(null);
                } else {
                    currentRow.push(trimmedLine);
                }
            }
        });

        // Agregar última fila si existe
        if (currentRow.length > 0) {
            rowsData.push(currentRow);
        }

        // Calcular dimensiones
        this.rows = rowsData.length;
        this.cols = Math.max(...rowsData.map(row => row.length));

        // Actualizar inputs
        this.rowsInput.value = this.rows;
        this.colsInput.value = this.cols;

        // Crear array plano de estudiantes con estructura
        this.students = [];
        this.customLayout = [];

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const student = rowsData[r] && rowsData[r][c] !== undefined
                    ? rowsData[r][c]
                    : null;

                this.students.push(student);
                this.customLayout.push({
                    row: r,
                    col: c,
                    student: student
                });
            }
        }
    }

    /**
     * Maneja la carga de archivo de alumnos
     */
    handleStudentFileUpload(event) {
        const file = event.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            const content = e.target.result;
            this.studentTextarea.value = content;
            this.loadStudents();
        };

        reader.readAsText(file);
    }

    /**
     * Actualiza el contador de alumnos
     */
    updateStudentCount() {
        if (this.students.length > 0) {
            const validStudents = this.students.filter(s => s !== null).length;
            const emptyDesks = this.students.filter(s => s === null).length;

            let text = `Total de alumnos: ${validStudents}`;
            if (emptyDesks > 0) {
                text += ` | Mesas vacías: ${emptyDesks}`;
            }

            this.studentCount.textContent = text;
            this.studentCount.style.display = 'block';
        } else {
            this.studentCount.style.display = 'none';
        }
    }

    /**
     * Genera el layout de la clase
     */
    generateLayout() {
        if (this.students.length === 0) {
            alert('Por favor, carga primero la lista de alumnos');
            return;
        }

        // Si hay un layout personalizado (por líneas en blanco), usarlo directamente
        if (this.autoLayout && this.customLayout) {
            this.layout = this.customLayout.map((desk, index) => ({
                ...desk,
                index: desk.student !== null ? index : null
            }));

            this.renderClassroom();
            this.classroomSection.style.display = 'block';

            // Scroll suave hacia la distribución
            setTimeout(() => {
                this.classroomSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 200);

            this.showNotification(`Distribución generada automáticamente: ${this.rows} filas × ${this.cols} columnas`);
            return;
        }

        // Modo manual: usar filas y columnas configuradas
        this.rows = parseInt(this.rowsInput.value);
        this.cols = parseInt(this.colsInput.value);

        const totalDesks = this.rows * this.cols;

        if (this.students.length > totalDesks) {
            const confirm = window.confirm(
                `Tienes ${this.students.length} alumnos pero solo ${totalDesks} mesas. ` +
                `Algunos alumnos no tendrán asignada una mesa. ¿Continuar?`
            );

            if (!confirm) return;
        }

        // Crear layout
        this.layout = [];
        let studentIndex = 0;

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (studentIndex < this.students.length) {
                    const student = this.students[studentIndex];
                    this.layout.push({
                        row: row,
                        col: col,
                        student: student, // Puede ser null si el usuario escribió "vacío"
                        index: student !== null ? studentIndex : null
                    });
                    studentIndex++;
                } else {
                    this.layout.push({
                        row: row,
                        col: col,
                        student: null,
                        index: null
                    });
                }
            }
        }

        this.renderClassroom();
        this.classroomSection.style.display = 'block';
        this.showNotification('Distribución de clase generada correctamente');
    }

    /**
     * Renderiza la visualización de la clase
     */
    renderClassroom() {
        this.classroomGrid.innerHTML = '';
        this.classroomGrid.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        this.classroomGrid.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;

        this.layout.forEach((desk, layoutIndex) => {
            const deskElement = document.createElement('div');
            deskElement.className = 'desk';
            deskElement.dataset.layoutIndex = layoutIndex;

            if (desk.student) {
                deskElement.textContent = desk.student;
                deskElement.dataset.index = desk.index;

                // Hacer el escritorio arrastrable
                deskElement.draggable = true;
                deskElement.classList.add('draggable');

                // Event listeners para drag and drop
                deskElement.addEventListener('dragstart', (e) => this.handleDragStart(e));
                deskElement.addEventListener('dragend', (e) => this.handleDragEnd(e));
            } else {
                deskElement.classList.add('empty');
                deskElement.textContent = 'Vacío';
            }

            // Event listeners para drop zone (todos los escritorios pueden recibir)
            deskElement.addEventListener('dragover', (e) => this.handleDragOver(e));
            deskElement.addEventListener('drop', (e) => this.handleDrop(e));
            deskElement.addEventListener('dragleave', (e) => this.handleDragLeave(e));

            this.classroomGrid.appendChild(deskElement);
        });
    }

    /**
     * Maneja el inicio del arrastre
     */
    handleDragStart(e) {
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.innerHTML);
        e.dataTransfer.setData('layoutIndex', e.target.dataset.layoutIndex);
    }

    /**
     * Maneja el fin del arrastre
     */
    handleDragEnd(e) {
        e.target.classList.remove('dragging');

        // Limpiar todas las clases de drop zone
        document.querySelectorAll('.desk').forEach(desk => {
            desk.classList.remove('drag-over');
        });
    }

    /**
     * Maneja el arrastre sobre un elemento
     */
    handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }

        e.dataTransfer.dropEffect = 'move';

        // Añadir clase visual
        if (!e.target.classList.contains('dragging')) {
            e.target.classList.add('drag-over');
        }

        return false;
    }

    /**
     * Maneja cuando el elemento sale de la zona de drop
     */
    handleDragLeave(e) {
        e.target.classList.remove('drag-over');
    }

    /**
     * Maneja el soltar el elemento
     */
    handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        e.preventDefault();

        const sourceIndex = parseInt(e.dataTransfer.getData('layoutIndex'));
        const targetIndex = parseInt(e.currentTarget.dataset.layoutIndex);

        if (sourceIndex !== targetIndex) {
            // Intercambiar los alumnos
            const sourceDesk = this.layout[sourceIndex];
            const targetDesk = this.layout[targetIndex];

            // Intercambiar los datos de estudiante
            const tempStudent = sourceDesk.student;
            const tempIndex = sourceDesk.index;

            sourceDesk.student = targetDesk.student;
            sourceDesk.index = targetDesk.index;

            targetDesk.student = tempStudent;
            targetDesk.index = tempIndex;

            // Re-renderizar
            this.renderClassroom();

            this.showNotification('Alumnos reorganizados');
        }

        e.target.classList.remove('drag-over');

        return false;
    }

    /**
     * Selecciona un alumno aleatoriamente
     */
    async selectRandomStudent() {
        // Filtrar solo alumnos válidos (no null)
        const validStudents = this.students.filter(s => s !== null);

        if (validStudents.length === 0) {
            alert('No hay alumnos cargados (solo mesas vacías)');
            return;
        }

        // Limpiar selección anterior
        this.clearSelection();

        // Deshabilitar el botón durante la animación
        this.randomStudentBtn.disabled = true;
        this.randomStudentBtn.textContent = 'Seleccionando...';

        // Crear animación de anticipación
        await this.animateSelection();

        // Seleccionar alumno aleatorio usando el randomizer mejorado
        const randomValidIndex = randomizer.superRandom(0, validStudents.length, 10);
        const selectedStudent = validStudents[randomValidIndex];

        // Encontrar el índice original en la lista completa de estudiantes
        const originalIndex = this.students.indexOf(selectedStudent);
        this.selectedStudentIndex = originalIndex;

        // Resaltar el alumno seleccionado
        this.highlightStudent(originalIndex);

        // Mostrar el nombre del alumno seleccionado
        this.selectedStudentName.textContent = selectedStudent;
        this.selectedStudentDisplay.style.display = 'block';

        // Rehabilitar el botón
        this.randomStudentBtn.disabled = false;
        this.randomStudentBtn.textContent = 'Seleccionar Otro Alumno';

        this.showNotification(`Alumno seleccionado: ${selectedStudent}`);
    }

    /**
     * Animación de selección aleatoria
     */
    animateSelection() {
        return new Promise((resolve) => {
            const desks = this.classroomGrid.querySelectorAll('.desk:not(.empty)');
            let iterations = 0;
            const maxIterations = 20;
            const interval = 100;

            const animate = setInterval(() => {
                // Limpiar todas las animaciones
                desks.forEach(desk => desk.classList.remove('selecting'));

                // Seleccionar un escritorio aleatorio para animar
                const randomDesk = desks[randomizer.randomInt(0, desks.length)];
                randomDesk.classList.add('selecting');

                iterations++;

                if (iterations >= maxIterations) {
                    clearInterval(animate);
                    desks.forEach(desk => desk.classList.remove('selecting'));
                    resolve();
                }
            }, interval);
        });
    }

    /**
     * Resalta al alumno seleccionado
     */
    highlightStudent(index) {
        const desks = this.classroomGrid.querySelectorAll('.desk');

        desks.forEach(desk => {
            if (desk.dataset.index == index) {
                desk.classList.add('selected');
            }
        });
    }

    /**
     * Limpia la selección actual
     */
    clearSelection() {
        const desks = this.classroomGrid.querySelectorAll('.desk');
        desks.forEach(desk => {
            desk.classList.remove('selected', 'selecting');
        });

        this.selectedStudentDisplay.style.display = 'none';
        this.selectedStudentIndex = null;
    }

    /**
     * Descarga la configuración actual
     */
    downloadLayout() {
        if (this.students.length === 0 || this.layout.length === 0) {
            alert('No hay configuración para descargar');
            return;
        }

        const config = {
            students: this.students,
            rows: this.rows,
            cols: this.cols,
            layout: this.layout,
            timestamp: new Date().toISOString()
        };

        const configText = JSON.stringify(config, null, 2);
        const blob = new Blob([configText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `configuracion-clase-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Configuración descargada correctamente');
    }

    /**
     * Maneja la carga de archivo de configuración
     */
    handleLayoutFileUpload(event) {
        const file = event.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const config = JSON.parse(content);

                // Validar configuración
                if (!config.students || !config.rows || !config.cols || !config.layout) {
                    throw new Error('Archivo de configuración inválido');
                }

                // Cargar configuración
                this.students = config.students;
                this.rows = config.rows;
                this.cols = config.cols;
                this.layout = config.layout;

                // Actualizar UI
                this.studentTextarea.value = this.students.join('\n');
                this.rowsInput.value = this.rows;
                this.colsInput.value = this.cols;

                this.updateStudentCount();
                this.renderClassroom();
                this.classroomSection.style.display = 'block';

                this.showNotification('Configuración cargada correctamente');
            } catch (error) {
                alert('Error al cargar el archivo de configuración: ' + error.message);
            }
        };

        reader.readAsText(file);
    }

    /**
     * Muestra una notificación temporal
     */
    showNotification(message) {
        // Eliminar notificación anterior si existe
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Crear nueva notificación
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;

        document.body.appendChild(notification);

        // Mostrar con animación
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Ocultar y eliminar después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new ClassroomManager();

    // Mostrar información de entropía en la consola (opcional)
    setInterval(() => {
        const info = randomizer.getEntropyInfo();
        console.log('Entropía del randomizer:', info);
    }, 5000);
});
