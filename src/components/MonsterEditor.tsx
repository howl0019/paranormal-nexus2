import { Monster } from '../types/Monster';

interface MonsterEditorProps {
  monster: Monster;
  onChange: (monster: Monster) => void;
  onRemove: () => void;
}

export function MonsterEditor({ monster, onChange, onRemove }: MonsterEditorProps) {
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange({ ...monster, image: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid gap-3 rounded-3xl border border-border bg-[#11121a] p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-white">Monstro</h3>
        <button type="button" onClick={onRemove} className="text-sm text-danger hover:text-red-300">Excluir</button>
      </div>
      <input
        value={monster.name}
        onChange={(event) => onChange({ ...monster, name: event.target.value })}
        placeholder="Nome do monstro"
        className="w-full rounded-2xl border border-border bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
      />
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="rounded-3xl border border-border bg-[#0f172a] p-3">
          <div className="h-40 overflow-hidden rounded-3xl bg-black">
            {monster.image ? (
              <img src={monster.image} alt={monster.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-neutral-500">Sem imagem</div>
            )}
          </div>
          <label className="mt-4 inline-flex w-full cursor-pointer items-center justify-center rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent/90">
            Enviar imagem
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => event.target.files?.[0] && handleImageUpload(event.target.files[0])}
            />
          </label>
        </div>
        <label className="block text-sm text-neutral-400">
          URL da imagem
          <input
            value={monster.image || ''}
            onChange={(event) => onChange({ ...monster, image: event.target.value })}
            placeholder="Cole a URL da imagem"
            className="mt-2 w-full rounded-2xl border border-border bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
          />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm text-neutral-400">
          Vida
          <input
            type="number"
            value={monster.hp}
            onChange={(event) => onChange({ ...monster, hp: Number(event.target.value) })}
            placeholder="Vida"
            className="mt-2 w-full rounded-2xl border border-border bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
          />
        </label>
        <label className="block text-sm text-neutral-400">
          Defesa
          <input
            type="number"
            value={monster.defense}
            onChange={(event) => onChange({ ...monster, defense: Number(event.target.value) })}
            placeholder="Defesa"
            className="mt-2 w-full rounded-2xl border border-border bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
          />
        </label>
      </div>
      <label className="block text-sm text-neutral-400">
        Dano
        <input
          value={monster.damage}
          onChange={(event) => onChange({ ...monster, damage: event.target.value })}
          placeholder="Ex: 1d6 + 2"
          className="mt-2 w-full rounded-2xl border border-border bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
        />
      </label>
      <textarea
        value={monster.description || ''}
        onChange={(event) => onChange({ ...monster, description: event.target.value })}
        placeholder="Descrição"
        className="min-h-[96px] w-full rounded-2xl border border-border bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
      />
    </div>
  );
}
