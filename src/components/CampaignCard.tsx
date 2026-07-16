import { Campaign } from '../types/Campaign';
import { Link } from 'react-router-dom';

interface CampaignCardProps {
  campaign: Campaign;
  onDelete: () => void;
  onDuplicate: () => void;
  onExport: () => void;
}

export function CampaignCard({ campaign, onDelete, onDuplicate, onExport }: CampaignCardProps) {
  return (
    <div className="rounded-3xl border border-border bg-[#11121a] p-5 shadow-panel">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{campaign.name || 'Campanha sem nome'}</h2>
          <p className="mt-2 text-sm text-neutral-400">{campaign.notes || 'Sem notas ainda.'}</p>
        </div>
        <Link to={`/campaigns/${campaign.id}`} className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-white">Abrir</Link>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-sm text-neutral-300">
        <div className="rounded-2xl bg-white/5 p-3">
          <div className="font-semibold text-white">Jogadores</div>
          <div>{campaign.players.length}</div>
        </div>
        <div className="rounded-2xl bg-white/5 p-3">
          <div className="font-semibold text-white">Monstros</div>
          <div>{campaign.monsters.length}</div>
        </div>
        <div className="rounded-2xl bg-white/5 p-3">
          <div className="font-semibold text-white">Mapas</div>
          <div>{campaign.maps.length}</div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={onDuplicate} className="rounded-2xl bg-white/5 px-4 py-2 text-sm text-neutral-200 transition hover:bg-white/10">Duplicar</button>
        <button type="button" onClick={onExport} className="rounded-2xl bg-white/5 px-4 py-2 text-sm text-neutral-200 transition hover:bg-white/10">Exportar</button>
        <button type="button" onClick={onDelete} className="rounded-2xl bg-danger px-4 py-2 text-sm font-semibold text-white transition hover:bg-danger/90">Excluir</button>
      </div>
    </div>
  );
}
