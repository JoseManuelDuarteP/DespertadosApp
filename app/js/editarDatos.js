function abrirModal(idModal, indiceArray, btn) {
    let overlay = document.getElementById("modal-overlay");
    let modal = document.getElementById(idModal);

    if (btn.classList.contains("open")) {
        void ponerDatosEnModal(idModal, indiceArray);
    }

    overlay.classList.add("active");
    modal.classList.add("active");
}

async function ponerDatosEnModal(idModal, indiceArray) {
    let datos = await selectDB("json", 1);

    switch (idModal) {
        case "menu-stats-personaje": {
            let html = `
                <label for="nombre-personaje-input">Nombre</label>
                <input id="nombre-personaje-input" type="text" 
                name="nombre-personaje" value="${datos.nombre}">
            `;

            for (let stat of datos.estadisticas) {
                html += `
                    <label for="stat-${stat.stat}">${stat.stat}</label>
                    <input id="stat-${stat.stat}" type="number" name="stat-${stat.stat}">
                `;
            }
            document.getElementById("form-stats-personaje").innerHTML = html;

            for (let stat of datos.estadisticas) {
                document.getElementById(`stat-${stat.stat}`).value = stat.valor;
            }
            break;
        }

        case "menu-cuerpo-personaje": {
            document.getElementById("labels-cuerpo").innerHTML =`
                <label>Parte</label>
                <label>Actual</label>
                <label>Máximo</label>
            `;

            let html = ``;
            for (let parte of datos.vida) {
                html += `
                    <input id="parte-${parte.parte}" type="text" name="parte-${parte.parte}">
                    <input id="parte-${parte.parte}-actual" type="number" name="parte-${parte.parte}-actual">
                    <input id="parte-${parte.parte}-maximo" type="number" name="parte-${parte.parte}-maximo">
                `;
            }
            document.getElementById("inputs-cuerpo").innerHTML = html;

            for (let parte of datos.vida) {
                document.getElementById(`parte-${parte.parte}`).value =
                    parte.parte;
                document.getElementById(`parte-${parte.parte}-actual`).value =
                    parte.actual;
                document.getElementById(`parte-${parte.parte}-maximo`).value =
                    parte.maximo;
            }
            break;
        }

        case "menu-habilidades-personaje": {
            let habilidad = datos.habilidades[indiceArray];

            document.getElementById("skill-form-header").innerHTML =`
                <!-- Campo hidden para identificar la habilidad -->
                <input id="index-habilidad" type="hidden" value="${indiceArray}">
                <input id="habilidad-nombre-input" type="text" 
                placeholder="Nombre habilidad" name="habilidad-nombre" value="${habilidad.nombre}">
            `;
            document.getElementById("skill-form-body").innerHTML =`
                <textarea id="habilidad-descripcion-input" placeholder="Descripción de la habilidad..." 
                name="detalles">${habilidad.detalles}</textarea>
            `;
            document.getElementById("skill-form-stats").innerHTML =`
                <div class="stat-input">
                    <label>Nivel</label>
                    <input id="habilidad-nivel-input" type="number" name="nivel" placeholder="0"
                    value="${habilidad.nivel}">
                </div>

                <div class="stat-input">
                    <label>Tier</label>
                    <input id="habilidad-tier-input" type="number" name="tier" placeholder="0"
                    value="${habilidad.tier}">
                </div>

                <div class="stat-input">
                    <label>Stat</label>
                    <select id="habilidad-stat-input" name="stat">
                        <option disabled selected></option>
                    </select>
                </div>
            `;

            for (let stat in listaStats) {
                document.getElementById("habilidad-stat-input").innerHTML +=`
                    <option value=${stat}>${stat}</option>
                `;
            }
            document.getElementById("habilidad-stat-input").value =
                habilidad.stat;
            break;
        }

        case "menu-inventario": {
            let item = datos.inventario[indiceArray];

            document.getElementById("form-inventario").innerHTML =`
                <div class="inventory-form enhanced-inventory-form">

                    <div class="inventory-header">
                        <!-- Campo hidden para identificar el item -->
                        <input id="index-item" type="hidden" value="${indiceArray}">
                        <input id="nombre-item" type="text" placeholder="Nombre del objeto" 
                        name="nombre-item" value="${item.nombre}">
                    </div>

                    <div class="inventory-body">
                        <textarea id="descripcion-item" placeholder="Descripción del objeto..." 
                        name="descripcion-item">${item.descripcion}</textarea>
                        <div class="stat-input">
                            <label>Cantidad</label>
                            <input id="cantidad-item" type="number" name="cantidad-item" 
                            placeholder="0" value="${item.cantidad}">
                        </div>
                    </div>
                </div>
            `;
            break;
        }
    }
}

