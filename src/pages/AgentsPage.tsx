import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgents } from '../hooks/useAgents';
import { AgentCard } from '../components/AgentCard';
import { exportAgent } from '../utils/export';
import { readJsonFile, isAgent } from '../utils/import';
import { Agent } from '../types/Agent';

export default function AgentsPage() {
  const { agents, createAgent, deleteAgent, duplicateAgent, importAgent } = useAgents();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState('');

  const sortedAgents = useMemo(
    () => [...agents].sort((a, b) => b.updatedAt - a.updatedAt),
    [agents]
  );

  const handleCreate = () => {
    const agent = createAgent();
    navigate(`/agents/${agent.id}`);
  };

  const handleImport = async (file: File) => {
    try {
      const data = await readJsonFile<unknown>(file);
      if (!isAgent(data)) {
        setError('Arquivo JSON inválido para agente.');
        return;
      }
      const imported = importAgent(data as Agent);
      navigate(`/agents/${imported.id}`);
      setError('');
    } catch (importError) {
      setError('Falha ao importar arquivo JSON.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-6 shadow-panel sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-accent">Agentes</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Gerencie seus agentes</h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button onClick={handleCreate} className="rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent/90">Criar agente</button>
          <label className="cursor-pointer rounded-2xl border border-border bg-white/5 px-5 py-3 text-sm text-neutral-200 transition hover:bg-white/10">
            Importar JSON
            <input
              ref={inputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(event) => event.target.files?.[0] && handleImport(event.target.files[0])}
            />
          </label>
        </div>
      </div>

      {error ? <div className="rounded-3xl border border-danger bg-[#500a0a] p-4 text-sm text-white">{error}</div> : null}

      <div className="grid gap-4 xl:grid-cols-2">
        {sortedAgents.length === 0 ? (
          <div className="rounded-3xl border border-border bg-[#11121a] p-8 text-center text-neutral-400">Nenhum agente criado ainda. Use o botão acima para começar.</div>
        ) : (
          sortedAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onDelete={() => deleteAgent(agent.id)}
              onDuplicate={() => {
                const duplicated = duplicateAgent(agent.id);
                if (duplicated) {
                  navigate(`/agents/${duplicated.id}`);
                }
              }}
              onExport={() => exportAgent(agent)}
            />
          ))
        )}
      </div>
    </div>
  );
}
