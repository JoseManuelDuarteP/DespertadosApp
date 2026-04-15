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

    /*datosObj.persona.nombre =
        document.getElementById("persona-name").textContent;*/

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
        dato["max"] = parseInt(max);
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
            .split(" ")[0];
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

        let nombre = contenedor.querySelector("h5").textContent;
        let detalles = contenedor.querySelector("p").textContent;

        dato["nombre"] = nombre;
        dato["detalles"] = detalles;
        datos.push(dato);
    });

    return datos;
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("exportBtn").onclick = exportar;
});