document.addEventListener("DOMContentLoaded", () => {

    const boton = document.querySelector("#pasarPagina");
    const portada = document.querySelector("#portada");
    const detalles = document.querySelector("#detalles");

    if (!boton || !portada || !detalles) return;

    function abrirRevista() {

        if (portada.classList.contains("portada--pasando")) return;

        portada.classList.remove("portada--pasando");

        // Reinicia la animación de apertura
        void portada.offsetWidth;

        // Inicia el giro de la portada
        portada.classList.add("portada--pasando");

        if (boton) {
            boton.disabled = true;
        }
    }

    // Apertura con botón
    boton.addEventListener("click", abrirRevista);

    // Detectar deslizamiento del dedo
    let inicioX = 0;
    let inicioY = 0;

    portada.addEventListener("touchstart", (e) => {
        inicioX = e.changedTouches[0].screenX;
        inicioY = e.changedTouches[0].screenY;
    });

    portada.addEventListener("touchend", (e) => {

        const finalX = e.changedTouches[0].screenX;
        const finalY = e.changedTouches[0].screenY;

        const diferenciaX = inicioX - finalX;
        const diferenciaY = Math.abs(inicioY - finalY);

        // Deslizamiento hacia la izquierda
        if (diferenciaX > 50 && diferenciaX > diferenciaY) {
            abrirRevista();
        }
    });

});