import { Route } from '@angular/router';
import { RacesComponent } from './races/races.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

export const routes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'races', component: RacesComponent },
  { path: 'login', component: LoginComponent }
];
