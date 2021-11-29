import { Component, Input, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { Workout } from '@app/_models/workout';
import { DateSelectArg, EventApi } from '@fullcalendar/angular';
import { INITIAL_EVENTS, createEventId } from "@app/calendar/calendar/event-utils";
import { CalendarService } from '@app/services/calendar.service';

import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators, FormBuilder } from '@angular/forms';

import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as moment from 'moment';



@Component({
  selector: 'app-workout-form',
  templateUrl: './workout-form.component.html',
  styleUrls: ['./workout-form.component.css']
})
export class WorkoutFormComponent implements OnInit{


  visible:boolean = true;
  selectInfo: DateSelectArg;
  public datestring:any = '';
  public edit:boolean = false;

  workoutForm: FormGroup;

  private dialogSub : any;

  constructor(
    private calendarService: CalendarService, 
    public dialog: MatDialog,

    ) { 


    }

  ngOnInit() {
    this.dialogSub = this.calendarService.callWorkoutDialog.subscribe(
      (data:object) => {
        this.openDialog(data);
      }
    );
  }

  ngOnDestroy() {
    this.dialogSub.unsubscribe();
  }

  openDialog(data: object) {
    let dateStr = data["startstr"]
    let eventInfo = data["eventinfo"]

    if(eventInfo){
      this.edit = true;
    } else {
      this.edit = false;
    }

    const dialogConfig = new MatDialogConfig();


    dialogConfig.autoFocus = false;

    dialogConfig.data = {
      datestring: dateStr,
      edit: this.edit,
      eventinfo: eventInfo

    }
    dialogConfig.width = '300px';

    const dialogRef = this.dialog.open(WorkoutFormDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
    })
  }




}

interface Level {
  value: string;
  hint: string;
}

@Component({
  selector: 'workout-form-dialog',
  templateUrl: 'workout-form-dialog.html',
  styleUrls: ['./workout-form-dialog.css']

})
export class WorkoutFormDialog implements OnInit {

  animalControl = new FormControl('', Validators.required);

  datestring: moment.Moment;
  edit: boolean;
  workoutForm: FormGroup;
  loading:Boolean = false;
  subscription: Subscription;
  eventInfo: EventApi;

  sportsoptions: string[] = [
    "Running",
    "Road biking",
    "Swimming",
    "Tennis",
    "Beachvolley",
    "Gym training",
    "Golf",
    "Walk",
    "Mountain biking",
    "Ice skating",
    "Cross-country skiing",
    "Alpine skiing"
  ];

  intensitylevels: Level[] = [
    {value: '1', hint: '50-60% of max heart rate'},
    {value: '2', hint: '60-70% of max heart rate'},
    {value: '3', hint: '70-80% of max heart rate'},
    {value: '4', hint: '80-90% of max heart rate'},
    {value: '5', hint: '90-100% of max heart rate'},

  ];

  label: string = "Sport";

  controlName: string = "sport";

  filteredOptions: Observable<string[]>;

  public selectedIntensity: any;

  constructor(
    private calendarService: CalendarService,
    private dialogRef: MatDialogRef<WorkoutFormDialog>,
    @Inject(MAT_DIALOG_DATA) data,
    private formBuilder: FormBuilder,
    
    ) {
      this.datestring = moment(data.datestring);
      this.edit = data.edit;
      if(this.edit) {
        this.eventInfo = data.eventinfo;
      }


      this.calendarService.callCloseDialog.subscribe( 
        next => {
          this.loading = false;
          this.dialogRef.close();
      })
    }
  
ngOnInit():void {

    this.workoutForm = this.formBuilder.group({
      sport: ['',Validators.required],
      duration: ['',Validators.required], 
      distance: ['', Validators.required],
      intensity: ['',Validators.required],
      description: ['',Validators.required]
    }, {
      validator: this.checkError('distance')
    });

    if(this.edit) {
      this.workoutForm.controls.sport.setValue(this.eventInfo.extendedProps.workoutInfo.sport)
      this.workoutForm.controls.duration.setValue(this.eventInfo.extendedProps.workoutInfo.duration) 
      this.workoutForm.controls.distance.setValue(this.eventInfo.extendedProps.workoutInfo.distance) 
      this.workoutForm.controls.intensity.setValue(this.intensitylevels[this.eventInfo.extendedProps.workoutInfo.intensity -1 ]) 
      this.selectedIntensity = this.eventInfo.extendedProps.workoutInfo.intensity;
      this.workoutForm.controls.description.setValue(this.eventInfo.extendedProps.workoutInfo.description) 

    } else {
      this.selectedIntensity = '';
    }

    this.sportsoptions = this.sportsoptions;
    this.filteredOptions = this.workoutForm.controls.sport.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );


  }

  checkError(distance: string) {
    return (formGroup: FormGroup) => {

      const control = formGroup.controls[distance];

      if (control.errors && !control.errors.noNumber) {
        // return if another validator has already found an error on the matchingControl
        return;
    }

      const value: string = String(control.value) || '';
      const regex = /^[0-9]*$/;
      const valid = value.match(regex);
      if(!valid) {
        control.setErrors({ noNumber: true });

      } else {
        control.setErrors(null);
      }
    }
  }



  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.sportsoptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit() {

    this.loading = true;

    let workout = this.workoutForm.value;

    workout.intensity = this.workoutForm.controls.intensity.value.value;
    workout.intensity = Number(workout.intensity)
    workout.distance = Number(workout.distance)

    if(this.edit){
      this.calendarService.callEditEvent.next({"workout": workout, "eventinfo": this.eventInfo} );
    }
    else {
      this.calendarService.callAddEvent.next(workout);
    }
  }


  get f() {
    return this.workoutForm.controls;
  }

  get getWorkoutForm() { return this.workoutForm; }

  get getSport() { return this.workoutForm.get('sport'); }

  get getDuration() { return this.workoutForm.get('duration'); }

  get getDescription() { return this.workoutForm.get('description'); }

  get getIntensity() { return this.workoutForm.get('intensity'); }

  get getDistance() { return this.workoutForm.get('distance'); }
}