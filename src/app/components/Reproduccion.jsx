import { useEffect, useRef, useState } from "react"

export function Reproduccion({ cancion, audio, siguiente, anterior }) {
    const [tiempo, setTiempo] = useState(0)
    const [pausa, setPausa] = useState(false)
    const [nivelVolumen, setNivelVolumen] = useState(0.5)
    const volumenRef = useRef(0.5)

    const play = () => { setPausa(false); audio.current.play(); };
    const pause = () => { setPausa(true); audio.current.pause(); };

    useEffect(() => {
        const interval = setInterval(() => {
            if (audio.current && !pausa) {
                setTiempo(audio.current.currentTime);
                if (Math.floor(audio.current.currentTime) >= cancion.duration) {
                    siguiente(); // Salta a la siguiente automáticamente al terminar
                }
            }
        }, 1000);
        return () => clearInterval(interval)
    }, [pausa, cancion.duration, siguiente])

    useEffect(() => {
        setTiempo(0);
        setPausa(false);
        if (audio.current) audio.current.volume = volumenRef.current;
    }, [cancion.track_id])

    const actualizarTiempo = (valor) => {
        setTiempo(valor);
        if (audio.current) audio.current.currentTime = valor;
    }

    const cambiarVolumen = (value) => {
        const nuevoVolumen = parseFloat(value);
        volumenRef.current = nuevoVolumen;
        setNivelVolumen(nuevoVolumen);
        if (audio.current) audio.current.volume = nuevoVolumen;
    }

    return (
        <div className="flex flex-col justify-between min-h-fit bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-2xl">
            
            <div className="relative group w-full aspect-square flex items-center justify-center mb-4">
                <img src={cancion.artwork["480x480"]} alt="portada" className="rounded-2xl w-full h-full object-cover shadow-2xl" />
            </div>

            <div className="space-y-0.5 mb-3">
                <h1 className="text-white font-bold text-xl truncate">{cancion.title}</h1>
                <p className="text-zinc-400 text-xs">{cancion.user.name}</p>
            </div>

            <div className="space-y-1 mb-3">
                <input
                    type="range"
                    max={cancion.duration}
                    value={tiempo}
                    onChange={(e) => actualizarTiempo(e.currentTarget.value)}
                    className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-white"
                />
                <div className="flex justify-between text-[9px] font-mono text-zinc-500 uppercase">
                    <span>{parseInt(tiempo / 60)}:{String(parseInt(tiempo % 60)).padStart(2, '0')}</span>
                    <span>{parseInt(cancion.duration / 60)}:{String(parseInt(cancion.duration % 60)).padStart(2, '0')}</span>
                </div>
            </div>

            {/* CONTROLES DE NAVEGACIÓN */}
            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-6">
                    {/* BOTÓN ANTERIOR */}
                    <button onClick={anterior} className="text-zinc-400 hover:text-white transition-colors">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                        </svg>
                    </button>

                    {/* BOTÓN PLAY/PAUSE */}
                    <button
                        onClick={() => (pausa ? play() : pause())}
                        className="flex items-center justify-center w-14 h-14 bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all"
                    >
                        {pausa ? (
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 ml-0.5"><path d="M8 5v14l11-7z" /></svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M6 5h4v14H6zm8 0h4v14h-4z" /></svg>
                        )}
                    </button>

                    {/* BOTÓN SIGUIENTE */}
                    <button onClick={siguiente} className="text-zinc-400 hover:text-white transition-colors">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6z"/>
                        </svg>
                    </button>
                </div>

                {/* VOLUMEN */}
                <div className="w-full bg-black/30 p-3 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-mono text-zinc-500 tracking-widest">VOLUME</span>
                        <span className="text-[9px] font-mono text-zinc-300">{Math.round(nivelVolumen * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        max={1}
                        step={0.01}
                        value={nivelVolumen}
                        onChange={(e) => cambiarVolumen(e.currentTarget.value)}
                        className="w-full h-1 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-orange-400"
                    />
                </div>
            </div>
        </div>
    )
}