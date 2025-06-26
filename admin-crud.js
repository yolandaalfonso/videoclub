// script.js

const API_URL = "http://localhost:3000/peliculas";

let editando = false;
let peliculaEditandoId = null;

// Global variables for custom alert/confirm modals
let customAlertModal;
let customAlertMessage;
let customConfirmModal;
let customConfirmMessage;
let customConfirmYesBtn;
let customConfirmNoBtn;
let confirmCallback;

/**
 * Initializes the custom alert and confirm modals by creating their HTML structure
 * and appending them to the document body. Sets up event listeners for their buttons.
 */
function initializeCustomModals() {
    // Create Alert Modal elements
    customAlertModal = document.getElementById('customAlertModal');
    customAlertMessage = document.getElementById('customAlertMessage');
    document.getElementById('customAlertOkBtn').addEventListener('click', () => customAlertModal.style.display = 'none');

    // Create Confirm Modal elements
    customConfirmModal = document.getElementById('customConfirmModal');
    customConfirmMessage = document.getElementById('customConfirmMessage');
    customConfirmYesBtn = document.getElementById('customConfirmYesBtn');
    customConfirmNoBtn = document.getElementById('customConfirmNoBtn');

    customConfirmYesBtn.addEventListener('click', () => {
        customConfirmModal.style.display = 'none';
        if (confirmCallback) confirmCallback(true);
    });
    customConfirmNoBtn.addEventListener('click', () => {
        customConfirmModal.style.display = 'none';
        if (confirmCallback) confirmCallback(false);
    });
}

/**
 * Displays a custom alert modal with the given message.
 * @param {string} message - The message to display in the alert.
 */
function showAlert(message) {
    customAlertMessage.textContent = message;
    customAlertModal.style.display = 'flex';
}

/**
 * Displays a custom confirmation modal with the given message and executes a callback
 * based on the user's choice.
 * @param {string} message - The message to display in the confirmation.
 * @param {function(boolean): void} callback - A function to call with `true` if 'Yes' is clicked, `false` if 'No'.
 */
function showConfirm(message, callback) {
    customConfirmMessage.textContent = message;
    confirmCallback = callback;
    customConfirmModal.style.display = 'flex';
}

// Mostrar y cerrar modal
document.getElementById('adminBtn').addEventListener('click', () => {
    limpiarFormulario(); // Ensure form is clean for new entry
    document.getElementById('modalTitle').textContent = "Agregar Nueva Película";
    document.getElementById("agregarBtn").textContent = "Agregar Película";
    abrirModal();
});

document.getElementById('cerrarBtn').addEventListener('click', () => {
    cerrarModal();
});

document.getElementById('cancelarBtn').addEventListener('click', () => {
    cerrarModal();
});

