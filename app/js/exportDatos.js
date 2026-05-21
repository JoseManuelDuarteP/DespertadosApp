async function exportar() {
    let datos = await cogerDatos();
    let json = JSON.stringify(datos);

    let blob = new Blob([json], {type: "application/json"});

    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = datos.nombre + ".json";
    link.click();

    URL.revokeObjectURL(link.href);
}

async function cogerDatos() {
    return await selectDB("json", 1);
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("exportBtn").onclick = exportar;
});