async function sobreEscribirJSON(idModal) {
    let datos = await selectDB("json", 1);

    switch (idModal) {
        case "menu-stats-personaje": {
            datos.nombre = document.getElementById("nombre-personaje-input").value;

            let stats =
                document.querySelectorAll(`input[id^="stat-"]`)
            let estadisticas = [];

            stats.forEach((stat) => {
                let nombreStat = stat.id.replace("stat-", "");
                let dato = {};

                dato["stat"] = nombreStat;
                dato["valor"] = stat.value;
                estadisticas.push(dato);
            });
            datos.estadisticas = estadisticas;
            break;
        }

        case "menu-cuerpo-personaje": {
            let nombreParte =
                document.querySelectorAll(`input[id^="parte-"][type="text"]`);
            let vidaAct =
                document.querySelectorAll(`input[id$="-actual"]`);
            let vidaMax =
                document.querySelectorAll(`input[id$="-maximo"]`);
            let partes = [];

            for (let i = 0; i < nombreParte.length; i++) {
                let dato = {};
                let parte = nombreParte[i].value;
                let act = vidaAct[i].value;
                let max = vidaMax[i].value;

                dato["parte"] = parte;
                dato["maximo"] = parseInt(max);
                dato["actual"] = parseInt(act);
                partes.push(dato);
            }
            datos.vida = partes;
            break;
        }

        case "menu-habilidades-personaje": {
            let indexArray =
                document.getElementById("index-habilidad");

            let habilidad;
            if (indexArray) {
                habilidad = datos.habilidades[parseInt(indexArray.value)];

                habilidad.nombre =
                    document.getElementById("habilidad-nombre-input").value;
                habilidad.detalles =
                    document.getElementById("habilidad-descripcion-input").value;
                habilidad.nivel =
                    parseInt(document.getElementById("habilidad-nivel-input").value);
                habilidad.tier =
                    parseInt(document.getElementById("habilidad-tier-input").value);
                habilidad.stat =
                    document.getElementById("habilidad-stat-input").value;
            } else {
                habilidad = {};

                habilidad["nombre"] =
                    document.getElementById("habilidad-nombre-input").value;
                habilidad["detalles"] =
                    document.getElementById("habilidad-descripcion-input").value;
                habilidad["nivel"] =
                    parseInt(document.getElementById("habilidad-nivel-input").value);
                habilidad["tier"] =
                    parseInt(document.getElementById("habilidad-tier-input").value);
                habilidad["stat"] =
                    document.getElementById("habilidad-stat-input").value;

                datos.habilidades.push(habilidad);
            }

            break;
        }

        case "menu-inventario": {
            let indexArray =
                document.getElementById("index-item");

            let item;
            if (indexArray) {
                item = datos.inventario[parseInt(indexArray.value)];

                item.nombre =
                    document.getElementById("nombre-item").value;
                item.descripcion =
                    document.getElementById("descripcion-item").value;
                item.cantidad =
                    parseInt(document.getElementById("cantidad-item").value);
            } else {
                item = {};

                item["nombre"] =
                    document.getElementById("nombre-item").value;
                item["descripcion"] =
                    document.getElementById("descripcion-item").value;
                item["cantidad"] =
                    parseInt(document.getElementById("cantidad-item").value);

                datos.inventario.push(item);
            }
        }
    }
    await insertDB(datos, "json", 1);
    cargarJSONDesdeDB();
    cerrarModal(idModal);
}

function cerrarModal(idModal) {
    let overlay = document.getElementById("modal-overlay");
    let modal = document.getElementById(idModal);

    overlay.classList.remove("active");
    modal.classList.remove("active");

    limpiarContenidoDinamico();
}

function limpiarContenidoDinamico() {
    // STATS
    document.getElementById("form-stats-personaje").innerHTML = "";

    // VIDA
    document.getElementById("labels-cuerpo").innerHTML = "";
    document.getElementById("inputs-cuerpo").innerHTML = "";

    // HABILIDADES
    document.getElementById("habilidad-nombre-input").value = "";
    document.getElementById("habilidad-descripcion-input").value = "";
    document.getElementById("habilidad-nivel-input").value = "";
    document.getElementById("habilidad-tier-input").value = "";
    document.getElementById("habilidad-stat-input").value = "";
    if (document.getElementById("index-habilidad"))
    document.getElementById("index-habilidad").remove();

    // INVENTARIO
    document.getElementById("nombre-item").value = "";
    document.getElementById("descripcion-item").value = "";
    document.getElementById("cantidad-item").value = "";
}

document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function (e) {
        const btn = e.target.closest(".open, .create");
        if (!btn) return;

        const idModal = btn.dataset.modal;
        const indiceArray = btn.dataset.index_array;
        if (idModal) abrirModal(idModal, indiceArray, btn);
    });

    document.addEventListener("click", function (e) {
        const btn = e.target.closest(".cancel");
        if (!btn) return;

        const idModal = btn.dataset.modal;
        if (idModal) cerrarModal(idModal);
    });

    document.addEventListener("click", function (e) {
        const btn = e.target.closest(".confirm");
        if (!btn) return;

        const idModal = btn.dataset.modal;
        if (idModal) void sobreEscribirJSON(idModal);
    });
});