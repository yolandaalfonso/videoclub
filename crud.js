const API_URL = "http://localhost:3000/peliculas";

// Elementos del DOM
const grid = document.getElementById("gridContainer");
const formulario = document.getElementById("formulario");
const btnCancelar = document.getElementById("btnCancelar");
const tituloFormulario = document.getElementById("tituloFormulario");

// Inputs del formulario
const titulo = document.getElementById("titulo");
const genero = document.getElementById("genero");
const anno = document.getElementById("anno");
const duracion = document.getElementById("duracion");
const portada = document.getElementById("portada");
const preview = document.getElementById("preview");
const disponibilidad = document.getElementById("disponibilidad"); //Se marca por defecto true

// Estado de edición
let modoEdicion = false;
let idEditando = null;

//Tratamiento imagen para subir archivo

// Función para convertir archivo a Base64
function convertirArchivoABase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      resolve(e.target.result); // Esto incluye "data:image/jpeg;base64,..."
    };
    
    reader.onerror = function(error) {
      reject(error);
    };
    
    reader.readAsDataURL(file);
  });
}

// Preview de imagen
portada.addEventListener('change', async function(e) {
  const file = e.target.files[0];
  
  if (file) {
    if (file.type.startsWith('image/')) {
      try {
        const base64 = await convertirArchivoABase64(file);
        if (preview) { // Verificar que existe
          preview.src = base64;
          preview.classList.remove('hidden');
        }
      } catch (error) {
        console.error('Error al convertir imagen:', error);
      }
    } else {
      alert('Solo archivos de imagen (JPG, PNG)');
      portada.value = '';
      if (preview) {
        preview.classList.add('hidden');
      }
    }
  } else {
    if (preview) {
      preview.classList.add('hidden');
    }
  }
});

// Obtener peliculas y mostrarlos (GET)
/*async function cargarPeliculas() {
  grid.innerHTML = "";

  try {
    const res = await fetch(API_URL);
    const peliculas = await res.json();

    peliculas.forEach((pelicula) => {
      const div = document.createElement("div");
      div.classList.add("grid-item")
      div.innerHTML = `
        <img src="${pelicula.portada}" alt="Portada de ${pelicula.titulo}"<br><br>
        <strong>${pelicula.titulo}</strong>
        <p>Género: ${pelicula.genero}</p>
        <p>Anno: ${pelicula.anno}</p>
        <p>Duración: ${pelicula.duracion} min</p>
        <p><strong>Disponible:</strong> ${pelicula.disponibilidad ? 'Sí' : 'No'}</p>
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
}*/

// Versión con debug para identificar el problema
async function cargarPeliculas() {
  grid.innerHTML = "";

  try {
    console.log("🔄 Cargando películas...");
    const res = await fetch(API_URL);
    
    console.log("📡 Respuesta del servidor:", res.status);
    
    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }
    
    const peliculas = await res.json();
    console.log("📊 Películas recibidas:", peliculas);
    console.log("📊 Número de películas:", peliculas.length);

    peliculas.forEach((pelicula, index) => {
      console.log(`🎬 Procesando película ${index + 1}:`, pelicula);
      
      // Verificar campos requeridos
      if (!pelicula.titulo) {
        console.warn("⚠️ Película sin título:", pelicula);
      }
      if (!pelicula.id) {
        console.warn("⚠️ Película sin ID:", pelicula);
      }

      const div = document.createElement("div");
      div.classList.add("grid-item");
      
      // Construcción más segura del HTML
      let html = '';
      
      // Imagen con verificación
      if (pelicula.portada && pelicula.portada !== 'null' && pelicula.portada !== '') {
        html += `<img src="${pelicula.portada}" alt="Portada de ${pelicula.titulo || 'Sin título'}" style="max-width: 150px; height: auto;"><br><br>`;
      } else {
        html += `<div style="width: 150px; height: 200px; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">Sin imagen</div>`;
      }
      
      // Información básica con valores por defecto
      html += `
        <strong>${pelicula.titulo || 'Sin título'}</strong>
        <p><strong>Género:</strong> ${pelicula.genero || 'No especificado'}</p>
        <p><strong>Anno:</strong> ${pelicula.anno || 'No especificado'}</p>
        <p><strong>Duración:</strong> ${pelicula.duracion || 'No especificado'} min</p>
        <p><strong>Disponible:</strong> ${pelicula.disponibilidad === true ? 'Sí' : pelicula.disponibilidad === false ? 'No' : 'No especificado'}</p>
      `;
      
      div.innerHTML = html;

      // Botones con verificación de ID
      const btnEditar = document.createElement("button");
      btnEditar.textContent = "✏️ Editar";
      if (pelicula.id) {
        btnEditar.addEventListener("click", () => cargarPeliculaEnFormulario(pelicula.id));
      } else {
        btnEditar.disabled = true;
        btnEditar.title = "Sin ID válido";
      }

      const btnBorrar = document.createElement("button");
      btnBorrar.textContent = "🗑️ Borrar";
      if (pelicula.id) {
        btnBorrar.addEventListener("click", () => borrarPelicula(pelicula.id));
      } else {
        btnBorrar.disabled = true;
        btnBorrar.title = "Sin ID válido";
      }

      div.appendChild(btnEditar);
      div.appendChild(btnBorrar);
      grid.appendChild(div);
    });
    
    console.log("✅ Películas cargadas exitosamente");
    
  } catch (error) {
    console.error("❌ Error detallado al cargar películas:", error);
    console.error("❌ Stack trace:", error.stack);
    alert("Error al cargar las películas 😢🍿");
  }
}

// Enviar formulario (POST o PUT)
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  let portadaBase64 = null;

  // Si hay archivo seleccionado, convertirlo a Base64
  if (portada.files[0]) {
    try {
      portadaBase64 = await convertirArchivoABase64(portada.files[0]);
    } catch (error) {
      alert("Error al procesar la imagen");
      return;
    }
  } else if (modoEdicion) {
    // Si estamos editando y no hay archivo nuevo, mantener la imagen actual
    const res = await fetch(`${API_URL}/${idEditando}`);
    const peliculaActual = await res.json();
    portadaBase64 = peliculaActual.portada;
  }

  //Crea un objeto con todos los valores del formulario. 
  //Titulo, genero, etc. son referencias a los inputs del HTML.
  const datosPelicula = {
    titulo: titulo.value,
    genero: genero.value,
    anno: anno.value,
    duracion: duracion.value,
    portada:portadaBase64,
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
    anno.value = pelicula.anno;
    duracion.value = pelicula.duracion;
    //Mostrar la imagen actual
    if (preview && pelicula.portada) {
      preview.src = pelicula.portada;
      preview.classList.remove('hidden');
    }

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


