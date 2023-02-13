export interface CalendarMonth {
    name: string;
    index: number;
}

export interface CalendarDayWeek {
    name: string;
    index: number;
}

export interface CalendarOutput {
    day: number;
    hour: number;
    date: string;
    faDate?:string;
}

export interface CalendarDateConfig{
    type:'manual' | 'dynamic' | 'full',
    showTime:boolean,
}
