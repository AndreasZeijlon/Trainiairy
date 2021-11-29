import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { CalendarService } from '@app/services/calendar.service';
import { MyEvent } from '@app/_models/myevent';
import { Workout } from '@app/_models/workout';
import { EventApi } from '@fullcalendar/common';
import { Observable } from 'rxjs';


import * as moment from 'moment';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.css']
})
export class EventInfoComponent implements OnInit {
  visible:boolean = true;

  @Output() updateVisible = new EventEmitter<boolean>();
  @Input('eventInfo') eventInfo: EventApi;


  public eventDate: moment.Moment;
  

  constructor(private calendarService: CalendarService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    let eventInfo = changes.eventInfo.currentValue;
    this.eventDate = moment(eventInfo.start);
  }

  toggleVisible() {
    this.visible = !this.visible;
    this.updateVisible.emit(this.visible);
  }

  deleteEvent() {
    if(confirm("Delete event?")) {
      this.calendarService.callDeleteEvent.next(this.eventInfo)

    }
  }

  editEvent(){
    this.calendarService.callWorkoutDialog.next({"startstr": this.eventInfo.startStr, "eventinfo": this.eventInfo})
  }

}
