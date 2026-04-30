function prueba() {
    let overlay = document.getElementById("modal-overlay");
    let modal = document.getElementById("menu-cuerpo-personaje");

    overlay.classList.add("active");
    modal.classList.add("active");
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btn-edit-cuerpo-personaje").onclick = prueba;
});