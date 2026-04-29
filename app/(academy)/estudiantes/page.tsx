import { getAllStudents } from "@/actions"


export default async function ObtenerEstudiantes() {
    const estudiantes = await getAllStudents();


    return(
        <div>
        
        <div>
            <table>
                <thead>
                    <tr>
                        <th className="p-3">Nombres</th>
                        <th className="p-3">Paterno</th>
                        <th className="p-3">Materno</th>
                        <th className="p-3">Direccion</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        estudiantes.map((est) => (
                            <tr key={est.id} className="border-t">
                                <td>{est.nombres}</td>
                                <td>{est.paterno}</td>
                                <td>{est.materno}</td>
                                <td>{est.direccion}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>

        </div>
    )
}