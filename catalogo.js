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

        if (!res.ok) throw new Error("Error al cambiar disponibilidad");

        loadMovies();

    } catch (err) {
        console.error("No se pudo cambiar la disponibilidad:", err);
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



//REVISAR BIEN EL LUNES, resultado de IA que funciona a medias
function filtrarPeliculas() {
    // Obtener los géneros seleccionados
    const generosSeleccionados = [
        'accion', 'comedia', 'cifi', 'terror'
    ].filter(id => document.getElementById(id).checked);

    // Obtener las películas usando fetchMovies
    fetchMovies().then(peliculas => {
        // Filtrar las películas según los géneros seleccionados
        const peliculasFiltradas = peliculas.filter(pelicula => {
            // Si no se han seleccionado géneros, se muestran todas las películas
            if (generosSeleccionados.length === 0) {
                return true;
            }

            // Verificar si el género de la película está en la lista de géneros seleccionados
            let generosPelicula;
            if (Array.isArray(pelicula.genero)) {
                // Si pelicula.genero es un array, convertir cada elemento a minúsculas
                generosPelicula = pelicula.genero.map(genero => genero.toLowerCase());
            } else if (typeof pelicula.genero === 'string') {
                // Si pelicula.genero es una cadena, convertirla a minúsculas
                generosPelicula = [pelicula.genero.toLowerCase()];
            } else {
                // Si pelicula.genero no es un array ni una cadena, asignar un array vacío
                generosPelicula = [];
            }

            // Verificar si algún género de la película coincide con los géneros seleccionados
            return generosPelicula.some(genero => generosSeleccionados.includes(genero));
        });

        // Mostrar las películas filtradas
        loadMovies(peliculasFiltradas);
    }).catch(error => {
        console.error('Error al filtrar las películas:', error);
    });
}