import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RaceComponent } from '../race/race.component';
import { RaceService } from '../race.service';

@Component({
  selector: 'pr-races',
  imports: [RaceComponent],
  templateUrl: './races.component.html',
  styleUrl: './races.component.css'
})
export class RacesComponent {
  readonly races = toSignal(inject(RaceService).list());
}
