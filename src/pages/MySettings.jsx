export function MySettings() {
  return (
    <div>
      <h3 id="settings-profilemy-settings">
        <strong>Settings</strong> (<code>/profile/my-settings</code>)
      </h3>
      <p>
        Configuración de cuenta: idioma, notificaciones, seguridad, integración
        con Riot API, cierre de sesión y eliminación de cuenta.
      </p>
      <p>
        <strong>Subpáginas sugeridas:</strong>
      </p>
      <ul>
        <li>
          <code>/profile/my-settings/account</code>: email, contraseña, 2FA.
        </li>
        <li>
          <code>/profile/my-settings/notifications</code>: preferencias de
          alertas.
        </li>
        <li>
          <code>/profile/my-settings/integrations</code>: vinculación con Riot,
          Discord, etc.
        </li>
      </ul>
    </div>
  );
}
