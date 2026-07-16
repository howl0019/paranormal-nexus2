interface MapEntry {
  id: string;
  name: string;
  src: string;
  playersMarked?: boolean;
}

interface MapUploaderProps {
  maps: MapEntry[];
  onAdd: (mapSrc: string) => void;
  onRemove: (index: number) => void;
  onRename: (index: number, name: string) => void;
  onToggleMarkers: (id: string) => void;
}

export function MapUploader({ maps, onAdd, onRemove, onRename, onToggleMarkers }: MapUploaderProps) {
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onAdd(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-3xl border border-border bg-[#11121a] p-5 shadow-panel">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Mapas</h3>
          <p className="text-sm text-neutral-400">Upload em Base64 para uso offline.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <label className="cursor-pointer rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent/90">
            Adicionar mapa
            <input type="file" accept="image/*" className="hidden" onChange={(event) => event.target.files?.[0] && handleFile(event.target.files[0])} />
          </label>
        </div>
      </div>
      <div className="mt-5 grid gap-4">
        {maps.length === 0 ? (
          <div className="rounded-3xl bg-white/5 p-4 text-sm text-neutral-300">Nenhum mapa adicionado.</div>
        ) : (
          maps.map((map, index) => (
            <div key={map.id} className="grid gap-3 rounded-3xl border border-border bg-[#0f172a] p-4">
              <div className="flex items-center justify-between gap-4">
                <input
                  value={map.name}
                  onChange={(event) => onRename(index, event.target.value)}
                  className="min-w-0 flex-1 rounded-2xl border border-border bg-[#11121a] px-4 py-2 text-sm text-white outline-none"
                />
                <button type="button" onClick={() => onRemove(index)} className="rounded-2xl bg-danger px-3 py-2 text-sm text-white">Excluir</button>
              </div>
              <div className="h-40 overflow-hidden rounded-3xl bg-black">
                <img src={map.src} alt={map.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-neutral-300">Marcações de players</span>
                <button
                  type="button"
                  onClick={() => onToggleMarkers(map.id)}
                  className="rounded-2xl bg-white/5 px-4 py-2 text-sm text-neutral-200 transition hover:bg-white/10"
                >
                  {map.playersMarked ? 'Desativar marcação' : 'Marcar players'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
