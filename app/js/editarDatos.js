function abrirModal(idModal) {
    let overlay = document.getElementById("modal-overlay");
    let modal = document.getElementById(idModal);

    overlay.classList.add("active");
    modal.classList.add("active");
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
});