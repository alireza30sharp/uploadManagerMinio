declare var document: any;

import {
  Directive,
  Injectable,
  Input,
  EventEmitter,
  Output,
  ElementRef,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[scrollSpy]',
})

export class ScrollSpyDirective {
  @Output() public sectionChange = new EventEmitter<string>();
  private currentSection?: string;

  inSide: boolean = false;

  constructor(private _el: ElementRef) { }

  @HostListener('wheel', ['$event'])
  onMouseWheel(event: any) {
    let currentSection: string = "";
    const parent = this._el.nativeElement;
    const children = this._el.nativeElement.children;
    let htmlScroll = document.querySelector("html").scrollTop;

    for (let i = 0; i < children.length; i++) {
      const element = children[i];
      if ("H1" === element.tagName) {
        const nextElement = parent.querySelector(`h1#section-${(+(element.getAttribute("id").split("-")[1]) + 1)}`)
        if (nextElement && element.offsetTop <= htmlScroll && nextElement.offsetTop > htmlScroll) {
          this.sectionChange.emit(element.getAttribute("id"));
        } else if (!nextElement && element.offsetTop <= htmlScroll) {
          this.sectionChange.emit(element.getAttribute("id"));
        }
      }
    }

  }
}
