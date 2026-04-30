async function guardarImagen(nombreImagen, ev, lugarImagen, id) {
    let file = ev.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = async () => {
        const imagen = reader.result;

        await insertDB(imagen, "fotos", nombreImagen);

        const json = await selectDB("json", 1);
        if (json) {
            if (nombreImagen === "imagen_personaje") {
                json.foto = imagen;
            } else if (nombreImagen === "imagen_persona") {
                json.persona.foto = imagen;
            }

            await insertDB(json, "json", 1);
        }
        await cargarImagen(imagen, lugarImagen, id);
    };
    reader.readAsDataURL(file);
}

document.addEventListener("DOMContentLoaded", function () {
    // Hay que envolver para poder pasar parámetros
    document.getElementById("character-image-input")
        .addEventListener("change", function (ev) {
            void guardarImagen(
                "imagen_personaje",
                ev,
                document.getElementById("name-container"),
                "character-image");
        });

    document.getElementById("persona-image-input")
        .addEventListener("change", function (ev) {
            void guardarImagen(
                "imagen_persona",
                ev,
                document.getElementById("persona-name-container"),
                "persona-image");
        });
});