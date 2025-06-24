function scrollCarousel(direction) {
  const carousel = document.getElementById("carousel");
//   //const movieWidth = carousel.querySelector(".movie").offsetWidth + 20; // ancho + gap
//   carousel.scrollBy({
//     left: direction * movieWidth * 2, // puedes cambiar el 2 por cuántas películas desplazar por click
//     behavior: "smooth"
//   });
// }

if (carousel) {
  const scrollAmount = carousel.clientWidth;

  carousel.scrollBy ( {
    left: direction * scrollAmount,
    behavior: "smooth",
  });
}
}