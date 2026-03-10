function crearEstudiante(cedula, nombre, apellido, año, seccion, tipo) {
    return {
        cedula, nombre, apellido, año, seccion, tipo,
        notas: {
            matematica: { l1: 0, l2: 0, l3: 0 },
            lenguaje: { l1: 0, l2: 0, l3: 0 },
            historia: { l1: 0, l2: 0, l3: 0 }
        }
    };
}

function calcularPromedioMateria(notas) {
    return ((notas.l1 + notas.l2 + notas.l3) / 3).toFixed(2);
}

module.exports = { crearEstudiante, calcularPromedioMateria };
