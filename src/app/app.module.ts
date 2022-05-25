import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {PopoverModule} from "ngx-smart-popover";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { environment } from 'src/environments/environment';

/* FIREBASE */
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';
@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    /* Inicializar firebase en la App */
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    PagesModule,
    AuthModule,
    PopoverModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
