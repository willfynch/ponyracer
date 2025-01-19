import { inject, Injectable } from '@angular/core';
import { Observable, takeWhile } from 'rxjs';
import { LiveRaceModel, RaceModel } from './models/race.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { WsService } from './ws.service';

@Injectable({ providedIn: 'root' })
export class RaceService {
  http = inject(HttpClient);
  ws = inject(WsService);

  apiUrl = environment.baseUrl;

  list(): Observable<RaceModel[]> {
    return this.http.get<RaceModel[]>(this.apiUrl + '/api/races?status=PENDING');
  }

  bet(raceId: number, ponyId: number): Observable<void> {
    return this.http.post<void>(this.apiUrl + `/api/races/${raceId}/bets`, { ponyId: ponyId });
  }

  cancelBet(raceId: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + `/api/races/${raceId}/bets`);
  }

  get(id: number): Observable<RaceModel> {
    return this.http.get<RaceModel>(this.apiUrl + `/api/races/${id}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  live(raceId: number): Observable<LiveRaceModel> {
    return this.ws
      .connect<LiveRaceModel>(`/race/${raceId}`)
      .pipe(takeWhile((liveRace: LiveRaceModel) => liveRace.status !== 'FINISHED', true));
  }
}
