const prompt = require('prompt-sync')();
const fs = require('fs');

let estudiantes = [];

// ================= LOGIN =================

function login(){

    const usuarioCorrecto = "admin";
    const passwordCorrecto = "admin";

    let usuario = prompt("Usuario: ");
    let password = prompt("Contraseña: ");

    if(usuario === usuarioCorrecto && password === passwordCorrecto){

        console.log("\n✅ Acceso concedido\n");
        return true;

    }else{

        console.log("❌ Datos incorrectos");
        return false;

    }

}

// ================= ARCHIVOS =================

function cargarDatos(){

    if(fs.existsSync("estudiantes.json")){

        let datos = fs.readFileSync("estudiantes.json");
        estudiantes = JSON.parse(datos);

    }

}

function guardarDatos(){

    fs.writeFileSync("estudiantes.json", JSON.stringify(estudiantes,null,2));

}

// ================= CREAR ESTUDIANTE =================

function crearEstudiante(cedula,nombre,apellido,año,seccion,tipo){

    return{

        cedula,
        nombre,
        apellido,
        año,
        seccion,
        tipo,

        notas:{
            matematica:{l1:0,l2:0,l3:0},
            lenguaje:{l1:0,l2:0,l3:0},
            historia:{l1:0,l2:0,l3:0}
        }

    }

}

// ================= REGISTRAR =================

function registrarEstudiante(){

    let cedula = prompt("Cedula: ");

    let existe = estudiantes.find(e=>e.cedula===cedula);

    if(existe){

        console.log("❌ Ya existe un estudiante con esa cedula");
        return;

    }

    let nombre = prompt("Nombre: ");
    let apellido = prompt("Apellido: ");
    let año = prompt("Año: ");
    let seccion = prompt("Seccion: ");
    let tipo = prompt("Tipo (Nuevo/Regular): ");

    let nuevo = crearEstudiante(cedula,nombre,apellido,año,seccion,tipo);

    estudiantes.push(nuevo);

    guardarDatos();

    console.log("✅ Estudiante registrado");

}

// ================= MOSTRAR =================

function mostrarEstudiantes(){

    if(estudiantes.length === 0){

        console.log("No hay estudiantes registrados");
        return;

    }

    estudiantes.forEach(e=>{

        console.log(
            "Cedula:",e.cedula,
            "| Nombre:",e.nombre,e.apellido,
            "| Año:",e.año,
            "| Seccion:",e.seccion
        );

    });

}

// ================= COLOCAR NOTA =================

function colocarNota(){

    let cedula = prompt("Cedula del estudiante: ");

    let est = estudiantes.find(e=>e.cedula===cedula);

    if(!est){

        console.log("❌ Estudiante no encontrado");
        return;

    }

    let materia = prompt("Materia (matematica/lenguaje/historia): ").toLowerCase();

    if(!est.notas[materia]){

        console.log("❌ Materia no valida");
        return;

    }

    let lapso = prompt("Lapso (l1/l2/l3): ").toLowerCase();

    if(est.notas[materia][lapso] === undefined){

        console.log("❌ Lapso no valido");
        return;

    }

    let nota = parseFloat(prompt("Nota: "));

    est.notas[materia][lapso] = nota;

    guardarDatos();

    console.log("✅ Nota registrada");

}

// ================= PROMEDIO =================

function promedioMateria(notas){

    return ((notas.l1 + notas.l2 + notas.l3)/3).toFixed(2);

}

// ================= VER BOLETIN =================

function verBoletin(){

    let cedula = prompt("Cedula del estudiante: ");

    let est = estudiantes.find(e=>e.cedula===cedula);

    if(!est){

        console.log("❌ Estudiante no encontrado");
        return;

    }

    console.log("\n========== BOLETIN ==========\n");

    console.log("Nombre:",est.nombre,est.apellido);
    console.log("Cedula:",est.cedula);
    console.log("Año:",est.año," | Seccion:",est.seccion);

    console.log("\nMateria\t\tL1\tL2\tL3\tProm");

    for(let materia in est.notas){

        let n = est.notas[materia];

        let prom = promedioMateria(n);

        console.log(
            materia,"\t",
            n.l1,"\t",
            n.l2,"\t",
            n.l3,"\t",
            prom
        );

    }

}
// ================= BUSCAR =================

function buscarEstudiante(){

    let cedula = prompt("Cedula del estudiante: ");

    let est = estudiantes.find(e=>e.cedula===cedula);

    if(!est){

        console.log("❌ No encontrado");
        return;

    }

    console.log("\nEstudiante encontrado:");

    console.log("Nombre:",est.nombre,est.apellido);
    console.log("Año:",est.año);
    console.log("Seccion:",est.seccion);

}

// ================= MODIFICAR =================

function modificarEstudiante(){

    let cedula = prompt("Cedula del estudiante: ");

    let est = estudiantes.find(e=>e.cedula===cedula);

    if(!est){

        console.log("❌ Estudiante no encontrado");
        return;

    }

    est.nombre = prompt("Nuevo nombre: ");
    est.apellido = prompt("Nuevo apellido: ");
    est.año = prompt("Nuevo año: ");
    est.seccion = prompt("Nueva seccion: ");

    guardarDatos();

    console.log("✅ Datos modificados");

}

// ================= ELIMINAR =================

function eliminarEstudiante(){

    let cedula = prompt("Cedula del estudiante: ");

    let index = estudiantes.findIndex(e=>e.cedula===cedula);

    if(index === -1){

        console.log("❌ Estudiante no encontrado");
        return;

    }

    estudiantes.splice(index,1);

    guardarDatos();

    console.log("✅ Estudiante eliminado");

}

// ================= MENU =================

function menu(){

    cargarDatos();

    let opcion;

    do{

        console.log("\n====== CONTROL DE ESTUDIO ======");

        console.log("1 Registrar estudiante");
        console.log("2 Mostrar estudiantes");
        console.log("3 Colocar nota");
        console.log("4 Ver boletin");
        console.log("5 Buscar estudiante");
        console.log("6 Modificar estudiante");
        console.log("7 Eliminar estudiante");
        console.log("8 Salir");

        opcion = prompt("Seleccione una opcion: ");

        switch(opcion){

            case "1":
            registrarEstudiante();
            break;

            case "2":
            mostrarEstudiantes();
            break;

            case "3":
            colocarNota();
            break;

            case "4":
            verBoletin();
            break;

            case "5":
            buscarEstudiante();
            break;

            case "6":
            modificarEstudiante();
            break;

            case "7":
            eliminarEstudiante();
            break;

            case "8":
            console.log("Saliendo del sistema...");
            break;

            default:
            console.log("Opcion invalida");

        }

    }while(opcion !== "8");

}

// ================= INICIO DEL PROGRAMA =================

if(login()){

    menu();

}
