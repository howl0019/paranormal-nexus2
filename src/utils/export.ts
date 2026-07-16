import { Agent } from '../types/Agent';
import { Campaign } from '../types/Campaign';

export function exportJson(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportAgent(agent: Agent): void {
  exportJson(agent, `agent-${agent.id}.json`);
}

export function exportCampaign(campaign: Campaign): void {
  exportJson(campaign, `campaign-${campaign.id}.json`);
}
