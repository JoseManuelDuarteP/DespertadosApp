function cargarJSON() {
    let archivo = this.files[0];
    if (!archivo) return;

    leerJSON(archivo, function(datos) {
        ponerJSONenElHTML(datos);
    });
}

function leerJSON(archivo, callback) {
    let reader = new FileReader();

    reader.onload = function(event) {
        try {
            let datos = JSON.parse(event.target.result);
            callback(datos);
        } catch (e) {
            console.log("JSON no válido");
            callback(null);
        }
    };

    reader.readAsText(archivo);
}

function ponerJSONenElHTML(datos) {
    if (!datos) return;

    document.getElementById("a").textContent += datos.a;
}

window.onload = function () {
    document.getElementById("import").onchange = cargarJSON;
}