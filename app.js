const prompt = require('prompt-sync')({sigint: true});
const db = require('./db');
const logica = require('./estudiantes');

let estudiantes = db.cargarDatos();

// ================= LOGIN =================
function login(){
    const usuarioCorrecto = "admin";
    const passwordCorrecto = "admin";
    console.log("\n--- INICIO DE SESIÓN ---");
    let usuario = prompt("Usuario: ");
    let password = prompt("Contraseña: ");

    if(usuario === usuarioCorrecto && password === passwordCorrecto){
        console.log("\n✅ Acceso concedido\n");
        return true;
    } else {
        console.log("❌ Datos incorrectos");
        return false;
    }
}

// ================= FUNCIONES DEL SISTEMA =================

function registrarEstudiante(){
    let cedula = prompt("Cedula: ");
    let existe = estudiantes.find(e => e.cedula === cedula);
    if(existe) return console.log("❌ Ya existe un estudiante con esa cedula");

    let nuevo = logica.crearEstudiante(
        cedula, 
        prompt("Nombre: "), 
        prompt("Apellido: "), 
        prompt("Año: "), 
        prompt("Seccion: "), 
        prompt("Tipo (Nuevo/Regular): ")
    );

    estudiantes.push(nuevo);
    db.guardarDatos(estudiantes);
    console.log("✅ Estudiante registrado");
}

function mostrarEstudiantes(){
    if(estudiantes.length === 0) return console.log("No hay estudiantes registrados");
    estudiantes.forEach(e => {
        console.log(`Cedula: ${e.cedula} | Nombre: ${e.nombre} ${e.apellido} | Año: ${e.año} | Seccion: ${e.seccion}`);
    });
}

function colocarNota(){
    let cedula = prompt("Cedula del estudiante: ");
    let est = estudiantes.find(e => e.cedula === cedula);
    if(!est) return console.log("❌ Estudiante no encontrado");

    let materia = prompt("Materia (matematica/lenguaje/historia): ").toLowerCase();
    if(!est.notas[materia]) return console.log("❌ Materia no valida");

    let lapso = prompt("Lapso (l1/l2/l3): ").toLowerCase();
    if(est.notas[materia][lapso] === undefined) return console.log("❌ Lapso no valido");

    est.notas[materia][lapso] = parseFloat(prompt("Nota: "));
    db.guardarDatos(estudiantes);
    console.log("✅ Nota registrada");
}

function verBoletin(){
    let cedula = prompt("Cedula del estudiante: ");
    let est = estudiantes.find(e => e.cedula === cedula);
    if(!est) return console.log("❌ Estudiante no encontrado");

    console.log(`\n========== BOLETIN: ${est.nombre} ${est.apellido} ==========`);
    console.log("Materia\t\tL1\tL2\tL3\tProm");
    for(let materia in est.notas){
        let n = est.notas[materia];
        let prom = logica.calcularPromedioMateria(n);
        console.log(`${materia}\t${n.l1}\t${n.l2}\t${n.l3}\t${prom}`);
    }
}

function buscarEstudiante(){
    let cedula = prompt("Cedula del estudiante: ");
    let est = estudiantes.find(e => e.cedula === cedula);
    if(!est) return console.log("❌ No encontrado");

    console.log(`\nEncontrado: ${est.nombre} ${est.apellido} | Año: ${est.año} | Seccion: ${est.seccion}`);
}

function modificarEstudiante(){
    let cedula = prompt("Cedula: ");
    let est = estudiantes.find(e => e.cedula === cedula);
    if(!est) return console.log("❌ No encontrado");

    est.nombre = prompt("Nuevo nombre: ");
    est.apellido = prompt("Nuevo apellido: ");
    est.año = prompt("Nuevo año: ");
    est.seccion = prompt("Nueva seccion: ");
    db.guardarDatos(estudiantes);
    console.log("✅ Datos modificados");
}

function eliminarEstudiante(){
    let cedula = prompt("Cedula: ");
    let index = estudiantes.findIndex(e => e.cedula === cedula);
    if(index === -1) return console.log("❌ No encontrado");

    estudiantes.splice(index, 1);
    db.guardarDatos(estudiantes);
    console.log("✅ Estudiante eliminado");
}

// ================= MENU =================

function ejecutarMenu(){
    let opcion;
    do {
        console.log("\n====== CONTROL DE ESTUDIO ======");
        console.log("1. Registrar estudiante");
        console.log("2. Mostrar estudiantes");
        console.log("3. Colocar nota");
        console.log("4. Ver boletin");
        console.log("5. Buscar estudiante");
        console.log("6. Modificar estudiante");
        console.log("7. Eliminar estudiante");
        console.log("8. Salir");

        opcion = prompt("Seleccione una opcion: ");

        switch(opcion){
            case "1": registrarEstudiante(); break;
            case "2": mostrarEstudiantes(); break;
            case "3": colocarNota(); break;
            case "4": verBoletin(); break;
            case "5": buscarEstudiante(); break;
            case "6": modificarEstudiante(); break;
            case "7": eliminarEstudiante(); break;
            case "8": console.log("Saliendo del sistema..."); break;
            default: console.log("Opcion invalida");
        }
    } while(opcion !== "8");
}

if(login()) ejecutarMenu();



