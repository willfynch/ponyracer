import { Component, inject, signal } from '@angular/core';
import { RaceModel } from '../models/race.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, startWith, Subject, switchMap } from 'rxjs';
import { RaceService } from '../race.service';
import { PonyComponent } from '../pony/pony.component';
import { FromNowPipe } from '../from-now.pipe';
import { PonyModel } from '../models/pony.model';

@Component({
  selector: 'pr-bet',
  imports: [PonyComponent, FromNowPipe, RouterLink],
  templateUrl: './bet.component.html',
  styleUrl: './bet.component.css'
})
export class BetComponent {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  raceService = inject(RaceService);

  raceModel = signal<RaceModel | undefined>(undefined);
  raceId: number;
  betFailed = signal<boolean>(false);
  private refreshSubject = new Subject<void>();

  constructor() {
    const raceIdParam = this.activatedRoute.snapshot.paramMap.get('raceId');
    this.raceId = raceIdParam ? parseInt(raceIdParam, 10) : 0;

    this.refreshSubject
      .pipe(
        startWith(undefined),
        switchMap(() => this.raceService.get(this.raceId))
      )
      .subscribe({
        next: (res: RaceModel | undefined) => this.raceModel.set(res)
      });
  }

  betOnPony(pony: PonyModel) {
    let action: Observable<RaceModel | void>;

    if (this.raceModel()?.betPonyId && this.isPonySelected(pony)) {
      action = this.raceService.cancelBet(this.raceId);
    } else {
      action = this.raceService.bet(this.raceId, pony.id);
    }

    action.subscribe({
      next: () => this.refreshSubject.next(),
      error: () => this.betFailed.set(true)
    });
  }

  isPonySelected(pony: PonyModel): boolean {
    return pony.id === this.raceModel()?.betPonyId;
  }
}
