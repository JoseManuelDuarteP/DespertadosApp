function abrirModal(idModal) {
    let overlay = document.getElementById("modal-overlay");
    let modal = document.getElementById(idModal);

    void ponerDatosEnModal(idModal);

    overlay.classList.add("active");
    modal.classList.add("active");
}

async function ponerDatosEnModal(idModal) {
    let datos = await selectDB("json", 1);

    switch (idModal) {
        case "menu-stats-personaje": {
            document.getElementById("nombre-personaje-input").value =
                datos.nombre;
            break;
        }
    }
}

async function sobreEscribirJSON(idModal) {
    let datos = await selectDB("json", 1);

    switch (idModal) {
        case "menu-stats-personaje": {
            datos.nombre = document.getElementById("nombre-personaje-input").value;
            break;
        }
    }
    insertDB(datos, "json", 1);
    cargarJSONDesdeDB();
}

function cerrarModal(idModal) {
    let overlay = document.getElementById("modal-overlay");
    let modal = document.getElementById(idModal);

    overlay.classList.remove("active");
    modal.classList.remove("active");
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