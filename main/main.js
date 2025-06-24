function crearLayout() {
    const header = document.getElementById('header');
    const footer = document.getElementById('footer');

    header.innerHTML = `
    <div class="img-header">
        <img src="img/Header.png" alt="logo Videoclub" width="1420">
      </div>
        <nav>
          <!--<button class="button-toggle">☰</button>-->
          <div class="menu">
            <a href="index.html">Inicio</a>
            <a href="">Catálogo</a>
            <a href="#" id="open-modal-btn">Alquila tu sala</a>
            <a href="">Contacto</a>
          </div>
        </nav>
    `;

    footer.innerHTML = `
            <div class="footer">
                <h4>Videoclub</h4>
                <p><a href="/politica-de-privacidad">Política de Privacidad</a></p>
                <p><a href="/contacto">Contacto</a></p>
            </div>
            <div class="footer">
                <h4>Cine</h4>
                <p><a href="/politica-de-privacidad">Reserva</a></p>
                <p><a href="/contacto">Cartelera</a></p>
            </div>
            <div class="footer">
                <h4>Nosotros</h4>
                <p><a href="/politica-de-privacidad">Conócenos</a></p>
                <p><a href="/contacto">Empleo</a></p>
            </div>
            <div class="footer">
                <h4>Contacto</h4>
                <p><a href="/politica-de-privacidad">Contacto</a></p>
                <p><a href="/contacto">Preguntas frecuentas</a></p>
            </div>
`;
}

// LÓGICA PARA LA VENTANA MODAL

// Esperamos a que el HTML del layout esté creado antes de buscar los elementos
document.addEventListener('DOMContentLoaded', function() {

    // 1. Seleccionamos los elementos del DOM que vamos a necesitar
    const openModalBtn = document.getElementById('open-modal-btn');
    const modalToOpen = document.getElementById('modal-booking');
    // Buscamos el botón de cerrar DENTRO del modal que acabamos de seleccionar
    const closeModalBtn = modalToOpen.querySelector('.close-modal-btn');

    // Comprobamos que los elementos existen antes de añadirles eventos
    if (openModalBtn && modalToOpen && closeModalBtn) {

        // 2. Creamos la función para ABRIR el modal
        const openModal = function(event) {
            event.preventDefault(); // Evita que el enlace '#' mueva la página
            modalToOpen.classList.add('modal-visible');
        };

        // 3. Creamos la función para CERRAR el modal
        const closeModal = function() {
            modalToOpen.classList.remove('modal-visible');
        };

        // 4. Asignamos las funciones a los eventos (los "escuchadores")
        // Al hacer clic en "Alquila tu sala", se abre el modal
        openModalBtn.addEventListener('click', openModal);

        // Al hacer clic en el botón 'X', se cierra el modal
        closeModalBtn.addEventListener('click', closeModal);

        // EXTRA: Cerrar el modal si se hace clic en el fondo oscuro
        modalToOpen.addEventListener('click', function(event) {
            // Si el elemento clickeado es el fondo oscuro...
            if (event.target === modalToOpen) {
                closeModal(); // ...cerramos el modal.
            }
        });

        // EXTRA: Cerrar el modal al presionar la tecla "Escape"
        document.addEventListener('keydown', function(event) {
            // Si la tecla es 'Escape' y el modal está visible...
            if (event.key === 'Escape' && modalToOpen.classList.contains('modal-visible')) {
                closeModal(); // ...cerramos el modal.
            }
        });
    }
});


// crearLayout();
//  console.log(footer.innerHTML);