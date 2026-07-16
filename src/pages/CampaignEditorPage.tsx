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

  const campaign = useMemo(() => campaigns.find((item) => item.id === id), [campaigns, id]);
  const [selectedAgentId, setSelectedAgentId] = useState('');

  const availableAgents = useMemo(
    () => agents.filter((agent) => !campaign?.players.includes(agent.id)),
    [agents, campaign?.players]
  );

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
    } catch (importError) {
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
    } catch (importError) {
      setError('Falha ao importar agente.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-6 shadow-panel sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-accent">Editor de campanha</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">{campaign.name || 'Campanha sem nome'}</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => exportCampaign(campaign)} className="rounded-2xl bg-white/5 px-5 py-3 text-sm text-neutral-200 transition hover:bg-white/10">Exportar JSON</button>
          <label className="cursor-pointer rounded-2xl border border-border bg-white/5 px-5 py-3 text-sm text-neutral-200 transition hover:bg-white/10">
            Importar campanha
            <input type="file" accept="application/json" className="hidden" onChange={(event) => event.target.files?.[0] && handleImportCampaign(event.target.files[0])} />
          </label>
          <button onClick={() => { deleteCampaign(campaign.id); navigate('/campaigns'); }} className="rounded-2xl bg-danger px-5 py-3 text-sm font-semibold text-white transition hover:bg-danger/90">Excluir</button>
          <button
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
            <div className="space-y-4">
              <textarea
                value={campaign.notes}
                onChange={(event) => update({ notes: event.target.value })}
                placeholder="Notas da campanha"
                className="min-h-[260px] w-full rounded-3xl border border-border bg-[#0f172a] px-4 py-4 text-sm text-white outline-none transition focus:border-accent"
              />
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
                      onChange={(updated) =>
                        update({ monsters: campaign.monsters.map((item) => (item.id === updated.id ? updated : item)) })
                      }
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
              onAdd={(map) => update({ maps: [...campaign.maps, map] })}
              onRemove={(index) => update({ maps: campaign.maps.filter((_, idx) => idx !== index) })}
              onRename={(index, value) => {
                const newMaps = [...campaign.maps];
                newMaps[index] = value;
                update({ maps: newMaps });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
