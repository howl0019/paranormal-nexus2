interface MapUploaderProps {
  maps: string[];
  onAdd: (map: string) => void;
  onRemove: (index: number) => void;
  onRename: (index: number, name: string) => void;
}

export function MapUploader({ maps, onAdd, onRemove, onRename }: MapUploaderProps) {
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
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Mapas</h3>
          <p className="text-sm text-neutral-400">Upload em Base64 para uso offline.</p>
        </div>
        <label className="cursor-pointer rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent/90">
          Adicionar mapa
          <input type="file" accept="image/*" className="hidden" onChange={(event) => event.target.files?.[0] && handleFile(event.target.files[0])} />
        </label>
      </div>
      <div className="mt-5 grid gap-4">
        {maps.length === 0 ? (
          <div className="rounded-3xl bg-white/5 p-4 text-sm text-neutral-300">Nenhum mapa adicionado.</div>
        ) : (
          maps.map((map, index) => (
            <div key={map + index} className="grid gap-3 rounded-3xl border border-border bg-[#0f172a] p-4">
              <div className="flex items-center justify-between gap-4">
                <input
                  value={`Mapa ${index + 1}`}
                  onChange={(event) => onRename(index, event.target.value)}
                  className="min-w-0 flex-1 rounded-2xl border border-border bg-[#11121a] px-4 py-2 text-sm text-white outline-none"
                />
                <button type="button" onClick={() => onRemove(index)} className="rounded-2xl bg-danger px-3 py-2 text-sm text-white">Excluir</button>
              </div>
              <div className="h-40 overflow-hidden rounded-3xl bg-black">
                <img src={map} alt={`Mapa ${index + 1}`} className="h-full w-full object-cover" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
