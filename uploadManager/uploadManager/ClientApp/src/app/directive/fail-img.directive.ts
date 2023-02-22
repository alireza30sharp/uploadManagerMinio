import { Directive, HostListener, Input, ViewChild, ElementRef } from '@angular/core';
@Directive({ selector: 'img[fail-img]' })
export class FailImgDirective {
  constructor(private el: ElementRef) {}

  @HostListener("error")
  private onError() {
    this.el.nativeElement.src = "https://s/assets/svg/sata.svg";
  }
}
