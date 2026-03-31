function cargarJSON(local) {
    let archivo = this.files[0];
    if (!archivo) return;

    leerJSON(archivo, function(datos) {
        ponerJSONenElHTML(datos);
    });
}

function leerJSON(archivo, callback) {
    let reader = new FileReader();

    reader.onload = function(event) {
        let texto = event.target.result;

        // Almacenar en navegador
        localStorage.setItem("personajeJSON", texto);

        try {
            let datos = JSON.parse(texto);
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

    document.getElementById("skill-list").innerHTML = crearListaHTML(datos.habilidades);
    document.getElementById("inventory-list").innerHTML = crearListaHTML(datos.inventario);
    document.getElementById("mission-list").innerHTML +=
        datos.misiones.map(mision =>
            `<div class="mission">
                <h5>${mision.nombre}</h5>
                <p>${mision.detalles}</p>
            </div>`).join('');
    document.getElementById("persona-skill-list").innerHTML = crearListaHTML(datos.persona.habilidades);
}

function crearListaHTML(lista) {
    return lista.map(x => `<li>${x}</li>`).join('');
}

function cargarJSONDesdeLocalStorage() {
    let texto = localStorage.getItem("personajeJSON");
    if (!texto) return;

    let datos = JSON.parse(texto);
    ponerJSONenElHTML(datos);
}

window.onload = function () {
    cargarJSONDesdeLocalStorage();

    document.getElementById("fileField").onchange = cargarJSON;
}