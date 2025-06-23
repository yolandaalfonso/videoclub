const API_URL = "http://localhost:3000/peliculas";

const movie = document.getElementById("movie");


fetch("http://localhost:3000/peliculas")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error));



async function loadMovies() {
  try {
    const res = await fetch(API_URL);
    const pelis = await res.json();
    console.log(pelis);
    movie.textContent = pelis[1].titulo;
  } catch (error) {
    console.error("Error al cargar películas:", error);
  }
}

loadMovies();
