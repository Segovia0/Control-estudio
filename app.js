const prompt = require('prompt-sync')({sigint: true});
const db = require('./db');
const logica = require('./estudiantes');

let estudiantes = db.cargarDatos();

// Función auxiliar para pausar antes de limpiar (Importante para que el usuario lea los mensajes)
function pausar() {
    prompt("\nPresione ENTER para continuar...");
}

// ================= LOGIN =================
function login(){
    console.clear(); // Limpiamos al iniciar el programa
    const usuarioCorrecto = "admin";
    const passwordCorrecto = "admin";
    console.log("\n--- INICIO DE SESIÓN ---");
    let usuario = prompt("Usuario: ");
    let password = prompt("Contraseña: ");

    if(usuario === usuarioCorrecto && password === passwordCorrecto){
        console.log("\n✅ Acceso concedido\n");
        pausar();
        return true;
    } else {
        console.log("❌ Datos incorrectos");
        pausar();
        return false;
    }
}

// ================= FUNCIONES DEL SISTEMA =================

function registrarEstudiante(){
    console.clear();
    console.log("--- REGISTRAR NUEVO ESTUDIANTE ---\n");
    let cedula = prompt("Cedula: ");
    let existe = estudiantes.find(e => e.cedula === cedula);
    if(existe) {
        console.log("❌ Ya existe un estudiante con esa cedula");
        return pausar();
    }

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
    console.log("\n✅ Estudiante registrado con éxito");
    pausar();
}

function mostrarEstudiantes(){
    console.clear();
    console.log("--- LISTADO DE ESTUDIANTES ---\n");
    if(estudiantes.length === 0) {
        console.log("No hay estudiantes registrados");
    } else {
        estudiantes.forEach(e => {
            console.log(`Cedula: ${e.cedula} | Nombre: ${e.nombre} ${e.apellido} | Año: ${e.año} | Seccion: ${e.seccion}`);
        });
    }
    pausar();
}

function colocarNota(){
    console.clear();
    let cedula = prompt("Cedula del estudiante para colocar nota: ");
    let est = estudiantes.find(e => e.cedula === cedula);
    
    if(!est) {
        console.log("❌ Estudiante no encontrado");
        return pausar();
    }

    let materia = prompt("Materia (matematica/lenguaje/historia): ").toLowerCase();
    if(!est.notas[materia]) {
        console.log("❌ Materia no valida");
        return pausar();
    }

    let lapso = prompt("Lapso (l1/l2/l3): ").toLowerCase();
    if(est.notas[materia][lapso] === undefined) {
        console.log("❌ Lapso no valido");
        return pausar();
    }

    // Validación de entrada numérica
    let nuevaNota = parseFloat(prompt(`Ingrese la nota para ${materia} (${lapso}): `));
    
    if (isNaN(nuevaNota) || nuevaNota < 0 || nuevaNota > 20) {
        console.log("❌ Error: Ingrese un número válido entre 0 y 20.");
        return pausar();
    }

    // Actualización de datos
    est.notas[materia][lapso] = nuevaNota;
    db.guardarDatos(estudiantes);

    // --- CÁLCULO EN TIEMPO REAL ---
    console.log("\n-----------------------------------------");
    console.log(`✅ Nota guardada exitosamente.`);
    
    // Usamos tu lógica existente para mostrar el impacto inmediato
    let nuevoPromedio = logica.calcularPromedioMateria(est.notas[materia]);
    
    console.log(`📊 Promedio actualizado de ${materia.toUpperCase()}: ${nuevoPromedio}`);
    
    // Feedback visual según la nota (opcional pero le da puntos extra al proyecto)
    if (nuevoPromedio >= 10) {
        console.log("Estado: 🟢 Aprobado");
    } else {
        console.log("Estado: 🔴 Reprobado (Requiere recuperación)");
    }
    console.log("-----------------------------------------\n");

    pausar();
}


