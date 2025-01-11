import { Component, computed, input, output } from '@angular/core';
import { PonyModel } from '../models/pony.model';

@Component({
  selector: 'pr-pony',
  templateUrl: './pony.component.html',
  styleUrl: './pony.component.css'
})
export class PonyComponent {
  readonly ponyModel = input.required<PonyModel>();
  readonly ponyClicked = output<PonyModel>();
  readonly ponyImageUrl = computed(() => `images/pony-${this.ponyModel().color.toLowerCase()}${this.isRunning() ? '-running' : ''}.gif`);

  isRunning = input(false);

  clicked(): void {
    this.ponyClicked.emit(this.ponyModel());
  }
}
