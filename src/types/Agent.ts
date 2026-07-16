export interface Attribute {
  id: string;
  name: string;
  value: number;
}

export interface Skill {
  id: string;
  name: string;
  value: number;
  notes: string;
}

export interface Section {
  id: string;
  name: string;
  content: string;
  category?: string;
}

export interface Agent {
  id: string;
  name: string;
  image?: string;
  description?: string;
  origin?: string;
  player?: string;
  role?: string;
  hp: number;
  maxHp: number;
  sanity: number;
  maxSanity: number;
  attributes: Attribute[];
  skills: Skill[];
  sections: Section[];
  createdAt: number;
  updatedAt: number;
}
