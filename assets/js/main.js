
document.addEventListener("DOMContentLoaded", () => {

    // ========================================
    // ELEMENTOS Y ESTADO DE LA REVISTA
    // ========================================

    const revista = document.querySelector(".revista");
    const boton = document.querySelector("#pasarPagina");

    const paginas = [
        document.querySelector("#portada"),
        document.querySelector("#detalles"),
        document.querySelector("#pagina2"),
        document.querySelector("#confirmacion")
    ];

    const clases = [
        "portada",
        "pagina-detalles",
        "pagina-evento",
        "pagina-confirmacion"
    ];

    // 0 = portada
    // 1 = detalles
    // 2 = evento
    // 3 = confirmación
    // 4 = reverso final

    let paginaActual = 0;
    let animando = false;
    let ultimoDeslizamiento = 0;

    const esMovil = window.matchMedia("(max-width: 767px)");


    // ========================================
    // OBTENER LA PÁGINA VISIBLE
    // ========================================

    function obtenerPaginaVisible() {
        return paginas[Math.min(paginaActual, 3)];
    }


    // ========================================
    // AVANZAR UNA PÁGINA
    // ========================================

    function avanzarPagina() {

        if (animando || paginaActual >= 4) return;

        const indice = paginaActual;
        const pagina = paginas[indice];
        const clase = clases[indice];

        if (!pagina) return;

        animando = true;

        // Quitamos la animación de página activa
        pagina.classList.remove(`${clase}--activa`);

        // Iniciamos el giro
        pagina.classList.add(`${clase}--pasando`);

        if (boton && indice === 0) {
            boton.disabled = true;
        }
    }


    // ========================================
    // RETROCEDER UNA PÁGINA
    // ========================================

    function retrocederPagina() {

        if (animando || paginaActual <= 0) return;

        // La hoja que tenemos que recuperar
        const indice = paginaActual - 1;
        const pagina = paginas[indice];
        const clase = clases[indice];

        if (!pagina) return;

        animando = true;

        // Quitamos la animación de la página visible
        const paginaVisible = obtenerPaginaVisible();
        const claseVisible = clases[Math.min(paginaActual, 3)];

        paginaVisible.classList.remove(`${claseVisible}--activa`);

        // Si estábamos en el reverso final,
        // devolvemos también la revista a su posición original.
        if (paginaActual === 4 && esMovil.matches && revista) {
            revista.classList.remove("revista--centrada-final");
            revista.classList.add("revista--volviendo-final");
        }

        // La hoja recuperada debe quedar por encima
        pagina.style.zIndex = "5";

        // Iniciamos el giro inverso
        pagina.classList.add(`${clase}--volviendo`);
    }


    // ========================================
    // FINALIZAR ANIMACIONES
    // ========================================

    paginas.forEach((pagina, indice) => {

        if (!pagina) return;

        const clase = clases[indice];

        pagina.addEventListener("animationend", (e) => {

            if (e.target !== pagina) return;

            // ------------------------------------
            // FINALIZAR AVANCE
            // ------------------------------------

            const animacionAvance = indice === 0
                ? "pasar-revista"
                : "pasar-pagina-interior";

            if (
                e.animationName === animacionAvance &&
                pagina.classList.contains(`${clase}--pasando`)
            ) {

                pagina.classList.add(`${clase}--girada`);

                paginaActual++;
                animando = false;

                // Activamos la siguiente página
                if (paginaActual < 4) {

                    const siguiente = paginas[paginaActual];
                    const siguienteClase = clases[paginaActual];

                    siguiente.classList.add(`${siguienteClase}--activa`);

                } else {

                    // Llegamos al reverso final
                    if (esMovil.matches && revista) {
                        revista.classList.add("revista--centrada-final");
                    }

                }

                return;
            }


            // ------------------------------------
            // FINALIZAR RETROCESO
            // ------------------------------------

            if (
                e.animationName === "volver-pagina" &&
                pagina.classList.contains(`${clase}--volviendo`)
            ) {

                pagina.classList.remove(
                    `${clase}--volviendo`,
                    `${clase}--girada`,
                    `${clase}--pasando`
                );

                pagina.style.zIndex = "";

                paginaActual--;
                animando = false;

                // Reactivamos la página a la que volvimos
                if (paginaActual > 0 && paginaActual < 4) {

                    const paginaAnterior = paginas[paginaActual];
                    const claseAnterior = clases[paginaActual];

                    paginaAnterior.classList.add(`${claseAnterior}--activa`);
                }

                // Volvimos a la portada
                if (paginaActual === 0 && boton) {
                    boton.disabled = false;
                }
            }

        });

    });


    // ========================================
    // DESLIZAMIENTO TÁCTIL
    // ========================================

    if (revista) {

        let inicioX = 0;
        let inicioY = 0;
        let toqueInteractivo = false;

        revista.addEventListener("touchstart", (e) => {

            toqueInteractivo = !!e.target.closest("a, button:not(#pasarPagina)");

            if (toqueInteractivo) return;

            inicioX = e.changedTouches[0].screenX;
            inicioY = e.changedTouches[0].screenY;

        }, { passive: true });


        revista.addEventListener("touchend", (e) => {

            if (toqueInteractivo || inicioX === 0) {
                inicioX = 0;
                inicioY = 0;
                toqueInteractivo = false;
                return;
            }

            const finalX = e.changedTouches[0].screenX;
            const finalY = e.changedTouches[0].screenY;

            const diferenciaX = finalX - inicioX;
            const diferenciaY = Math.abs(finalY - inicioY);

            if (
                Math.abs(diferenciaX) > 50 &&
                Math.abs(diferenciaX) > diferenciaY
            ) {

                ultimoDeslizamiento = Date.now();

                if (diferenciaX < 0) {
                    avanzarPagina();
                } else {
                    retrocederPagina();
                }
            }

            inicioX = 0;
            inicioY = 0;
            toqueInteractivo = false;

        }, { passive: true });

    }


    // ========================================
    // CLIC EN LA MITAD DE LA PÁGINA
    // ========================================

    if (revista) {

        revista.addEventListener("click", (e) => {

            // No interferimos con enlaces ni botones
            if (e.target.closest("a, button")) return;

            // Evitamos que el clic posterior a un swipe
            // provoque un segundo cambio de página.
            if (Date.now() - ultimoDeslizamiento < 500) return;

            const paginaVisible = obtenerPaginaVisible();
            const paginaClickeada = e.target.closest(
                ".portada, .pagina-detalles, .pagina-evento, .pagina-confirmacion"
            );

            // Solo actuamos sobre la página que está visible
            if (!paginaClickeada || paginaClickeada !== paginaVisible) {
                return;
            }

            const rect = paginaVisible.getBoundingClientRect();
            const mitad = rect.left + rect.width / 2;

            if (e.clientX < mitad) {
                retrocederPagina();
            } else {
                avanzarPagina();
            }

        });

    }


    // ========================================
    // BOTÓN DE LA PORTADA
    // ========================================

    if (boton) {
    boton.addEventListener("click", () => {

        // Evitamos avanzar dos veces después de deslizar
        if (Date.now() - ultimoDeslizamiento < 500) return;

        avanzarPagina();

    });
}

    // ========================================
    // ANIMACIÓN DE REGRESO DE LA REVISTA
    // ========================================

    if (revista) {

        revista.addEventListener("animationend", (e) => {

            if (
                e.target === revista &&
                e.animationName === "deslizar-revista-inicial"
            ) {
                revista.classList.remove("revista--volviendo-final");
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
