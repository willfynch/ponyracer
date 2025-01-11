import { PonyModel, PonyWithPositionModel } from './pony.model';

export interface RaceModel {
  id: number;
  name: string;
  ponies: Array<PonyModel>;
  startInstant: string;
  betPonyId?: number;
  status?: Status;
}

export interface LiveRaceModel {
  ponies: PonyWithPositionModel[];
  status: Status;
}

type Status = 'PENDING' | 'RUNNING' | 'FINISHED';
