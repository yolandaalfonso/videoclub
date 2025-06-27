// --- 1. CONSTANTES Y VARIABLES ---
const API_URL = "http://localhost:3000/peliculas";
const grid = document.getElementById("gridContainer");
const formulario = document.getElementById("formulario");
const tituloFormulario = document.getElementById("tituloFormulario");
const titulo = document.getElementById("titulo");
const genero = document.getElementsByName("genero");
const ano = document.getElementById("año");
const duracion = document.getElementById("duracion");
const portada = document.getElementById("portada");
const preview = document.getElementById("preview");
const disponibilidad = document.getElementsByName("disponible");
const btnCancelarForm = document.getElementById("btnCancelarForm");

let modoEdicion = false;
let idEditando = null;

// --- Función para convertir archivo a base64 ---
function convertirArchivoABase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      resolve(e.target.result);
    };
    reader.onerror = function(error) {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
}

// --- Завантаження фільмів у grid ---
async function cargarPeliculas() {
  grid.innerHTML = "";
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
    const peliculas = await res.json();

    // --- Табличний вигляд ---
    const table = document.createElement("table");
    table.className = "table-movies";
    table.innerHTML = `
      <thead>
        <tr>
          <th>Póster</th>
          <th>Título</th>
          <th>Año</th>
          <th>Duración</th>
          <th>Géneros</th>
          <th>Disponible</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector("tbody");

    peliculas.forEach((pelicula) => {
      const year = pelicula.año || pelicula.anno || '';
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><img src="${pelicula.portada}" 
             onerror="this.src='img/covers/portada_no_disponible.jpg'" 
             alt="Portada de ${pelicula.titulo}" 
             ></td>
        <td>${pelicula.titulo || ''}</td>
        <td>${year}</td>
        <td>${pelicula.duracion || ''} min</td>
        <td>${(pelicula.genero || []).join(', ')}</td>
        <td>${pelicula.disponible === true ? 'Sí' : pelicula.disponible === false ? 'No' : 'No especificado'}</td>
        <td>
          <button class="table-action-btn" data-edit="${pelicula.id}">Editar</button>
          <button class="table-action-btn delete" data-delete="${pelicula.id}">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    grid.appendChild(table);

    // --- Дії для кнопок ---
    grid.querySelectorAll('[data-edit]').forEach(btn => {
      btn.onclick = () => cargarPeliculaEnFormulario(btn.getAttribute('data-edit'));
    });
    grid.querySelectorAll('[data-delete]').forEach(btn => {
      btn.onclick = () => borrarPelicula(btn.getAttribute('data-delete'));
    });

  } catch (error) {
    grid.innerHTML = "Не вдалося завантажити фільми.";
  }
}

// --- Завантаження фільму у форму для редагування ---
async function cargarPeliculaEnFormulario(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const pelicula = await res.json();
    titulo.value = pelicula.titulo || "";
    ano.value = pelicula.año || pelicula.anno || "";
    duracion.value = pelicula.duracion || "";
    if (pelicula.portada) {
      preview.src = pelicula.portada;
      preview.classList.remove('hidden');
    } else {
      preview.src = '';
      preview.classList.add('hidden');
    }
    // Відмітити жанри
    genero.forEach(cb => cb.checked = (pelicula.genero || []).includes(cb.value));
    // Відмітити доступність
    disponibilidad.forEach(r => r.checked = pelicula.disponible === r.value);

    modoEdicion = true;
    idEditando = id;
    tituloFormulario.textContent = "Editar película";
    formulario.classList.remove("hidden");
  } catch (error) {
    alert("Error al cargar la película para editarla.");
  }
}

// --- Видалення фільму ---
async function borrarPelicula(id) {
  if (confirm("¿Estás seguro que deseas eliminar esta película?")) {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      cargarPeliculas();
    } catch (error) {
      alert("Error al eliminar la película.");
    }
  }
}

// --- Скасування редагування/додавання ---
function cancelarEdicion() {
  formulario.reset();
  modoEdicion = false;
  idEditando = null;
  tituloFormulario.textContent = "Agregar una película";
  preview.classList.add('hidden');
  formulario.classList.add("hidden");
}

// --- Preview для зображення ---
portada.addEventListener('change', async function(e) {
  if (e.target.files && e.target.files[0]) {
    try {
      const base64 = await convertirArchivoABase64(e.target.files[0]);
      preview.src = base64;
      preview.classList.remove('hidden');
    } catch (error) {
      preview.classList.add('hidden');
    }
  }
});

// --- Кнопка "Скасувати" ---
btnCancelarForm.addEventListener("click", cancelarEdicion);

// --- Submit форми ---
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();
  let portadaBase64 = preview.src;
  if (portada.files && portada.files[0]) {
    try {
      portadaBase64 = await convertirArchivoABase64(portada.files[0]);
    } catch (error) {
      alert("Error de procesamiento de imagen.");
      return;
    }
  }
  // Зібрати жанри
  const generosSeleccionados = Array.from(genero).filter(cb => cb.checked).map(cb => cb.value);
  // Зібрати доступність
  const disponibleSeleccionado = Array.from(disponibilidad).find(r => r.checked)?.value || "No";

  const datosPelicula = {
    titulo: titulo.value,
    año: ano.value, // завжди зберігаємо як "año"
    duracion: duracion.value,
    portada: portadaBase64,
    genero: generosSeleccionados,
    disponible: disponibleSeleccionado
  };

  try {
    let respuesta;
    if (modoEdicion) {
      respuesta = await fetch(`${API_URL}/${idEditando}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosPelicula),
      });
    } else {
      respuesta = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosPelicula),
      });
    }
    if (!respuesta.ok) throw new Error("Error de respuesta del servidor.");
    cancelarEdicion();
    cargarPeliculas();
  } catch (error) {
    alert("Error al guardar datos.");
  }
});

// --- Відкриття форми ---
const adminBtn = document.getElementById("adminBtn");
adminBtn.addEventListener("click", () => {
  formulario.reset();
  preview.classList.add('hidden');
  modoEdicion = false;
  tituloFormulario.textContent = 'Agregar una película';
  formulario.classList.remove('hidden');
});

// --- Завантажити фільми при старті ---
cargarPeliculas();

       
    if (!respuesta.ok) throw new Error("La respuesta del servidor no fue exitosa.");

    // Se llama a cancelarEdicion, que ya oculta el formulario y reseteа.
    cancelarEdicion(); 
    cargarPeliculas();

  


// ---> AÑADIDO: Los listeners para abrir y cerrar el modal principal
adminBtn.addEventListener("click", () => {
    modal.style.display = 'flex';
    cargarPeliculas(); // Cargamos las películas al abrir el modal
});

cerrarBtn.addEventListener("click", () => {
    modal.style.display = 'none';
});

  


// ---> AÑADIDO: Los listeners para abrir y cerrar el modal principal
adminBtn.addEventListener("click", () => {
    modal.style.display = 'flex';
    cargarPeliculas(); // Cargamos las películas al abrir el modal
});

cerrarBtn.addEventListener("click", () => {
    modal.style.display = 'none';
});












