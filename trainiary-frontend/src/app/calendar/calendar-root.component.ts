import { Component, OnInit } from '@angular/core';
import { CalendarService } from '@app/services/calendar.service'
import { MyEvent } from '@app/_models/myevent';
import { Workout } from '@app/_models/workout';
import { EventApi } from '@fullcalendar/common';

@Component({
    selector: 'app-calendar-root',
    templateUrl: './calendar-root.component.html',
    styleUrls: ['./calendar-root.component.css']
})
export class CalendarRootComponent implements OnInit {
    eventInfo : EventApi;
    eventInfoVisible : boolean;

    constructor(private calendarService : CalendarService) {

    }

    updateEventInfo(eventInfo: EventApi) { 
        this.eventInfo=eventInfo;
    }

    showEventInfo(show: boolean){
        this.eventInfoVisible = show;
    }


    ngOnInit(): void {
    }

}
