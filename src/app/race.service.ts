import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RaceModel } from './models/race.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class RaceService {
  http = inject(HttpClient);
  apiUrl = environment.baseUrl;

  list(): Observable<RaceModel[]> {
    return this.http.get<RaceModel[]>(this.apiUrl + '/api/races?status=PENDING');
  }
}