function verBoletin() {
    let cedula = prompt("Cedula del estudiante para ver boletín: ");
    let est = estudiantes.find(e => e.cedula === cedula);

    if (!est) {
        console.log("❌ Estudiante no encontrado");
        return pausar();
    }

    let editando = true;

    while (editando) {
        console.clear();
        console.log(`\n========== BOLETIN INTERACTIVO: ${est.nombre} ${est.apellido} ==========`);
        console.log("Materia\t\tL1\tL2\tL3\tProm\tEstado");
        console.log("------------------------------------------------------------");

        for (let materia in est.notas) {
            let n = est.notas[materia];
            let prom = logica.calcularPromedioMateria(n);
            let estado = prom >= 10 ? "🟢" : "🔴";
            // Usamos .padEnd para que las columnas queden alineadas
            console.log(`${materia.padEnd(12)}\t${n.l1}\t${n.l2}\t${n.l3}\t${prom}\t${estado}`);
        }
        console.log("------------------------------------------------------------");
        
        console.log("\n[ E ] Editar una nota | [ ENTER ] Volver al menú principal");
        let accion = prompt("Seleccione una opción: ").toLowerCase();

        if (accion === 'e') {
            let matInput = prompt("¿Qué materia desea modificar?: ").toLowerCase();
            
            if (est.notas[matInput]) {
                let lapsoInput = prompt("¿Qué lapso (l1, l2, l3)?: ").toLowerCase();
                
                if (est.notas[matInput][lapsoInput] !== undefined) {
                    let nuevaNota = parseFloat(prompt(`Nueva nota para ${matInput} - ${lapsoInput}: `));

                    if (!isNaN(nuevaNota) && nuevaNota >= 0 && nuevaNota <= 20) {
                        est.notas[matInput][lapsoInput] = nuevaNota;
                        db.guardarDatos(estudiantes); // Guardamos cambios
                        console.log("\n✅ Nota actualizada. Refrescando boletín...");
                    } else {
                        console.log("\n❌ Nota inválida (debe ser entre 0 y 20).");
                        pausar();
                    }
                } else {
                    console.log("\n❌ Lapso no válido.");
                    pausar();
                }
            } else {
                console.log("\n❌ Materia no encontrada en el boletín.");
                pausar();
            }
        } else {
            editando = false; // Sale del bucle y vuelve al menú principal
        }
    }
}

function buscarEstudiante(){
    console.clear();
    let cedula = prompt("Cedula del estudiante a buscar: ");
    let est = estudiantes.find(e => e.cedula === cedula);
    if(!est) {
        console.log("❌ No encontrado");
    } else {
        console.log(`\nEncontrado: ${est.nombre} ${est.apellido} | Año: ${est.año} | Seccion: ${est.seccion}`);
    }
    pausar();
}

function modificarEstudiante(){
    console.clear();
    let cedula = prompt("Cedula del estudiante a modificar: ");
    let est = estudiantes.find(e => e.cedula === cedula);
    if(!est) {
        console.log("❌ No encontrado");
        return pausar();
    }

    est.nombre = prompt("Nuevo nombre: ");
    est.apellido = prompt("Nuevo apellido: ");
    est.año = prompt("Nuevo año: ");
    est.seccion = prompt("Nueva seccion: ");
    db.guardarDatos(estudiantes);
    console.log("✅ Datos modificados");
    pausar();
}

function eliminarEstudiante(){
    console.clear();
    let cedula = prompt("Cedula del estudiante a eliminar: ");
    let index = estudiantes.findIndex(e => e.cedula === cedula);
    if(index === -1) {
        console.log("❌ No encontrado");
        return pausar();
    }

    let confirmar = prompt(`¿Seguro que desea eliminar a ${estudiantes[index].nombre}? (s/n): `);
    if(confirmar.toLowerCase() === 's') {
        estudiantes.splice(index, 1);
        db.guardarDatos(estudiantes);
        console.log("✅ Estudiante eliminado");
    } else {
        console.log("Operación cancelada");
    }
    pausar();
}

// ================= MENU =================

function ejecutarMenu(){
    let opcion;
    do {
        console.clear();
        console.log("\n====== SISTEMA DE CONTROL DE ESTUDIO ======");
        console.log("1. Registrar estudiante");
        console.log("2. Listado general");
        console.log("3. Gestionar Notas y Boletín"); // <--- Consolidado
        console.log("4. Buscar estudiante");
        console.log("5. Modificar datos personales");
        console.log("6. Eliminar estudiante");
        console.log("7. Salir");

        opcion = prompt("Seleccione una opcion: ");

        switch(opcion){
            case "1": registrarEstudiante(); break;
            case "2": mostrarEstudiantes(); break;
            case "3": verBoletin(); break; // Esta ahora lo hace todo
            case "4": buscarEstudiante(); break;
            case "5": modificarEstudiante(); break;
            case "6": eliminarEstudiante(); break;
            case "7": console.log("Saliendo..."); break;
            default: 
                console.log("Opcion invalida");
                pausar();
        }
    } while(opcion !== "7");
}

if(login()) ejecutarMenu();


