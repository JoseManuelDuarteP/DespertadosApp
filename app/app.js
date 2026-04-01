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

    document.getElementById("character-name").innerHTML =
        datos.nombre;

    document.getElementById("persona-name").innerHTML =
        datos.persona.nombre;

    document.getElementById("skill-list").innerHTML =
        crearHTML(datos.habilidades, "skill-card character-skill");

    document.getElementById("inventory-list").innerHTML =
        crearHTML(datos.inventario, "inventory-item");

    document.getElementById("mission-list").innerHTML +=
        crearHTML(datos.misiones, "mission")

    document.getElementById("persona-skill-list").innerHTML =
        crearHTML(datos.persona.habilidades, "skill-card");

    document.getElementById("weakness-container").innerHTML =
        crearHTML(datos.persona.debilidades, "weakness-item");
}

function crearHTML(lista, clases) {
    return lista.map(x => {
        let clase = clases + comprobarClaseCss(x, clases);

        return `<div class="${clase}">
                    ${crearContenidoTarjeta(x, clases)}
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

function crearContenidoTarjeta(x, clases) {
    switch (clases) {

        case "skill-card character-skill":
            return `
                <h5>${x.nombre}</h5>
                <p>${x.detalles}</p>
                <div class="skill-meta">
                    <span>Nv: ${x.nivel}</span>
                    <span>Tier: ${x.tier}</span>
                    <span>Stat: ${x.stat}</span>
                </div>
            `;

        case "weakness-item":
            return `
                <h5>${x.nombre}</h5>
                <p>${listaDebilidades[x.detalles]}</p>
            `;

        case "inventory-item":
            return `
                <h5>${x.nombre}</h5><span class="quantity">${x.cantidad}</span>
                <p>${x.descripcion}</p>
            `;

        default:
            return `
                <h5>${x.nombre}</h5>
                <p>${x.detalles || ""}</p>
            `;
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