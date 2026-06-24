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
        let datos = JSON.parse(texto);

        void insertDB(datos, "json", 1);

        try {
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

    document.getElementById("mission-list").innerHTML =
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

    // Imagenes
    void cargarImagen(datos.foto, document
        .getElementById("name-container"), "character-image");
    void cargarImagen(datos.persona.foto, document
        .getElementById("persona-name-container"), "persona-image");
}

function crearHTML(lista, clases) {
    return lista.map((x, indexArray) => {
        let clase = clases + comprobarClaseCss(x, clases);

        return `<div class="${clase}">
                    ${crearContenidoTarjeta(x, clases, indexArray)}
                </div>`;
    }).join('');
}

async function cargarImagen(imagen, lugarImagen, id) {
    let img = document.getElementById(id);

    if (!img) {
        img = document.createElement("img");
        img.id = id;
        lugarImagen.after(img);
    }

    if (id === "character-image") {
        let guardada = await selectDB("fotos", "imagen_personaje");
        if (guardada) {
            img.src = guardada;
        }
    }

    if (id === "persona-image") {
        let guardada = await selectDB("fotos", "imagen_persona");
        if (guardada) {
            img.src = guardada;
        }
    }

    if (imagen && imagen.startsWith("data:image")) {
        img.src = imagen;
    }
}

function comprobarClaseCss(x, clases) {
    switch(clases) {
        case "weakness-item":
            return " " + x.detalles.toLowerCase();
        case "skill-card":
            return " " + x.codElemento.toLowerCase();
        default:
            return "";
    }
}

function crearContenidoTarjeta(x, clases, indexArray) {
    switch (clases) {

        case "skill-card character-skill":
            return `      
                <button class="edit-btn skill-edit-btn open"
                        data-modal="menu-habilidades-personaje"
                        data-index_array=${indexArray}>
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="edit-btn skill-edit-btn delete"
                        data-modal="menu-habilidades-personaje"
                        data-index_array=${indexArray}>
                    <i class="bi bi-trash"></i>
                </button>

                <h5>${x.nombre} +${x.nivel * x.tier}</h5>
                <p>${x.detalles}</p>
                <div class="skill-meta">
                    <span>Nv: ${x.nivel}</span>
                    <span>Tier: ${x.tier}</span>
                    <span>Stat: ${x.stat}</span>
                </div>
            `;

        case "weakness-item":
            let debs = "";
            for (let deb in listaDebilidades) {
                debs += `
                    <option ${deb === x.detalles ? "selected" : ""} value="${deb}">${listaDebilidades[deb]}</option>
                `;
            }

            return `
                <h5>${x.nombre}</h5>
                <select id="select-debilidad-${indexArray}" class="select-debilidad" data-elemento="${x.nombre}">
                    ${debs}
                </select>
            `;

        case "inventory-item":
            return `
                 <button class="edit-btn skill-edit-btn open"
                        data-modal="menu-inventario"
                        data-index_array=${indexArray}>
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="edit-btn skill-edit-btn delete"
                        data-modal="menu-inventario"
                        data-index_array=${indexArray}>
                    <i class="bi bi-trash"></i>
                </button>
                
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
                <button class="edit-btn skill-edit-btn open"
                        data-modal="menu-habilidades-persona"
                        data-index_array=${indexArray}>
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="edit-btn skill-edit-btn delete"
                        data-modal="menu-habilidades-persona"
                        data-index_array=${indexArray}>
                    <i class="bi bi-trash"></i>
                </button>
                
                <h5>${x.nombre} +${x.nivel}</h5>
                <p>${x.detalles || ""}</p>
                <div class="skill-meta">
                    <span>${x.elemento || "-"}</span>
                    <span>Nv: ${x.nivel || "-"}</span>
                </div>
            `;

        case "mission":
            return `
                <button class="edit-btn mission-edit-btn open"
                        data-modal="menu-misiones"
                        data-index_array=${indexArray}>
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="edit-btn mission-edit-btn delete"
                        data-modal="menu-misiones"
                        data-index_array=${indexArray}>
                    <i class="bi bi-trash"></i>
                </button>
                
                <h5>${x.nombre}</h5>
                <p>${x.detalles || ""}</p>
            `;

        default:
            return `
            `;
    }
}

