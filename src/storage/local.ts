import { Agent } from '../types/Agent';
import { Campaign } from '../types/Campaign';

const AGENT_KEY = 'agents';
const CAMPAIGN_KEY = 'campaigns';

export const loadAgents = (): Agent[] => {
  return JSON.parse(localStorage.getItem(AGENT_KEY) || '[]') as Agent[];
};

export const saveAgents = (agents: Agent[]): void => {
  localStorage.setItem(AGENT_KEY, JSON.stringify(agents));
};

export const loadCampaigns = (): Campaign[] => {
  return JSON.parse(localStorage.getItem(CAMPAIGN_KEY) || '[]') as Campaign[];
};

export const saveCampaigns = (campaigns: Campaign[]): void => {
  localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(campaigns));
};
