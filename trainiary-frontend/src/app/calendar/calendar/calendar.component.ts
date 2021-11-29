import { Component, OnInit, ViewChild, ErrorHandler, Output, EventEmitter } from '@angular/core';
import { NgModule} from '@angular/core';

import { FullCalendarComponent, CalendarOptions, DateSelectArg, EventClickArg,  EventApi, EventAddArg, EventRemoveArg, EventChangeArg} from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/angular';


import { Workout } from '@app/_models/workout';
import { MyEvent } from '@app/_models/myevent';

import { Injectable, Input } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, elementAt, retry } from 'rxjs/operators';
import { CalendarService} from '@app/services/calendar.service'
import { INITIAL_EVENTS, createEventId } from "./event-utils";
import { BootstrapTheme } from '@fullcalendar/bootstrap';
import { AlertService } from '@app/services/alert.service';
import { environment } from '@env/environment';
import { AuthService } from '@app/services/auth.service';
import { User } from '@app/_models/user';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

@Injectable()
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent; // the #calendar in the template
  
  @Output() updateEventInfo = new EventEmitter<EventApi>();
  @Output() showEventInfo = new EventEmitter<boolean>();


  public cursorX : number;
  public cursorY : number;

  public user : User;

  public show:boolean = false;
  public dialogLoading:boolean = false;
  public buttonName:any = 'Show';

  calendarVisible = true;
  currentEvents: EventApi[] = [];
  selectInfo: DateSelectArg;
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      start: 'prev,next,today',
      center: 'title',
      end: 'dayGridMonth,timeGridWeek,listWeek'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    firstDay: 1,
    selectable: true,
    selectMirror: true,
    selectConstraint: {
      startTime: '00:00', 
      endTime: '24:00', 
      daysOfWeek: [0,1,2,3,4,5,6]
    },
    eventConstraint: {
      startTime: '00:00', 
      endTime: '24:00', 
      daysOfWeek: [0,1,2,3,4,5,6]
    },
    forceEventDuration: true,



    dayMaxEvents: true,
    weekNumbers: true,
    themeSystem: 'bootstrap',
    eventStartEditable: true,
    eventDurationEditable: false,


    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventChange: this.handleEventChange.bind(this),
    events: this.fetchEvents.bind(this), 
    eventAdd: this.handleEventAdd.bind(this),
    eventRemove: this.handleEventRemove.bind(this),

    slotLabelFormat: {
      week: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: false,
      omitZeroMinute: false,
      meridiem: false
    },
    
    eventTimeFormat: {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false,
      omitZeroMinute: false,
      meridiem: false
    },

    views: {
      week: {
        dayHeaderFormat: 'dd/MM',
      },
    }



  };

  private userSub : any;
  private addEventSub : any;
  private editEventSub : any;
  private deleteEventSub : any;


  constructor(
    private calendarService: CalendarService,
    private alertService: AlertService,
    private authService: AuthService
    ) { }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user
    }
      );

    this.addEventSub = this.calendarService.callAddEvent.subscribe(
      (data:Workout) => {
        this.addEventToCalendar(data);
      }
    );

    this.editEventSub = this.calendarService.callEditEvent.subscribe(
      (data:object) => {
        this.editEvent(data);
      }
    )

    this.deleteEventSub = this.calendarService.callDeleteEvent.subscribe(
      (data:EventApi) => {
        this.deleteEvent(data);
      }
    )
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.addEventSub.unsubscribe();
    this.editEventSub.unsubscribe();
    this.deleteEventSub.unsubscribe();


  }


  /*toggleVisible() {
    this.calendarVisible = !this.calendarVisible;
  }

  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends;
  }

  gotoPast() {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate('2000-01-01'); // call a method on the Calendar object
  }*/

  addEventToCalendar(workout: Workout){
    const title = workout.sport;
    const calendarApi = this.selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    let resizable:boolean = true;
    if(this.selectInfo.allDay) {
      resizable = false;
    }

    if (title) {
      calendarApi.addEvent({
        title,
        start: this.selectInfo.startStr,
        end: this.selectInfo.endStr,
        allDay: this.selectInfo.allDay,
        durationEditable: resizable,
        extendedProps: {
          id: '',
          workoutInfo: workout
        }
      }, true);
    }
  }

  editEvent(data:object) {
    const workout = data["workout"];
    const eventinfo = data["eventinfo"];

    if(JSON.stringify(eventinfo.extendedProps.workoutInfo) != JSON.stringify(workout) ) {
      eventinfo.setExtendedProp("workoutInfo", workout);
    } 
    else {
      this.alertService.info("No change detected. Event has not been changed.");
      this.calendarService.callCloseDialog.next();
    }
  }

  deleteEvent(event: EventApi) {
    event.remove();
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.selectInfo = selectInfo;
    this.calendarService.callWorkoutDialog.next( {"startstr": selectInfo.startStr} );
    
  }


  handleEventClick(clickInfo: EventClickArg) {

    const workoutInfo = clickInfo.event.extendedProps.workoutInfo;

    const myevent = new MyEvent(clickInfo.event.id, workoutInfo, clickInfo.event.start, clickInfo.event.end, clickInfo.event.allDay);

    


    this.updateEventInfo.emit(clickInfo.event);
    this.showEventInfo.emit(true);

  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  handleEventAdd(addInfo: EventAddArg) {
    const workout = addInfo.event.extendedProps.workoutInfo;
    const start = addInfo.event.start;
    const end = addInfo.event.end;
    const allday = addInfo.event.allDay;


    const myevent = new MyEvent('', workout, start, end, allday);


    this.alertService.clear();

    this.calendarService.postWorkout(myevent).subscribe(
      response => {
        this.alertService.success(response["message"]);

        this.calendarService.callCloseDialog.next();
        addInfo.event.setExtendedProp('id', response["id"]);

      },
      error => {
        addInfo.revert;
        this.alertService.error(error.error["message"]);
        this.calendarService.callCloseDialog.next();

      }
    );

  }

  handleEventChange(changeInfo: EventChangeArg) {
    const event = changeInfo.event;
    const newevent = new MyEvent(event.extendedProps.id, event.extendedProps.workoutInfo, event.start, event.end, event.allDay); 

    if(changeInfo.event.extendedProps.id == changeInfo.oldEvent.extendedProps.id) {
        this.alertService.clear();
  
        this.calendarService.editEvent(newevent).subscribe(
          response => {
            this.alertService.success(response["message"]);
    
            this.calendarService.callCloseDialog.next();

            this.calendarComponent.getApi().refetchEvents();
          },
          error => {
            changeInfo.revert();
            this.alertService.error(error.error["message"]);
            this.calendarService.callCloseDialog.next();
          }
        )      
    }




  }

  handleEventRemove(removeInfo: EventRemoveArg) {
    this.alertService.clear();
    this.calendarService.deleteEvent(removeInfo.event.extendedProps.id).subscribe(
      response => {
        this.alertService.success(response["message"]);
        this.showEventInfo.emit(false);


      },
      error => {
        removeInfo.revert();
        this.alertService.error(error.error["message"]);
        
      }

    )
  }


  mouseClicked(event: MouseEvent) {
    this.cursorX = event.clientX;
    this.cursorY = event.clientY;
  }


  fetchEvents(fetchInfo, successCallback, failureCallback) {
    this.calendarService.fetchEvents(fetchInfo.startStr, fetchInfo.endStr).subscribe(
      (response:any) => {
        const data = response["data"];
        const events = [];

        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          let resizable:boolean = true;
          if(element.allDay) {
            resizable = false;
          }
          events.push(
            {
              "title": element.workout.sport,
              "start": element.start,
              "end": element.end,
              "allDay": element.allDay,
              "durationEditable" : resizable,
              "extendedProps": {
                "id": element.id,
                "workoutInfo": element.workout
              }
            }
          ) 
        }
    

        successCallback(events);
      },
      error => {
        failureCallback(error);
        this.alertService.error(error.error["message"]);
      }
    );

  }
}
