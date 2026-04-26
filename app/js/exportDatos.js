function exportar() {
    let datos = cogerDatos();
    let json = JSON.stringify(datos);

    let blob = new Blob([json], {type: "application/json"});

    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = datos.nombre + ".json";
    link.click();

    URL.revokeObjectURL(link.href);
}

function cogerDatos() {
    let datosObj = {};

    datosObj.nombre =
        document.getElementById("character-name").textContent;

    datosObj.foto =
        localStorage.getItem("imagen_personaje");

    datosObj.estadisticas =
        obtenerEstadisticas("#stats-grid-personaje");

    datosObj.vida =
        obtenerVida();

    datosObj.habilidades =
        obtenerHabilidades();

    datosObj.inventario =
        obtenerInventario();

    datosObj.misiones =
        obtenerDatosSimples("#mission-list");

    datosObj.persona =
        crearPersona();

    return datosObj;
}

function obtenerEstadisticas(selector) {
    let stats =
        document.querySelectorAll(`${selector} .stat`);
    let datos = [];

    stats.forEach(stat => {
        let dato = {};

        let nombreStat = stat.querySelector("span").textContent;
        let valor = stat.querySelector("strong").textContent;

        dato["stat"] = nombreStat;
        dato["valor"] = parseInt(valor);
        datos.push(dato);
    });

    return datos;
}

function obtenerVida() {
    let vidaPartes =
        document.querySelectorAll(".health-item");
    let datos = [];

    vidaPartes.forEach(parte => {
        let dato = {};

        let claveParte = parte.querySelector("h5").textContent;
        let max = parte.querySelector("span").textContent
            .split("/")[1];
        let actual = parte.querySelector("span").textContent
            .split("/")[0];

        dato["parte"] = claveParte;
        dato["maximo"] = parseInt(max);
        dato["actual"] = parseInt(actual);
        datos.push(dato);
    });

    return datos;
}

function obtenerHabilidades() {
    let habilidades =
        document.querySelectorAll(`#skill-list .character-skill`);
    let datos = [];

    habilidades.forEach(habilidad => {
        let dato = {};

        let nombre = habilidad.querySelector("h5").textContent
            .split(" +")[0];
        let detalles = habilidad.querySelector("p").textContent;
        let nivel = habilidad.querySelectorAll("span")[0].textContent
            .split(" ")[1];
        let tier = habilidad.querySelectorAll("span")[1].textContent
            .split(" ")[1];
        let stat = habilidad.querySelectorAll("span")[2].textContent
            .split(" ")[1];

        dato["nombre"] = nombre;
        dato["detalles"] = detalles;
        dato["nivel"] = parseInt(nivel);
        dato["tier"] = parseInt(tier);
        dato["stat"] = stat;
        datos.push(dato);
    });

    return datos;
}

function obtenerInventario() {
    let inventario =
        document.querySelectorAll(".inventory-item");
    let datos = [];

    inventario.forEach(item => {
        let dato = {};

        let nombre = item.querySelector("h5").textContent;
        let cantidad = item.querySelector("span").textContent;
        let descripcion = item.querySelector("p").textContent;

        dato["nombre"] = nombre;
        dato["cantidad"] = parseInt(cantidad);
        dato["descripcion"] = descripcion;
        datos.push(dato);
    });

    return datos;
}

function obtenerDatosSimples(selector) {
    let contenedores =
        document.querySelectorAll(`${selector} div`);
    let datos = [];

    contenedores.forEach(contenedor => {
        let dato = {};
        if (contenedor.classList.contains("edit-header")) return;

        let nombre = contenedor.querySelector("h5").textContent;
        let detalles = contenedor.querySelector("p").textContent;

        dato["nombre"] = nombre;

        if (Object.values(listaDebilidades).includes(detalles)) {
            detalles = Object.entries(listaDebilidades)
                .find(([llave, valor]) => valor === detalles)?.[0];

            dato["detalles"] = detalles;
        }
        dato["detalles"] = detalles;
        datos.push(dato);
    });

    return datos;
}

// === FUNCIONES PERSONA ===
function crearPersona() {
    let persona = {};

    persona.nombre =
        document.getElementById("persona-name").textContent;

    persona.foto =
        localStorage.getItem("imagen_persona");

    persona.vida =
        obtenerRecursoPersona("#persona-hp-bar");

    persona.mp =
        obtenerRecursoPersona("#persona-mana-bar");

    persona.estadisticas =
        obtenerEstadisticas("#stats-grid-persona");

    persona.debilidades =
        obtenerDatosSimples("#weakness-container");

    persona.habilidades =
        obtenerHabilidadesPersona();

    return persona;
}

function obtenerRecursoPersona(recurso) {
    let contenedor =
        document.querySelector(`${recurso} + span`);
    let datos = {};

    let maximo =
        contenedor.textContent.split("/")[1];
    let actual =
        contenedor.textContent.split("/")[0];

    datos["maximo"] = maximo;
    datos["actual"] = actual;
    return datos;
}

function obtenerHabilidadesPersona() {
    let habilidades =
        document.querySelectorAll(`#persona-skill-list .skill-card`);
    let datos = [];

    habilidades.forEach(habilidad => {
        let dato = {};

        let nombre = habilidad.querySelector("h5").textContent
            .split(" +")[0];
        let nivel = habilidad.querySelector("h5").textContent
            .match(/\d+/)[0];
        let detalles = habilidad.querySelector("p").textContent;

        dato["nombre"] = nombre;
        dato["nivel"] = parseInt(nivel);
        dato["detalles"] = detalles;
        datos.push(dato);
    });

    return datos;
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("exportBtn").onclick = exportar;
});