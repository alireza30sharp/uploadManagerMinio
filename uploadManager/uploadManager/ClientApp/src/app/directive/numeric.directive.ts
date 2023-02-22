import { Directive, OnInit, forwardRef, ElementRef, HostListener, Renderer2, EventEmitter } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Output, Input} from '@angular/core';

@Directive({
  selector: '[input-currency]'
})
export class NumericDirective implements OnInit {
  currencyChars = new RegExp('[\.,]', 'g'); // we're going to remove commas and dots
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() ngModel: any | number;
  constructor(public el: ElementRef, public renderer: Renderer2, private decimalPipe: DecimalPipe) { }

  ngOnInit() {
    this.format(this.el.nativeElement.value); // format any initial values
  }

  @HostListener('input', ["$event.target.value"]) onInput(e: string) {
    this.format(e);
  };

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    event.preventDefault();
    this.format(event.clipboardData.getData('text/plain'));
  }

  format(val: any) {
    
    if (!val && this.ngModel) {
      val = this.ngModel;
    }

    const numberFormat = parseInt(String(val).replace(this.currencyChars, ''));
    const usd = this.decimalPipe.transform(numberFormat, '1.0', 'en-US');

    setTimeout(() => {
      if (!isNaN(numberFormat)) {
        this.ngModel = numberFormat.toString();
        this.ngModelChange.emit(this.ngModel);
        setTimeout(() => {
          this.renderer.setProperty(this.el.nativeElement, 'value', usd);
        }, 1)
      }
      else {
        this.ngModel =0;
        this.ngModelChange.emit(this.ngModel);
      }
    }, 1);
  }

}
