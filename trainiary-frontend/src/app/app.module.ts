import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';




import 'hammerjs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select'; 




import {MatGridListModule} from '@angular/material/grid-list'; 


import {MatDatepickerModule} from '@angular/material/datepicker'; 



import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from '@app/calendar/calendar.module'
import { LoginpageModule } from '@app/loginPage/loginpage.module'



import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AlertComponent } from './alert/alert.component';

import { JwtInterceptor } from '@app/httpInterceptor/jwt-interceptor';
import { ErrorInterceptor } from '@app/httpInterceptor/error-interceptor';


// For MDB Angular Free
import { /*MDBBootstrapModule,*/ WavesModule, ChartsModule, CardsModule, ButtonsModule } from 'angular-bootstrap-md';
import { MatNativeDateModule } from '@angular/material/core';


import {MatListModule} from '@angular/material/list'; 




@NgModule({
  declarations: [
    AppComponent,
    StatisticsComponent,
    ProfileComponent,
    SettingsComponent,
    AlertComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CalendarModule,
    LoginpageModule,
    MatIconModule,
    //MDBBootstrapModule.forRoot(),
    WavesModule.forRoot(),
    ChartsModule,
    CardsModule,
    ButtonsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatGridListModule,
    MatListModule,

  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
