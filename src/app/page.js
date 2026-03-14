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
    try {
      const headers = { Accept: "application/json" };
      const res = await fetch("https://api.audius.co/v1/tracks/trending", {
        method: "GET",
        headers: headers,
      });
      const datos = await res.json();
      setCanciones(datos.data);
    } catch (error) {
      console.error("Error al cargar canciones:", error);
    }
    setCargando(false);
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  const reproducir = async (id) => {
    setCancionCargando(true);
    try {
      const headers = { Accept: "application/json" };
      const res = await fetch(`https://api.audius.co/v1/tracks/${id}`, {
        method: "GET",
        headers: headers,
      });
      const data = await res.json();
      const infoCancion = data.data;

      if (audio.current) {
        audio.current.pause();
        audio.current.src = "";
      }

      setReproduccion(infoCancion);
      audio.current = new Audio(infoCancion.stream.url);
      await audio.current.play();
    } catch (error) {
      console.error("Error al reproducir:", error);
    }
    setCancionCargando(false);
  };

  // FUNCIONES DE NAVEGACIÓN
  const siguienteCancion = () => {
    const currentIndex = canciones.findIndex(c => c.track_id === reproduccion.track_id);
    const nextIndex = (currentIndex + 1) % canciones.length;
    reproducir(canciones[nextIndex].track_id);
  };

  const anteriorCancion = () => {
    const currentIndex = canciones.findIndex(c => c.track_id === reproduccion.track_id);
    const prevIndex = (currentIndex - 1 + canciones.length) % canciones.length;
    reproducir(canciones[prevIndex].track_id);
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-orange-500/30">
      <main className="flex h-full w-full flex-col lg:flex-row overflow-hidden">
        
        <div className="w-full lg:w-[420px] p-6 flex flex-col lg:justify-center border-r border-white/5 bg-gradient-to-b from-zinc-900/20 to-transparent overflow-y-auto">
          {reproduccion ? (
            !cancionCargando ? (
              <Reproduccion 
                cancion={reproduccion} 
                audio={audio} 
                siguiente={siguienteCancion} 
                anterior={anteriorCancion} 
              />
            ) : (
              <div className="flex flex-col justify-center items-center h-[500px] animate-pulse">
                <Image src={"/img/cargando.png"} width={60} height={60} alt="cargando" className="invert opacity-20" />
                <span className="mt-4 text-[10px] font-mono tracking-[0.3em] text-zinc-600 uppercase">Sincronizando...</span>
              </div>
            )
          ) : (
            <div className="h-[500px] rounded-3xl border border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-600 px-10 text-center">
              <p className="font-mono text-[10px] uppercase tracking-widest mb-2">System Ready</p>
              <p className="text-sm font-light italic">Selecciona una pista para iniciar</p>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col bg-black/40">
          <div className="p-8 pb-6 bg-gradient-to-b from-black to-transparent">
            <h2 className="text-3xl font-bold tracking-tighter mb-8">Audius Trending</h2>
            <Busqueda setCanciones={setCanciones} setCargando={setCargando} cargarDatos={cargarDatos} />
          </div>

          <div className="flex-1 overflow-y-auto px-8 pb-10 space-y-2">
            {cargando ? (
              <div className="flex flex-col items-center justify-center h-64 opacity-20">
                 <Image src={"/img/cargando.png"} width={40} height={40} alt="loading" className="invert" />
              </div>
            ) : (
              canciones.map((cancion, index) => (
                <CancionCard cancion={cancion} reproducir={reproducir} key={cancion.track_id || index} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}