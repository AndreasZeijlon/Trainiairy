import { Workout } from "./workout";

export class MyEvent {
    constructor(
        public id: string,
        public workout: Workout,
        public start?: Date,
        public end?: Date,
        public allday?: boolean
    ) {}
  }