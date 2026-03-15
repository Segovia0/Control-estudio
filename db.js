const fs = require('fs');
const FILE_NAME = "estudiantes.json";

function cargarDatos() {
    if (fs.existsSync(FILE_NAME)) {
        const datos = fs.readFileSync(FILE_NAME);
        return JSON.parse(datos);
    }
    return [];
}

function guardarDatos(estudiantes) {
    fs.writeFileSync(FILE_NAME, JSON.stringify(estudiantes, null, 2));
}

// Asegúrate de que estos nombres coincidan con las funciones de arriba
module.exports = { cargarDatos, guardarDatos };
