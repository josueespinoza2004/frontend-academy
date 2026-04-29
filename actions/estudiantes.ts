import { Estudiante } from '@/types/estudiante.interface'

const URL = `${process.env.GATEWAY_URL}`;

export async function getAllStudents(): Promise<Estudiante[]> {

    const response = await fetch (`${URL}/estudiantes`, {cache: 'no-store'});

    if(!response.ok){
        throw new Error('Error al obtener los estudiantes');
    }

    const data = await response.json();

    if(Array.isArray(data?.data)) return data.data;

    console.error("Error al obtener la data:", data)
     
    return [];
}