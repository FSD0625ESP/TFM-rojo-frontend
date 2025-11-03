export function MyProfile() {
  return (
    <div>
      <h3 id="my-profile-profilemy-profile">
        <strong>My Profile</strong> (<code>/profile/my-profile</code>)
      </h3>
      <p>
        Perfil editable del usuario con avatar, biografía, roles preferidos,
        redes sociales y disponibilidad. Incluye configuración de visibilidad y
        preferencias.
      </p>
      <p>
        <strong>Subpáginas sugeridas:</strong>
      </p>
      <ul>
        <li>
          <code>/profile/my-profile/edit</code>: edición del perfil.
        </li>
        <li>
          <code>/profile/my-profile/preferences</code>: roles, horarios, idioma.
        </li>
        <li>
          <code>/profile/my-profile/visibility</code>: configuración de
          privacidad.
        </li>
      </ul>
    </div>
  );
}
