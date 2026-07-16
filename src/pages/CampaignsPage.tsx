import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaigns } from '../hooks/useCampaigns';
import { CampaignCard } from '../components/CampaignCard';
import { exportCampaign } from '../utils/export';
import { readJsonFile, isCampaign } from '../utils/import';
import { Campaign } from '../types/Campaign';

export default function CampaignsPage() {
  const { campaigns, createCampaign, deleteCampaign, duplicateCampaign, importCampaign } = useCampaigns();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState('');

  const sortedCampaigns = useMemo(
    () => [...campaigns].sort((a, b) => b.updatedAt - a.updatedAt),
    [campaigns]
  );

  const handleCreate = () => {
    const campaign = createCampaign();
    navigate(`/campaigns/${campaign.id}`);
  };

  const handleImport = async (file: File) => {
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
      setError('Falha ao importar arquivo JSON.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-6 shadow-panel sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-accent">Campanhas</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Gerencie suas campanhas</h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button onClick={handleCreate} className="rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent/90">Criar campanha</button>
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
        {sortedCampaigns.length === 0 ? (
          <div className="rounded-3xl border border-border bg-[#11121a] p-8 text-center text-neutral-400">Nenhuma campanha criada ainda. Use o botão acima para começar.</div>
        ) : (
          sortedCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onDelete={() => deleteCampaign(campaign.id)}
              onDuplicate={() => {
                const duplicated = duplicateCampaign(campaign.id);
                if (duplicated) {
                  navigate(`/campaigns/${duplicated.id}`);
                }
              }}
              onExport={() => exportCampaign(campaign)}
            />
          ))
        )}
      </div>
    </div>
  );
}
