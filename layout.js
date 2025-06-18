function crearLayout() {
    const header = document.getElementById('header');
    const footer = document.getElementById('footer');

    header.innerHTML = `
    <div class="img-header">
        <img src="img/Header.png" alt="logo Videoclub" width="1420">
      </div>
        <nav>
          <!--<button class="button-toggle">☰</button>-->
          <div class="menu">
            <a href="index.html">Inicio</a>
            <a href="">Catálogo</a>
            <a href="">Alquila tu sala</a>
            <a href="">Contacto</a>
          </div>
        </nav>
    `;

    footer.innerHTML = `
            <div class="footer">
                <h4>Videoclub</h4>
                <p><a href="/politica-de-privacidad">Política de Privacidad</a></p>
                <p><a href="/contacto">Contacto</a></p>
            </div>
            <div class="footer">
                <h4>Cine</h4>
                <p><a href="/politica-de-privacidad">Reserva</a></p>
                <p><a href="/contacto">Cartelera</a></p>
            </div>
            <div class="footer">
                <h4>Nosotros</h4>
                <p><a href="/politica-de-privacidad">Conócenos</a></p>
                <p><a href="/contacto">Empleo</a></p>
            </div>
            <div class="footer">
                <h4>Contacto</h4>
                <p><a href="/politica-de-privacidad">Contacto</a></p>
                <p><a href="/contacto">Preguntas frecuentas</a></p>
            </div>
`;
}


crearLayout();