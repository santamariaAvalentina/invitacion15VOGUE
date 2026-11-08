
document.addEventListener("DOMContentLoaded", () => {

    // ========================================
    // ELEMENTOS
    // ========================================

    const boton = document.querySelector("#pasarPagina");
    const revista = document.querySelector(".revista");
    const portada = document.querySelector("#portada");
    const detalles = document.querySelector("#detalles");
    const paginaEvento = document.querySelector("#pagina2");
    const confirmacion = document.querySelector("#confirmacion");


    // ========================================
    // DESLIZAMIENTO TÁCTIL
    // ========================================

    function activarDeslizamiento(elemento, accion) {
        if (!elemento) return;

        let inicioX = 0;
        let inicioY = 0;
        let toqueInteractivo = false;

        elemento.addEventListener("touchstart", (e) => {

            toqueInteractivo = !!e.target.closest("a, button");

            if (toqueInteractivo) return;

            inicioX = e.changedTouches[0].screenX;
            inicioY = e.changedTouches[0].screenY;

        }, { passive: true });

        elemento.addEventListener("touchend", (e) => {

            if (toqueInteractivo || inicioX === 0) {
                inicioX = 0;
                inicioY = 0;
                toqueInteractivo = false;
                return;
            }

            const finalX = e.changedTouches[0].screenX;
            const finalY = e.changedTouches[0].screenY;

            const diferenciaX = inicioX - finalX;
            const diferenciaY = Math.abs(inicioY - finalY);

            if (diferenciaX > 50 && diferenciaX > diferenciaY) {
                accion();
            }

            inicioX = 0;
            inicioY = 0;
            toqueInteractivo = false;

        }, { passive: true });
    }


    // ========================================
    // PORTADA
    // ========================================

    function abrirRevista() {

        if (!portada) return;

        if (portada.classList.contains("portada--pasando")) {
            return;
        }

        portada.classList.add("portada--pasando");

        if (boton) {
            boton.disabled = true;
        }
    }

    if (boton) {
        boton.addEventListener("click", abrirRevista);
    }

    activarDeslizamiento(portada, abrirRevista);


    // ========================================
    // FINALIZAR GIRO DE PORTADA
    // ========================================

    if (portada && detalles) {

        portada.addEventListener("animationend", (e) => {

            if (e.target !== portada) return;
            if (e.animationName !== "pasar-revista") return;

            portada.classList.add("portada--girada");
            detalles.classList.add("pagina-detalles--activa");

        });
    }


    // ========================================
    // PÁGINA DE DETALLES
    // ========================================

    function pasarPaginaDetalles() {

        if (!detalles) return;

        if (detalles.classList.contains("pagina-detalles--pasando")) {
            return;
        }

        detalles.classList.add("pagina-detalles--pasando");
    }

    activarDeslizamiento(detalles, pasarPaginaDetalles);

    if (detalles) {

        detalles.addEventListener("click", (e) => {

            if (e.target.closest("a, button")) return;

            pasarPaginaDetalles();

        });
    }


    // ========================================
    // FINALIZAR GIRO DE DETALLES
    // ========================================

    if (detalles && paginaEvento) {

        detalles.addEventListener("animationend", (e) => {

            if (e.target !== detalles) return;
            if (e.animationName !== "pasar-pagina-interior") return;

            detalles.classList.add("pagina-detalles--girada");
            paginaEvento.classList.add("pagina-evento--activa");

        });
    }


    // ========================================
    // PÁGINA DEL EVENTO
    // ========================================

    function pasarPaginaEvento() {

        if (!paginaEvento) return;

        if (paginaEvento.classList.contains("pagina-evento--pasando")) {
            return;
        }

        paginaEvento.classList.add("pagina-evento--pasando");
    }

    activarDeslizamiento(paginaEvento, pasarPaginaEvento);

    if (paginaEvento) {

        paginaEvento.addEventListener("click", (e) => {

            if (e.target.closest("a, button")) return;

            pasarPaginaEvento();

        });
    }


    // ========================================
    // FINALIZAR GIRO DEL EVENTO
    // ========================================

    if (paginaEvento && confirmacion) {

        paginaEvento.addEventListener("animationend", (e) => {

            if (e.target !== paginaEvento) return;
            if (e.animationName !== "pasar-pagina-interior") return;

            paginaEvento.classList.add("pagina-evento--girada");
            confirmacion.classList.add("pagina-confirmacion--activa");

        });
    }


    // ========================================
    // PÁGINA DE CONFIRMACIÓN
    // ========================================

    function pasarPaginaConfirmacion() {

        if (!confirmacion) return;

        if (confirmacion.classList.contains("pagina-confirmacion--pasando")) {
            return;
        }

        confirmacion.classList.add("pagina-confirmacion--pasando");
    }

    activarDeslizamiento(confirmacion, pasarPaginaConfirmacion);

    if (confirmacion) {

        confirmacion.addEventListener("click", (e) => {

            if (e.target.closest("a, button")) return;

            pasarPaginaConfirmacion();

        });


        // ========================================
        // FINALIZAR ÚLTIMO GIRO
        // ========================================

        confirmacion.addEventListener("animationend", (e) => {

            if (e.target !== confirmacion) return;
            if (e.animationName !== "pasar-pagina-interior") return;

            confirmacion.classList.add("pagina-confirmacion--girada");

            if (window.matchMedia("(max-width: 767px)").matches && revista) {
                revista.classList.add("revista--centrada-final");
            }

        });
    }


    // ========================================
    // CONTADOR
    // ========================================

    const contador = document.querySelector("#contador");

    if (contador) {

        const fechaEvento = new Date("2027-01-22T00:00:00");

        function actualizarContador() {

            const ahora = new Date();
            const diferencia = fechaEvento - ahora;

            if (diferencia <= 0) {

                contador.innerHTML = "<p>¡Llegó el gran día!</p>";

                return;
            }

            const dias = Math.floor(
                diferencia / (1000 * 60 * 60 * 24)
            );

            const horas = Math.floor(
                (diferencia / (1000 * 60 * 60)) % 24
            );

            const minutos = Math.floor(
                (diferencia / (1000 * 60)) % 60
            );

            const segundos = Math.floor(
                (diferencia / 1000) % 60
            );

            document.querySelector("#dias").textContent =
                String(dias).padStart(2, "0");

            document.querySelector("#horas").textContent =
                String(horas).padStart(2, "0");

            document.querySelector("#minutos").textContent =
                String(minutos).padStart(2, "0");

            document.querySelector("#segundos").textContent =
                String(segundos).padStart(2, "0");
        }

        actualizarContador();

        setInterval(actualizarContador, 1000);
    }

});
