import { useEffect, useState } from 'react';
import { Agent } from '../types/Agent';
import { loadAgents, saveAgents } from '../storage/local';

const defaultAgent: Agent = {
  id: crypto.randomUUID(),
  name: 'Novo Agente',
  image: '',
  description: '',
  origin: '',
  player: '',
  role: '',
  hp: 10,
  maxHp: 10,
  sanity: 10,
  maxSanity: 10,
  attributes: [],
  skills: [],
  sections: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>(() => loadAgents());

  useEffect(() => {
    saveAgents(agents);
  }, [agents]);

  const createAgent = (): Agent => {
    const newAgent: Agent = {
      ...defaultAgent,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const currentAgents = loadAgents();
    const updatedAgents = [newAgent, ...currentAgents];
    saveAgents(updatedAgents);
    setAgents(updatedAgents);
    console.log(localStorage.getItem('agents'));
    return newAgent;
  };

  const updateAgent = (id: string, changes: Partial<Agent>): void => {
    setAgents((current) =>
      current.map((agent) =>
        agent.id === id
          ? {
              ...agent,
              ...changes,
              updatedAt: Date.now(),
            }
          : agent
      )
    );
  };

  const deleteAgent = (id: string): void => {
    setAgents((current) => current.filter((agent) => agent.id !== id));
  };

  const duplicateAgent = (id: string): Agent | undefined => {
    const source = agents.find((agent) => agent.id === id);
    if (!source) return undefined;
    const duplicated: Agent = {
      ...source,
      id: crypto.randomUUID(),
      name: `${source.name} (Cópia)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      attributes: source.attributes.map((attribute) => ({ ...attribute, id: crypto.randomUUID() })),
      skills: source.skills.map((skill) => ({ ...skill, id: crypto.randomUUID() })),
      sections: source.sections.map((section) => ({
        ...section,
        id: crypto.randomUUID(),
        category: section.category ?? 'descricao',
      })),
    };
    setAgents((current) => [duplicated, ...current]);
    return duplicated;
  };

  const importAgent = (agent: Agent): Agent => {
    const imported: Agent = {
      ...agent,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      attributes: agent.attributes?.map((attribute) => ({ ...attribute, id: crypto.randomUUID() })) ?? [],
      skills: agent.skills?.map((skill) => ({ ...skill, id: crypto.randomUUID() })) ?? [],
      sections: agent.sections?.map((section) => ({
        ...section,
        id: crypto.randomUUID(),
        category: section.category ?? 'descricao',
      })) ?? [],
    };
    setAgents((current) => [imported, ...current]);
    return imported;
  };

  return {
    agents,
    createAgent,
    updateAgent,
    deleteAgent,
    duplicateAgent,
    importAgent,
  };
}
