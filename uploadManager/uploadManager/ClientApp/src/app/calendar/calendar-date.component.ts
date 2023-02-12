import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { CalendarDateService } from './calendar-date.service';
import { CalendarDayWeek, CalendarMonth, CalendarOutput, CalendarDateConfig } from './calendar-date.model';
import * as moment from 'jalali-moment';

//import moment from "jalali-moment";

@Component({
  selector: 'calendar-date',
  templateUrl: './calendar-date.component.html',
  styleUrls: ['./calendar-date.component.scss'],
  providers: [CalendarDateService],
})
export class CalendarDateComponent implements OnInit, OnChanges {
  @Input() locale: 'fa' | 'en' = 'fa';
  @Input() config: CalendarDateConfig = { type: 'full', showTime: true }
  @Input() model: CalendarOutput | undefined = undefined;
  @Output() modelChange = new EventEmitter<CalendarOutput>();


  calendar: Calendar = {
    now: moment(),
    current: moment(),
    monthName: null,
    month: null,
    year: null,
    selectedDate: {
      date: null,
      day: 0,
      month: 0,
      year: 0,
      hour: 0,
      minutes: 0,
      seconds: 0,
      display: false
    }
  };
  days: CalendarDay[] = [];
  daysOfWeek: CalendarDayWeek[] = [];
  months: CalendarMonth[] = [];
  years: number[] = [];
  customDate: { year: number, month: CalendarMonth | undefined; } = { year: 0, month: undefined };
  calendarViewEnums = CalendarViewType;
  calendarView = CalendarViewType.Calendar;
  calendarTypeEnums = CalendarType;
  calendarType = CalendarType.Static_Calendar;
  calendarOutput: CalendarOutput = { day: 0, hour: 0, date: null };
  calendarId: string = '';
  loading: boolean=false
  constructor(private _exirDateSvc: CalendarDateService) {
    moment.locale(this.locale);

    // ایجاد یک آیدی منحصربفرد برای تقویم
    this.calendarId = (Math.floor(100000 + Math.random() * 900000)).toString();
  }

  //#region Lifecycle hooks

  ngOnInit(): void {
    this.months = this._exirDateSvc.getMonths(moment(), this.locale);
    this.years = this._exirDateSvc.getYears(moment(), this.locale);
    this.daysOfWeek = this._exirDateSvc.getDaysName(moment(), this.locale);

    this.parseDate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes && !!changes['model'] && !changes['model'].firstChange) {
      this.parseDate();
    }

