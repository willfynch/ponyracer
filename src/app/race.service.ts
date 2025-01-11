import { inject, Injectable } from '@angular/core';
import { interval, map, Observable, take } from 'rxjs';
import { LiveRaceModel, RaceModel } from './models/race.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class RaceService {
  http = inject(HttpClient);
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
    const positions = interval(1000);

    return positions.pipe(
      take(101),
      map(position => {
        return {
          ponies: [
            {
              id: 1,
              name: 'Superb Runner',
              color: 'BLUE',
              position: position
            },
            {
              id: 2,
              name: 'Awesome Fridge',
              color: 'GREEN',
              position: position
            },
            {
              id: 3,
              name: 'Great Bottle',
              color: 'ORANGE',
              position: position
            },
            {
              id: 4,
              name: 'Little Flower',
              color: 'YELLOW',
              position: position
            },
            {
              id: 5,
              name: 'Nice Rock',
              color: 'PURPLE',
              position: position
            }
          ],
          status: 'RUNNING'
        };
      })
    );
  }
}
