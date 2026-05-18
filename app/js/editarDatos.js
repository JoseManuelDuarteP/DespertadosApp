function abrirModal(idModal) {
    let overlay = document.getElementById("modal-overlay");
    let modal = document.getElementById(idModal);
    backUpModal = modal.cloneNode(true);

    void ponerDatosEnModal(idModal);

    overlay.classList.add("active");
    modal.classList.add("active");
}

async function ponerDatosEnModal(idModal) {
    let datos = await selectDB("json", 1);

    switch (idModal) {
        case "menu-stats-personaje": {
            let inputNombre = document.getElementById("nombre-personaje-input");
            if(!inputNombre) {
                let labelNombre = document.createElement("label");
                labelNombre.setAttribute("for", "nombre-personaje-input");

                inputNombre = document.createElement("input");
                inputNombre.setAttribute("type", "text");
                inputNombre.setAttribute("id", "nombre-personaje-input");
                inputNombre.setAttribute("name", "nombre-personaje");

                labelNombre.textContent = "Nombre";
                inputNombre.value = datos.nombre;

                document.getElementById("form-stats-personaje").appendChild(labelNombre);
                document.getElementById("form-stats-personaje").appendChild(inputNombre);
            }

            let labelNombreStat;
            let inputStat = document.getElementById("stat-"+datos.estadisticas[0].stat);
            if (!inputStat)
            for (let stat of datos.estadisticas) {
                let nombreStat = "stat-"+stat.stat;

                labelNombreStat = document.createElement("label");
                labelNombreStat.setAttribute("for", nombreStat);

                inputStat = document.createElement("input");
                inputStat.setAttribute("id", nombreStat);
                inputStat.setAttribute("type", "number");
                inputStat.setAttribute("name", nombreStat);

                labelNombreStat.textContent = stat.stat;
                inputStat.value = stat.valor;

                document.getElementById("form-stats-personaje").appendChild(labelNombreStat);
                document.getElementById("form-stats-personaje").appendChild(inputStat);
            }
            break;
        }

        case "menu-cuerpo-personaje": {
            let labelParte, labelAct, labelMax;
            let inputParte = document.getElementById("parte-"+datos.vida[0].parte);
            if (!inputParte) {
                for (let parte of datos.vida) {
                    let nombreParte = "parte-"+parte.parte;
                    let nombreParteAct = nombreParte+"-actual";
                    let nombreParteMax = nombreParte+"-maximo";

                    labelParte = document.createElement("label");
                    labelAct = document.createElement("label");
                    labelMax = document.createElement("label");

                    labelParte.setAttribute("for", nombreParte);
                    labelAct.setAttribute("for", nombreParteAct);
                    labelMax.setAttribute("for", nombreParteMax);

                    inputParte = document.createElement("input");
                    inputParte.setAttribute("id", nombreParte);
                    inputParte.setAttribute("type", "text");
                    inputParte.setAttribute("name", nombreParte);

                    let inputAct = document.createElement("input");
                    inputAct.setAttribute("id", nombreParteAct);
                    inputAct.setAttribute("type", "number");
                    inputAct.setAttribute("name", nombreParteAct);

                    let inputMax = document.createElement("input");
                    inputMax.setAttribute("id", nombreParteMax);
                    inputMax.setAttribute("type", "number");
                    inputMax.setAttribute("name", nombreParteMax);

                    inputParte.value = parte.parte;
                    inputAct.value = parte.actual;
                    inputMax.value = parte.maximo;

                    document.getElementById("labels-cuerpo").appendChild(labelParte);
                    document.getElementById("labels-cuerpo").appendChild(labelAct);
                    document.getElementById("labels-cuerpo").appendChild(labelMax);

                    document.getElementById("inputs-cuerpo").appendChild(inputParte);
                    document.getElementById("inputs-cuerpo").appendChild(inputAct);
                    document.getElementById("inputs-cuerpo").appendChild(inputMax);
                }

                labelParte.textContent = "Parte";
                labelAct.textContent = "Actual";
                labelMax.textContent = "Máximo";
            }
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
    let editBtns = document.getElementsByClassName("open");
    for (let btn of editBtns) {
        let idModal = btn.dataset.modal;
        if (idModal) btn.onclick = () => abrirModal(idModal);
    }

    let clsBtns = document.getElementsByClassName("cancel");
    for (let btn of clsBtns) {
        let idModal = btn.dataset.modal;
        if (idModal) btn.onclick = () => cerrarModal(idModal);
    }

    let confirmBtns = document.getElementsByClassName("confirm");
    for (let btn of confirmBtns) {
        let idModal = btn.dataset.modal;
        if (idModal) btn.onclick = () => sobreEscribirJSON(idModal);
    }
});