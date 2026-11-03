
document.addEventListener("DOMContentLoaded", () => {

    const boton = document.querySelector("#pasarPagina");
    const portada = document.querySelector("#portada");
    const detalles = document.querySelector("#detalles");

    if (!boton || !portada || !detalles) return;

    boton.addEventListener("click", () => {

        portada.classList.remove("portada--pasando");

        // Reinicia la animación de apertura
        void portada.offsetWidth;

        // Inicia el giro de la portada
        portada.classList.add("portada--pasando");

        boton.disabled = true;

    });

});
