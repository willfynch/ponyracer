import { Route } from '@angular/router';
import { RacesComponent } from './races/races.component';
import { HomeComponent } from './home/home.component';

export const routes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'races', component: RacesComponent }
];
