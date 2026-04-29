let db = null; //Global para acceso a DB

// Las funciones async siempre devuelve una promesa: Promise<>
async function comprobarDB(baseBuscada) {
    // await pausa la función, espera a que la promesa termine
    // y devuelve el resultado final, no la promesa
    const dbs = await indexedDB.databases();
    return dbs.some(db => db.name === baseBuscada);
}

function crearDB() {
    let baseDatos = "despertadosDB";
    comprobarDB(baseDatos).then(existe => {
        if (!existe) {
            const peticion = indexedDB.open(baseDatos, 1);

            peticion.onupgradeneeded = (ev => {
                db = ev.target.result;

                db.createObjectStore("json", {
                    autoIncrement: false
                });
                db.createObjectStore("fotos", {
                    autoIncrement: false
                })
            });
        }
    });
}

function insertDB(db, data, tabla) {
    const transaccion = db.transaction(tabla, "readwrite");
    const store = transaccion.objectStore(tabla);

    if (store.get(1)) store.delete(1);
    const peticion = store.add(data, 1);

    peticion.onsuccess = (e => {
        console.log("json añadido correctamente");
    });
    peticion.onerror = (e => {
        console.log("Error al añadir el json: " + e.target.error)
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // Crear la DB
    crearDB();
});