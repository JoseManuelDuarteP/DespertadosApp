// Las funciones async siempre devuelve una promesa: Promise<>
async function comprobarDB(db) {
    // await pausa la función, espera a que la promesa termine
    // y devuelve el resultado final, no la promesa
    const dbs = await indexedDB.databases();
    return dbs.some(db => db.name === "despertadosDB");
}

function crearDB() {
    if (!comprobarDB("despertadosDB")) {
        const peticion = indexedDB.open("despertadosDB", 1);


    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Crear la DB
    crearDB();
});