const API_URL = "http://localhost:3000/peliculas";

// Elementos del DOM
const grid = document.getElementById("gridContainer");
const formulario = document.getElementById("formulario");
const btnCancelar = document.getElementById("btnCancelar");
const tituloFormulario = document.getElementById("tituloFormulario");

// Inputs del formulario
const titulo = document.getElementById("titulo");
const genero = document.getElementById("genero");
const decada = document.getElementById("decada");
const duracion = document.getElementById("duracion");
const portada = document.getElementById("portada");
const disponibilidad = document.getElementById("disponibilidad"); //esto no tengo muy claro si hay que ponerlo o le damos por defecto true

// Estado de edición
let modoEdicion = false;
let idEditando = null;

// Obtener peliculas y mostrarlos (GET)
async function cargarPeliculas() {
  grid.innerHTML = "";

  try {
    const res = await fetch(API_URL);
    const peliculas = await res.json();

    peliculas.forEach((pelicula) => {
      const div = document.createElement("div");
      div.classList.add("grid-item")
      div.innerHTML = `
        <img src="${pelicula.portada}" alt="Portada de ${pelicula.titulo}"<br>
        <strong>${pelicula.titulo}</strong>
      `;

      const btnEditar = document.createElement("button");
      btnEditar.textContent = "✏️";
      btnEditar.addEventListener("click", () =>
        cargarPeliculaEnFormulario(pelicula.id)
      );

      const btnBorrar = document.createElement("button");
      btnBorrar.textContent = "🗑️";
      btnBorrar.addEventListener("click", () => borrarPelicula(pelicula.id));

      div.appendChild(btnEditar);
      div.appendChild(btnBorrar);
      grid.appendChild(div);
    });
  } catch (error) {
    alert("Error al cargar las películas 😢🍿");
    console.error(error);
  }
}

// Enviar formulario (POST o PUT)
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const datosPelicula = {
    titulo: titulo.value,
    genero: genero.value,
    decada: decada.value,
    duracion: duracion.value,
    portada:portada.value,
    disponibilidad: disponibilidad.checked
  };

  try {
    if (modoEdicion) {
      await fetch(`${API_URL}/${idEditando}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosPelicula),
      });
      alert("Película actualizada con éxito");
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosPelicula),
      });
      alert("Película agregada con éxito");
    }

    cancelarEdicion();
    cargarPeliculas();
  } catch (error) {
    alert("❌ Error al guardar los datos");
    console.error(error);
  }
});

// Cargar películas en el formulario para editar
async function cargarPeliculaEnFormulario(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const pelicula = await res.json();

    titulo.value = pelicula.titulo;
    genero.value = pelicula.genero;
    decada.value = pelicula.decada;
    duracion.value = pelicula.duracion;
    portada.value = pelicula.portada; //??
    // Disponible automaticamente??

    modoEdicion = true;
    idEditando = id;
    tituloFormulario.textContent = "Editar película";
  } catch (error) {
    alert("⚠️ Error al cargar la película");
    console.error(error);
  }
}

// Borrar película (DELETE)
async function borrarPelicula(id) {
  const confirmacion = confirm(
    "¿Estás segura de que quieres eliminar esta película?"
  );
  if (!confirmacion) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    alert("Película eliminada");
    cargarPeliculas();
  } catch (error) {
    alert("❌ No se pudo eliminar");
    console.error(error);
  }
}

// Resetear formulario
function cancelarEdicion() {
  formulario.reset();
  modoEdicion = false;
  idEditando = null;
  tituloFormulario.textContent = "Agregar película";
}

// Botón cancelar
btnCancelar.addEventListener("click", cancelarEdicion);

// Iniciar app
cargarPeliculas();