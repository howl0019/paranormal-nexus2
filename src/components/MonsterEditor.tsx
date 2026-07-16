import { Monster } from '../types/Monster';

interface MonsterEditorProps {
  monster: Monster;
  onChange: (monster: Monster) => void;
  onRemove: () => void;
}

export function MonsterEditor({ monster, onChange, onRemove }: MonsterEditorProps) {
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
      <input
        value={monster.image || ''}
        onChange={(event) => onChange({ ...monster, image: event.target.value })}
        placeholder="URL da imagem"
        className="w-full rounded-2xl border border-border bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
      />
      <div className="grid grid-cols-3 gap-3">
        <input
          type="number"
          value={monster.hp}
          onChange={(event) => onChange({ ...monster, hp: Number(event.target.value) })}
          placeholder="Vida"
          className="rounded-2xl border border-border bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
        />
        <input
          value={monster.damage}
          onChange={(event) => onChange({ ...monster, damage: event.target.value })}
          placeholder="Dano"
          className="rounded-2xl border border-border bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
        />
        <input
          type="number"
          value={monster.defense}
          onChange={(event) => onChange({ ...monster, defense: Number(event.target.value) })}
          placeholder="Defesa"
          className="rounded-2xl border border-border bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
        />
      </div>
      <textarea
        value={monster.description || ''}
        onChange={(event) => onChange({ ...monster, description: event.target.value })}
        placeholder="Descrição"
        className="min-h-[96px] w-full rounded-2xl border border-border bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
      />
    </div>
  );
}
