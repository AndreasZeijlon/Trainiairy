import { Component, Input, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';



export class Sport {
  constructor(public name: string) { }
}

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent implements OnInit {


  @Input() sportsoptions: string[];
  @Input() label: string;
  @Input() formControlName: string;


  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this.sportsoptions = this.sportsoptions;
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.sportsoptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

}





export class Sports {

}