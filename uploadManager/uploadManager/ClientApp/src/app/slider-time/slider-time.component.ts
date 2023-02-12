import { LabelType, Options } from '@angular-slider/ngx-slider';
import { Component, OnInit } from '@angular/core';
import * as moment from "jalali-moment";

@Component({
  selector: 'app-slider-time',
  templateUrl: './slider-time.component.html',
  styleUrls: ['./slider-time.component.scss']
})
export class SliderTimeComponent implements OnInit {
  options: Options;
  steps = [];
  date = null;
  value: number = 0;
  ngOnInit() {
    this.setStep();
  }
  setStep() {
    var currentDate = new Date();
    let date = moment(currentDate).format("YYYY-MM-DD");
    let hour = +moment(currentDate).format("HH");
    let count = 28;
    if (hour < 6) {
      date = `${date} 06:00:00`;
      count = 25;
    } else if (hour < 12) {
      date = `${date} 12:00:00`;
      count = 26;
    } else if (hour < 18) {
      date = `${date} 18:00:00`;
      count = 27;
    } else if (hour < 24) {
      date = `${date} 00:00:00`;
    }

    const steps = [];

    for (var i = 0; i < count; i++) {
      let t = moment
        .from(date, "en")
        .locale("fa")
        .add("hour", -(i * 6))
        .format("YYYY-MM-DD HH");
      if (i === 0) {
        t = moment
          .from(currentDate.toISOString(), "en")
          .locale("fa")
          .format("YYYY-MM-DD HH");
      }

      if (!steps.find((f) => f === `${t}:00:00`)) {
        steps.push(`${t}:00:00`);
      }
    }
    this.steps = steps.map((f, i) => ({
      label: f,
      value: steps.length - 1 - i,
    }));

    this.options = {
      showTicks: true,
      stepsArray: this.steps.map((s) => {
        return { value: s.value };
      }),
      translate: (value: number, label: LabelType): string => {
        return this.steps[value].label;
      },
    };
  }

  /**
 * انتخاب تاریخ بر روی اسلایدر 
 * @param time
 */
  changeTimeSlider(step: number) {
    if (step) {
      this.date = moment
        .from(this.steps[step].label, "fa", "YYYY-MM-DD HH:mm:ss")
        .locale("en")
        .format("YYYY-MM-DD HH:mm:ss");
     // this.refreshSliderFlag.next(this.date);
    } else {
      this.date = null;
      //this.refreshSliderFlag.next(this.date);
    }
  }

}