    if (this.config?.type === 'dynamic') this.calendarType = CalendarType.Daynamic_Calendar;
  }
  //#endregion Lifecycle hooks


  //#region Public methods

  nextMonth(): void {
    this.initCalendar(this.calendar.current.add(1, 'month'));
  }

  previousMonth(): void {
    this.initCalendar(this.calendar.current.add(-1, 'month'));
  }

  today(): void {
    this.calendarView = CalendarViewType.Calendar;
    this.calendar.current = moment();
    this.initCalendar(moment());
  }

  selectDay(date: CalendarDay): void {
    if (date.display) {
      this.calendarOutput.day = 0;
      this.calendarOutput.hour = 0;

      this.calendar.selectedDate = (date.day && date.display) ? date : this.calendar.selectedDate;
      var dateString = `${date.year}-${date.month}-${date.day} ${moment().format(appConst.timeFormat)}`;
      if (!!this.calendar.selectedDate) {
        this.calendar.selectedDate.date = moment.from(dateString, this.locale, appConst.dateTimeFormat);
        this.calendar.selectedDate.hour = +this.calendar.selectedDate.date.format('HH');
        this.calendar.selectedDate.minutes = +this.calendar.selectedDate.date.format('mm');
        this.calendar.selectedDate.seconds = +this.calendar.selectedDate.date.format('ss');

        this.emit();
      }
    }
  }

  nextYears(): void {
    this.years = this._exirDateSvc.getYears(this.calendar.current.add(5, 'year'), this.locale);
  }

  prevYears(): void {
    this.years = this._exirDateSvc.getYears(this.calendar.current.add(-5, 'year'), this.locale);
  }

  selectCustomYear(year: number): void {
    this.customDate.year = year;
    if (this.customDate.month) {
      var dateString = `${year}-${this.customDate.month.index}-01 ` + moment().format(appConst.timeFormat);
      this.setCustomDate(dateString);
    }
  }

  selectCustomMonth(month: CalendarMonth): void {
    this.customDate.month = month;
    if (this.customDate.year) {
      var dateString = `${this.customDate.year}-${month.index}-01 ` + moment().format(appConst.timeFormat);
      this.setCustomDate(dateString);
    }
  }

  selectCustomDate(): void {
    this.calendarView = (this.calendarView == CalendarViewType.Custom_Year_Month) ? CalendarViewType.Calendar : CalendarViewType.Custom_Year_Month;
  }

  setDynamicDate(): void {
    var d = this._exirDateSvc.getDynamicDate(
      moment(), this.calendarOutput.day, this.calendarOutput.hour);

    this.calendar.selectedDate.date = d;
    this.calendarOutput.date = d.locale('en').format(appConst.dateTimeFormat);
    this.calendarOutput.faDate = d.locale('fa').format(appConst.dateTimeFormat);
    
    this.modelChange.emit(this.calendarOutput);
  }

  pluseDay() {
    this.calendarOutput.day++;
    this.setDynamicDate();
  }

  minusDay() {
    if (this.calendarOutput.day > 0) {
      this.calendarOutput.day--;
      this.setDynamicDate();
    }
  }

  pluseHour() {
    this.calendarOutput.hour++;
    this.setDynamicDate();
  }

  minusHour() {
    if (this.calendarOutput.hour > 0) {
      this.calendarOutput.hour--;
      this.setDynamicDate();
    }
  }

  changeTime(): void {
    if (!!this.calendar.selectedDate.date) {
      this.calendar.selectedDate.date?.hour(this.calendar.selectedDate.hour);
      this.calendar.selectedDate.date?.minute(this.calendar.selectedDate.minutes);
      this.calendar.selectedDate.date?.second(this.calendar.selectedDate.seconds);
      this.emit();
    }
  }

  //#endregion


  //#region Private methods

  private initCalendar(date: moment.Moment): void {
    var startDayOfMonth = this._exirDateSvc.getWeeksDay(date, this.locale);
    var monthDays = date.daysInMonth();

    this.calendar.monthName = this._exirDateSvc.getMonthName(date, this.locale);
    this.calendar.month = +date.format('MM');
    this.calendar.year = +date.format('YYYY');

    // Set selected day params
    this.calendar.selectedDate.day = +date.format('DD');
    this.calendar.selectedDate.month = +date.format('MM');
    this.calendar.selectedDate.year = +date.format('YYYY');
    this.calendar.selectedDate.hour = date.hour();
    this.calendar.selectedDate.minutes = date.minute();
    this.calendar.selectedDate.seconds = date.second();

    this.days = [];
    var daysLength = 0;
    for (var i = 0; i < 42; i++) {

      /** مشخص شدن روزهای مجاز ماه جاری */
      if ((i >= startDayOfMonth) && ((i - startDayOfMonth) + 1 <= monthDays)) {
        var dateString = `${this.calendar.year}-${this.calendar.month}-${((i + 1) - startDayOfMonth)} ${moment().format(appConst.timeFormat)}`;
        this.days.push({
          day: ((i + 1) - startDayOfMonth),
          month: this.calendar.month,
          year: this.calendar.year,
          hour: 0,
          minutes: 0,
          seconds: 0,
          display: true,
          date: null,
        });
      }
      /** روزهای مربوط به ماه قبل از ماه جاری */
      else if (!(i >= startDayOfMonth)) {
        var cloneCurrent = this.calendar.current.clone().add(-1, 'month');
        var lastMonthDays = cloneCurrent.daysInMonth();

        this.days.push({
          day: lastMonthDays - (startDayOfMonth - i) + 1,
          month: +cloneCurrent.format('MM'),
          year: +cloneCurrent.format('YYYY'),
          hour: 0,
          minutes: 0,
          seconds: 0,
          display: false,
          date: null
        });
      }
      /** روزهای مربوط به ماه بعد از ماه جاری */
      else if (!((i - startDayOfMonth) + 1 <= monthDays)) {
        var cloneCurrent = this.calendar.current.clone().add(1, 'month');
        if (!daysLength) daysLength = this.days.length;

        this.days.push({
          day: i - daysLength + 1,
          month: +cloneCurrent.format('MM'),
          year: +cloneCurrent.format('YYYY'),
          hour: 0,
          minutes: 0,
          seconds: 0,
          display: false,
          date: null
        });
      }
    }
    this.getDataForDay();
  }
  private getDataForDay() {
    this.loading = true;
    const toDate = moment
      .from(this.calendar.current._d, null)
      .locale('fa')
      .endOf('month')
      .locale('en')
      .format('YYYY/MM/DD HH:MM');
    const fromDate = moment
      .from(this.calendar.current._d, null)
      .locale('fa')
      .startOf('month')
      .locale('en')
      .format('YYYY/MM/DD HH:MM');
    let filter = {
      FromDate: fromDate,
      ToDate: toDate,
    };
    //find isHoliday day
  //  this._calendarDateService.adminCalendar(filter).subscribe(
  //    (res) => {
  //      let listCloseDate = res[0].data.filter((f: any) => f.isHoliday);

  //      this.days.forEach((f) => {
  //        if (listCloseDate.find((l: any) => l.date.split('T')[0] == f.date)) {
  //          f.isHoliday = true;
  //        }
  //      });

  //      //sum price
  //      //this.days.forEach((f) => {
  //      //  f.sumPrice = res[1].data.find(
  //      //    (l: any) => l.orderDate.split('T')[0] == f.date
  //      //  )?.sumPrice;
  //      //});
  //      this.loading = false;
  //    },
  //    (error) => {
  //      //this.toster.error(
  //      //  'در گرفتن اطلاعات دچار مشکل شد لطفا دوباره تلاش کنید'
  //      //);
  //      this.loading = false;
  //    }
  //  );
  }
  private setCustomDate(date: string): void {
    this.calendar.current = moment.from(date, this.locale, 'YYYY-MM-DD HH:mm:ss');
    this.initCalendar(this.calendar.current);
    this.calendarView = CalendarViewType.Calendar;
    this.customDate = { month: undefined, year: 0 };
  }

  private emit(): void {
    this.calendarOutput.date = this.calendar.selectedDate.date?.locale('en').format('YYYY-MM-DD HH:mm:ss');
    this.calendarOutput.faDate = this.calendar.selectedDate.date?.locale('fa').format('YYYY-MM-DD HH:mm:ss');
    this.modelChange.emit(this.calendarOutput);
  }

  private parseDate(): void {
    if (!!this.model && !!this.model.date) {
      var date = moment.from(this.model.date, 'en', appConst.dateTimeFormat);
      this.calendar.selectedDate.date = date;
      this.initCalendar(date);

      this.emit();
    }
    else {
      this.today();
    }
  }
  //#endregion Private methods
}


//#region Modeles and interfaces
interface Calendar {
  now: moment.Moment,
  current:any,
  monthName: string | null,
  month: number | null,
  year: number | null,
  selectedDate: CalendarDay;
}

interface CalendarDay {
  day: number,
  month: number | null,
  year: number | null,
  hour: number,
  minutes: number,
  seconds: number,
  display: boolean,
  date: moment.Moment | null;
}

enum CalendarViewType {
  Calendar = 1,
  Custom_Year_Month = 2,
}

enum CalendarType {
  Static_Calendar = 1,
  Daynamic_Calendar = 2
}

const appConst = {
  dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
  timeFormat: 'HH:mm:ss',
}
//#endregion
//let daySelect = moment(this.selectItemOutput?.Date, 'YYYY/MM/DD')
//  .locale('en')
//  .jDay();
