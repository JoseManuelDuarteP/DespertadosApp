function guardarImagen(nombreImagen, ev, lugarImagen, id) {
    let file = ev.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function () {
        localStorage.setItem(nombreImagen, reader.result);

        cargarImagen(nombreImagen, lugarImagen, id);
    };
    reader.readAsDataURL(file);
}

document.addEventListener("DOMContentLoaded", function () {
    // Hay que envolver para poder pasar parámetros
    document.getElementById("character-image-input")
        .addEventListener("change", function (ev) {
            guardarImagen(
                "imagen_personaje",
                ev,
                document.getElementById("name-container"),
                "character-image");
        });

    document.getElementById("persona-image-input")
        .addEventListener("change", function (ev) {
            guardarImagen(
                "imagen_persona",
                ev,
                document.getElementById("persona-name-container"),
                "persona-image");
        });
});