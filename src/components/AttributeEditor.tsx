import { Attribute } from '../types/Agent';

interface AttributeEditorProps {
  attribute: Attribute;
  onChange: (attribute: Attribute) => void;
  onRemove: () => void;
}

export function AttributeEditor({ attribute, onChange, onRemove }: AttributeEditorProps) {
  return (
    <div className="grid gap-3 rounded-3xl border border-border bg-[#11121a] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-white">Atributo</div>
        <button type="button" onClick={onRemove} className="text-sm text-danger hover:text-red-300">Remover</button>
      </div>
      <input
        value={attribute.name}
        onChange={(event) => onChange({ ...attribute, name: event.target.value })}
        placeholder="Nome do atributo"
        className="w-full rounded-2xl border border-border bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
      />
      <input
        type="number"
        value={attribute.value}
        onChange={(event) => onChange({ ...attribute, value: Number(event.target.value) })}
        placeholder="Valor"
        className="w-full rounded-2xl border border-border bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
      />
    </div>
  );
}
