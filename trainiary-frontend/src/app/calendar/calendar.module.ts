import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';


import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import luxonPlugin from '@fullcalendar/luxon';


import { CalendarComponent } from './calendar/calendar.component'
import { WorkoutFormComponent, WorkoutFormDialog } from './workout-form/workout-form.component';
import { EventInfoComponent } from './event-info/event-info.component';
import { CalendarRootComponent } from './calendar-root.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 


import { MatSlideToggleModule } from '@angular/material/slide-toggle'

import { MatSelectModule } from '@angular/material/select'







FullCalendarModule.registerPlugins([ // register FullCalendar plugins
    luxonPlugin,
    dayGridPlugin,
    interactionPlugin,
    timeGridPlugin,
    listPlugin,
  ]);

@NgModule({
    imports: [
        CommonModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatDialogModule,
        ReactiveFormsModule,
        FormsModule,
        FullCalendarModule,
        MatAutocompleteModule,
        MatSlideToggleModule,
        MatSelectModule

    ],
    declarations: [
        CalendarComponent,
        WorkoutFormComponent,
        EventInfoComponent,
        CalendarRootComponent,
        WorkoutFormDialog,
        AutocompleteComponent,
        
    ],
    providers: []
})
export class CalendarModule { }