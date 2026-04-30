let db = null; //Global para acceso a DB

function crearDB() {
    return new Promise((resolve, reject) => {
        const peticion = indexedDB.open("despertadosDB", 1);

        peticion.onupgradeneeded = (ev => {
            const db = ev.target.result;

            db.createObjectStore("json", {
                autoIncrement: false
            });
            db.createObjectStore("fotos", {
                autoIncrement: false
            })
        });
        peticion.onsuccess = () => {
            resolve(peticion.result);
        };
        peticion.onerror = () => {
            reject(peticion.error);
        };

    });
}

function getDB() {
    if (!db) {
        db = crearDB();
    }
    return db;
}

function insertDB(data, tabla) {
    return getDB().then(db => {
        return new Promise((resolve, reject) => {
            const transaccion = db.transaction(tabla, "readwrite");
            const peticion = transaccion.objectStore(tabla);

            peticion.put(data, 1);

            // En las operaciones de escritura se escucha a la transacción
            transaccion.oncomplete = () => {
                resolve();
            };
            transaccion.onerror = () => {
                reject(transaccion.error);
            };
            transaccion.onabort = () => {
                reject(transaccion.error);
            };
        });
    });
}

function selectDB(tabla, id) {
    return getDB().then(db => {
        return new Promise((resolve, reject) => {
            const transaccion = db.transaction(tabla, "readonly");
            const store = transaccion.objectStore(tabla);
            const peticion = store.get(id);

            // En las operaciones de lectura se escuchan a los datos
            peticion.onsuccess = () => {
                resolve(peticion.result);
            }
            peticion.onerror = () => {
                reject(peticion.error);
            };
        });
    });
}

/*
document.addEventListener("DOMContentLoaded", function () {

});*/
