
document.addEventListener("DOMContentLoaded", () => {

    const boton = document.querySelector("#pasarPagina");
    const portada = document.querySelector("#portada");
    const detalles = document.querySelector("#detalles");

    // ABRIR LA REVISTA
    function abrirRevista() {

        if (!portada || portada.classList.contains("portada--pasando")) return;

        portada.classList.add("portada--pasando");

        if (boton) {
            boton.disabled = true;
        }
    }

    // CLIC EN EL BOTÓN DE LA PORTADA
    if (boton && portada) {
        boton.addEventListener("click", abrirRevista);
    }

    // DETECTAR DESLIZAMIENTOS
    function activarDeslizamiento(elemento, accion) {

        if (!elemento) return;

        let inicioX = 0;
        let inicioY = 0;

        elemento.addEventListener("touchstart", (e) => {
            inicioX = e.changedTouches[0].screenX;
            inicioY = e.changedTouches[0].screenY;
        }, { passive: true });

        elemento.addEventListener("touchend", (e) => {

            const finalX = e.changedTouches[0].screenX;
            const finalY = e.changedTouches[0].screenY;

            const diferenciaX = inicioX - finalX;
            const diferenciaY = Math.abs(inicioY - finalY);

            if (diferenciaX > 50 && diferenciaX > diferenciaY) {
                accion();
            }

        }, { passive: true });
    }

    // DESLIZAR SOBRE LA PORTADA
    activarDeslizamiento(portada, abrirRevista);

    // PASAR DE LA PRIMERA PÁGINA A LA SEGUNDA
    function pasarPaginaDetalles() {

        if (detalles && !detalles.classList.contains("pagina-detalles--pasando")) {
            detalles.classList.add("pagina-detalles--pasando");
        }
    }

    // DESLIZAR SOBRE LA PRIMERA PÁGINA
    activarDeslizamiento(detalles, pasarPaginaDetalles);

    // CLIC SOBRE LA PRIMERA PÁGINA
    if (detalles) {
        detalles.addEventListener("click", pasarPaginaDetalles);
    }

    // CUENTA REGRESIVA
    const contador = document.querySelector("#contador");

    if (contador) {

        const fechaEvento = new Date("2027-12-22T00:00:00");

        function actualizarContador() {

            const ahora = new Date();
            const diferencia = fechaEvento - ahora;

            if (diferencia <= 0) {
                contador.innerHTML = "<p>¡Llegó el gran día!</p>";
                return;
            }

            const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
            const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
            const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
            const segundos = Math.floor((diferencia / 1000) % 60);

            document.querySelector("#dias").textContent = String(dias).padStart(2, "0");
            document.querySelector("#horas").textContent = String(horas).padStart(2, "0");
            document.querySelector("#minutos").textContent = String(minutos).padStart(2, "0");
            document.querySelector("#segundos").textContent = String(segundos).padStart(2, "0");
        }

        actualizarContador();
        setInterval(actualizarContador, 1000);
    }

});
