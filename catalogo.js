const API_URL = "http://localhost:3000/peliculas";

const movie = document.getElementById("movie");

const searchBtn = document.getElementById('search-button');

searchBtn.addEventListener('click', filtrarPeliculas);

document.querySelector('#menu-busqueda input[type="text"]').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') filtrarPeliculas();
});

//Hacer el fetch

async function fetchMovies() {
    try {
        const res = await fetch(API_URL);
        const pelis = await res.json();
        return pelis;
    } catch (error) {
        console.error("Error al cargar películas:", error);
    }
}

//Cargar películas desde el inicio o desde la búsqueda

async function loadMovies(pelis = null) {

    if (!pelis) {
        pelis = await fetchMovies();
        if (!pelis) return; // Si no hay películas, salir de la función
    }
    const fichaPeli = pelis.map(peli => {
        return `
        <div class="ficha">
            <h2>${peli.titulo}</h2>
            <p><strong>Año: </strong>${peli.anno}</p>
            <p><strong>Género: </strong>${peli.genero.join(", ")}</p>
            <p><strong>Duración: </strong>${peli.duracion} min</p>
            <img src="${peli.portada}" alt="Portada de ${peli.titulo}" class="portada" width="300px">
            ${peli.disponible
                ? `<button class="reservar" data-id="${peli.id}"">Reservar</button>`
                : `<button class="devolver" data-id="${peli.id}"">Devolver</button>`}
        </div>
        `;
    });

    movie.innerHTML = fichaPeli.join("");

}

loadMovies();

//Cambiar disponibilidad de la película al reservarla o devolverla mediante el botón

async function cambiarDisponibilidad(peliId, estado) {
    try {
        const res = await fetch(`${API_URL}/${peliId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ disponible: estado })
        });

        if (!res.ok) throw new Error("Error en la reserva/devolución.");

        loadMovies();

    } catch (err) {
        console.error("No se pudo realizar la reserva/devolución:", err);
    }
}

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("reservar")) {
        const peliId = e.target.dataset.id;
        cambiarDisponibilidad(peliId, false);
    }

    if (e.target.classList.contains("devolver")) {
        const peliId = e.target.dataset.id;
        cambiarDisponibilidad(peliId, true);
    }
});



async function filtrarPeliculas() {
    // Obtener todas las películas
    const pelis = await fetchMovies();
    if (!pelis) return;

    // Obtener texto de búsqueda por título

    const textoBusqueda = document.querySelector('#menu-busqueda input[type="text"]').value.trim().toLowerCase();

    // Obtener los géneros seleccionados (ids de los checkboxes)
    const generosSeleccionados = [];
    const checkboxes = document.querySelectorAll('#menu-busqueda input[type="checkbox"]:checked');

    checkboxes.forEach(checkbox => {
        // Mapear el id del checkbox al género correspondiente (ej: "cifi" → "ciencia ficción")
        switch (checkbox.id) {
            case 'accion':
                generosSeleccionados.push('acción');
                break;
            case 'cifi':
                generosSeleccionados.push('ciencia ficción');
                break;
            case 'comedia':
                generosSeleccionados.push('comedia');
                break;
            case 'terror':
                generosSeleccionados.push('terror');
                break;
        }
    });

    // Obtener década seleccionada
    const decadaSeleccionada = document.getElementById('decada').value;

    // Filtrar películas que incluyan TODOS los géneros seleccionados y la década seleccionada
    const pelisFiltradas = pelis.filter(peli => {

        // Verificar que el conenido del cuadro de texto se incluya en el título de la película
        const cumpleTitulo = textoBusqueda === '' ||
            peli.titulo.toLowerCase().includes(textoBusqueda);

        console.log(`Película: ${peli.titulo}, Cumple: ${cumpleTitulo}`);

        // Verificar que la película tenga TODOS los géneros seleccionados (o que no se haya seleccionado ninguno)
        const cumpleGeneros = generosSeleccionados.length === 0 ||
            generosSeleccionados.every(g => peli.genero.includes(g));
        console.log(`Película: ${peli.titulo}, Géneros: ${peli.genero}, Cumple: ${cumpleGeneros}`);

        // Filtro por década
        const cumpleDecada = decadaSeleccionada === 'todas' ||
            peli.anno.startsWith(decadaSeleccionada.substring(0, 3)); // Ej: "1980" empieza con "198"

        // La película debe cumplir AMBAS condiciones
        return cumpleTitulo && cumpleGeneros && cumpleDecada;

    });

    // Cargar las películas filtradas
    loadMovies(pelisFiltradas);
}

