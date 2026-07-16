import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAgents } from '../hooks/useAgents';
import { AttributeEditor } from '../components/AttributeEditor';
import { SkillEditor } from '../components/SkillEditor';
import { readJsonFile, isAgent } from '../utils/import';
import { exportAgent } from '../utils/export';
import { Agent } from '../types/Agent';

function createAttribute() {
  return { id: crypto.randomUUID(), name: '', value: 0 };
}

function createSkill() {
  return { id: crypto.randomUUID(), name: '', value: 0, notes: '' };
}

function createSection(category: string) {
  return { id: crypto.randomUUID(), name: '', content: '', category };
}

const sectionTabs = [
  { id: 'combate', label: 'COMBATE' },
  { id: 'habilidades', label: 'HABILIDADES' },
  { id: 'rituais', label: 'RITUAIS' },
  { id: 'inventario', label: 'INVENTÁRIO' },
  { id: 'descricao', label: 'DESCRIÇÃO' },
];

export default function AgentEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agents, updateAgent, deleteAgent, duplicateAgent, importAgent } = useAgents();
  const [importError, setImportError] = useState('');
  const [activeSectionTab, setActiveSectionTab] = useState('combate');

  const agent = useMemo(() => agents.find((item) => item.id === id), [agents, id]);

  if (!agent) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-8 shadow-panel">
        <h1 className="text-2xl font-semibold text-white">Agente não encontrado</h1>
        <p className="mt-3 text-sm text-neutral-400">Verifique se o agente existe ou crie um novo agente na página de agentes.</p>
      </div>
    );
  }

  const update = (changes: Partial<Agent>) => updateAgent(agent.id, changes);

  const handleImport = async (file: File) => {
    try {
      const data = await readJsonFile<unknown>(file);
      if (!isAgent(data)) {
        setImportError('Arquivo JSON inválido.');
        return;
      }
      const imported = importAgent(data as Agent);
      navigate(`/agents/${imported.id}`);
      setImportError('');
    } catch (error) {
      setImportError('Falha ao importar agente.');
    }
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        update({ image: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const sectionItems = agent.sections.filter((section) => section.category === activeSectionTab);

  const handleAddSection = () => {
    update({ sections: [...agent.sections, createSection(activeSectionTab)] });
  };

  const handleSectionChange = (updatedSection: Agent['sections'][number]) => {
    update({ sections: agent.sections.map((section) => (section.id === updatedSection.id ? updatedSection : section)) });
  };

  const handleRemoveSection = (sectionId: string) => {
    update({ sections: agent.sections.filter((section) => section.id !== sectionId) });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-6 shadow-panel sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <button
            type="button"
            onClick={() => navigate('/agents')}
            className="rounded-2xl bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Voltar
          </button>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-accent">Editor de agente</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">{agent.name || 'Agente sem nome'}</h1>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => exportAgent(agent)} className="rounded-2xl bg-white/5 px-5 py-3 text-sm text-neutral-200 transition hover:bg-white/10">Exportar JSON</button>
          <label className="cursor-pointer rounded-2xl border border-border bg-white/5 px-5 py-3 text-sm text-neutral-200 transition hover:bg-white/10">
            Importar JSON
            <input type="file" accept="application/json" className="hidden" onChange={(event) => event.target.files?.[0] && handleImport(event.target.files[0])} />
          </label>
          <button onClick={() => { deleteAgent(agent.id); navigate('/agents'); }} className="rounded-2xl bg-danger px-5 py-3 text-sm font-semibold text-white transition hover:bg-danger/90">Excluir</button>
          <button
            onClick={() => {
              const duplicated = duplicateAgent(agent.id);
              if (duplicated) navigate(`/agents/${duplicated.id}`);
            }}
            className="rounded-2xl bg-white/5 px-5 py-3 text-sm text-neutral-200 transition hover:bg-white/10"
          >
            Duplicar
          </button>
        </div>
      </div>

      {importError ? <div className="rounded-3xl border border-danger bg-[#500a0a] p-4 text-sm text-white">{importError}</div> : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6 rounded-3xl border border-border bg-[#11121a] p-6 shadow-panel">
          <div className="grid gap-5 rounded-3xl border border-border bg-[#0f172a] p-6">
            <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr] items-start">
              <div className="grid gap-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm text-neutral-400">
                    Nome
                    <input
                      value={agent.name}
                      onChange={(event) => update({ name: event.target.value })}
                      placeholder="Nome do agente"
                      className="mt-2 w-full rounded-2xl border border-border bg-[#11121a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
                    />
                  </label>
                  <label className="block text-sm text-neutral-400">
                    Descrição
                    <input
                      value={agent.description || ''}
                      onChange={(event) => update({ description: event.target.value })}
                      placeholder="Breve descrição"
                      className="mt-2 w-full rounded-2xl border border-border bg-[#11121a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
                    />
                  </label>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm text-neutral-400">
                    Jogador
                    <input
                      value={agent.player || ''}
                      onChange={(event) => update({ player: event.target.value })}
                      placeholder="Nome do jogador"
                      className="mt-2 w-full rounded-2xl border border-border bg-[#11121a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
                    />
                  </label>
                  <label className="block text-sm text-neutral-400">
                    Classe
                    <input
                      value={agent.role || ''}
                      onChange={(event) => update({ role: event.target.value })}
                      placeholder="Especialista, Operativo..."
                      className="mt-2 w-full rounded-2xl border border-border bg-[#11121a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
                    />
                  </label>
                </div>
                <label className="block text-sm text-neutral-400">
                  Origem
                  <input
                    value={agent.origin || ''}
                    onChange={(event) => update({ origin: event.target.value })}
                    placeholder="Amnésico, Agência..."
                    className="mt-2 w-full rounded-2xl border border-border bg-[#11121a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
                  />
                </label>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[2.5rem] border border-border bg-[#11121a] p-4">
                  <div className="h-52 w-full overflow-hidden rounded-[2rem] bg-zinc-900">
                    {agent.image ? (
                      <img src={agent.image} alt={agent.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-neutral-500">Sem imagem</div>
                    )}
                  </div>
                  <label className="mt-4 inline-flex w-full cursor-pointer items-center justify-center rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent/90">
                    Importar imagem
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => event.target.files?.[0] && handleImageUpload(event.target.files[0])}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 rounded-3xl border border-border bg-[#0f172a] p-6">
            <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="grid gap-4">
                <div className="rounded-3xl border border-border bg-[#11121a] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Status</p>
                      <h2 className="mt-1 text-xl font-semibold text-white">Vida e sanidade</h2>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-4">
                    <div className="rounded-3xl bg-[#0f172a] p-4">
                      <div className="flex items-center justify-between text-sm text-neutral-400">
                        <span>HP</span>
                        <span>{agent.hp}/{agent.maxHp}</span>
                      </div>
                      <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(100, Math.max(0, (agent.hp / Math.max(1, agent.maxHp)) * 100))}%` }} />
                      </div>
                      <div className="mt-4 grid gap-3">
                        <input
                          type="number"
                          value={agent.hp}
                          min={0}
                          onChange={(event) => update({ hp: Number(event.target.value) })}
                          className="w-full rounded-2xl border border-border bg-[#11121a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
                        />
                        <input
                          type="number"
                          value={agent.maxHp}
                          min={1}
                          onChange={(event) => update({ maxHp: Number(event.target.value) })}
                          className="w-full rounded-2xl border border-border bg-[#11121a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
                        />
                      </div>
                    </div>
                    <div className="rounded-3xl bg-[#0f172a] p-4">
                      <div className="flex items-center justify-between text-sm text-neutral-400">
                        <span>Sanidade</span>
                        <span>{agent.sanity}/{agent.maxSanity}</span>
                      </div>
                      <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, Math.max(0, (agent.sanity / Math.max(1, agent.maxSanity)) * 100))}%` }} />
                      </div>
                      <div className="mt-4 grid gap-3">
                        <input
                          type="number"
                          value={agent.sanity}
                          min={0}
                          onChange={(event) => update({ sanity: Number(event.target.value) })}
                          className="w-full rounded-2xl border border-border bg-[#11121a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
                        />
                        <input
                          type="number"
                          value={agent.maxSanity}
                          min={1}
                          onChange={(event) => update({ maxSanity: Number(event.target.value) })}
                          className="w-full rounded-2xl border border-border bg-[#11121a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-[#11121a] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Navegação</p>
                  </div>
                  <div className="mt-4 grid gap-3">
                    {sectionTabs.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveSectionTab(tab.id)}
                        className={`rounded-2xl border border-border px-4 py-3 text-left text-sm font-semibold transition ${
                          activeSectionTab === tab.id ? 'bg-accent text-white' : 'text-neutral-200 hover:border-accent hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-3xl border border-border bg-[#11121a] p-6 shadow-panel">
          <section className="rounded-3xl border border-border bg-[#0f172a] p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-white">Atributos</h2>
              <button
                type="button"
                onClick={() => update({ attributes: [...agent.attributes, createAttribute()] })}
                className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent/90"
              >
                + Adicionar
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {agent.attributes.length === 0 ? (
                <div className="rounded-3xl bg-white/5 p-4 text-sm text-neutral-400">Nenhum atributo definido.</div>
              ) : (
                agent.attributes.map((attribute) => (
                  <AttributeEditor
                    key={attribute.id}
                    attribute={attribute}
                    onChange={(updated) =>
                      update({ attributes: agent.attributes.map((item) => (item.id === updated.id ? updated : item)) })
                    }
                    onRemove={() => update({ attributes: agent.attributes.filter((item) => item.id !== attribute.id) })}
                  />
                ))
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-[#0f172a] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Perícias</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">Perícias</h2>
              </div>
              <button
                type="button"
                onClick={() => update({ skills: [...agent.skills, createSkill()] })}
                className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent/90"
              >
                + Adicionar
              </button>
            </div>
            <div className="mt-5 space-y-4">
              {agent.skills.length === 0 ? (
                <div className="rounded-3xl bg-white/5 p-4 text-sm text-neutral-400">Nenhuma perícia definida.</div>
              ) : (
                agent.skills.map((skill) => (
                  <SkillEditor
                    key={skill.id}
                    skill={skill}
                    onChange={(updated) =>
                      update({ skills: agent.skills.map((item) => (item.id === updated.id ? updated : item)) })
                    }
                    onRemove={() => update({ skills: agent.skills.filter((item) => item.id !== skill.id) })}
                  />
                ))
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-[#0f172a] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">{sectionTabs.find((tab) => tab.id === activeSectionTab)?.label}</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">Painel lateral</h2>
              </div>
              <button
                type="button"
                onClick={handleAddSection}
                className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent/90"
              >
                + Adicionar
              </button>
            </div>
            <div className="mt-5 space-y-4">
              {sectionItems.length === 0 ? (
                <div className="rounded-3xl bg-white/5 p-4 text-sm text-neutral-400">Nenhuma nota nesta aba ainda.</div>
              ) : (
                sectionItems.map((section) => (
                  <div key={section.id} className="grid gap-3 rounded-3xl border border-border bg-[#11121a] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <input
                        value={section.name}
                        onChange={(event) => handleSectionChange({ ...section, name: event.target.value })}
                        placeholder="Título"
                        className="min-w-0 rounded-2xl border border-border bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(section.id)}
                        className="text-sm text-danger hover:text-red-300"
                      >
                        Excluir
                      </button>
                    </div>
                    <textarea
                      value={section.content}
                      onChange={(event) => handleSectionChange({ ...section, content: event.target.value })}
                      placeholder="Conteúdo da seção"
                      className="min-h-[120px] w-full rounded-3xl border border-border bg-[#0f172a] px-4 py-4 text-sm text-white outline-none transition focus:border-accent"
                    />
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
