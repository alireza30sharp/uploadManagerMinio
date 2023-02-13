import { Injectable } from '@angular/core';
import * as moment from 'jalali-moment';
import { CalendarDayWeek, CalendarMonth } from './calendar-date.model';

@Injectable({
    providedIn: 'root'
})
export class CalendarDateService {

    constructor() { }

    getMonthName(date: moment.Moment, locale: string = 'fa'): string {
        return date.locale(locale).format('MMMM');
    }

    getWeeksDay(date: moment.Moment, locale: string = 'fa'): number {
        var startOfMonth = date.clone().startOf('month');
        switch (locale) {
            case 'fa':
                return startOfMonth.weekday();
            case 'en':
                return startOfMonth.weekday() + 1;
            default:
                return 0;
        }
    }

    getMonths(_moment: moment.Moment, locale: string = 'fa'): CalendarMonth[] {
        switch (locale) {
            case 'fa':
                return _moment.localeData().jMonths().map((f, i) => { return { name: f, index: i + 1 } });
            case 'en':
                return _moment.localeData().months().map((f, i) => { return { name: f, index: i + 1 } });
            default:
                return [];
        }
    }

    getYears(_moment: moment.Moment, locale: string = 'fa'): number[] {
        var year = _moment.year();
        var years = [];

        for (var i = year - 2; i <= year + 2; i++) {
            years.push(i);
        }

        return years;
    }

    getDynamicDate(date: moment.Moment, day: number, hour: number): moment.Moment {
        return date.add(-1 * day, 'day').add(-1 * hour, 'hour');
    }

    getDaysName(_moment: moment.Moment, locale: string = 'fa'): CalendarDayWeek[] {
        switch (locale) {
            case 'fa':
                return [
                    { index: 1, name: 'ش' },
                    { index: 1, name: 'ی' },
                    { index: 1, name: 'د' },
                    { index: 1, name: 'س' },
                    { index: 1, name: 'چ' },
                    { index: 1, name: 'پ' },
                    { index: 1, name: 'ج' },
                ];
            case 'en':
                return _moment.locale(locale).localeData().weekdaysMin().map((f, i) => { return { name: f, index: i + 1 } });
            default:
                return [];
        }
    }
}
