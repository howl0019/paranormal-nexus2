import { useEffect, useState } from 'react';
import { Campaign } from '../types/Campaign';
import { loadCampaigns, saveCampaigns } from '../storage/local';

const defaultCampaign: Campaign = {
  id: crypto.randomUUID(),
  name: 'Nova Campanha',
  notes: '',
  players: [],
  monsters: [],
  maps: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => loadCampaigns());

  useEffect(() => {
    saveCampaigns(campaigns);
  }, [campaigns]);

  const createCampaign = (): Campaign => {
    const newCampaign: Campaign = {
      ...defaultCampaign,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const currentCampaigns = loadCampaigns();
    const updatedCampaigns = [newCampaign, ...currentCampaigns];
    saveCampaigns(updatedCampaigns);
    setCampaigns(updatedCampaigns);
    console.log(localStorage.getItem('campaigns'));
    return newCampaign;
  };

  const updateCampaign = (id: string, changes: Partial<Campaign>): void => {
    setCampaigns((current) =>
      current.map((campaign) =>
        campaign.id === id
          ? {
              ...campaign,
              ...changes,
              updatedAt: Date.now(),
            }
          : campaign
      )
    );
  };

  const deleteCampaign = (id: string): void => {
    setCampaigns((current) => current.filter((campaign) => campaign.id !== id));
  };

  const duplicateCampaign = (id: string): Campaign | undefined => {
    const source = campaigns.find((campaign) => campaign.id === id);
    if (!source) return undefined;
    const duplicated: Campaign = {
      ...source,
      id: crypto.randomUUID(),
      name: `${source.name} (Cópia)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      monsters: source.monsters.map((monster) => ({ ...monster, id: crypto.randomUUID() })),
      maps: [...source.maps],
      players: [...source.players],
    };
    setCampaigns((current) => [duplicated, ...current]);
    return duplicated;
  };

  const importCampaign = (campaign: Campaign): Campaign => {
    const imported: Campaign = {
      ...campaign,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      monsters: campaign.monsters.map((monster) => ({ ...monster, id: crypto.randomUUID() })),
      maps: [...campaign.maps],
      players: [...campaign.players],
    };
    setCampaigns((current) => [imported, ...current]);
    return imported;
  };

  return {
    campaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    duplicateCampaign,
    importCampaign,
  };
}
