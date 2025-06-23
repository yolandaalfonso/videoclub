const API_URL = "http://localhost:3000/peliculas";

const movie = document.getElementById("movie");

const searchBtn = document.getElementById('search-button');

searchBtn.addEventListener('click', filtrarPeliculas);

//Hacer el fetch

async function fetchMovies() {
     try {
        const res = await fetch(API_URL);
        const pelis = await res.json();
        return pelis;
    }catch (error) {
        console.error("Error al cargar películas:", error);
    }
}

//Cargar películas desde el inicio o desde la búsqueda

async function loadMovies(pelis=null) {
    
        if (!pelis) {
        pelis = await fetchMovies();
        if (!pelis) return; // Si no hay películas, salir de la función
        }
        const fichaPeli = pelis.map(peli => {
            return `
        <div class="ficha">
            <h2>${peli.titulo}</h2>
            <p><strong>Año: </strong>${peli.año}</p>
            <p><strong>Género: </strong>${Array.isArray(peli.genero) ? peli.genero.join(", ") : peli.genero}</p>
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

    // Obtener los géneros seleccionados (ids de los checkboxes)
    const generosSeleccionados = [];
    const checkboxes = document.querySelectorAll('#menu-busqueda input[type="checkbox"]:checked');
    
    checkboxes.forEach(checkbox => {
        // Mapear el id del checkbox al género correspondiente (ej: "cifi" → "ciencia ficción")
        switch(checkbox.id) {
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

    // Si no hay géneros seleccionados, mostrar todas las películas
    if (generosSeleccionados.length === 0) {
        loadMovies(pelis);
        return;
    }

    // Filtrar películas que incluyan TODOS los géneros seleccionados
    const pelisFiltradas = pelis.filter(peli => {
        // Normalizar el campo 'genero' a un array (por si es un string)
        const generosPeli = Array.isArray(peli.genero) ? peli.genero : [peli.genero];
        
        // Verificar que la película tenga TODOS los géneros seleccionados
        const cumple = generosSeleccionados.every(genero => generosPeli.includes(genero));
    console.log(`Película: ${peli.titulo}, Géneros: ${generosPeli}, Cumple: ${cumple}`);
    return cumple;
    });

    // Cargar las películas filtradas
    loadMovies(pelisFiltradas);
}

