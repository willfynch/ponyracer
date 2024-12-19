import { Component, input } from '@angular/core';
import { RaceModel } from '../models/race.model';
import { PonyComponent } from '../pony/pony.component';
import { FromNowPipe } from '../from-now.pipe';

@Component({
  selector: 'pr-race',
  imports: [PonyComponent, FromNowPipe],
  templateUrl: './race.component.html',
  styleUrl: './race.component.css'
})
export class RaceComponent {
  readonly raceModel = input.required<RaceModel>();
}
