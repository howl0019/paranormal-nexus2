import { Agent } from '../types/Agent';
import { Campaign } from '../types/Campaign';

export async function readJsonFile<T>(file: File): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as T;
        resolve(parsed);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export function isAgent(value: any): value is Agent {
  return value && typeof value.id === 'string' && typeof value.name === 'string' && typeof value.hp === 'number';
}

export function isCampaign(value: any): value is Campaign {
  return value && typeof value.id === 'string' && typeof value.name === 'string' && typeof value.notes === 'string';
}
