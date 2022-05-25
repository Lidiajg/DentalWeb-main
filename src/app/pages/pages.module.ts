import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { AppRoutingModule } from '../app-routing.module';

import {PopoverModule} from "ngx-smart-popover";
import { FooterComponent } from '../shared/footer/footer.component';
import { ProfileComponent } from './profile/profile.component';
import { MedicsComponent } from './medics/medics.component';
import { TakeTurnsComponent } from './patient/take-turns/take-turns.component';
import { WatchMyTurnsComponent } from './patient/watch-my-turns/watch-my-turns.component';
import { ShowTurnsComponent } from './doctor/show-turns/show-turns.component';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    ProfileComponent,
    MedicsComponent,
    TakeTurnsComponent,
    WatchMyTurnsComponent,
    ShowTurnsComponent
  ],
  exports:[
    HomeComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    PopoverModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule
  ]
})
export class PagesModule { }
