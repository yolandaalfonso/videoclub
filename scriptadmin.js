// Lista JSON simulada
let peliculas = [];

document.getElementById('adminBtn').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'flex';
});

document.getElementById('cerrarBtn').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'none';
});

document.getElementById('agregarBtn').addEventListener('click', () => {
  const titulo = document.getElementById('titulo').value;
  const año = document.getElementById('año').value;
  const duracion = document.getElementById('duracion').value;
  const portada = document.getElementById('portada').value;

  const generos = Array.from(document.querySelectorAll('input[name="genero"]:checked')).map(el => el.value);
  const cartelera = document.querySelector('input[name="cartelera"]:checked')?.value || "No";
  const disponible = document.querySelector('input[name="disponible"]:checked')?.value || "No";

  const nuevaPelicula = {
    titulo,
    año,
    duracion,
    portada,
    genero: generos,
    cartelera,
    disponible
  };

  peliculas.push(nuevaPelicula);

  console.log("Película agregada:", nuevaPelicula);
  console.log("Lista actualizada:", peliculas);

  alert("Película agregada con éxito");
  document.getElementById('modal').style.display = 'none';
});
