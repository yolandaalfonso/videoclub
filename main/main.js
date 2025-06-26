
// ---------------MARISOL

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

// ------------------------END-MARISOL------------------
// ------------------------MIGUEL-----------------------
function scrollCarousel(direction) {
    const carousel = document.getElementById("carousel");
  //   //const movieWidth = carousel.querySelector(".movie").offsetWidth + 20; // ancho + gap
  //   carousel.scrollBy({
  //     left: direction * movieWidth * 2, // puedes cambiar el 2 por cuántas películas desplazar por click
  //     behavior: "smooth"
  //   });
  // }
  
  if (carousel) {
    const scrollAmount = carousel.clientWidth;
  
    carousel.scrollBy ( {
      left: direction * scrollAmount,
      behavior: "smooth",
    });
  }
}
  
// ---------------------END-MIGUEL--------------------


// ---------------------Sofi---------------------

function initMap() {
    
    const ubicacion = { lat: 43.527979078623225, lng: -5.664691001959122 };
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: ubicacion
    });


    new google.maps.Marker({
        position: ubicacion,
        map: map,
        title: 'VideoCLUB85'
    })
}


// ---------------------Sofi---------------------