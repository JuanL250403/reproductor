export function CancionCard({ cancion, reproducir }) {
    return (
        <div 
            onClick={() => reproducir(cancion.track_id)}
            className="group flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:bg-zinc-800/50 border border-transparent hover:border-white/5 cursor-pointer"
        >
            <div className="flex items-center gap-4 overflow-hidden">
                {/* Miniatura pequeña o número */}
                <div className="w-10 h-10 bg-zinc-800 rounded flex-shrink-0 flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors overflow-hidden">
                    <img src={cancion.artwork["150x150"]} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                </div>
                
                <div className="flex flex-col overflow-hidden">
                    <h1 className="text-zinc-100 font-medium text-sm truncate group-hover:text-orange-400 transition-colors">
                        {cancion.title}
                    </h1>
                    <p className="text-zinc-500 text-xs truncate">
                        {cancion.user.name}
                    </p>
                </div>
            </div>

            <div className="text-zinc-600 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                PLAYING NOW
            </div>
        </div>
    )
}