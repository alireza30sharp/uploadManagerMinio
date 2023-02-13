import { Component, OnInit, Input, EventEmitter, Output, HostListener, OnChanges, SimpleChanges } from "@angular/core";
import * as moment from "jalali-moment";
import { CalendarDateConfig, CalendarOutput } from "../calendar/calendar-date.model";


@Component({
  selector: "calendar-datepicker",
  templateUrl: "./calendar-datepicker.component.html",
  styleUrls: ["./calendar-datepicker.component.scss"],

})
export class CalendarDatepickerComponent {
  @Input() placeholder: string = '';
  @Input() config: CalendarDateConfig = { type: "full", showTime: true };
  @Input() model: CalendarOutput = { day: 0, hour: 0, date: '' };
  @Output() modelChange = new EventEmitter<CalendarOutput>();

  isOpen: boolean = false;

  constructor() { }

  @HostListener('window:click', ['$event'])
  onClick(e: any) {
    this.isOpen = false;
  }

  clickInput(event: any): void {
    this.isOpen = !this.isOpen;
    event.stopPropagation();
  }

  onSelectDate(date: CalendarOutput): void {
    this.modelChange.emit(date);
  }

  /** تغییر تاریخ و زمان توسط کاربر در تکست باکس */
  changeDate(): void {
    this.model = {
      date: moment.from(this.model.faDate, 'fa', 'YYYY-MM-DD HH:mm:ss').locale('en').format('YYYY-MM-DD HH:mm:ss'),
      day: 0,
      hour: 0,
      faDate: this.model.faDate
    }
  }
}
