import { Route } from '@angular/router';
import { RacesComponent } from './races/races.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BetComponent } from './bet/bet.component';
import { LiveComponent } from './live/live.component';

export const routes: Route[] = [
  { path: '', component: HomeComponent },
  {
    path: 'races',
    children: [
      { path: '', component: RacesComponent },
      { path: ':raceId', component: BetComponent },
      { path: ':raceId/live', component: LiveComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];
