import { act, useEffect, useRef, useState } from "react"
import Image from "next/image";
export function Reproduccion({ cancion, audio }) {
    const [tiempo, setTiempo] = useState(0)
    const [pausa, setPausa] = useState(false)

    const volumen = useRef(0.5)

    const play = () => {
        setPausa(false)
        audio.current.play()
    };

    const pause = () => {
        setPausa(true)
        audio.current.pause()
    };
    useEffect(() => {
        const interval = setInterval(() => {
            if (parseInt(audio.current.currentTime) == cancion.duration) {
                pause()
                setTiempo(0)
            }

            if (pausa) {
                clearInterval(interval)
            }

            setTiempo(audio.current.currentTime)

        }, 1000);
        return () => {
            clearInterval(interval)
        }
    }, [pausa])

    useEffect(() => {
        setTiempo(0)
        setPausa(false)
    }, [audio.current.src])

    useEffect(() => {
        audio.current.volume = volumen.current;
    }, [audio.current.src])
    const actualizar = (valor) => {
        setTiempo(valor)
        audio.current.currentTime = valor
    }

    const cambiarVolumen = (value) => {
        volumen.current = value
        audio.current.volume = value
    }
    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-center w-full m-2">
                <input
                    type="range"
                    max={cancion.duration}
                    value={tiempo}
                    onChange={(e) => actualizar(e.currentTarget.value)}
                    className="w-4/3 mr-2 h-2 bg-white/80 bg-blend-color-dodge rounded-full appearance-none cursor-pointer" />
                <h1 className="m-1 w-1/3">{
                    parseInt(tiempo / 3600) + ":" + parseInt(tiempo / 60) + ":" + parseInt(tiempo % 60)
                }</h1>
            </div>
            <div className="flex flex-row justify-between items-center">
                <div className="w-2xl">
                    <h1 className="text-white">{cancion.title} </h1>
                    <p>{cancion.user.name}</p>
                </div>
                <div className="w-2xl flex justify-center ">
                    {
                        pausa ?
                            <button onClick={() => play()} >
                                <Image
                                    src={"/img/play.png"}
                                    width={70}
                                    height={70}
                                    alt="play"
                                    className="bg-white p-4 rounded-3xl hover:bg-white/70"
                                />
                            </button>
                            :
                            <button onClick={() => pause()} >
                                <Image
                                    src={"/img/pausa.png"}
                                    width={70}
                                    height={70}
                                    alt="play"
                                    className="bg-white p-2 rounded-3xl hover:bg-white/70"
                                />
                            </button>
                    }
                </div>
                <div className="w-2xl flex flex-col">
                    <input
                        type="range"
                        max={1}
                        step={0.01}
                        onChange={(e) => cambiarVolumen(e.currentTarget.value)}
                        className="h-2 bg-white/80 bg-blend-color-dodge rounded-full appearance-none cursor-pointer"/>
                    <p>volumen</p>
                </div>
            </div>
        </div >
    )
}