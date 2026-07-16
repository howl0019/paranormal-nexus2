import { Skill } from '../types/Agent';

interface SkillEditorProps {
  skill: Skill;
  onChange: (skill: Skill) => void;
  onRemove: () => void;
}

export function SkillEditor({ skill, onChange, onRemove }: SkillEditorProps) {
  return (
    <div className="grid gap-3 rounded-3xl border border-border bg-[#11121a] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-white">Perícia</div>
        <button type="button" onClick={onRemove} className="text-sm text-danger hover:text-red-300">Remover</button>
      </div>
      <input
        value={skill.name}
        onChange={(event) => onChange({ ...skill, name: event.target.value })}
        placeholder="Nome da perícia"
        className="w-full rounded-2xl border border-border bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
      />
      <input
        type="number"
        value={skill.value}
        onChange={(event) => onChange({ ...skill, value: Number(event.target.value) })}
        placeholder="Valor"
        className="w-full rounded-2xl border border-border bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
      />
      <textarea
        value={skill.notes}
        onChange={(event) => onChange({ ...skill, notes: event.target.value })}
        placeholder="Observações"
        className="min-h-[96px] w-full rounded-2xl border border-border bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
      />
    </div>
  );
}
