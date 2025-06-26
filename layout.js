function crearLayout() {

    const footer = document.getElementById('footer');

    footer.innerHTML = `
              <div class="footer-case">
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
      </div>
`;
}


crearLayout();