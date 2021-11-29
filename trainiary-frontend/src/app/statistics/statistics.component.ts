import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DateRange, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogContainer } from '@angular/material/dialog';
import { AlertService } from '@app/services/alert.service';
import { AuthService } from '@app/services/auth.service';
import { CalendarService } from '@app/services/calendar.service';
import { Alert } from '@app/_models/alert';
import { MyEvent } from '@app/_models/myevent';
import { User } from '@app/_models/user';


import * as moment from 'moment';


interface MyDateRange {
  start: moment.Moment;  
  end: moment.Moment;  
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  public selectedUnit: string = "week";

  private user : User;
  private userSub : any;

  private dataSet: object;

  public dateRange: MyDateRange;

  public selectedDataType: string;

  public shownStats = {
    workouts: 0,
    distance: 0,
    time: 0,
    intensity: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    },
  }

  public averageStats = {
    day: {
      workouts: 0,
      distance: 0,
      time: 0,
    },
    week: {
      workouts: 0,
      distance: 0,
      time: 0,
    },
    month: {
      workouts: 0,
      distance: 0,
      time: 0,
    },
    year: {
      workouts: 0,
      distance: 0,
      time: 0,
    },
    intensity: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    },
  }



  public statisticForm : FormGroup;
  public loading: boolean;

  public chartType: string = 'line';

  public chartDatasets: Array<any> = [
  
    { data: [], 
      label: 'My First dataset',
    },

  ];

  public chartLabels: Array<any> = ['2020-01-01', '2020-01-02', '2020-01-04', '2020-01-05', '2020-01-06', '2020-01-07',];

  public chartColors: Array<any> = [
    {
      backgroundColor: 'rgba(105, 0, 132, .2)',
      borderColor: 'rgba(200, 99, 132, .7)',
      borderWidth: 2,
    },
    {
      backgroundColor: 'rgba(0, 137, 132, .2)',
      borderColor: 'rgba(0, 10, 130, .7)',
      borderWidth: 2,

    }
  ];

  public chartOptions: any = {
    title: {
      display: false,
      text: "Mychart",

    },
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: true,
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          let label = data.datasets[0].label;
          let yValue = "0";
          switch (label) {
            case "Workouts":
              yValue = tooltipItem.yLabel
              break;
            case "Distance":

              yValue = tooltipItem.yLabel + " km";

              break;
            case "Time":
              yValue = tooltipItem.yLabel + " h";
              break;
          
            default:
              break;
          }
          
          return label + ": " + yValue;
        }
      }
    },
    scales: {
      xAxes: [
        {
          type: "category",
          ticks: {
            source: 'auto',
            autoSkip: true,
            maxTicksLimit: 40,

            callback: function(value) { 
              let dateformat = "YYYY-DD-MM";

              let year = /..../;
              let month = /....-../;
              let weekday = /....-..-../;

              if(weekday.test(value)) {
                //week or day
                dateformat = "D/M";
              } else if (month.test(value)) {
                //month
                dateformat = "MMM YYYY"
              } else if (year.test(value)){
                //year
                dateformat = "YYYY";
              } else {
              }

              return moment(value).format(dateformat); 
          },
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  };
  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private calendarService: CalendarService,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
    })

    this.dateRange = {
      start: moment().subtract(3, "months"),
      end: moment()
    }


    this.statisticForm = this.formBuilder.group({
      startdate: [this.dateRange.start.toDate()],
      enddate: [this.dateRange.end.toDate()], 
      unit: ['week'],
      datatype: ['workouts'],
    });

    this.selectedUnit = this.statisticForm.controls.unit.value;
    this.selectedDataType = this.statisticForm.controls.datatype.value;



    this.onDateChange()


  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }


  calcAverageStats(data:Array<MyEvent>, dateRange: MyDateRange) {
    const start = dateRange.start;
    const end = dateRange.end;

    const days = end.diff(start, 'days', true);
    const weeks = end.diff(start, 'week', true);
    const months = end.diff(start, 'months', true);
    const years = end.diff(start, 'years', true);


    const total_workouts = data.length;
    var total_distance = 0;
    var total_time = 0;
    var intensitylevels = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    }
    

    for (let index = 0; index < data.length; index++) {
      const event = data[index];

      total_distance += event.workout.distance;

      let time = moment(event.workout.duration, 'HH:mm:ss')
      total_time += time.minute() + time.hour()*60;
      intensitylevels[event.workout.intensity] += 1
    }

    this.averageStats.day.workouts= Math.round(10*total_workouts/days) / 10;
    this.averageStats.week.workouts = Math.round(10*total_workouts/weeks) / 10;
    this.averageStats.month.workouts = Math.round(10*total_workouts/months) / 10;
    this.averageStats.year.workouts = Math.round(10*total_workouts/years) / 10;

    this.averageStats.day.distance = Math.round(10 * total_distance/days) / 10;
    this.averageStats.week.distance = Math.round(10 * total_distance/weeks) / 10;
    this.averageStats.month.distance = Math.round(10 * total_distance/months) / 10;
    this.averageStats.year.distance = Math.round(10 * total_distance/years) / 10;

    this.averageStats.day.time = Math.round(10*total_time/60/days) / 10;
    this.averageStats.week.time = Math.round(10*total_time/60/weeks) / 10;
    this.averageStats.month.time =  Math.round(10*total_time/60/months) / 10;
    this.averageStats.year.time = Math.round(10*total_time/60/years) / 10;

    this.averageStats.intensity[1] = Math.round((intensitylevels[1]/total_workouts)*100)
    this.averageStats.intensity[2] = Math.round((intensitylevels[2]/total_workouts)*100)
    this.averageStats.intensity[3] = Math.round((intensitylevels[3]/total_workouts)*100)
    this.averageStats.intensity[4] = Math.round((intensitylevels[4]/total_workouts)*100)
    this.averageStats.intensity[5] = Math.round((intensitylevels[5]/total_workouts)*100)

  }



  buildDataSet(data:Array<any>, dateRange: MyDateRange) {
    var dataSet = {}

    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      let intenselevels = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      }
      intenselevels[element.workout.intensity] = 1;
      
      const date = moment(element.start);
      const year = date.format("YYYY");
      const month = date.format("YYYY-MM"); //01-12
      const day = date.format("YYYY-MM-DD"); //1-31
      const week = date.startOf('isoWeek').format("YYYY-MM-DD"); //1-52


      let time = moment(element.workout.duration, 'HH:mm:ss')
      let hours = Math.round( 10* ( (time.minute() + time.hour()*60) /60) ) / 10 ;

      if(dataSet[year]) {
        dataSet[year].workouts += 1;
        dataSet[year].distance += element.workout.distance;
        dataSet[year].time += hours;
        dataSet[year].intensity[element.workout.intensity] += 1;    
        if(dataSet[year].months[month]) {
          dataSet[year].months[month].workouts += 1;
          dataSet[year].months[month].distance += element.workout.distance;
          dataSet[year].months[month].time += hours;
          dataSet[year].months[month].intensity[element.workout.intensity] += 1;   
          if(dataSet[year].months[month].weeks[week]) {
            dataSet[year].months[month].weeks[week].workouts += 1;
            dataSet[year].months[month].weeks[week].distance += element.workout.distance;
            dataSet[year].months[month].weeks[week].time += hours;
            dataSet[year].months[month].weeks[week].intensity[element.workout.intensity] += 1;
            if(dataSet[year].months[month].weeks[week].days[day]) {
              dataSet[year].months[month].weeks[week].days[day].workouts += 1;
              dataSet[year].months[month].weeks[week].days[day].distance += element.workout.distance;
              dataSet[year].months[month].weeks[week].days[day].time += hours;
              dataSet[year].months[month].weeks[week].days[day].intensity[element.workout.intensity] += 1;
            } else {
              dataSet[year].months[month].weeks[week].days[day] = {
                workouts: 1,
                distance: element.workout.distance,
                time: hours,
                intensity:  intenselevels,
              };          
            }
          } else{
            dataSet[year].months[month].weeks[week] = {
              workouts: 1,
              distance: element.workout.distance,
              time: hours,
              intensity:  intenselevels,
              days: {}
            };
            dataSet[year].months[month].weeks[week].days[day] = {
              workouts: 1,
              distance: element.workout.distance,
              time: hours,
              intensity:  intenselevels,
            };          
          }
        } else {
          dataSet[year].months[month] = {
            workouts: 1,
            distance: element.workout.distance,
            time: hours,
            intensity:  intenselevels,
            weeks: {}
          };
          dataSet[year].months[month].weeks[week] = {
            workouts: 1,
            distance: element.workout.distance,
            time: hours,
            intensity:  intenselevels,
            days: {}
          };
          dataSet[year].months[month].weeks[week].days[day] = {
            workouts: 1,
            distance: element.workout.distance,
            time: hours,
            intensity:  intenselevels,
          };        
        }
  
      } else {
        dataSet[year] = {
          workouts: 1,
          distance: element.workout.distance,
          time: hours,
          intensity: intenselevels,
          months: {}
        };
        dataSet[year].months[month] = {
          workouts: 1,
          distance: element.workout.distance,
          time: hours,
          intensity: intenselevels,
          weeks: {}
        };
        dataSet[year].months[month].weeks[week] = {
          workouts: 1,
          distance: element.workout.distance,
          time: hours,
          intensity: intenselevels,
          days: {}
        };
        dataSet[year].months[month].weeks[week].days[day] = {
          workouts: 1,
          distance: element.workout.distance,
          time: hours,
          intensity: intenselevels,
        };
      }

    }



    this.dataSet = dataSet;


  }

  //dates need to be sorted in iso format
  addMissingDates(dates:Array<any>, unit:string){

    for (let index = 0; index+1 < dates.length; index++) {
      var date1 = moment(dates[index])
      var date2 = moment(dates[index+1])

      switch (unit) {
        case "day":
          if(!date1.add(1, "days").isSame(date2, "day")) {
            //add the label
            dates.splice(index + 1, 0, date1.format('YYYY-MM-DD'));
          }      
          break;
        case "week":
          if(!date1.add(7, "days").isSame(date2, "day")) {
            //add the label
            dates.splice(index + 1, 0, date1.format('YYYY-MM-DD'));
          }      
          break;
        case "month":
          if(!date1.add(1, "months").isSame(date2, "month")) {
            //add the label
            dates.splice(index + 1, 0, date1.format('YYYY-MM'));
          }      
          break;

        case "year":
          if(!date1.add(1, "years").isSame(date2, "year")) {
            //add the label
            dates.splice(index + 1, 0, date1.format('YYYY'));
          }      
          break;
      
        default:
          break;
      }
      

    }
    return dates;
  }

  addStartEndDates(chartLabels: Array<any>, start:moment.Moment, end:moment.Moment, format: string) {


    if(!chartLabels.includes(start.format(format))){
      chartLabels.push(start.format(format));

    }
    if(!chartLabels.includes(end.format(format))){
      chartLabels.push(end.format(format));
    }
    return chartLabels;
  }

  newUpdateChart(unit:string, dataType: string) {
    var start = this.dateRange.start;
    var end = this.dateRange.end;

    var chartLabels = [];
    var chartDataset = [];

    let years = Object.keys(this.dataSet);

    switch (unit) {
      case "day":
        for (let i = 0; i < years.length; i++) {
          let months = Object.keys(this.dataSet[years[i]].months);
          for (let j = 0; j < months.length; j++) {
            let weeks = Object.keys(this.dataSet[years[i]].months[months[j]].weeks);
            for (let k = 0; k < weeks.length; k++) {
              let days = Object.keys(this.dataSet[years[i]].months[months[j]].weeks[weeks[k]].days)

              chartLabels = chartLabels.concat(days);
            }
          }
        }

        chartLabels = this.addStartEndDates(chartLabels, start, end, "YYYY-MM-DD");
        chartLabels.sort();
        chartLabels = this.addMissingDates(chartLabels, unit);

        for (let l = 0; l < chartLabels.length; l++) {
          const date = moment(chartLabels[l], "YYYY-MM-DD");
          let day = date.format("YYYY-MM-DD");
          let month = date.format("YYYY-MM");
          let year = date.format("YYYY");
          let week = date.startOf("isoWeek").format("YYYY-MM-DD");


          try {
            chartDataset.push(this.dataSet[year].months[month].weeks[week].days[day][this.selectedDataType]);
          } catch (error) {
            chartDataset.push(0)
          }
        }
        break;

      case "week":
        for (let i = 0; i < years.length; i++) {
          let months = Object.keys(this.dataSet[years[i]].months);
          for (let j = 0; j < months.length; j++) {
            let weeks = Object.keys(this.dataSet[years[i]].months[months[j]].weeks);

            chartLabels = chartLabels.concat(weeks);
          }
        }

        chartLabels = this.addStartEndDates(chartLabels, start.startOf("isoWeek"), end.add(1, "week").startOf("isoWeek"), "YYYY-MM-DD");
        chartLabels.sort();
        chartLabels = this.addMissingDates(chartLabels, unit);

        for (let k = 0; k < chartLabels.length; k++) {
          const date = moment(chartLabels[k], "YYYY-MM-DD");
          let week = date.format("YYYY-MM-DD");
          let month = date.format("YYYY-MM");
          let year = date.format("YYYY");

          let startOfWeekMonth = date.startOf("isoWeek").format("YYYY-MM");
          let endOfWeekMonth = date.endOf("isoWeek").format("YYYY-MM");
          let startOfWeekYear = date.startOf("isoWeek").format("YYYY");
          let endOfWeekYear = date.endOf("isoWeek").format("YYYY");


          if(startOfWeekMonth != endOfWeekMonth) {

            let data = 0;
            try {
              data += this.dataSet[startOfWeekYear].months[startOfWeekMonth].weeks[week][this.selectedDataType]
            }
            catch {

            }

            try {
              data += this.dataSet[endOfWeekYear].months[endOfWeekMonth].weeks[week][this.selectedDataType]
            }
            catch {
              
            }
            chartDataset.push(data);

          } else {
            try {
              chartDataset.push(this.dataSet[year].months[month].weeks[week][this.selectedDataType]);
              
            } catch (error) {
              chartDataset.push(0);
              
            }

          }


        }

        break;

      case "month":



        for (let i = 0; i < years.length; i++) {
          let months = Object.keys(this.dataSet[years[i]].months);
          chartLabels = chartLabels.concat(months);
        }

        chartLabels = this.addStartEndDates(chartLabels, start, end, "YYYY-MM");
        chartLabels.sort();
        chartLabels = this.addMissingDates(chartLabels, unit);

        for (let j = 0; j < chartLabels.length; j++) {
          const date = moment(chartLabels[j], "YYYY-MM");
          let month = date.format("YYYY-MM");
          let year = date.format("YYYY");
          try {
            chartDataset.push(this.dataSet[year].months[month][this.selectedDataType]);
          } catch (error) {
            chartDataset.push(0);
          }

        }

        break;

      case "year":

        chartLabels = chartLabels.concat(years);
        chartLabels = this.addStartEndDates(chartLabels, start, end, "YYYY");
        chartLabels.sort();
        chartLabels = this.addMissingDates(chartLabels, unit);

        for (let i = 0; i < chartLabels.length; i++) {
          const year = chartLabels[i];

          try {
            chartDataset.push(this.dataSet[year][this.selectedDataType]);
          } catch (error) {
            chartDataset.push(0);
            
          }
        }
        break;
    
      default:
        break;
    }






    this.chartLabels = chartLabels;
    this.chartDatasets[0] =       {
      data: chartDataset,
      label: this.selectedDataType.charAt(0).toUpperCase() + this.selectedDataType.slice(1),
    }
  }

  onDateChange(event?: MatDatepickerInputEvent<Date>) {
    const form = this.statisticForm.value;

      if (form.startdate && form.enddate) {
        this.calendarService.fetchEvents(form.startdate.toISOString(), form.enddate.toISOString()).subscribe(
          (response) => {
            const dateRange:MyDateRange = {
              start: moment(form.startdate),
              end: moment(form.enddate)
            }

            this.dateRange = dateRange;

            this.buildDataSet(response["data"], dateRange);
            this.calcAverageStats(response["data"], dateRange);
            this.shownStats = this.averageStats[this.selectedUnit]
            this.shownStats.intensity = this.averageStats.intensity;

            this.newUpdateChart(this.selectedUnit, this.selectedDataType);

          },
          error => {
            this.alertService.error(error.error["message"]);
          }
        )
    } 
  }

  onDataTypeChange(event:any) {
    this.selectedDataType = event.value;
    this.newUpdateChart(this.selectedUnit, this.selectedDataType);
  }

  onUnitChange(event: any){
    this.selectedUnit = event.value;
    this.shownStats = this.averageStats[this.selectedUnit]
    this.shownStats.intensity = this.averageStats.intensity;
    this.newUpdateChart(this.selectedUnit, this.selectedDataType)
  }


  get getStatisticForm() {
    return this.statisticForm;
  }


}

