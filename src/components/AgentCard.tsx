import { Agent } from '../types/Agent';
import { Link } from 'react-router-dom';

interface AgentCardProps {
  agent: Agent;
  onDelete: () => void;
  onDuplicate: () => void;
  onExport: () => void;
}

export function AgentCard({ agent, onDelete, onDuplicate, onExport }: AgentCardProps) {
  return (
    <div className="rounded-3xl border border-border bg-[#11121a] p-5 shadow-panel">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-2xl bg-zinc-900">
          {agent.image ? <img src={agent.image} alt={agent.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-neutral-500">Sem imagem</div>}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-semibold text-white">{agent.name || 'Agente sem nome'}</h2>
          <p className="mt-1 text-sm leading-5 text-neutral-400">{agent.description || 'Nenhuma descrição disponível.'}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-neutral-300">
        <div className="rounded-2xl bg-white/5 p-3">
          <div className="font-semibold text-white">Vida</div>
          <div>{agent.hp} / {agent.maxHp}</div>
        </div>
        <div className="rounded-2xl bg-white/5 p-3">
          <div className="font-semibold text-white">Sanidade</div>
          <div>{agent.sanity} / {agent.maxSanity}</div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link to={`/agents/${agent.id}`} className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent/90">Abrir</Link>
        <button type="button" onClick={onDuplicate} className="rounded-2xl bg-white/5 px-4 py-2 text-sm text-neutral-200 transition hover:bg-white/10">Duplicar</button>
        <button type="button" onClick={onExport} className="rounded-2xl bg-white/5 px-4 py-2 text-sm text-neutral-200 transition hover:bg-white/10">Exportar</button>
        <button type="button" onClick={onDelete} className="rounded-2xl bg-danger px-4 py-2 text-sm font-semibold text-white transition hover:bg-danger/90">Excluir</button>
      </div>
    </div>
  );
}
