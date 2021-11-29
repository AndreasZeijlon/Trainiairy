import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParameterCodec, HttpParams } from '@angular/common/http';
import { Workout } from '@app/_models/workout';
import { environment } from '@env/environment';
import { DateSelectArg } from '@fullcalendar/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { MyEvent } from '@app/_models/myevent';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private http: HttpClient) { }

  callWorkoutDialog = new Subject();
  callAddEvent = new Subject();
  callCloseDialog = new Subject();
  callDeleteEvent = new Subject();
  callEditEvent = new Subject();


  postWorkout(event_object: MyEvent) {
    return this.http.post(`${environment.API_url}/postworkout`, event_object);
  }

  deleteEvent(id: string){
    return this.http.delete(`${environment.API_url}/deleteevent`, {
      params: new HttpParams().set('id', id)
    })

  }

  fetchEvents(start, end) {
    
    return this.http.get(`${environment.API_url}/fetchevents?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`)

  }

  editEvent(event_object: MyEvent){
    return this.http.post(`${environment.API_url}/changeevent`, event_object)
  }

}

