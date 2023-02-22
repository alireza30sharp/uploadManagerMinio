import { Directive, OnInit, forwardRef, ElementRef, HostListener, Renderer2, EventEmitter } from '@angular/core';
import { Output, Input} from '@angular/core';

@Directive({
  selector: '[input-unicod]'
})
export class UniCodeDirective implements OnInit {
  currencyChars = new RegExp('[ا-ی|ئ|\$|\!|\(|\)|\^|\&|\?]+', 'g'); // we're going to remove commas and dots
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() ngModel: any | number;
  constructor(public el: ElementRef, public renderer: Renderer2) { }

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

    const Format =String(val).replace(this.currencyChars, '');
   

    setTimeout(() => {
      if (Format) {
        this.ngModel = Format.toString();
        this.ngModelChange.emit(this.ngModel);
        setTimeout(() => {
          this.renderer.setProperty(this.el.nativeElement, 'value', Format);
        }, 1)
      }
      else {
        this.ngModel ='';
        this.ngModelChange.emit(this.ngModel);
      }
    }, 1);
  }

}
