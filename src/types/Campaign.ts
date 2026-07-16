import { Monster } from './Monster';

export interface NoteCategory {
  id: string;
  name: string;
  notes: string;
}

export interface LocationEntry {
  id: string;
  name: string;
  description: string;
  playersMarked?: boolean;
}

export interface MapEntry {
  id: string;
  name: string;
  src: string;
  playersMarked?: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  notes: string;
  players: string[];
  monsters: Monster[];
  maps: MapEntry[];
  noteCategories?: NoteCategory[];
  locations?: LocationEntry[];
  createdAt: number;
  updatedAt: number;
}