function cargarJSONDesdeDB() {
    selectDB("json", 1).then(datos => {
        if (!datos) generarJSONBase();
        ponerJSONenElHTML(datos);
    });
}

function generarJSONBase() {
    let json = {
        nombre: "",
        foto: null,
        estadisticas: [
            {
                stat: "FUE",
                valor: 0
            },
            {
                stat: "DES",
                valor: 0
            },
            {
                stat: "CON",
                valor: 0
            },
            {
                stat: "INT",
                valor: 0
            },
            {
                stat: "VOL",
                valor: 0
            },
            {
                stat: "AST",
                valor: 0
            },
            {
                stat: "PER",
                valor: 0
            },
            {
                stat: "DEV",
                valor: 0
            }
        ],
        vida: [
            {
                parte: "Cabeza",
                maximo: 40,
                actual: 40
            },
            {
                parte: "Torso",
                maximo: 60,
                actual: 60
            },
            {
                parte: "Brazo izq.",
                maximo: 20,
                actual: 20
            },
            {
                parte: "Brazo der.",
                maximo: 20,
                actual: 20
            },
            {
                parte: "Pierna izq.",
                maximo: 30,
                actual: 30
            },
            {
                parte: "Pierna der.",
                maximo: 30,
                actual: 30
            }
        ],
        habilidades: [],
        inventario: [],
        misiones: [],
        persona: {
            nombre: "",
            foto: null,
            vida: {
                maximo: 100,
                actual: 100
            },
            mp: {
                maximo: 50,
                actual: 50
            },
            estadisticas: [
                {
                    stat: "FUE",
                    valor: 0
                },
                {
                    stat: "DES",
                    valor: 0
                },
                {
                    stat: "CON",
                    valor: 0
                },
                {
                    stat: "INT",
                    valor: 0
                },
                {
                    stat: "VOL",
                    valor: 0
                },
                {
                    stat: "AST",
                    valor: 0
                },
                {
                    stat: "PER",
                    valor: 0
                },
                {
                    stat: "DEV",
                    valor: 0
                }
            ],
            debilidades: [
                {
                    nombre: "Físico",
                    detalles: "NORMAL"
                },
                {
                    nombre: "Disparo",
                    detalles: "NORMAL"
                },
                {
                    nombre: "Piedra",
                    detalles: "NORMAL"
                },
                {
                    nombre: "Electricidad",
                    detalles: "IMMUNE"
                },
                {
                    nombre: "Magnético",
                    detalles: "NORMAL"
                },
                {
                    nombre: "Nuclear",
                    detalles: "NORMAL"
                },
                {
                    nombre: "Hielo",
                    detalles: "RESIST"
                },
                {
                    nombre: "Fuego",
                    detalles: "WEAK"
                },
                {
                    nombre: "Luz",
                    detalles: "REFLECT"
                },
                {
                    nombre: "Agua",
                    detalles: "NORMAL"
                },
                {
                    nombre: "Cinético",
                    detalles: "NORMAL"
                },
                {
                    nombre: "Viento",
                    detalles: "NORMAL"
                },
                {
                    nombre: "Psíquico",
                    detalles: "NORMAL"
                },
                {
                    nombre: "Oscuridad",
                    detalles: "ABSORB"
                }
            ],
            habilidades: []
        }
    }

    void insertDB(json, "json", 1);
}

document.addEventListener("DOMContentLoaded", function () {
    // Por si se hace F5 sin que haya un JSON
    void cargarImagen("imagen_personaje", document
        .getElementById("name-container"), "character-image");
    void cargarImagen("imagen_persona", document
        .getElementById("persona-name-container"), "persona-image");

    cargarJSONDesdeDB();

    document.getElementById("importField").onchange = cargarJSON;
});