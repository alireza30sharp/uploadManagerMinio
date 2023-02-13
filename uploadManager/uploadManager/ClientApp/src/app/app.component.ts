import { Component } from '@angular/core';
import { CalendarDateConfig, CalendarOutput } from './partials/calendar/calendar-date.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  config: CalendarDateConfig = {
    showTime: true,
    type: 'full'
  }
  date: CalendarOutput = {
    day: 0,
    hour: 0,
    date: null, //'2022-11-29 09:16:03'
    faDate: null
  };


  fromDate: CalendarOutput = { day: 0, hour: 0, date: '2022-11-28 10:12:36' };
  toDate: CalendarOutput = { day: 0, hour: 0, date: '2022-11-28 10:12:36' };

  config2: CalendarDateConfig = {
    showTime: true,
    type: 'full'
  };
  title = 'app';
}
