import { Lab } from '../core/models';
export type LabAvailability = 'Available' | 'In Use' | 'Unavailable';
export function labAvailability(lab: Lab): LabAvailability {
  return !lab.active ? 'Unavailable' : lab.inUse ? 'In Use' : 'Available';
}
