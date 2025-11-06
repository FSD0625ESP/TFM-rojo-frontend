import { Card, CardContent } from "../components/ui/card";

export function MySquad() {
  return (
    <Card className="md:m-4">
      <CardContent>
        <div>
          <h3 id="my-squad-profilemy-squad">
            <strong>My Squad</strong> (<code>/profile/my-squad</code>)
          </h3>
          <p>
            Gestión del equipo propio: miembros, roles, calendario, objetivos y
            scrims. Incluye administración de solicitudes y edición del perfil
            del equipo.
          </p>
          <p>
            <strong>Subpáginas sugeridas:</strong>
          </p>
          <ul>
            <li>
              <code>/profile/my-squad/manage</code>: administración del equipo.
            </li>
            <li>
              <code>/profile/my-squad/calendar</code>: entrenamientos y
              partidas.
            </li>
            <li>
              <code>/profile/my-squad/invitations</code>: solicitudes enviadas y
              recibidas.
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
