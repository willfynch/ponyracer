import { Component, inject, signal, OnDestroy } from '@angular/core';
import { RaceService } from '../race.service';
import { RaceModel } from '../models/race.model';
import { ActivatedRoute } from '@angular/router';
import { PonyWithPositionModel } from '../models/pony.model';
import { map, startWith, Subscription, switchMap } from 'rxjs';
import { PonyComponent } from '../pony/pony.component';

@Component({
  selector: 'pr-live',
  imports: [PonyComponent],
  templateUrl: './live.component.html',
  styleUrl: './live.component.css'
})
export class LiveComponent implements OnDestroy {
  raceService = inject(RaceService);
  activatedRoute = inject(ActivatedRoute);

  private subscription: Subscription;

  raceId: number;
  raceModel = signal<RaceModelWithPositions | undefined>(undefined);

  constructor() {
    const raceIdParam = this.activatedRoute.snapshot.paramMap.get('raceId');
    this.raceId = raceIdParam ? parseInt(raceIdParam, 10) : 0;

    this.subscription = this.raceService
      .get(this.raceId)
      .pipe(
        switchMap(race =>
          this.raceService.live(this.raceId).pipe(
            map(live => ({ ...race, status: live.status, poniesWithPosition: live.ponies })),
            startWith({ ...race, poniesWithPosition: [] })
          )
        )
      )
      .subscribe({
        next: res => {
          this.raceModel.set(res);
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

interface RaceModelWithPositions extends RaceModel {
  poniesWithPosition: Array<PonyWithPositionModel>;
}
