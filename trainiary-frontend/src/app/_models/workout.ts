import { Time } from "@angular/common";

export class Workout {
    constructor(
      public sport?: string,
      public duration?: Time,
      public distance?: number,
      public intensity?: number,
      public description?: string
    ) {}
  }