"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CancionCard } from "./components/CancionCard";
import { Reproduccion } from "./components/Reproduccion";
import { Busqueda } from "./components/Busqueda";
export default function Home() {
  const [canciones, setCanciones] = useState([]);

  const [reproduccion, setReproduccion] = useState();

  const [cargando, setCargando] = useState(false);

  const [cancionCargando, setCancionCargando] = useState(false);

  const audio = useRef();

  async function cargarDatos() {
    setCargando(true);

    const headers = {
      Accept: "application/json",
    };

    const cancionesDatos = await fetch(
      "https://api.audius.co/v1/tracks/trending",
      {
        method: "GET",
        headers: headers,
      },
    );

    const datos = await cancionesDatos.json();
    setCanciones(datos.data);

    setCargando(false);
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  const reproducir = async (id) => {
    setCancionCargando(true);
    const headers = {
      Accept: "application/json",
    };

    const cancionData = await fetch(`https://api.audius.co/v1/tracks/${id}`, {
      method: "GET",
      headers: headers,
    });

    const data = await cancionData.json();
    const reproduccionData = data.data;

    setReproduccion(reproduccionData);

    if (audio.current) {
      if (audio.current.played) {
        audio.current.pause();
      }
    }

    audio.current = new Audio(data.data.stream.url);
    await audio.current.play();

    setCancionCargando(false);
  };

  return (
    <div className="flex flex-col min-h-screen justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-row items-center justify-between bg-white dark:bg-black sm:items-start">
        <div className="w-1/3">
          {reproduccion ? (
            !cancionCargando ? (
              <div className="m-5">
                <Reproduccion cancion={reproduccion} audio={audio} />
              </div>
            ) : (
              <Image
                src={"/img/cargando.png"}
                width={100}
                height={100}
                alt="cargando"
                className="invert"
              />
            )
          ) : (
            ""
          )}
          <div>
            <h1>SoundAzureCloud</h1>
          </div>
        </div>
        <div className={`w-2/3 ${cancionCargando ? "pointer-events-none bg-white/10" : ""}`}>
          <div>
            <Busqueda
              setCanciones={setCanciones}
              setCargando={setCargando}
              cargarDatos={cargarDatos}
            ></Busqueda>
          </div>
          <div className="h-screen w-full overflow-auto">
            {cargando ? (
              <Image
                src={"/img/cargando.png"}
                width={100}
                height={100}
                alt="cargando"
                className="invert  bg-white/20"
              />
            ) : (
              canciones.map((cancion, index) => (
                <CancionCard
                  cancion={cancion}
                  reproducir={reproducir}
                  key={index}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