// Agregar o editar película
document.getElementById('agregarBtn').addEventListener('click', async () => {
    // Trim values and ensure they are not empty
    const titulo = document.getElementById('titulo').value.trim();
    const anno = document.getElementById('anno').value.trim();
    const duracion = document.getElementById('duracion').value.trim();
    const portada = document.getElementById('portada').value.trim();
    
    // Get selected genres
    const generos = Array.from(document.querySelectorAll('input[name="genero"]:checked')).map(el => el.value);
    
    // Get availability
    const disponible = document.querySelector('input[name="disponible"]:checked')?.value === "Sí";

    // Basic validation
    if (!titulo || !anno || !duracion || !portada || generos.length === 0) {
        showAlert("Completa todos los campos antes de continuar.");
        return;
    }

    // Prepare movie data object
    const datosPelicula = {
        titulo,
        anno: parseInt(anno, 10), // Ensure anno is a number
        duracion: parseInt(duracion, 10), // Ensure duracion is a number
        portada,
        genero: generos.join(", "), // Store genres as a comma-separated string
        disponibilidad: disponible
    };

    try {
        let response;
        if (editando && peliculaEditandoId !== null) {
            // Update existing movie
            response = await fetch(`${API_URL}/${peliculaEditandoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosPelicula)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            showAlert("Película actualizada con éxito");
        } else {
            // Add new movie
            response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosPelicula)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            showAlert("Película agregada con éxito");
        }

        cerrarModal(); // Close modal after successful operation
        cargarPeliculas(); // Reload movies to update the grid
    } catch (err) {
        console.error("Error al guardar los datos:", err);
        showAlert(`❌ Error al guardar los datos: ${err.message}`);
    }
});

/**
 * Fetches all movies from the API and displays them in the grid.
 */
async function cargarPeliculas() {
    const grid = document.getElementById("gridContainer");
    grid.innerHTML = ""; // Clear existing movies

    try {
        const res = await fetch(API_URL);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const peliculas = await res.json();

        if (peliculas.length === 0) {
            grid.innerHTML = "<p class='text-center text-lg mt-10 w-full'>No hay películas para mostrar. ¡Agrega una!</p>";
            return;
        }

        peliculas.forEach(p => {
            const div = document.createElement("div");
            div.classList.add("grid-item");
            // Inline styles moved to CSS for better practice, keeping here for consistency with original
            div.style.background = "#20203a";
            div.style.padding = "20px";
            div.style.borderRadius = "12px";
            div.style.color = "#e0e0eb";

            div.innerHTML = `
                ${p.portada ? `<img src="${p.portada}" alt="${p.titulo}" style="width: 100%; max-height: 350px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;">` : `<img src="https://placehold.co/300x450/333/eee?text=No+Portada" alt="No Portada" style="width: 100%; max-height: 350px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;">`}
                <h3>${p.titulo}</h3>
                <p><strong>Género:</strong> ${p.genero}</p>
                <p><strong>Año:</strong> ${p.anno}</p>
                <p><strong>Duración:</strong> ${p.duracion} min</p>
                <p><strong>Disponible:</strong> ${p.disponibilidad ? "Sí" : "No"}</p>
            `;

            // Botón Editar
            const btnEditar = document.createElement("button");
            btnEditar.textContent = "✏️ Editar";
            btnEditar.classList.add("btn-editar");
            btnEditar.style.marginTop = "10px";
            btnEditar.addEventListener("click", () => editarPelicula(p.id));

            // Botón Borrar
            const btnBorrar = document.createElement("button");
            btnBorrar.textContent = "🗑️ Borrar";
            btnBorrar.classList.add("btn-borrar");
            btnBorrar.style.marginTop = "10px"; // Added margin-top for consistency
            btnBorrar.addEventListener("click", () => borrarPelicula(p.id));

            div.appendChild(btnEditar);
            div.appendChild(btnBorrar);
            grid.appendChild(div);
        });
    } catch (err) {
        console.error("Error al cargar películas:", err);
        showAlert(`Error al cargar películas: ${err.message}. Asegúrate de que JSON Server esté funcionando.`);
    }
}

/**
 * Deletes a movie from the API by its ID.
 * @param {string} id - The ID of the movie to delete.
 */
async function borrarPelicula(id) {
    showConfirm("¿Deseas eliminar esta película?", async (confirmed) => {
        if (!confirmed) return;
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            showAlert("Película eliminada con éxito");
            cargarPeliculas(); // Reload movies after deletion
        } catch (err) {
            console.error("Error al eliminar película:", err);
            showAlert(`No se pudo eliminar la película: ${err.message}`);
        }
    });
}

/**
 * Fills the modal form with existing movie data for editing.
 * @param {string} id - The ID of the movie to edit.
 */
async function editarPelicula(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const peli = await res.json();

        // Set modal title and button text for editing
        document.getElementById('modalTitle').textContent = "Editar Película";
        document.getElementById("agregarBtn").textContent = "Guardar cambios";

        // Populate form fields with movie data
        document.getElementById('titulo').value = peli.titulo || '';
        document.getElementById('anno').value = peli.anno || '';
        document.getElementById('duracion').value = peli.duracion || '';
        document.getElementById('portada').value = peli.portada || '';

        // Reset all genre checkboxes and then check the relevant ones
        document.querySelectorAll('input[name="genero"]').forEach(cb => cb.checked = false);
        // Ensure peli.genero is a string before splitting.
        // If it's an array (e.g., from an old db.json entry), handle it.
        if (typeof peli.genero === 'string' && peli.genero) {
            peli.genero.split(",").map(g => g.trim()).forEach(g => {
                const checkbox = document.querySelector(`input[name="genero"][value="${g}"]`);
                if (checkbox) checkbox.checked = true;
            });
        } else if (Array.isArray(peli.genero)) {
            peli.genero.forEach(g => {
                const checkbox = document.querySelector(`input[name="genero"][value="${String(g).trim()}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }


        // Set availability radio button
        document.querySelectorAll('input[name="disponible"]').forEach(rb => {
            rb.checked = (rb.value === (peli.disponibilidad ? "Sí" : "No"));
        });

        // Set global state for editing mode
        editando = true;
        peliculaEditandoId = id;

        abrirModal(); // Open the modal
    } catch (err) {
        console.error("Error al cargar película para edición:", err);
        showAlert(`No se pudo cargar la película para edición: ${err.message}.`);
    }
}

/**
 * Displays the modal.
 */
function abrirModal() {
    document.getElementById('modal').style.display = 'flex';
}

/**
 * Hides the modal and cleans the form.
 */
function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
    limpiarFormulario(); // Always clean the form when closing
}

/**
 * Clears all form fields and resets the editing state.
 */
function limpiarFormulario() {
    document.querySelectorAll('#modal input').forEach(el => {
        if (el.type === "checkbox" || el.type === "radio") el.checked = false;
        else el.value = "";
    });
    // Ensure the default availability "Sí" is checked when clearing for a new entry
    document.querySelector('input[name="disponible"][value="Sí"]').checked = true;

    editando = false;
    peliculaEditandoId = null;
    document.getElementById("agregarBtn").textContent = "Agregar película"; // Reset button text
    document.getElementById('modalTitle').textContent = "Agregar Nueva Película"; // Reset modal title
}

// Iniciar app al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
    initializeCustomModals(); // Initialize custom modals first
    cargarPeliculas(); // Load movies
});
