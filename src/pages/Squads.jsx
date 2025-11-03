export function Squads() {
  return (
    <div>
      <h3 id="squads-startsquads">
        <strong>Squads</strong> (<code>/start/squads</code>)
      </h3>
      <p>
        Espacio para explorar equipos públicos. Los usuarios pueden ver perfiles
        de equipos, miembros, objetivos y enviar solicitudes para unirse.
        Incluye filtros por idioma, región y nivel competitivo.
      </p>
      <p>
        <strong>Subpáginas sugeridas:</strong>
      </p>
      <ul>
        <li>
          <code>/start/squads/search</code>: buscador avanzado de equipos.
        </li>
        <li>
          <code>/start/squads/profile/:id</code>: perfil público de un equipo.
        </li>
        <li>
          <code>/start/squads/applications</code>: solicitudes enviadas y
          recibidas.
        </li>
      </ul>
    </div>
  );
}
