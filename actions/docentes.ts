import { Docente } from "@/types/docente.interface";


const URL = `${process.env.GATEWAY_URL}`;

export async function getAllDocentes(): Promise<Docente[]> {

    const response = await fetch (`${URL}/docentes`, {cache: 'no-store'});

    if(!response.ok){
        throw new Error('Error al obtener los docentes');
    }

    const data = await response.json();

    if(Array.isArray(data?.data)) return data.data;

    console.error("Error al obtener la data:", data)
     
    return [];
}