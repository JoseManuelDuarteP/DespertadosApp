const listaDebilidades = {
    WEAK: "Débil",
    RESIST: "Resistente",
    IMMUNE: "Inmune",
    ABSORB: "Absorbe",
    REFLECT: "Refleja",
    NORMAL: "Normal"
}

/*const listaStats = {
    FUE: "Fuerza",
    DES: "Destreza",
    CON: "Constitución",
    INT: "Inteligencia",
    VOL: "Voluntad",
    AST: "Astra",
    PER: "Percepción",
    DEV: "Devoción"
}*/

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

    document.getElementById("stats-grid-personaje").innerHTML =
        crearHTML(datos.estadisticas, "stat");

    document.getElementById("stats-grid-persona").innerHTML =
        crearHTML(datos.persona.estadisticas, "stat");

    document.getElementById("health-grid").innerHTML =
        crearHTML(datos.vida, "health-item");

    document.getElementById("persona-resources-container").innerHTML =
        crearContenidoTarjeta(datos.persona, "persona-resources-container");

    cargarImagen(datos.foto, document
        .getElementById("name-container"), "character-image");
    cargarImagen(datos.persona.foto, document
        .getElementById("persona-name-container"), "persona-image");
}

function crearHTML(lista, clases) {
    return lista.map(x => {
        let clase = clases + comprobarClaseCss(x, clases);

        return `<div class="${clase}">
                    ${crearContenidoTarjeta(x, clases)}
                </div>`;
    }).join('');
}

function cargarImagen(imagen, lugarImagen, id) {
    let img = document.getElementById(id);

    if (!img) {
        img = document.createElement("img");
        img.id = id;
        lugarImagen.after(img);
    }

    if (id === "character-image") {
        let guardada = localStorage.getItem("imagen_personaje");
        if (guardada) {
            img.src = guardada;
            return;
        }
    }

    if (id === "persona-image") {
        let guardada = localStorage.getItem("imagen_persona");
        if (guardada) {
            img.src = guardada;
            return;
        }
    }

    if (imagen && imagen.startsWith("data:image")) {
        img.src = imagen;
    } else if (imagen) {
        img.src = localStorage.getItem(imagen);
    }
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
                <h5>${x.nombre} +${x.nivel * x.tier}</h5>
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

        case "stat":
            return `
                <span>${x.stat}</span><strong>${x.valor}</strong>
            `;

        case "health-item":
            return `
                <h5>${x.parte}</h5>
                <div class="progress health-wrapper">
                    <div class="progress-bar hp-bar" style="width: ${(x.actual * 100)/x.maximo}%"></div>
                    <span class="health-text">${x.actual}/${x.maximo}</span>
                </div>
            `;

        case "persona-resources-container":
            return `
                <div class="persona-bar">
                    <h5>HP</h5>
                    <div class="progress persona-bar-wrapper">
                        <div id="persona-hp-bar" class="progress-bar hp-bar" style="width: ${(x.vida.actual * 100)/x.vida.maximo}%"></div>
                        <span class="bar-text">${x.vida.actual}/${x.vida.maximo}</span>
                    </div>
                </div>

                <div class="persona-bar">
                    <h5>MP</h5>
                    <div class="progress persona-bar-wrapper mana">
                        <div id="persona-mana-bar" class="progress-bar mana-bar" style="width: ${(x.mp.actual * 100)/x.mp.maximo}%"></div>
                        <span class="bar-text">${x.mp.actual}/${x.mp.maximo}</span>
                    </div>
                </div>
            `;

        case "skill-card":
            return `
                <h5>${x.nombre} +${x.nivel}</h5>
                <p>${x.detalles || ""}</p>
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

document.addEventListener("DOMContentLoaded", function () {
    cargarJSONDesdeLocalStorage();

    document.getElementById("importField").onchange = cargarJSON;
});