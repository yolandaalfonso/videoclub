const API_URL = "http://localhost:3000/peliculas";

const movie = document.getElementById("movie");


async function loadMovies() {

  try {
    const res = await fetch(API_URL);
    const pelis = await res.json();
    const fichaPeli = pelis.map(peli => {
        return `
        <div class="ficha">
            <h2>${peli.titulo}</h2>
            <p><strong>Año: </strong>${peli.año}</p>
            <p><strong>Género: </strong>${Array.isArray(peli.genero) ? peli.genero.join(", ") : peli.genero}</p>
            <p><strong>Duración: </strong>${peli.duracion} min</p>
            <img src="${peli.portada}" alt="Portada de ${peli.titulo}" class="portada">
        </div>
        `
    });
    
    console.log(fichaPeli);

    movie.innerHTML = fichaPeli.join("");
  } catch (error) {
    console.error("Error al cargar películas:", error);
  }
}

loadMovies();
