function abrirModal(idModal, indiceArray) {
    let overlay = document.getElementById("modal-overlay");
    let modal = document.getElementById(idModal);

    void ponerDatosEnModal(idModal, indiceArray);

    overlay.classList.add("active");
    modal.classList.add("active");
}

async function ponerDatosEnModal(idModal, indiceArray) {
    let datos = await selectDB("json", 1);

    switch (idModal) {
        case "menu-stats-personaje": {
            let html = `
                <label for="nombre-personaje-input">Nombre</label>
                <input id="nombre-personaje-input" type="text" name="nombre-personaje">
            `;

            for (let stat of datos.estadisticas) {
                html += `
                    <label for="stat-${stat.stat}">${stat.stat}</label>
                    <input id="stat-${stat.stat}" type="number" name="stat-${stat.stat}">
                `;
            }
            document.getElementById("form-stats-personaje").innerHTML = html;

            document.getElementById("nombre-personaje-input").value = datos.nombre;
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
                <input id="habilidad-nombre-input" type="text" 
                placeholder="Nombre habilidad" name="habilidad-nombre">
            `;
            document.getElementById("skill-form-body").innerHTML =`
                <textarea id="habilidad-descripcion-input" placeholder="Descripción de la habilidad..." 
                name="detalles"></textarea>
            `;
            document.getElementById("skill-form-stats").innerHTML =`
                <div class="stat-input">
                    <label>Nivel</label>
                    <input id="habilidad-nivel-input" type="number" name="nivel" placeholder="0">
                </div>

                <div class="stat-input">
                    <label>Tier</label>
                    <input id="habilidad-tier-input" type="number" name="tier" placeholder="0">
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
            document.getElementById("habilidad-nombre-input").value =
                habilidad.nombre;
            document.getElementById("habilidad-descripcion-input").value =
                habilidad.detalles;
            document.getElementById("habilidad-nivel-input").value =
                habilidad.nivel;
            document.getElementById("habilidad-tier-input").value =
                habilidad.tier;
            document.getElementById("habilidad-stat-input").value =
                habilidad.stat;
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
    document.getElementById("form-stats-personaje").innerHTML = "";
    document.getElementById("labels-cuerpo").innerHTML = "";
    document.getElementById("inputs-cuerpo").innerHTML = "";
}

document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function (e) {
        const btn = e.target.closest(".open");
        if (!btn) return;

        const idModal = btn.dataset.modal;
        const indiceArray = btn.dataset.index_habilidad;
        if (idModal) abrirModal(idModal, indiceArray);
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