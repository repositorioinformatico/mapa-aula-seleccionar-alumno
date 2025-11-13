/**
 * EnhancedRandomizer - Clase para generar números aleatorios mejorados
 * Utiliza las coordenadas del ratón y el tiempo para aumentar la aleatoriedad
 */
class EnhancedRandomizer {
    constructor() {
        this.mouseEntropy = [];
        this.maxEntropySize = 100;
        this.isCollecting = false;
        this.collectionTime = 2000; // 2 segundos de recolección

        // Iniciar la recolección de entropía del ratón
        this.startMouseTracking();
    }

    /**
     * Inicia el seguimiento del movimiento del ratón
     */
    startMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            // Almacenar coordenadas del ratón y timestamp
            const entropy = {
                x: e.clientX,
                y: e.clientY,
                timestamp: Date.now(),
                movementX: e.movementX || 0,
                movementY: e.movementY || 0
            };

            this.mouseEntropy.push(entropy);

            // Mantener solo las últimas N entradas
            if (this.mouseEntropy.length > this.maxEntropySize) {
                this.mouseEntropy.shift();
            }
        });
    }

    /**
     * Genera un seed basado en la entropía del ratón
     */
    generateSeed() {
        if (this.mouseEntropy.length === 0) {
            // Si no hay datos del ratón, usar timestamp y Math.random()
            return Date.now() * Math.random();
        }

        let seed = 0;

        // Combinar datos del ratón
        for (let i = 0; i < this.mouseEntropy.length; i++) {
            const entry = this.mouseEntropy[i];
            seed += entry.x * entry.y * entry.timestamp;
            seed += Math.abs(entry.movementX * entry.movementY) * 1000;
        }

        // Añadir timestamp actual y Math.random()
        seed += Date.now() * Math.random() * 1000000;

        return seed;
    }

    /**
     * Función hash simple para el seed
     */
    hash(seed) {
        seed = seed % 2147483647;
        if (seed <= 0) seed += 2147483646;
        return seed;
    }

    /**
     * Genera un número aleatorio mejorado entre 0 y 1
     */
    randomEnhanced() {
        const seed = this.generateSeed();
        const hashed = this.hash(seed);

        // Combinar con Math.random() para mejor distribución
        const combined = (hashed / 2147483647) * Math.random();

        return combined;
    }

    /**
     * Genera un número entero aleatorio entre min (inclusivo) y max (exclusivo)
     */
    randomInt(min, max) {
        return Math.floor(this.randomEnhanced() * (max - min)) + min;
    }

    /**
     * Recolecta entropía adicional del ratón durante un tiempo determinado
     * Útil antes de hacer una selección importante
     */
    collectEntropy(duration = this.collectionTime) {
        return new Promise((resolve) => {
            this.isCollecting = true;
            const startEntropy = this.mouseEntropy.length;

            setTimeout(() => {
                this.isCollecting = false;
                const collected = this.mouseEntropy.length - startEntropy;
                resolve(collected);
            }, duration);
        });
    }

    /**
     * Mezcla un array de forma aleatoria (Fisher-Yates shuffle mejorado)
     */
    shuffle(array) {
        const shuffled = [...array];

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = this.randomInt(0, i + 1);
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled;
    }

    /**
     * Selecciona un elemento aleatorio de un array
     */
    choice(array) {
        if (!array || array.length === 0) {
            return null;
        }

        const index = this.randomInt(0, array.length);
        return array[index];
    }

    /**
     * Genera múltiples números aleatorios y devuelve uno de ellos
     * Esto añade una capa extra de aleatoriedad
     */
    superRandom(min, max, iterations = 5) {
        let results = [];

        for (let i = 0; i < iterations; i++) {
            results.push(this.randomInt(min, max));
        }

        // Seleccionar aleatoriamente uno de los resultados
        return this.choice(results);
    }

    /**
     * Verifica si hay suficiente entropía del ratón
     */
    hasEnoughEntropy() {
        return this.mouseEntropy.length > 10;
    }

    /**
     * Obtiene información sobre el estado de la entropía
     */
    getEntropyInfo() {
        return {
            collected: this.mouseEntropy.length,
            maxSize: this.maxEntropySize,
            percentage: (this.mouseEntropy.length / this.maxEntropySize * 100).toFixed(1),
            isCollecting: this.isCollecting
        };
    }
}

// Crear instancia global del randomizer
const randomizer = new EnhancedRandomizer();
