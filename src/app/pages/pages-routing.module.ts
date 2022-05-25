import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckLoginGuard } from '../guards/check-login.guard';
import { IsPatientGuard } from '../guards/is-patient.guard';
import { isAdminGuard } from '../guards/is-admin.guard';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { AdminComponent } from './admin/admin.component';
import { ShowTurnsComponent } from './doctor/show-turns/show-turns.component';
import { HomeComponent } from './home/home.component';
import { MedicsComponent } from './medics/medics.component';
import { PagesComponent } from './pages.component';
import { TakeTurnsComponent } from './patient/take-turns/take-turns.component';
import { WatchMyTurnsComponent } from './patient/watch-my-turns/watch-my-turns.component';
import { ProfileComponent } from './profile/profile.component';
import { IsMedicGuard } from '../guards/is-medic.guard';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, },
      { path: 'doctors', component: MedicsComponent, },
      { path: 'admin', component: AdminComponent, canActivate: [CheckLoginGuard,isAdminGuard] },
      { path: 'user', component: ProfileComponent, canActivate: [CheckLoginGuard] },
      { path: 'takeTurns', component: TakeTurnsComponent, canActivate: [CheckLoginGuard,IsPatientGuard] },
      { path: 'watchTurns', component: WatchMyTurnsComponent, canActivate: [CheckLoginGuard,IsPatientGuard] },
      { path: 'showTurns', component: ShowTurnsComponent, canActivate: [CheckLoginGuard,IsMedicGuard] },
    ],
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule],
})
export class PagesRoutingModule {}
