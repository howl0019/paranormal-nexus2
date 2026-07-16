import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAgents } from '../hooks/useAgents';
import { useCampaigns } from '../hooks/useCampaigns';
import { Agent } from '../types/Agent';
import { Monster } from '../types/Monster';
import { Campaign } from '../types/Campaign';
import { Tabs } from '../components/Tabs';
import { MonsterEditor } from '../components/MonsterEditor';
import { MapUploader } from '../components/MapUploader';
import { exportCampaign } from '../utils/export';
import { readJsonFile, isAgent, isCampaign } from '../utils/import';

function createMonster(): Monster {
  return {
    id: crypto.randomUUID(),
    name: '',
    image: '',
    hp: 0,
    damage: '',
    defense: 0,
    description: '',
  };
}

export default function CampaignEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agents } = useAgents();
  const { campaigns, updateCampaign, deleteCampaign, duplicateCampaign, importCampaign } = useCampaigns();
  const [activeTab, setActiveTab] = useState('players');
  const [error, setError] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationDescription, setNewLocationDescription] = useState('');

  const campaign = useMemo(() => campaigns.find((item) => item.id === id), [campaigns, id]);

  const availableAgents = useMemo(
    () => agents.filter((agent) => !campaign?.players.includes(agent.id)),
    [agents, campaign?.players]
  );

  const noteCategories = campaign?.noteCategories ?? [];
  const locations = campaign?.locations ?? [];

  if (!campaign) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-8 shadow-panel">
        <h1 className="text-2xl font-semibold text-white">Campanha não encontrada</h1>
        <p className="mt-3 text-sm text-neutral-400">Verifique se a campanha existe ou crie uma nova campanha na página de campanhas.</p>
      </div>
    );
  }

  const update = (changes: Partial<Campaign>) => updateCampaign(campaign.id, changes);

  const handleImportCampaign = async (file: File) => {
    try {
      const data = await readJsonFile<unknown>(file);
      if (!isCampaign(data)) {
        setError('Arquivo JSON inválido para campanha.');
        return;
      }
      const imported = importCampaign(data as Campaign);
      navigate(`/campaigns/${imported.id}`);
      setError('');
    } catch {
      setError('Falha ao importar campanha.');
    }
  };

  const handleAgentImport = async (file: File) => {
    try {
      const data = await readJsonFile<unknown>(file);
      if (!isAgent(data)) {
        setError('Arquivo JSON inválido para agente.');
        return;
      }
      const importedAgent = data as Agent;
      update({ players: [...campaign.players, importedAgent.id] });
      setError('');
    } catch {
      setError('Falha ao importar agente.');
    }
  };

  const copyCampaignJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(campaign, null, 2));
      setShareMessage('JSON da campanha copiado! Compartilhe com seus jogadores.');
      window.setTimeout(() => setShareMessage(''), 3000);
    } catch {
      setShareMessage('Falha ao copiar. Use o botão Exportar JSON para compartilhar manualmente.');
      window.setTimeout(() => setShareMessage(''), 5000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-6 shadow-panel sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-accent">Editor de campanha</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">{campaign.name || 'Campanha sem nome'}</h1>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <button onClick={() => exportCampaign(campaign)} className="rounded-2xl bg-white/5 px-5 py-3 text-sm text-neutral-200 transition hover:bg-white/10">Exportar JSON</button>
          <button type="button" onClick={copyCampaignJson} className="rounded-2xl bg-white/5 px-5 py-3 text-sm text-neutral-200 transition hover:bg-white/10">Copiar JSON</button>
          <label className="cursor-pointer rounded-2xl border border-border bg-white/5 px-5 py-3 text-sm text-neutral-200 transition hover:bg-white/10">
            Importar campanha
            <input type="file" accept="application/json" className="hidden" onChange={(event) => event.target.files?.[0] && handleImportCampaign(event.target.files[0])} />
          </label>
          <button onClick={() => { deleteCampaign(campaign.id); navigate('/campaigns'); }} className="rounded-2xl bg-danger px-5 py-3 text-sm font-semibold text-white transition hover:bg-danger/90">Excluir</button>
          <button
            type="button"
            onClick={() => {
              const duplicated = duplicateCampaign(campaign.id);
              if (duplicated) navigate(`/campaigns/${duplicated.id}`);
            }}
            className="rounded-2xl bg-white/5 px-5 py-3 text-sm text-neutral-200 transition hover:bg-white/10"
          >
            Duplicar
          </button>
        </div>
      </div>

      {error ? <div className="rounded-3xl border border-danger bg-[#500a0a] p-4 text-sm text-white">{error}</div> : null}
      {shareMessage ? <div className="rounded-3xl border border-accent bg-[#0f172a] p-4 text-sm text-white">{shareMessage}</div> : null}

      <div className="rounded-3xl border border-border bg-[#11121a] p-6 shadow-panel">
        <div className="mb-6">
          <label className="block text-sm text-neutral-400">Nome da campanha</label>
          <input
            value={campaign.name}
            onChange={(event) => update({ name: event.target.value })}
            className="mt-2 w-full rounded-3xl border border-border bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
          />
        </div>

        <Tabs
          tabs={[
            { id: 'players', label: 'Jogadores' },
            { id: 'notes', label: 'Anotações' },
            { id: 'monsters', label: 'Monstros' },
            { id: 'maps', label: 'Mapas' },
            { id: 'locations', label: 'Locais' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="mt-6">
          {activeTab === 'players' && (
            <div className="space-y-6">
              <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-sm text-neutral-400">Jogadores adicionados à campanha</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <label className="cursor-pointer rounded-2xl border border-border bg-white/5 px-4 py-2 text-sm text-neutral-200 transition hover:bg-white/10">
                    Importar agente
                    <input type="file" accept="application/json" className="hidden" onChange={(event) => event.target.files?.[0] && handleAgentImport(event.target.files[0])} />
                  </label>
                </div>
              </div>

              <div className="grid gap-4">
                {availableAgents.length > 0 && (
                  <div className="rounded-3xl border border-border bg-[#11121a] p-4">
                    <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Adicionar jogador existente</p>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <select
                        value={selectedAgentId}
                        onChange={(event) => setSelectedAgentId(event.target.value)}
                        className="w-full rounded-2xl border border-border bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
                      >
                        <option value="">Selecione um agente</option>
                        {availableAgents.map((agent) => (
                          <option key={agent.id} value={agent.id}>
                            {agent.name || 'Agente sem nome'}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        disabled={!selectedAgentId}
                        onClick={() => {
                          if (!selectedAgentId) return;
                          update({ players: [...campaign.players, selectedAgentId] });
                          setSelectedAgentId('');
                        }}
                        className="rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-white/10"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                )}

                {campaign.players.length === 0 ? (
                  <div className="rounded-3xl border border-border bg-[#0f172a] p-6 text-sm text-neutral-400">Nenhum jogador adicionado. Importe um agente ou utilize um agente existente.</div>
                ) : (
                  campaign.players.map((playerId) => {
                    const agent = agents.find((item) => item.id === playerId);
                    return (
                      <div key={playerId} className="grid gap-3 rounded-3xl border border-border bg-[#0f172a] p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-white">{agent?.name || 'Jogador importado'}</p>
                            <p className="text-xs text-neutral-400">{agent ? 'Agente local disponível' : 'Agente não encontrado no banco local'}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {agent ? (
                              <Link
                                to={`/agents/${agent.id}`}
                                className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent/90"
                              >
                                Abrir ficha
                              </Link>
                            ) : null}
                            <button
                              type="button"
                              onClick={() => update({ players: campaign.players.filter((value) => value !== playerId) })}
                              className="rounded-2xl bg-danger px-4 py-2 text-sm text-white"
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-6">
              <div className="grid gap-4 rounded-3xl border border-border bg-[#0f172a] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Categorias de notas</p>
                    <h2 className="mt-1 text-xl font-semibold text-white">Organizar anotações</h2>
                  </div>
                </div>
                <div className="grid gap-3">
                  {noteCategories.length === 0 ? (
                    <div className="rounded-3xl bg-white/5 p-4 text-sm text-neutral-400">Nenhuma categoria criada.</div>
                  ) : (
                    noteCategories.map((category) => (
                      <div key={category.id} className="grid gap-2 rounded-3xl border border-border bg-[#11121a] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-sm font-semibold text-white">{category.name}</h3>
                          <button
                            type="button"
                            onClick={() => update({ noteCategories: noteCategories.filter((item) => item.id !== category.id) })}
                            className="text-sm text-danger hover:text-red-300"
                          >
                            Excluir
                          </button>
                        </div>
                        <textarea
                          value={category.notes}
                          onChange={(event) =>
                            update({
                              noteCategories: noteCategories.map((item) =>
                                item.id === category.id ? { ...item, notes: event.target.value } : item
                              ),
                            })
                          }
                          placeholder="Conteúdo da categoria"
                          className="min-h-[120px] w-full rounded-3xl border border-border bg-[#0f172a] px-4 py-4 text-sm text-white outline-none transition focus:border-accent"
                        />
                      </div>
                    ))
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <input
                    value={newCategoryName}
                    onChange={(event) => setNewCategoryName(event.target.value)}
                    placeholder="Nome da nova categoria"
                    className="w-full rounded-2xl border border-border bg-[#11121a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newCategoryName.trim()) return;
                      update({
                        noteCategories: [
                          ...noteCategories,
                          { id: crypto.randomUUID(), name: newCategoryName.trim(), notes: '' },
                        ],
                      });
                      setNewCategoryName('');
                    }}
                    className="rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent/90"
                  >
                    Adicionar categoria
                  </button>
                </div>
                <label className="block text-sm text-neutral-400">
                  Notas gerais
                  <textarea
                    value={campaign.notes}
                    onChange={(event) => update({ notes: event.target.value })}
                    placeholder="Notas gerais da campanha"
                    className="mt-2 min-h-[160px] w-full rounded-3xl border border-border bg-[#0f172a] px-4 py-4 text-sm text-white outline-none transition focus:border-accent"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'monsters' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-neutral-400">Gerencie os monstros da campanha.</p>
                <button
                  type="button"
                  onClick={() => update({ monsters: [...campaign.monsters, createMonster()] })}
                  className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent/90"
                >
                  Criar monstro
                </button>
              </div>
              {campaign.monsters.length === 0 ? (
                <div className="rounded-3xl border border-border bg-[#0f172a] p-6 text-sm text-neutral-400">Nenhum monstro criado.</div>
              ) : (
                <div className="space-y-4">
                  {campaign.monsters.map((monster) => (
                    <MonsterEditor
                      key={monster.id}
                      monster={monster}
                      onChange={(updated) => update({ monsters: campaign.monsters.map((item) => (item.id === updated.id ? updated : item)) })}
                      onRemove={() => update({ monsters: campaign.monsters.filter((item) => item.id !== monster.id) })}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'maps' && (
            <MapUploader
              maps={campaign.maps}
              onAdd={(mapSrc) =>
                update({
                  maps: [
                    ...campaign.maps,
                    {
                      id: crypto.randomUUID(),
                      name: `Mapa ${campaign.maps.length + 1}`,
                      src: mapSrc,
                      playersMarked: false,
                    },
                  ],
                })
              }
              onRemove={(index) => update({ maps: campaign.maps.filter((_, idx) => idx !== index) })}
              onRename={(index, value) =>
                update({
                  maps: campaign.maps.map((map, idx) =>
                    idx === index ? { ...map, name: value } : map
                  ),
                })
              }
              onToggleMarkers={(mapId) =>
                update({
                  maps: campaign.maps.map((map) =>
                    map.id === mapId ? { ...map, playersMarked: !map.playersMarked } : map
                  ),
                })
              }
            />
          )}

          {activeTab === 'locations' && (
            <div className="grid gap-6 rounded-3xl border border-border bg-[#0f172a] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Locais</p>
                  <h2 className="mt-1 text-xl font-semibold text-white">Gerenciar pontos</h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!newLocationName.trim()) return;
                    update({
                      locations: [
                        ...locations,
                        {
                          id: crypto.randomUUID(),
                          name: newLocationName.trim(),
                          description: newLocationDescription.trim(),
                        },
                      ],
                    });
                    setNewLocationName('');
                    setNewLocationDescription('');
                  }}
                  className="rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent/90"
                >
                  Adicionar local
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
                <input
                  value={newLocationName}
                  onChange={(event) => setNewLocationName(event.target.value)}
                  placeholder="Nome do local"
                  className="w-full rounded-2xl border border-border bg-[#11121a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
                />
                <input
                  value={newLocationDescription}
                  onChange={(event) => setNewLocationDescription(event.target.value)}
                  placeholder="Descrição do local"
                  className="w-full rounded-2xl border border-border bg-[#11121a] px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
                />
              </div>

              <div className="grid gap-4">
                {locations.length === 0 ? (
                  <div className="rounded-3xl bg-white/5 p-4 text-sm text-neutral-400">Nenhum local adicionado.</div>
                ) : (
                  locations.map((location) => (
                    <div key={location.id} className="grid gap-3 rounded-3xl border border-border bg-[#11121a] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">{location.name}</p>
                          <p className="text-xs text-neutral-400">{location.description || 'Sem descrição'}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => update({ locations: locations.filter((item) => item.id !== location.id) })}
                          className="rounded-2xl bg-danger px-3 py-2 text-sm text-white"
                        >
                          Excluir
                        </button>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-neutral-300">Marcações de players</span>
                        <button
                          type="button"
                          onClick={() =>
                            update({
                              locations: locations.map((item) =>
                                item.id === location.id
                                  ? { ...item, playersMarked: !item.playersMarked }
                                  : item
                              ),
                            })
                          }
                          className="rounded-2xl bg-white/5 px-4 py-2 text-sm text-neutral-200 transition hover:bg-white/10"
                        >
                          {location.playersMarked ? 'Desativar marcação' : 'Marcar players'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
