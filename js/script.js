let infopeliculas = [];  // Para almacenar los datos de películas

document.addEventListener("DOMContentLoaded", () => {
    fetch("https://japceibal.github.io/japflix_api/movies-data.json")
      .then(response => response.json())
      .then(data => {
        infopeliculas = data;
        console.log("Películas cargadas pero sin mostrar:", data);
      })
      .catch(error => console.error("Error al obtener las películas:", error));
});  // Fetch que obtiene la info del URL al cargar la página

// Mostrar las estrellas según el puntaje
function mostrarPuntaje(vote_average) {
    const maxStars = 5; // Puntaje máximo: 5 estrellas
    const puntajeEstrellas = Math.round(vote_average / 2); // Convertir de 10 a 5 estrellas
    let estrellas = "";

    for (let i = 1; i <= maxStars; i++) {
      if (i <= puntajeEstrellas) {
        estrellas += `<i class="fa fa-star"></i>`;
      } else {
        estrellas += `<i class="fa fa-star-o"></i>`;
      }
    }
    return estrellas;
}

// Buscar películas
function buscarPeliculas() {
    const inputBuscar = document.getElementById("inputBuscar").value.toLowerCase();
    const lista = document.getElementById("lista");
    lista.innerHTML = ""; // Limpiar la lista antes de mostrar nuevos resultados

    if (inputBuscar) {
      // Filtrar las películas según el input en title, genres, tagline u overview
      const peliculasFiltradas = infopeliculas.filter(pelicula =>
        pelicula.title.toLowerCase().includes(inputBuscar) ||
        pelicula.genres.join(" ").toLowerCase().includes(inputBuscar) ||
        (pelicula.tagline && pelicula.tagline.toLowerCase().includes(inputBuscar)) ||
        (pelicula.overview && pelicula.overview.toLowerCase().includes(inputBuscar))
      );

      // Mostrar los resultados
      peliculasFiltradas.forEach(pelicula => {
        const item = document.createElement("li");
        item.classList.add("list-group-item", "bg-dark", "text-light");

        item.innerHTML = `
          <h5>${pelicula.title}</h5>
          <p>${pelicula.tagline ? pelicula.tagline : "Sin tagline"}</p>
          <div>${mostrarPuntaje(pelicula.vote_average)}</div>
        `;

        // Agregar evento click para mostrar más información en el offcanvas
        item.addEventListener("click", () => mostrarInfoPelicula(pelicula));

        lista.appendChild(item);
      });

      if (peliculasFiltradas.length === 0) {
        const item = document.createElement("li");
        item.classList.add("list-group-item", "bg-dark", "text-light");
        item.innerHTML = `<p>No se encontraron películas relacionadas.</p>`;
        lista.appendChild(item);
      }
    }
}

// Función para mostrar la información de la película en el offcanvas
function mostrarInfoPelicula(pelicula) {
  // Llenar los campos del offcanvas con la información de la película seleccionada
  document.getElementById('offcanvasTopLabel').innerText = pelicula.title;
  document.getElementById('movieOverview').innerText = pelicula.overview || "Sin descripción disponible.";

  // Crear una lista de géneros y mostrarla
  const genres = pelicula.genres.join(' - ');
  document.getElementById('movieGenres').innerText = genres;

  // Llenar el desplegable con información adicional (aquí ajusta los valores como consideres)
  const additionalInfo = document.getElementById('additionalInfo');
  additionalInfo.innerHTML = `
    <li><span class="dropdown-item">Year: ${new Date(pelicula.release_date).getFullYear()}</span></li>
    <li><span class="dropdown-item">Runtime: ${pelicula.runtime || "Desconocido"} mins</span></li>
  `;

  // Mostrar el offcanvas usando Bootstrap
  const offcanvasElement = new bootstrap.Offcanvas(document.getElementById('offcanvasTop'));
  offcanvasElement.show();
}

// Agregar evento al botón de búsqueda
const btnBuscar = document.getElementById("btnBuscar");
btnBuscar.addEventListener("click", buscarPeliculas);