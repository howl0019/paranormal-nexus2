import { Monster } from './Monster';

export interface Campaign {
  id: string;
  name: string;
  notes: string;
  players: string[];
  monsters: Monster[];
  maps: string[];
  createdAt: number;
  updatedAt: number;
}
