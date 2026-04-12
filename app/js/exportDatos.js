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
        obtenerVida("#health-grid");

    return datosObj;
}

function obtenerEstadisticas(selector) {
    let stats =
        document.querySelectorAll(`${selector} .stat`);
    let datos = {};

    stats.forEach(stat => {
        let clave = stat.querySelector("span").textContent;
        let valor = parseInt(stat.querySelector("strong").textContent);

        datos[clave] = valor;
    })

    return datos;
}

function obtenerVida(selector) {
    let vidaPartes =
        document.querySelectorAll(".health-item");
    let datos = {};

    vidaPartes.forEach(parte => {
        let claveParte = parte.querySelector("h5").textContent;
        datos["parte"] = claveParte;

        let max = parte.querySelector("span").textContent
            .match();
    });
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("exportBtn").onclick = exportar;
});