import { useState, useEffect } from "react";

export function Busqueda({ setCargando, setCanciones, cargarDatos }) {
    const buscarCancion = async () => {
        setCargando(true)

        const headers = {
            Accept: "application/json",
        };

        const cancionesDatos = await fetch(`https://api.audius.co/v1/tracks/search?query=${busqueda}`, {
            method: "GET",
            headers: headers,
        });

        const datos = await cancionesDatos.json();
        console.log(datos.data)
        setCanciones(datos.data);
        setCargando(false)
    }

    const [busqueda, setBusqueda] = useState()

    useEffect(() => {
        if(!busqueda){
            cargarDatos();
        }
    },[busqueda])
    return (
        <div className="flex ">
            <input
                type="text"
                onChange={(e) => setBusqueda(e.currentTarget.value)}
                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-1/2 px-3 py-2.5 shadow-xs placeholder:text-body"
            />
            <button onClick={() => buscarCancion()}>buscar</button>
        </div>
    )
}