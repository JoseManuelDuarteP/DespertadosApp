const listaDebilidades = {
    WEAK: "Débil",
    RESIST: "Resistente",
    IMMUNE: "Inmune",
    ABSORB: "Absorbe",
    REFLECT: "Refleja",
    NORMAL: "Normal"
}

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

    document.getElementById("skill-list").innerHTML =
        crearListaHTML(datos.habilidades);

    document.getElementById("inventory-list").innerHTML =
        crearListaHTML(datos.inventario);

    document.getElementById("mission-list").innerHTML +=
        crearTarjetaHTML(datos.misiones, "mission")

    document.getElementById("persona-skill-list").innerHTML =
        crearTarjetaHTML(datos.persona.habilidades, "skill-card");

    document.getElementById("weakness-container").innerHTML =
        crearTarjetaHTML(datos.persona.debilidades, "weakness-item");
}

function crearListaHTML(lista) {
    return lista.map(x => `<li>${x}</li>`).join('');
}

function crearTarjetaHTML(lista, clases) {
    return lista.map(x => {
        let clase = clases; // Map es un bucle, hay que reiniciar el parámetro

        clase += comprobarClaseCss(x, clases);

        return `<div class="${clase}">
                    <h5>${x.nombre}</h5>
                    <p>${clases === "weakness-item" ? listaDebilidades[x.detalles] : x.detalles || ""}</p>
                </div>`;
    }).join('');
}

function comprobarClaseCss(x, clases) {
    switch(clases) {
        case "weakness-item":
            return " " + x.detalles.toLowerCase();
        default:
            return "";
    }
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